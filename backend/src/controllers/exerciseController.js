import { pool } from "../db/pool.js";
import axios from "axios";

// GET /api/exercises/:id - Obtener ejercicio con sus tests
export const getExercise = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener ejercicio
    const [exercise] = await pool.query(
      "SELECT id, title, statement, code_template, required_keywords, total_tests FROM exercise_activities WHERE id = ?",
      [id]
    );

    if (exercise.length === 0) {
      return res.status(404).json({ error: "Ejercicio no encontrado" });
    }

    // Obtener tests
    const [tests] = await pool.query(
      "SELECT id, test_order, input_data, expected_output, description FROM exercise_tests WHERE exercise_id = ? ORDER BY test_order",
      [id]
    );

    res.json({
      id: exercise[0].id,
      title: exercise[0].title,
      statement: exercise[0].statement,
      code_template: exercise[0].code_template,
      required_keywords: exercise[0].required_keywords,
      total_tests: exercise[0].total_tests,
      tests: tests.map(t => ({
        id: t.id,
        test_order: t.test_order,
        input_data: t.input_data,
        expected_output: t.expected_output,
        description: t.description
      }))
    });
  } catch (error) {
    console.error("Error fetching exercise:", error);
    res.status(500).json({ error: "Error al obtener el ejercicio" });
  }
};

// POST /api/exercises/:id/validate - Validar código del usuario
export const validateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body;
    const userId = req.user?.id;

    if (!code) {
      return res.status(400).json({ error: "Código requerido" });
    }

    // Obtener ejercicio
    const [exercise] = await pool.query(
      "SELECT id, required_keywords, total_tests FROM exercise_activities WHERE id = ?",
      [id]
    );

    if (exercise.length === 0) {
      return res.status(404).json({ error: "Ejercicio no encontrado" });
    }

    // Obtener tests
    const [tests] = await pool.query(
      "SELECT expected_output, input_data FROM exercise_tests WHERE exercise_id = ? ORDER BY test_order",
      [id]
    );

    const exerciseData = exercise[0];
    const requiredKeywords = exerciseData.required_keywords?.split(",").map(k => k.trim()) || [];
    let functionName = requiredKeywords.length > 0 ? requiredKeywords[0] : null;
    let functionReturnType = null;

    // If required_keywords contains a type (e.g. 'long') or a control keyword
    // like 'if', or it's not a valid identifier, ignore it and extract the
    // actual function name from the code template.
    const primitiveTypes = ["int", "long", "double", "float", "string", "bool", "void"];
    const controlKeywords = ["if", "for", "while", "foreach", "switch", "return", "break", "continue", "public", "private", "class"];
    const isValidIdentifier = (s) => /^[A-Za-z_]\w*$/.test(s || "");

    if (functionName) {
      const fnLower = functionName.toLowerCase();
      if (primitiveTypes.includes(fnLower) || controlKeywords.includes(fnLower) || !isValidIdentifier(functionName)) {
        functionName = null;
      }
    }

    if (!functionName && typeof code === "string") {
      const fnMatch = code.match(/public\s+static\s+(\w+)\s+(\w+)\s*\(/i);
      if (fnMatch && fnMatch[2]) {
        functionReturnType = fnMatch[1];
        functionName = fnMatch[2];
      }
    } else if (functionName && typeof code === "string") {
      // If a functionName was inferred from required keywords, try to detect its return type from the code
      const re = new RegExp(`public\\s+static\\s+(\\w+)\\s+${functionName}\\s*\\(`, 'i');
      const m = code.match(re);
      if (m && m[1]) functionReturnType = m[1];
    }

    // Validar keywords (case-insensitive)
    const codeLower = (code || "").toLowerCase();
    const missingKeywords = [];
    for (const keyword of requiredKeywords) {
      const k = (keyword || "").toLowerCase();
      if (!k) continue;
      if (!codeLower.includes(k)) missingKeywords.push(keyword);
    }
    if (missingKeywords.length > 0) {
      return res.status(400).json({ 
        error: `Palabra(s) clave(s) requeridas no encontrada(s): ${missingKeywords.join(", ")}` 
      });
    }

    // Inyectar y ejecutar tests
    let passedTests = 0;
    let jdoodleOutput = "";
    const testResults = [];

    // Ejecutar todos los tests pero recolectar output
    let fullTestCode = code;
    let mainInjection = "";

    // Build injection that calls the user's function (if function name known)
    // Each test will produce a single Console.WriteLine(call) so outputs map 1:1 to tests
    const formatArg = (arg) => {
      if (arg === null) return "null";

      // Arrays (1D and 2D) -> format as C# array literals
      if (Array.isArray(arg)) {
        // Empty array -> new int[] { }
        if (arg.length === 0) return "new int[] { }";

        // Detect 2D (array of arrays)
        if (Array.isArray(arg[0])) {
          // Build rows
          const rows = arg.map(row => {
            if (!Array.isArray(row)) return `{ ${formatArg(row)} }`;
            const inner = row.map(v => {
              // inner values should be primitives
              if (typeof v === 'string') return formatArg(v);
              if (typeof v === 'boolean') return v ? 'true' : 'false';
              return String(v);
            }).join(', ');
            return `{ ${inner} }`;
          }).join(', ');
          return `new int[,] { ${rows} }`;
        }

        // 1D array -> new int[] { a, b, c }
        const items = arg.map(v => {
          if (v === null) return 'null';
          if (typeof v === 'string') return formatArg(v);
          if (typeof v === 'boolean') return v ? 'true' : 'false';
          return String(v);
        }).join(', ');
        return `new int[] { ${items} }`;
      }

      if (typeof arg === "string") {
        // Check if it's a numeric string (for long numbers)
        if (/^-?\d+$/.test(arg)) {
          const absDigits = arg.replace(/^[-+]/, "");
          if (absDigits.length > 10) {
            return arg + "L";
          }
          return arg;
        }
        return JSON.stringify(arg);
      }

      if (typeof arg === "boolean") return arg ? "true" : "false";

      return String(arg);
    };

    for (const test of tests) {
      let generated = "";
      if (test.input_data) {
        try {
          const inputs = JSON.parse(test.input_data);
          if (Array.isArray(inputs)) {
            const argList = inputs.map(i => formatArg(i)).join(", ");
            if (functionName) {
              // If the user's function returns void, call it directly; it should print its own output.
              if (functionReturnType && functionReturnType.toLowerCase() === 'void') {
                generated = `    ${functionName}(${argList});\n`;
              } else {
                generated = `    Console.WriteLine(${functionName}(${argList}));\n`;
              }
            } else {
              // fallback: print each input on its own line
              inputs.forEach(i => {
                generated += `    Console.WriteLine(${formatArg(i)});\n`;
              });
            }
          } else {
            const arg = formatArg(inputs);
            if (functionName) {
              if (functionReturnType && functionReturnType.toLowerCase() === 'void') {
                generated = `    ${functionName}(${arg});\n`;
              } else {
                generated = `    Console.WriteLine(${functionName}(${arg}));\n`;
              }
            } else {
              generated = `    Console.WriteLine(${arg});\n`;
            }
          }
        } catch (e) {
          // If input_data is not valid JSON, print it as a string
            if (functionName) {
              if (functionReturnType && functionReturnType.toLowerCase() === 'void') {
                generated = `    ${functionName}(${JSON.stringify(test.input_data)});\n`;
              } else {
                generated = `    Console.WriteLine(${functionName}(${JSON.stringify(test.input_data)}));\n`;
              }
            } else {
              generated = `    Console.WriteLine(${JSON.stringify(test.input_data)});\n`;
            }
        }
      } else {
        // No input_data: if function exists, call without args; else print empty line
        if (functionName) {
          if (functionReturnType && functionReturnType.toLowerCase() === 'void') {
            generated = `    ${functionName}();\n`;
          } else {
            generated = `    Console.WriteLine(${functionName}());\n`;
          }
        } else {
          generated = `    Console.WriteLine();\n`;
        }
      }

      mainInjection += generated;
    }

    // Inyectar en el Main
    const mainPattern = /public\s+static\s+void\s+Main\s*\(\s*string\[\]\s+args\s*\)\s*\{/i;
    fullTestCode = fullTestCode.replace(mainPattern, (match) => {
      return match + "\n" + mainInjection;
    });

    try {
      // Llamar JDoodle una sola vez con todos los tests
      // DEBUG: print generated code for exercise 14 to help diagnose compilation issues
      if (String(id) === "14") {
        console.info("[DEBUG] Generated code for exercise 14:\n", fullTestCode);
      }

      const response = await axios.post("https://api.jdoodle.com/v1/execute", {
        script: fullTestCode,
        language: "csharp",
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET
      });

      const output = (response.data.output || "").trim();
      const outputLines = output.split("\n").map(line => line.trim());

      jdoodleOutput = output;

      // Comparar output con expected
      // If all functions are void, the entire output is the combined result of all function calls
      // and we need to split it appropriately across tests.
      // If functions return values, each test gets one line from outputLines.
      let lineIndex = 0;
      
      for (let i = 0; i < tests.length; i++) {
        const expectedOutput = (tests[i].expected_output || "").trim();
        
        // Parse input_data for display
        let inputDisplay = "";
        try {
          if (tests[i].input_data) {
            const parsed = JSON.parse(tests[i].input_data);
            if (Array.isArray(parsed)) {
              inputDisplay = parsed.join(", ");
            } else {
              inputDisplay = String(parsed);
            }
          }
        } catch (e) {
          inputDisplay = tests[i].input_data || "";
        }

        let actualOutput = "";
        
        // If the function returns void, the expected output may contain multiple lines
        // We need to collect lines from the output until we've assembled what's expected
        if (functionReturnType && functionReturnType.toLowerCase() === 'void') {
          const expectedLines = expectedOutput.split("\n").map(l => l.trim());
          const actualLines = [];
          
          for (let j = 0; j < expectedLines.length; j++) {
            if (lineIndex < outputLines.length) {
              actualLines.push(outputLines[lineIndex]);
              lineIndex++;
            }
          }
          actualOutput = actualLines.join("\n");
        } else {
          // Non-void function: each test gets one line of output
          actualOutput = outputLines[lineIndex] || "";
          lineIndex++;
        }

        if (actualOutput === expectedOutput) {
          passedTests++;
          testResults.push({ 
            test_number: i + 1,
            input: inputDisplay,
            expected: expectedOutput, 
            actual: actualOutput,
            passed: true,
            description: tests[i].description
          });
        } else {
          testResults.push({ 
            test_number: i + 1,
            input: inputDisplay,
            expected: expectedOutput, 
            actual: actualOutput,
            passed: false,
            description: tests[i].description
          });
        }
      }
    } catch (error) {
      console.error("Error executing tests:", error);
      jdoodleOutput = error.response?.data?.error || error.message;
      return res.status(400).json({ 
        error: "Error al ejecutar el código",
        details: error.response?.data?.error || error.message
      });
    }

    const isSuccessful = passedTests === tests.length;

    // RQF22: Guardar intento en BD si es usuario autenticado
    if (userId) {
      try {
        await pool.query(
          "INSERT INTO exercise_attempts (user_id, exercise_id, is_successful, passed_tests, total_tests, jdoodle_output) VALUES (?, ?, ?, ?, ?, ?)",
          [userId, id, isSuccessful ? 1 : 0, passedTests, tests.length, jdoodleOutput.trim()]
        );

        // Nueva lógica: incrementar contador de fallos por ejercicio
        // Solo se cuenta como fallo cuando NO se aprueban todas las pruebas
        if (!isSuccessful) {
          await pool.query(
            `INSERT INTO exercise_failure_count (user_id, exercise_id, failure_count)
             VALUES (?, ?, 1)
             ON DUPLICATE KEY UPDATE failure_count = failure_count + 1, last_attempt_at = NOW()`,
            [userId, id]
          );
        }
      } catch (dbError) {
        console.error("Error saving attempt:", dbError);
      }
    }

    res.json({
      is_successful: isSuccessful,
      passed_tests: passedTests,
      total_tests: tests.length,
      output: jdoodleOutput.trim(),
      test_results: testResults
    });
  } catch (error) {
    console.error("Error validating exercise:", error);
    res.status(500).json({ error: "Error al validar el ejercicio" });
  }
};

// (duplicate snippet removed)
// añadimos este bloque para actualizar user_weaknesses:
