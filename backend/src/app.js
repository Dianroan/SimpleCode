/**
 * Configuración principal de la aplicación Express
 * 
 * Este archivo configura:
 * - Middlewares globales (CORS, parseo de JSON)
 * - Rutas de la API REST
 * - Endpoints principales de la aplicación
 */

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import healthRoutes from "./routes/health.js";
import learningPathRoutes from "./routes/learningPath.js";
import jdoodleRoutes from "./routes/jdoodle.routes.js";
import exercisesRoutes from "./routes/exercises.js";
import weaknessesRoutes from "./routes/weaknesses.js";
import streaksRoutes from "./routes/streaks.js";

const app = express();

/**
 * Middleware CORS: Permite peticiones desde el frontend en localhost:5173
 * En producción, cambiar el origin al dominio del frontend desplegado
 */
app.use(
  cors({
    origin: ["http://localhost:5173"],
    optionsSuccessStatus: 200,
  })
);

/**
 * Middleware para parsear cuerpos JSON en las peticiones
 * Permite acceder a req.body en los controllers
 */
app.use(express.json());

/**
 * Health check básico - responde si el servidor está activo
 */
app.get("/health", (_req, res) => res.json({ ok: true }));

/**
 * Registro de rutas de la API
 * Cada ruta maneja un módulo específico de la aplicación
 */
app.use("/api/auth", authRoutes);                    // Autenticación: login, registro
app.use("/api/health", healthRoutes);                // Verificación de salud de DB
app.use("/api/learning-path", learningPathRoutes);   // Rutas de aprendizaje
app.use("/api/jdoodle", jdoodleRoutes);              // Ejecución de código
app.use("/api/exercises", exercisesRoutes);          // Ejercicios de práctica
app.use("/api/weaknesses", weaknessesRoutes);        // Análisis de debilidades
app.use("/api/streaks", streaksRoutes);              // Rachas de estudio

export default app;
