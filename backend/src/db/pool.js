/**
 * Pool de conexiones a MySQL
 * 
 * Este módulo crea y configura un pool de conexiones reutilizables
 * a la base de datos MySQL. El pool gestiona automáticamente las conexiones,
 * permitiendo múltiples peticiones concurrentes de forma eficiente.
 * 
 * Uso en controllers:
 *   const [rows] = await pool.query('SELECT * FROM tabla WHERE id = ?', [id]);
 */

import mysql from "mysql2/promise";
import { env } from "../config/env.js";

/**
 * Pool de conexiones MySQL configurado
 * 
 * Configuración:
 * - waitForConnections: Espera si no hay conexiones disponibles
 * - connectionLimit: Máximo 10 conexiones simultáneas
 * - queueLimit: Sin límite de peticiones en cola (0 = ilimitado)
 */
export const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
