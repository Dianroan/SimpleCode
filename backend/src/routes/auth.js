import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { register, login } from "../controllers/authController.js";

const router = Router();

const registerSchema = z.object({
  body: z
    .object({
      username: z.string().min(3, "El nombre de usuario es obligatorio."),
      email: z.string().email("Correo inválido."),
      password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres."),
      confirm: z.string().min(6),
    })
    .refine((d) => d.password === d.confirm, {
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

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
