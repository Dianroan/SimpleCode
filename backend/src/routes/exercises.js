import express from "express";
import { getExercise, validateExercise } from "../controllers/exerciseController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/exercises/:id - Obtener ejercicio con tests
router.get("/:id", getExercise);

// POST /api/exercises/:id/validate - Validar código
router.post("/:id/validate", requireAuth, validateExercise);

export default router;
