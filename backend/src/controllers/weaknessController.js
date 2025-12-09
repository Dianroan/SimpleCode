import { pool } from "../db/pool.js";

// POST /api/weaknesses/record-attempt
// body: { exercise_id, success: boolean, first_try?: boolean }
export const recordAttempt = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Autenticación requerida" });

    const { exercise_id, success, first_try } = req.body;
    if (!exercise_id || typeof success !== "boolean") {
      return res.status(400).json({ error: "exercise_id y success son requeridos" });
    }

    // Obtener etiquetas del ejercicio
    const [tags] = await pool.query(
      `SELECT t.id, t.name FROM tags t
       JOIN exercise_tags et ON et.tag_id = t.id
       WHERE et.exercise_id = ?`,
      [exercise_id]
    );

    if (!tags || tags.length === 0) {
      return res.status(200).json({ message: "No hay etiquetas asociadas a este ejercicio" });
    }

    // Para cada etiqueta, actualizar el contador en user_weaknesses
    // Si el intento fue fallido -> +1
    // Si fue exitoso y first_try === true -> -1 (sin bajar de 0)
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      for (const tag of tags) {
        if (!success) {
          await conn.query(
            `INSERT INTO user_weaknesses (user_id, tag_id, value)
             VALUES (?, ?, 1)
             ON DUPLICATE KEY UPDATE value = value + 1`,
            [userId, tag.id]
          );
        } else if (success && first_try) {
          // Decrement but not below zero
          await conn.query(
            `INSERT INTO user_weaknesses (user_id, tag_id, value)
             VALUES (?, ?, 0)
             ON DUPLICATE KEY UPDATE value = GREATEST(0, value - 1)`,
            [userId, tag.id]
          );
        }
      }

      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    res.json({ ok: true });
  } catch (error) {
    console.error("recordAttempt error:", error);
    res.status(500).json({ error: "Error al procesar intento" });
  }
};

// POST /api/weaknesses/community-report
// body: { tags: [tagId], difficulty: 1|2|3 }
export const communityReport = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Autenticación requerida" });

    const { tags, difficulty } = req.body;
    if (!Array.isArray(tags) || tags.length === 0 || ![1,2,3].includes(Number(difficulty))) {
      return res.status(400).json({ error: "tags y difficulty (1-3) son requeridos" });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (const tagId of tags) {
        await conn.query(
          `INSERT INTO user_weaknesses (user_id, tag_id, value)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE value = value + VALUES(value)`,
          [userId, tagId, Number(difficulty)]
        );
      }
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    res.json({ ok: true });
  } catch (error) {
    console.error("communityReport error:", error);
    res.status(500).json({ error: "Error al procesar reporte" });
  }
};

// GET /api/weaknesses/top
export const getTopWeaknesses = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Autenticación requerida" });

    const [rows] = await pool.query(
      `SELECT t.id, t.name, COALESCE(uw.value,0) as value
       FROM tags t
       LEFT JOIN user_weaknesses uw ON uw.tag_id = t.id AND uw.user_id = ?
       WHERE COALESCE(uw.value,0) > 0
       ORDER BY uw.value DESC
       LIMIT 20`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error("getTopWeaknesses error:", error);
    res.status(500).json({ error: "Error al obtener debilidades" });
  }
};

// GET /api/weaknesses/by-category
export const getWeaknessesByCategory = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Autenticación requerida" });

    // Obtener categorías (cursos) donde el usuario tiene debilidades
    const [categories] = await pool.query(
      `SELECT DISTINCT c.id, c.title,
              COALESCE(SUM(uw.value), 0) as total_weakness
       FROM courses c
       LEFT JOIN exercise_tags et ON c.id = et.exercise_id
       LEFT JOIN user_weaknesses uw ON uw.tag_id = et.tag_id AND uw.user_id = ?
       WHERE COALESCE(uw.value, 0) > 0
       GROUP BY c.id, c.title
       ORDER BY total_weakness DESC
       LIMIT 10`,
      [userId]
    );

    res.json(categories);
  } catch (error) {
    console.error("getWeaknessesByCategory error:", error);
    res.status(500).json({ error: "Error al obtener debilidades por categoría" });
  }
};

// GET /api/weaknesses/failed-exercises
// Retorna los ejercicios específicos que el usuario ha fallado con su contador
export const getFailedExercises = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Autenticación requerida" });

    const [exercises] = await pool.query(
      `SELECT 
        ea.id,
        ea.title,
        efc.failure_count,
        efc.last_attempt_at
       FROM exercise_failure_count efc
       JOIN exercise_activities ea ON ea.id = efc.exercise_id
       WHERE efc.user_id = ? AND efc.failure_count > 0
       ORDER BY efc.failure_count DESC, efc.last_attempt_at DESC
       LIMIT 20`,
      [userId]
    );

    res.json(exercises);
  } catch (error) {
    console.error("getFailedExercises error:", error);
    res.status(500).json({ error: "Error al obtener ejercicios fallidos" });
  }
};
