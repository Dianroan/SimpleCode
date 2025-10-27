import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";
import { env } from "../config/env.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

/* ──────────────── REGISTER ──────────────── */
export const register = async (req, res) => {
  const { username, email, password } = req.validated.body;

  try {
    // Check duplicates
    const [dup] = await pool.query(
      "SELECT id FROM users WHERE username=? OR email=? LIMIT 1",
      [username, email]
    );
    if (dup.length)
      return res
        .status(409)
        .json({ message: "El usuario o correo ya existe." });

    const password_hash = await hashPassword(password);
    await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?,?,?)",
      [username, email, password_hash]
    );

    return res.status(201).json({ message: "Cuenta creada." });
  } catch (err) {
    console.error("[AUTH ERROR]", err?.code, err?.message, err?.sqlMessage);
    return res
      .status(500)
      .json({
        message: `Error interno del servidor (${err?.code || "UNKNOWN"})`,
      });
  }
};

/* ──────────────── LOGIN ──────────────── */
export const login = async (req, res) => {
  const { username, password } = req.validated.body;

  try {
    const [rows] = await pool.query(
      "SELECT id, username, password_hash FROM users WHERE username=? LIMIT 1",
      [username]
    );
    if (!rows.length)
      return res.status(401).json({ message: "Credenciales inválidas." });

    const user = rows[0];
    const ok = await comparePassword(password, user.password_hash);
    if (!ok)
      return res.status(401).json({ message: "Credenciales inválidas." });

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      env.jwtSecret,
      { expiresIn: "1d" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("[AUTH ERROR]", err?.code, err?.message, err?.sqlMessage);
    return res.status(500).json({
      message: `Error interno del servidor (${err?.code || "UNKNOWN"})`,
    });
  }
};

/* ──────────────── ME ──────────────── */
export const me = async (req, res) => {
  try {
    const id = req.user?.sub;
    const [rows] = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE id=? LIMIT 1",
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
