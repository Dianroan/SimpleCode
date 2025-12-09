/**
 * Rutas de Ruta de Aprendizaje (Learning Path)
 * 
 * Gestiona el acceso y progreso del usuario a trav\u00e9s de los cursos y actividades.
 * Incluye acceso a teor\u00eda, ejercicios, y seguimiento de progreso.
 * Todas las rutas requieren autenticaci\u00f3n.
 */

import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/learning-path
 * Obtiene la ruta de aprendizaje completa para el usuario autenticado
 * 
 * Retorna todos los cursos/actividades con su estado:
 * - LOCKED: Bloqueado (no disponible a\u00fan)
 * - UNLOCKED: Desbloqueado (puede acceder)
 * - COMPLETED: Completado
 * 
 * Se ordenan por step_order para mostrar la secuencia correcta
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.activity_type,
        c.step_order,
        COALESCE(ucp.status, 'LOCKED') AS status
      FROM courses c
      LEFT JOIN user_course_progress ucp
        ON ucp.course_id = c.id AND ucp.user_id = ?
      WHERE c.is_active = 1
      ORDER BY c.step_order ASC
      `,
      [userId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("Error in GET /api/learning-path:", err);
    return res
      .status(500)
      .json({ message: "Error getting learning path" });
  }
});

/**
 * GET /api/learning-path/theory/:courseId
 * Obtiene el contenido de una actividad de teoría
 * 
 * Retorna:
 * - Información de la teoría (título, contenido, tiempo estimado)
 * - Ejemplos de código asociados (ordenados por example_order)
 * 
 * Cada ejemplo incluye:
 * - Código de ejemplo
 * - Output esperado
 * - Explicación del concepto
 */
router.get("/theory/:courseId", requireAuth, async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Obtener información de la actividad de teoría
    const [theoryRows] = await pool.query(
      `
      SELECT 
        t.id,
        t.title,
        t.content,
        t.estimated_minutes
      FROM theory_activities t
      WHERE t.id = ?
      `,
      [courseId]
    );

    if (theoryRows.length === 0) {
      return res.status(404).json({ message: "Theory not found" });
    }

    const theory = theoryRows[0];

    // Obtener ejemplos de código para la teoría
    const [exampleRows] = await pool.query(
      `
      SELECT 
        id,
        example_order,
        code,
        expected_output,
        explanation
      FROM theory_examples
      WHERE theory_id = ?
      ORDER BY example_order ASC
      `,
      [courseId]
    );

    return res.json({
      id: theory.id,
      title: theory.title,
      content: theory.content,
      estimated_minutes: theory.estimated_minutes,
      examples: exampleRows,
    });
  } catch (err) {
    console.error("Error in GET /api/learning-path/theory/:courseId:", err);
    return res
      .status(500)
      .json({ message: "Error getting theory activity" });
  }
});

/**
 * POST /api/learning-path/complete/:courseId
 * Marca una actividad como COMPLETED para el usuario autenticado
 * 
 * Validación especial para ejercicios:
 * - Si la actividad es un ejercicio, verifica que el usuario haya
 *   pasado todos los tests exitosamente antes de marcarlo como completado
 * - Para teoría y otras actividades, simplemente lo marca como completado
 * 
 * Retorna error 403 si intenta completar un ejercicio sin haberlo resuelto
 */
router.post("/complete/:courseId", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;

    // Obtener tipo de actividad del curso
    const [courseRows] = await pool.query(
      `SELECT activity_type FROM courses WHERE id = ?`,
      [courseId]
    );

    if (courseRows.length === 0) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const activityType = courseRows[0].activity_type?.toLowerCase() || "";
    
    // Validación especial para ejercicios
    // Si es un ejercicio (exercise o practice), verificar que haya pasado todos los tests
    if (activityType.includes("exercise") || activityType.includes("practice")) {
      // Verificar si el usuario tiene al menos un intento exitoso
      const [attempts] = await pool.query(
        `SELECT id FROM exercise_attempts WHERE user_id = ? AND exercise_id = ? AND is_successful = 1 LIMIT 1`,
        [userId, courseId]
      );

      if (attempts.length === 0) {
        return res.status(403).json({ 
          message: "Cannot complete exercise without passing all tests",
          error: "TESTS_NOT_PASSED"
        });
      }
    }

    // Verificar si ya existe un registro de progreso para esta actividad
    const [rows] = await pool.query(
      `SELECT id, status FROM user_course_progress WHERE user_id = ? AND course_id = ?`,
      [userId, courseId]
    );

    if (rows.length > 0) {
      // Si ya existe, actualizar a COMPLETED (si no lo está ya)
      if (rows[0].status !== "COMPLETED") {
        await pool.query(
          `UPDATE user_course_progress SET status = 'COMPLETED' WHERE id = ?`,
          [rows[0].id]
        );
      }
    } else {
      // Si no existe, crear nuevo registro como COMPLETED
      await pool.query(
        `INSERT INTO user_course_progress (user_id, course_id, status) VALUES (?, ?, 'COMPLETED')`,
        [userId, courseId]
      );
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Error in POST /api/learning-path/complete/:courseId:", err);
    return res.status(500).json({ message: "Error marking activity as completed" });
  }
});

/**
 * GET /api/learning-path/progress
 * Retorna el progreso global del usuario en la ruta de aprendizaje
 * 
 * Calcula:
 * - Total de actividades disponibles
 * - Actividades completadas por el usuario
 * - Porcentaje de progreso
 * - Siguiente actividad a realizar (primera no completada)
 * 
 * Útil para mostrar barras de progreso y guiar al usuario en su siguiente paso
 */
router.get("/progress", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Contar total de actividades activas en el sistema
    const [totalRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM courses WHERE is_active = 1`
    );

    const total = totalRows[0]?.total || 0;

    // Contar actividades completadas por el usuario
    const [completedRows] = await pool.query(
      `SELECT COUNT(*) AS completed FROM user_course_progress WHERE user_id = ? AND status = 'COMPLETED'`,
      [userId]
    );

    const completed = completedRows[0]?.completed || 0;

    // Calcular porcentaje de progreso
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Obtener la siguiente actividad no completada según el orden
    const [nextRows] = await pool.query(
      `
      SELECT c.id, c.title, c.activity_type, c.step_order, COALESCE(ucp.status, 'LOCKED') AS status
      FROM courses c
      LEFT JOIN user_course_progress ucp
        ON ucp.course_id = c.id AND ucp.user_id = ?
      WHERE c.is_active = 1
      ORDER BY c.step_order ASC
      `,
      [userId]
    );

    // Buscar la primera actividad no completada
    let nextActivity = null;
    for (const r of nextRows) {
      if (r.status !== "COMPLETED") {
        nextActivity = r;
        break;
      }
    }

    return res.json({ total, completed, percentage, nextActivity });
  } catch (err) {
    console.error("Error in GET /api/learning-path/progress:", err);
    return res.status(500).json({ message: "Error getting progress" });
  }
});

export default router;
