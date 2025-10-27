import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { register, login, me } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/* ───────── Zod Schemas ───────── */
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
    .refine((data) => data.password === data.confirm, {
      path: ["confirm"],
      message: "Las contraseñas no coinciden.",
    }),
});

const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3, "El nombre de usuario es obligatorio."),
    password: z.string().min(1, "La contraseña es obligatoria."),
  }),
});

/* ───────── Rutas ───────── */
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", requireAuth, me);

export default router;
