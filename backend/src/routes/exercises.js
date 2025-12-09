/**
 * Rutas de Ejercicios
 * 
 * Endpoints para obtener ejercicios y validar soluciones de los usuarios.
 */

import express from "express";
import { getExercise, validateExercise } from "../controllers/exerciseController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/exercises/:id
 * Obtiene un ejercicio específico con sus casos de prueba
 * Público - no requiere autenticación
 */
router.get("/:id", getExercise);

/**
 * POST /api/exercises/:id/validate
 * Valida el código enviado por el usuario contra los tests
 * Requiere autenticación para registrar el intento en BD
 */
router.post("/:id/validate", requireAuth, validateExercise);

export default router;
