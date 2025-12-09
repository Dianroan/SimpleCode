/**
 * Rutas de Health Check
 * 
 * Endpoints para verificar el estado de salud del servidor y la base de datos.
 * Útil para monitoreo y diagnóstico de problemas de conexión.
 */

import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

/**
 * GET /api/health/db
 * Verifica la conexión a la base de datos MySQL
 * 
 * Prueba:
 * 1. Conexión básica ejecutando un query simple
 * 2. Existencia de la tabla users (tabla fundamental)
 * 
 * Retorna:
 * - 200 OK si todo funciona correctamente
 * - 500 Error si hay problemas de conexión o esquema
 */
router.get("/db", async (_req, res) => {
  try {
    // Prueba 1: Ejecutar query simple para verificar conexión
    await pool.query("SELECT 1+1 AS ok");

    // Prueba 2: Verificar existencia de tabla users
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
