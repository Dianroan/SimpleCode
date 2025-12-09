/**
 * Rutas de Debilidades (Weaknesses)
 * 
 * Endpoints para registrar intentos, obtener análisis de debilidades
 * y ejercicios fallados. Todas las rutas requieren autenticación.
 */

import express from "express";
import { 
  recordAttempt, 
  communityReport, 
  getTopWeaknesses, 
  getWeaknessesByCategory, 
  getFailedExercises 
} from "../controllers/weaknessController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/weaknesses/record-attempt
 * Registra un intento de ejercicio (exitoso o fallido)
 * Actualiza automáticamente los contadores de debilidad por tema
 */
router.post("/record-attempt", requireAuth, recordAttempt);

/**
 * POST /api/weaknesses/community-report
 * Permite reportar manualmente debilidades desde desafíos de la comunidad
 */
router.post("/community-report", requireAuth, communityReport);

/**
 * GET /api/weaknesses/top
 * Obtiene los temas con mayor número de fallos del usuario
 */
router.get("/top", requireAuth, getTopWeaknesses);

/**
 * GET /api/weaknesses/by-category
 * Obtiene debilidades agrupadas por categoría/curso
 */
router.get("/by-category", requireAuth, getWeaknessesByCategory);

/**
 * GET /api/weaknesses/failed-exercises
 * Retorna ejercicios específicos que el usuario ha fallado con contadores
 */
router.get("/failed-exercises", requireAuth, getFailedExercises);

export default router;
