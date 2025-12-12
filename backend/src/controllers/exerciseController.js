/**
 * Controller de Ejercicios
 * 
 * Gestiona los ejercicios de programación en C#:
 * - Obtención de ejercicios con sus casos de prueba
 * - Validación de código del usuario
 * - Ejecución de tests usando JDoodle API
 * - Generación de código de ejemplo para mostrar
 * - Registro de intentos y estadísticas
 */

import { pool } from "../db/pool.js";
import axios from "axios";

/**
 * Normaliza código C# para comparación
 * Elimina:
 * - Espacios en blanco múltiples
 * - Saltos de línea
 * - Comentarios de una línea (//)
 * - Comentarios de múltiples líneas
 * 
 * Esto permite detectar si el usuario no ha modificado el código base
 * sin importar si agregó espacios o saltos de línea
 * 
 * @param {string} code - Código C# a normalizar
 * @returns {string} Código normalizado
 */
function normalizeCode(code) {
  if (!code) return "";
  
  return code
    // Eliminar comentarios de múltiples líneas /* ... */
    .replace(/\/\*[\s\S]*?\*\//g, "")
    // Eliminar comentarios de una línea //...
    .replace(/\/\/.*$/gm, "")
    // Eliminar todos los espacios en blanco (espacios, tabs, saltos de línea)
    .replace(/\s+/g, "")
    // Convertir a minúsculas para comparación case-insensitive
    .toLowerCase();
}

/**
 * GET /api/exercises/:id
 * Obtiene un ejercicio específico con todos sus tests
 * 
 * Retorna:
 * - Información del ejercicio (título, enunciado, template de código)
 * - Lista de casos de prueba
 * - Código de ejemplo que muestra cómo se ejecutarán los tests
 * 
 * @param {Request} req - Parámetro :id del ejercicio
 * @param {Response} res - Datos del ejercicio y sus tests
 */
export const getExercise = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener información del ejercicio
    const [exercise] = await pool.query(
      "SELECT id, title, statement, code_template, required_keywords, total_tests FROM exercise_activities WHERE id = ?",
      [id]
    );

    if (exercise.length === 0) {
      return res.status(404).json({ error: "Ejercicio no encontrado" });
    }

    // Obtener casos de prueba del ejercicio, ordenados por número de test
    const [tests] = await pool.query(
      "SELECT id, test_order, input_data, expected_output, description FROM exercise_tests WHERE exercise_id = ? ORDER BY test_order",
      [id]
    );

    // Generar código de ejemplo mostrando cómo se ejecutarán las pruebas
    const exampleTestsCode = generateExampleTestsCode(
      exercise[0].code_template,
      exercise[0].required_keywords,
      tests
    );

    res.json({
      id: exercise[0].id,
      title: exercise[0].title,
      statement: exercise[0].statement,
      code_template: exercise[0].code_template,
      required_keywords: exercise[0].required_keywords,
      total_tests: exercise[0].total_tests,
      example_tests_code: exampleTestsCode,
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

/**
 * Genera código de ejemplo que muestra cómo se ejecutarán los tests
 * 
 * Esta función crea un método Main() en C# que llama a la función del usuario
 * con los datos de entrada de cada test. Esto ayuda al usuario a entender
 * cómo se probará su código.
 * 
 * Proceso:
 * 1. Extrae el nombre de la función del código template o de required_keywords
 * 2. Detecta el tipo de retorno de la función
 * 3. Formatea los datos de entrada (arrays, strings, números, etc.)
 * 4. Genera llamadas a la función con Console.WriteLine para cada test
 * 
 * @param {string} codeTemplate - Template de código del ejercicio
 * @param {string} requiredKeywords - Palabras clave requeridas (puede incluir nombre de función)
 * @param {Array} tests - Array de casos de prueba
 * @returns {string} Código C# del método Main con las llamadas de prueba
 */
function generateExampleTestsCode(codeTemplate, requiredKeywords, tests) {
  const keywords = requiredKeywords?.split(",").map(k => k.trim()) || [];
  let functionName = keywords.length > 0 ? keywords[0] : null;
  let functionReturnType = null;

  // Validar si el nombre de función es válido (no es un tipo primitivo o keyword)
  const primitiveTypes = ["int", "long", "double", "float", "string", "bool", "void"];
  const controlKeywords = ["if", "for", "while", "foreach", "switch", "return", "break", "continue", "public", "private", "class"];
  const isValidIdentifier = (s) => /^[A-Za-z_]\w*$/.test(s || "");

  // Si el primer keyword no es un identificador válido, descartarlo
  if (functionName) {
    const fnLower = functionName.toLowerCase();
    if (primitiveTypes.includes(fnLower) || controlKeywords.includes(fnLower) || !isValidIdentifier(functionName)) {
      functionName = null;
    }
  }

  // Extraer nombre de función del template si no se encontró en keywords
  if (!functionName && typeof codeTemplate === "string") {
    const fnMatch = codeTemplate.match(/public\s+static\s+(\w+)\s+(\w+)\s*\(/i);
    if (fnMatch && fnMatch[2]) {
      functionReturnType = fnMatch[1];
      functionName = fnMatch[2];
    }
  } else if (functionName && typeof codeTemplate === "string") {
    // Si ya tenemos el nombre, extraer el tipo de retorno
    const re = new RegExp(`public\\s+static\\s+(\\w+)\\s+${functionName}\\s*\\(`, 'i');
    const m = codeTemplate.match(re);
    if (m && m[1]) functionReturnType = m[1];
  }

  /**
   * Formatea un argumento para código C#
   * Convierte valores JavaScript a sintaxis C# apropiada
   */
  const formatArg = (arg) => {
    if (arg === null) return "null";

    // Manejar arrays (1D y 2D)
    if (Array.isArray(arg)) {
      if (arg.length === 0) return "new int[] { }";

      // Detectar array 2D (array de arrays)
      if (Array.isArray(arg[0])) {
        const rows = arg.map(row => {
          if (!Array.isArray(row)) return `{ ${formatArg(row)} }`;
          const inner = row.map(v => {
            if (typeof v === 'string') return formatArg(v);
            if (typeof v === 'boolean') return v ? 'true' : 'false';
            return String(v);
          }).join(', ');
          return `{ ${inner} }`;
        }).join(', ');
        return `new int[,] { ${rows} }`;
      }

      // Array 1D
      const items = arg.map(v => {
        if (v === null) return 'null';
        if (typeof v === 'string') return formatArg(v);
        if (typeof v === 'boolean') return v ? 'true' : 'false';
        return String(v);
      }).join(', ');
      return `new int[] { ${items} }`;
    }

    // Strings y números grandes (long)
    if (typeof arg === "string") {
      if (/^-?\d+$/.test(arg)) {
        const absDigits = arg.replace(/^[-+]/, "");
        // Si tiene más de 10 dígitos, tratarlo como long
        if (absDigits.length > 10) {
          return arg + "L";
        }
        return arg;
      }
      return JSON.stringify(arg);
    }

    // Booleans
    if (typeof arg === "boolean") return arg ? "true" : "false";

    return String(arg);
  };

  // Generar el código del método Main con las llamadas de prueba
  let mainCode = "public static void Main(string[] args)\n{\n";
  
  for (const test of tests) {
    let testCall = "";
    if (test.input_data) {
      try {
        const inputs = JSON.parse(test.input_data);
        if (Array.isArray(inputs)) {
          // Múltiples argumentos
          const argList = inputs.map(i => formatArg(i)).join(", ");
          if (functionName) {
            if (functionReturnType && functionReturnType.toLowerCase() === 'void') {
              // Función void: solo llamar, no imprimir retorno
              testCall = `    ${functionName}(${argList});`;
            } else {
              // Función con retorno: imprimir el resultado
              testCall = `    Console.WriteLine(${functionName}(${argList}));`;
            }
          } else {
            // Fallback: imprimir cada input
            testCall = inputs.map(i => `    Console.WriteLine(${formatArg(i)});`).join('\n');
          }
        } else {
          // Un solo argumento
          const arg = formatArg(inputs);
          if (functionName) {
            if (functionReturnType && functionReturnType.toLowerCase() === 'void') {
              testCall = `    ${functionName}(${arg});`;
            } else {
              testCall = `    Console.WriteLine(${functionName}(${arg}));`;
            }
          } else {
            testCall = `    Console.WriteLine(${arg});`;
          }
        }
      } catch (e) {
        // Si input_data no es JSON válido, usarlo como string
        if (functionName) {
          if (functionReturnType && functionReturnType.toLowerCase() === 'void') {
            testCall = `    ${functionName}(${JSON.stringify(test.input_data)});`;
          } else {
            testCall = `    Console.WriteLine(${functionName}(${JSON.stringify(test.input_data)}));`;
          }
        } else {
          testCall = `    Console.WriteLine(${JSON.stringify(test.input_data)});`;
        }
      }
    } else {
      // Sin datos de entrada: llamar función sin argumentos
      if (functionName) {
        if (functionReturnType && functionReturnType.toLowerCase() === 'void') {
          testCall = `    ${functionName}();`;
        } else {
          testCall = `    Console.WriteLine(${functionName}());`;
        }
      } else {
        testCall = `    Console.WriteLine();`;
      }
    }

    mainCode += testCall + "\n";
  }

  mainCode += "}";
  
  return mainCode;
}

/**
 * POST /api/exercises/:id/validate
 * Valida el código enviado por el usuario contra los casos de prueba
 * 
 * Este es el endpoint más complejo del sistema. Realiza:
 * 1. Extracción del nombre de función del código del usuario
 * 2. Validación de palabras clave requeridas
 * 3. Inyección de tests en el método Main()
 * 4. Ejecución del código en JDoodle API
 * 5. Comparación de outputs con resultados esperados
 * 6. Registro del intento en base de datos
 * 7. Actualización de contador de fallos si no pasa todos los tests
 * 
 * @param {Request} req - Body: { code: string }, Params: { id: exerciseId }
 * @param {Response} res - Resultado de la validación con tests pasados/fallados
 */
export const validateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body;
    const userId = req.user?.id;

    if (!code) {
      return res.status(400).json({ error: "Código requerido" });
    }

    // Obtener información del ejercicio desde BD (incluye code_template para comparar)
    const [exercise] = await pool.query(
      "SELECT id, required_keywords, total_tests, code_template FROM exercise_activities WHERE id = ?",
      [id]
    );

    if (exercise.length === 0) {
      return res.status(404).json({ error: "Ejercicio no encontrado" });
    }

    // Obtener todos los casos de prueba del ejercicio
    const [tests] = await pool.query(
      "SELECT expected_output, input_data FROM exercise_tests WHERE exercise_id = ? ORDER BY test_order",
      [id]
    );

    const exerciseData = exercise[0];
    const requiredKeywords = exerciseData.required_keywords?.split(",").map(k => k.trim()) || [];
    let functionName = requiredKeywords.length > 0 ? requiredKeywords[0] : null;
    let functionReturnType = null;

    // Detectar si el usuario no modificó el código base
    // Comparando versión normalizada (sin espacios ni comentarios)
    const normalizedUserCode = normalizeCode(code);
    const normalizedTemplateCode = normalizeCode(exerciseData.code_template);
    const isUnmodifiedCode = normalizedUserCode === normalizedTemplateCode;

    // Si el código no fue modificado, marcar todas las pruebas como fallidas inmediatamente
    if (isUnmodifiedCode) {
      const testResults = tests.map((test, i) => {
        let inputDisplay = "";
        try {
          if (test.input_data) {
            const parsed = JSON.parse(test.input_data);
            if (Array.isArray(parsed)) {
              inputDisplay = parsed.join(", ");
            } else {
              inputDisplay = String(parsed);
            }
          }
        } catch (e) {
          inputDisplay = test.input_data || "";
        }

        return {
          test_number: i + 1,
          input: inputDisplay,
          expected: (test.expected_output || "").trim(),
          actual: "",
          passed: false,
          description: test.description
        };
      });

      // Registrar intento fallido en base de datos
      if (userId) {
        try {
          await pool.query(
            "INSERT INTO exercise_attempts (user_id, exercise_id, is_successful, passed_tests, total_tests, jdoodle_output) VALUES (?, ?, ?, ?, ?, ?)",
            [userId, id, 0, 0, tests.length, "Código sin modificar - Todas las pruebas marcadas como fallidas"]
          );

          // Incrementar contador de fallos
          await pool.query(
            `INSERT INTO exercise_failure_count (user_id, exercise_id, failure_count)
             VALUES (?, ?, 1)
             ON DUPLICATE KEY UPDATE failure_count = failure_count + 1, last_attempt_at = NOW()`,
            [userId, id]
          );
        } catch (dbError) {
          console.error("Error saving attempt:", dbError);
        }
      }

      return res.json({
        is_successful: false,
        passed_tests: 0,
        total_tests: tests.length,
        output: "Código sin modificar. Por favor, implementa la solución antes de ejecutar las pruebas.",
        test_results: testResults
      });
    }

    // Validar que el nombre de función sea válido
    // Si required_keywords contiene un tipo primitivo (ej: 'long') o palabra reservada (ej: 'if'),
    // ignorarlo y extraer el nombre real de la función del código del usuario
    const primitiveTypes = ["int", "long", "double", "float", "string", "bool", "void"];
    const controlKeywords = ["if", "for", "while", "foreach", "switch", "return", "break", "continue", "public", "private", "class"];
    const isValidIdentifier = (s) => /^[A-Za-z_]\w*$/.test(s || "");

    if (functionName) {
      const fnLower = functionName.toLowerCase();
      if (primitiveTypes.includes(fnLower) || controlKeywords.includes(fnLower) || !isValidIdentifier(functionName)) {
        functionName = null;
      }
    }

    // Extraer nombre de función del código del usuario si no se encontró en keywords
    if (!functionName && typeof code === "string") {
      const fnMatch = code.match(/public\s+static\s+(\w+)\s+(\w+)\s*\(/i);
      if (fnMatch && fnMatch[2]) {
        functionReturnType = fnMatch[1];
        functionName = fnMatch[2];
      }
    } else if (functionName && typeof code === "string") {
      // Si tenemos nombre de función, detectar su tipo de retorno del código
      const re = new RegExp(`public\\s+static\\s+(\\w+)\\s+${functionName}\\s*\\(`, 'i');
      const m = code.match(re);
      if (m && m[1]) functionReturnType = m[1];
    }

    // Validar que todas las palabras clave requeridas estén en el código (case-insensitive)
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

    // Variables para recolectar resultados de la ejecución
    let passedTests = 0;
    let jdoodleOutput = "";
    const testResults = [];

    let fullTestCode = code;
    let mainInjection = "";

    /**
     * Función interna para formatear argumentos para código C#
     * (Igual que en generateExampleTestsCode, necesaria para inyectar tests)
     */
    const formatArg = (arg) => {
      if (arg === null) return "null";

      // Manejar arrays 1D y 2D
      if (Array.isArray(arg)) {
        if (arg.length === 0) return "new int[] { }";

        // Detectar array 2D (array de arrays)
        if (Array.isArray(arg[0])) {
          const rows = arg.map(row => {
            if (!Array.isArray(row)) return `{ ${formatArg(row)} }`;
            const inner = row.map(v => {
              if (typeof v === 'string') return formatArg(v);
              if (typeof v === 'boolean') return v ? 'true' : 'false';
              return String(v);
            }).join(', ');
            return `{ ${inner} }`;
          }).join(', ');
          return `new int[,] { ${rows} }`;
        }

        // Array 1D
        const items = arg.map(v => {
          if (v === null) return 'null';
          if (typeof v === 'string') return formatArg(v);
          if (typeof v === 'boolean') return v ? 'true' : 'false';
          return String(v);
        }).join(', ');
        return `new int[] { ${items} }`;
      }

      // Strings y números largos
      if (typeof arg === "string") {
        if (/^-?\d+$/.test(arg)) {
          const absDigits = arg.replace(/^[-+]/, "");
          if (absDigits.length > 10) {
            return arg + "L"; // Números grandes como long
          }
          return arg;
        }
        return JSON.stringify(arg);
      }

      if (typeof arg === "boolean") return arg ? "true" : "false";

      return String(arg);
    };

    // Generar llamadas de prueba para inyectar en el Main() del usuario
    for (const test of tests) {
      let generated = "";
      if (test.input_data) {
        try {
          const inputs = JSON.parse(test.input_data);
          if (Array.isArray(inputs)) {
            const argList = inputs.map(i => formatArg(i)).join(", ");
            if (functionName) {
              // Si la función es void, solo llamarla (ella imprime)
              if (functionReturnType && functionReturnType.toLowerCase() === 'void') {
                generated = `    ${functionName}(${argList});\n`;
              } else {
                // Si retorna valor, imprimirlo
                generated = `    Console.WriteLine(${functionName}(${argList}));\n`;
              }
            } else {
              // Fallback: imprimir cada input en su propia línea
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
          // Si input_data no es JSON válido, usarlo como string
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
        // Sin datos de entrada: llamar función sin argumentos
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

    // Inyectar las llamadas de prueba en el método Main() del código del usuario
    const mainPattern = /public\s+static\s+void\s+Main\s*\(\s*string\[\]\s+args\s*\)\s*\{/i;
    fullTestCode = fullTestCode.replace(mainPattern, (match) => {
      return match + "\n" + mainInjection;
    });

    try {
      // Ejecutar el código completo en JDoodle API
      // JDoodle es un servicio externo que compila y ejecuta código en varios lenguajes
      
      // DEBUG: Imprimir código generado para ejercicio específico (ayuda en troubleshooting)
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
      
      // Filtrar líneas de compilación y warnings de JDoodle
      // Estas líneas no son parte del output real del programa
      const outputLines = output.split("\n")
        .map(line => line.trim())
        .filter(line => {
          // Ignorar líneas de compilación y warnings
          return !line.startsWith("Compilation succeeded") &&
                 !line.includes("warning(s)") &&
                 !line.startsWith("jdoodle.cs(") &&
                 line.length > 0; // También ignorar líneas vacías
        });

      jdoodleOutput = output;

      /**
       * Comparación de outputs con resultados esperados
       * 
       * Lógica:
       * - Si la función es void: cada test puede generar múltiples líneas de output
       * - Si la función retorna valor: cada test genera exactamente 1 línea
       * - Se comparan los outputs línea por línea con los esperados
       */
      let lineIndex = 0;
      
      for (let i = 0; i < tests.length; i++) {
        const expectedOutput = (tests[i].expected_output || "").trim();
        
        // Parsear input_data para mostrar en resultados
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
        
        // Si la función es void, puede generar múltiples líneas de output
        if (functionReturnType && functionReturnType.toLowerCase() === 'void') {
          const expectedLines = expectedOutput.split("\n").map(l => l.trim());
          const actualLines = [];
          
          // Recolectar tantas líneas como se esperan
          for (let j = 0; j < expectedLines.length; j++) {
            if (lineIndex < outputLines.length) {
              actualLines.push(outputLines[lineIndex]);
              lineIndex++;
            }
          }
          actualOutput = actualLines.join("\n");
        } else {
          // Función no-void: cada test = 1 línea de output
          actualOutput = outputLines[lineIndex] || "";
          lineIndex++;
        }

        // Comparar output actual vs esperado
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

    /**
     * Guardar intento en base de datos
     * 
     * Registra:
     * - Si el usuario está autenticado, guardar el intento
     * - Si falló algún test, incrementar contador de fallos del ejercicio
     * - Esto permite análisis de debilidades y progreso
     */
    if (userId) {
      try {
        // Insertar registro del intento con resultados
        await pool.query(
          "INSERT INTO exercise_attempts (user_id, exercise_id, is_successful, passed_tests, total_tests, jdoodle_output) VALUES (?, ?, ?, ?, ?, ?)",
          [userId, id, isSuccessful ? 1 : 0, passedTests, tests.length, jdoodleOutput.trim()]
        );

        // Si no pasó todos los tests, incrementar contador de fallos
        // Esto se usa en el análisis de debilidades
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

    // Retornar resultados de la validación al frontend
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
