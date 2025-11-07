import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

router.get("/db", async (_req, res) => {
  try {
    // prueba conexión
    await pool.query("SELECT 1+1 AS ok");

    // prueba existencia de tabla users
    await pool.query("DESCRIBE users");

    return res.json({ db: "ok", usersTable: "ok" });
  } catch (err) {
    console.error("[HEALTH DB]", err?.code, err?.message, err?.sqlMessage);
    return res.status(500).json({
      db: "error",
      code: err?.code || "UNKNOWN",
      message: err?.message || err?.sqlMessage || "Fail",
    });
  }
});

export default router;
