/**
 * Rutas de Rachas (Streaks)
 * 
 * Endpoints para obtener y actualizar las rachas de estudio del usuario.
 * Todas las rutas requieren autenticación.
 */

import express from "express";
import { getCurrentStreak, updateStreak } from "../controllers/streakController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/streaks/current
 * Obtiene la racha actual del usuario autenticado
 * Retorna días consecutivos, última actividad, si está activa hoy
 */
router.get("/current", requireAuth, getCurrentStreak);

/**
 * POST /api/streaks/update
 * Actualiza la racha cuando el usuario completa una actividad
 * Se llama automáticamente al completar ejercicios o teoría
 */
router.post("/update", requireAuth, updateStreak);

export default router;
