/**
 * Rutas de JDoodle
 * 
 * Endpoints para ejecutar código C# usando la API externa de JDoodle.
 * JDoodle es un compilador online que soporta múltiples lenguajes.
 */

import { Router } from "express";

const router = Router();

/**
 * GET /api/jdoodle/ping
 * Endpoint de prueba para verificar que el router está montado correctamente
 */
router.get("/ping", (_req, res) => {
  res.json({ ok: true, from: "jdoodle router" });
});

/**
 * POST /api/jdoodle/run-example
 * Ejecuta código C# en JDoodle y retorna el output
 * 
 * Body: { script: string } - Código C# a ejecutar
 * 
 * Proceso:
 * 1. Valida que se envíe el código
 * 2. Llama a la API de JDoodle con credenciales del .env
 * 3. Retorna el output, errores y código de estado
 */
router.post("/run-example", async (req, res) => {
  try {
    const { script } = req.body;

    if (!script) {
      return res.status(400).json({ message: "Falta el código (script)." });
    }

    // Llamar a la API de JDoodle para compilar y ejecutar el código
    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        script,
        stdin: "",
        language: "csharp",
        versionIndex: "0",
      }),
    });

    const data = await response.json();

    return res.json({
      output: data.output,
      error: data.error,
      statusCode: data.statusCode,
    });
  } catch (err) {
    console.error("Error llamando a JDoodle:", err);
    return res
      .status(500)
      .json({ message: "Error ejecutando el ejemplo en JDoodle." });
  }
});

export default router;
