/**
 * Controller de Autenticación
 * 
 * Maneja las operaciones de registro, login y obtención de información del usuario.
 * Utiliza JWT para autenticación y bcrypt para encriptación de contraseñas.
 */

import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";
import { env } from "../config/env.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

/**
 * POST /api/auth/register
 * Registra un nuevo usuario en el sistema
 * 
 * Proceso:
 * 1. Verifica que el username y email no estén ya registrados
 * 2. Encripta la contraseña con bcrypt
 * 3. Inserta el nuevo usuario en la base de datos
 * 
 * @param {Request} req - Petición con body: { username, email, password }
 * @param {Response} res - Respuesta JSON
 */
export const register = async (req, res) => {
  const { username, email, password } = req.validated.body;

  try {
    // Verificar si ya existe un usuario con ese username o email
    const [dup] = await pool.query(
      "SELECT id FROM users WHERE username=? OR email=? LIMIT 1",
      [username, email]
    );
    
    if (dup.length) {
      return res
        .status(409)
        .json({ message: "El usuario o correo ya están registrados." });
    }

    // Encriptar la contraseña usando bcrypt
    const hashed = await hashPassword(password);

    // Insertar el nuevo usuario en la base de datos
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

/**
 * POST /api/auth/login
 * Autentica un usuario y genera un token JWT
 * 
 * Proceso:
 * 1. Busca el usuario por username o email
 * 2. Verifica que la contraseña sea correcta
 * 3. Genera un token JWT con expiración de 1 hora
 * 4. Retorna el token y la información del usuario (sin la contraseña)
 * 
 * @param {Request} req - Petición con body: { username, password }
 * @param {Response} res - Respuesta JSON con token y datos de usuario
 */
export const login = async (req, res) => {
  const { username, password } = req.validated.body;

  try {
    // Buscar usuario por username o email (el campo puede contener cualquiera de los dos)
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

    // Comparar la contraseña ingresada con el hash almacenado en BD
    const ok = await comparePassword(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    // Generar token JWT que expira en 1 hora
    // El payload incluye el ID del usuario (sub) y su username
    const token = jwt.sign(
      { sub: user.id, username: user.username },
      env.jwtSecret,
      { expiresIn: "1h" }
    );

    // Remover el password del objeto antes de enviarlo al cliente
    const { password: _hide, ...safe } = user;

    return res.json({ token, user: safe });
  } catch (err) {
    console.error("[AUTH ERROR]", err?.code, err?.message, err?.sqlMessage);
    return res.status(500).json({
      message: `Error interno del servidor (${err?.code || "UNKNOWN"})`,
    });
  }
};

/**
 * GET /api/auth/me
 * Obtiene la información del usuario autenticado (requiere token JWT)
 * 
 * Esta ruta está protegida por el middleware requireAuth,
 * que verifica el token y añade req.user con la información del payload.
 * 
 * @param {Request} req - Petición con header Authorization: Bearer <token>
 * @param {Response} res - Respuesta JSON con datos del usuario
 */
export const me = async (req, res) => {
  const id = req.user?.sub;
  
  if (!id) {
    return res.status(401).json({ message: "No autorizado." });
  }

  try {
    // Obtener datos del usuario sin incluir el password
    const [rows] = await pool.query(
      "SELECT id, username, email, role, created_at FROM users WHERE id=? LIMIT 1",
      [id]
    );
    
    if (!rows.length) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("[AUTH ERROR]", err?.code, err?.message, err?.sqlMessage);
    return res.status(500).json({
      message: `Error interno del servidor (${err?.code || "UNKNOWN"})`,
    });
  }
};
