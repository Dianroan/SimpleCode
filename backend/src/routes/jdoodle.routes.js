// backend/src/routes/jdoodle.routes.js
import { Router } from "express";

const router = Router();

// GET /api/jdoodle/ping  → para probar que el router sí está montado
router.get("/ping", (_req, res) => {
  res.json({ ok: true, from: "jdoodle router" });
});

// POST /api/jdoodle/run-example  → ejecuta código en JDoodle
router.post("/run-example", async (req, res) => {
  try {
    const { script } = req.body;

    if (!script) {
      return res.status(400).json({ message: "Falta el código (script)." });
    }

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
