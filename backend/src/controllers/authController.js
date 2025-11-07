// backend/src/controllers/authController.js
import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";
import { env } from "../config/env.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

/* ──────────────── REGISTER ──────────────── */
export const register = async (req, res) => {
  const { username, email, password } = req.validated.body;

  try {
    // ¿ya existe usuario o email?
    const [dup] = await pool.query(
      "SELECT id FROM users WHERE username=? OR email=? LIMIT 1",
      [username, email]
    );
    if (dup.length) {
      return res
        .status(409)
        .json({ message: "El usuario o correo ya están registrados." });
    }

    // ⚠️ ahora usamos la columna password (no password_hash)
    const hashed = await hashPassword(password);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashed]
    );

    return res.status(201).json({ message: "Cuenta creada." });
  } catch (err) {
    console.error("[AUTH ERROR]", err?.code, err?.message, err?.sqlMessage);
    return res.status(500).json({
      message: `Error interno del servidor (${err?.code || "UNKNOWN"})`,
    });
  }
};

/* ──────────────── LOGIN ──────────────── */
export const login = async (req, res) => {
  const { username, password } = req.validated.body;

  try {
    // acepta login por username o email en el mismo campo "username"
    const [rows] = await pool.query(
      `SELECT id, username, email, password, role, created_at
       FROM users
       WHERE username = ? OR email = ?
       LIMIT 1`,
      [username, username]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const user = rows[0];

    // 🔐 comparamos contra user.password (hash Bcrypt)
    const ok = await comparePassword(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    // JWT para el front (usas Bearer en Authorization)
    const token = jwt.sign(
      { sub: user.id, username: user.username },
      env.jwtSecret,
      { expiresIn: "1h" }
    );

    // nunca regreses el password
    const { password: _hide, ...safe } = user;

    return res.json({ token, user: safe });
  } catch (err) {
    console.error("[AUTH ERROR]", err?.code, err?.message, err?.sqlMessage);
    return res.status(500).json({
      message: `Error interno del servidor (${err?.code || "UNKNOWN"})`,
    });
  }
};

/* ──────────────── ME ──────────────── */
export const me = async (req, res) => {
  // este endpoint está protegido por requireAuth (Bearer)
  const id = req.user?.sub;
  if (!id) return res.status(401).json({ message: "No autorizado." });

  try {
    // No incluyas password en el SELECT
    const [rows] = await pool.query(
      "SELECT id, username, email, role, created_at FROM users WHERE id=? LIMIT 1",
      [id]
    );
    if (!rows.length)
      return res.status(404).json({ message: "Usuario no encontrado." });

    return res.json(rows[0]);
  } catch (err) {
    console.error("[AUTH ERROR]", err?.code, err?.message, err?.sqlMessage);
    return res.status(500).json({
      message: `Error interno del servidor (${err?.code || "UNKNOWN"})`,
    });
  }
};
