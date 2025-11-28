import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/learning-path
// Regresa la ruta de aprendizaje para el usuario autenticado
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

// GET /api/learning-path/theory/:courseId
// Regresa la info de la actividad de teoría (contenido + ejemplos)
router.get("/theory/:courseId", requireAuth, async (req, res) => {
  try {
    const courseId = req.params.courseId;

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

export default router;

// GET /api/learning-path/progress
// Retorna progreso global del usuario y la siguiente actividad por hacer
router.get("/progress", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Total de actividades activas
    const [totalRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM courses WHERE is_active = 1`
    );

    const total = totalRows[0]?.total || 0;

    // Completadas por el usuario
    const [completedRows] = await pool.query(
      `SELECT COUNT(*) AS completed FROM user_course_progress WHERE user_id = ? AND status = 'COMPLETED'`,
      [userId]
    );

    const completed = completedRows[0]?.completed || 0;

    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Obtener la siguiente actividad no completada (por step_order)
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
