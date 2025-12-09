import express from "express";
import { recordAttempt, communityReport, getTopWeaknesses, getWeaknessesByCategory, getFailedExercises } from "../controllers/weaknessController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Registro de intento (éxito/fallo)
router.post("/record-attempt", requireAuth, recordAttempt);

// Reporte desde desafíos de la comunidad
router.post("/community-report", requireAuth, communityReport);

// Obtener top debilidades del usuario
router.get("/top", requireAuth, getTopWeaknesses);

// Obtener debilidades por categoría
router.get("/by-category", requireAuth, getWeaknessesByCategory);

// Obtener ejercicios fallidos específicos
router.get("/failed-exercises", requireAuth, getFailedExercises);

export default router;
