import express from "express";
import { getCurrentStreak, updateStreak } from "../controllers/streakController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Obtener racha actual del usuario
router.get("/current", requireAuth, getCurrentStreak);

// Actualizar racha (llamar cuando completa una actividad)
router.post("/update", requireAuth, updateStreak);

export default router;
