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

    // Validar keywords
    for (const keyword of requiredKeywords) {
      if (!code.includes(keyword)) {
        return res.status(400).json({ 
          error: `Palabra clave requerida no encontrada: '${keyword}'` 
        });
      }
    }

    // Inyectar y ejecutar tests
    let passedTests = 0;
    let jdoodleOutput = "";
    const testResults = [];

    // Ejecutar todos los tests pero recolectar output
    let fullTestCode = code;
    let mainInjection = "";

    for (const test of tests) {
      if (test.input_data) {
        try {
          const inputs = JSON.parse(test.input_data);
          if (Array.isArray(inputs)) {
            inputs.forEach(input => {
              mainInjection += `    Console.WriteLine(${JSON.stringify(input)});\n`;
            });
          } else {
            mainInjection += `    Console.WriteLine(${JSON.stringify(inputs)});\n`;
          }
        } catch (e) {
          mainInjection += `    Console.WriteLine(${JSON.stringify(test.input_data)});\n`;
        }
      }
    }

    // Inyectar en el Main
    const mainPattern = /public\s+static\s+void\s+Main\s*\(\s*string\[\]\s+args\s*\)\s*\{/i;
    fullTestCode = fullTestCode.replace(mainPattern, (match) => {
      return match + "\n" + mainInjection;
    });

    try {
      // Llamar JDoodle una sola vez con todos los tests
      const response = await axios.post("https://api.jdoodle.com/v1/execute", {
        script: fullTestCode,
        language: "csharp",
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET
      });

      const output = (response.data.output || "").trim();
      const outputLines = output.split("\n").map(line => line.trim());

      jdoodleOutput = output;

      // Comparar líneas de output con expected
      for (let i = 0; i < tests.length; i++) {
        const expectedOutput = (tests[i].expected_output || "").trim();
        const actualOutput = outputLines[i] || "";

        if (actualOutput === expectedOutput) {
          passedTests++;
          testResults.push({ passed: true, output: actualOutput, expected: expectedOutput });
        } else {
          testResults.push({ passed: false, output: actualOutput, expected: expectedOutput });
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
