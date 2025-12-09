/**
 * Middleware de autenticación con JWT (JSON Web Token)
 * 
 * Este middleware protege rutas que requieren autenticación.
 * Verifica que la petición incluya un token JWT válido en el header Authorization.
 * 
 * Uso en rutas:
 *   router.get('/ruta-protegida', requireAuth, controller);
 */

import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Middleware que requiere autenticación JWT
 * 
 * Funcionamiento:
 * 1. Extrae el token del header Authorization (formato: "Bearer <token>")
 * 2. Verifica que el token sea válido y no haya expirado
 * 3. Decodifica el payload del token y lo añade a req.user
 * 4. Si todo es correcto, permite continuar con next()
 * 5. Si falla, retorna error 401 (No autorizado)
 * 
 * @param {Request} req - Objeto de petición Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {NextFunction} next - Función para continuar al siguiente middleware
 */
export function requireAuth(req, res, next) {
  // Obtener el header Authorization
  const h = req.headers.authorization || "";
  
  // Extraer el token (formato esperado: "Bearer <token>")
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  
  if (!token) {
    return res.status(401).json({ message: "No autorizado." });
  }

  try {
    // Verificar y decodificar el token usando la clave secreta
    const payload = jwt.verify(token, env.jwtSecret);
    
    // Normalizar: el login firma el JWT con { sub: user.id, ... }
    // Aseguramos que req.user.id esté presente para el resto de la app
    req.user = { ...payload, id: payload.sub };
    
    // Continuar al siguiente middleware o controller
    return next();
  } catch {
    // El token es inválido o ha expirado
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
}
