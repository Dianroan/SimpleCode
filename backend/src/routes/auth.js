/**
 * Rutas de Autenticación
 * 
 * Define los endpoints para registro, login y obtención de usuario actual.
 * Usa Zod para validar los datos de entrada antes de llegar a los controllers.
 */

import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { register, login, me } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * Schemas de validación con Zod
 * Definen la estructura y reglas de validación para cada endpoint
 */

// Schema para registro de nuevos usuarios
const registerSchema = z.object({
  body: z
    .object({
      username: z.string().min(3, "El nombre de usuario es obligatorio."),
      email: z.string().email("Correo inválido."),
      password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres."),
      confirm: z.string().min(6, "La confirmación es obligatoria."),
    })
    // Validación personalizada: password y confirm deben coincidir
    .refine((data) => data.password === data.confirm, {
      path: ["confirm"],
      message: "Las contraseñas no coinciden.",
    }),
});

// Schema para login
const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3, "El nombre de usuario es obligatorio."),
    password: z.string().min(1, "La contraseña es obligatoria."),
  }),
});

/**
 * Definición de rutas
 */

// POST /api/auth/register - Registrar nuevo usuario
router.post("/register", validate(registerSchema), register);

// POST /api/auth/login - Iniciar sesión
router.post("/login", validate(loginSchema), login);

// GET /api/auth/me - Obtener usuario actual (requiere autenticación)
router.get("/me", requireAuth, me);

export default router;
