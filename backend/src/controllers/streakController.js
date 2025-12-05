import { pool } from "../db/pool.js";

// GET /api/streaks/current
export const getCurrentStreak = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Autenticación requerida" });

    // Obtener racha actual
    const [rows] = await pool.query(
      `SELECT current_streak_days, last_activity_date 
       FROM user_streaks 
       WHERE user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      // No tiene racha, retornar 0
      return res.json({
        current_streak_days: 0,
        last_activity_date: null,
        is_active_today: false
      });
    }

    const streak = rows[0];
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastActivity = streak.last_activity_date ? new Date(streak.last_activity_date).toISOString().split('T')[0] : null;

    // Verificar si la racha está activa hoy
    const isActiveToday = lastActivity === today;

    // Verificar si se rompió la racha
    let currentStreak = streak.current_streak_days;
    let streakStartDate = null;
    
    if (lastActivity) {
      const lastDate = new Date(lastActivity);
      const todayDate = new Date(today);
      const diffTime = todayDate - lastDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Si pasaron más de 1 día, se rompió la racha
      if (diffDays > 1) {
        currentStreak = 0;
        await pool.query(
          `UPDATE user_streaks SET current_streak_days = 0 WHERE user_id = ?`,
          [userId]
        );
      } else if (currentStreak > 0) {
        // Calcular fecha de inicio de la racha
        streakStartDate = new Date(lastDate);
        streakStartDate.setDate(streakStartDate.getDate() - (currentStreak - 1));
        streakStartDate = streakStartDate.toISOString().split('T')[0];
      }
    }

    res.json({
      current_streak_days: currentStreak,
      last_activity_date: lastActivity,
      streak_start_date: streakStartDate,
      is_active_today: isActiveToday
    });
  } catch (error) {
    console.error("getCurrentStreak error:", error);
    res.status(500).json({ error: "Error al obtener racha" });
  }
};

// POST /api/streaks/update
// Se llama cuando el usuario completa una actividad (teoría o ejercicio)
export const updateStreak = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Autenticación requerida" });

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Obtener racha actual
    const [rows] = await pool.query(
      `SELECT current_streak_days, last_activity_date 
       FROM user_streaks 
       WHERE user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      // Primera vez, crear racha
      await pool.query(
        `INSERT INTO user_streaks (user_id, current_streak_days, last_activity_date)
         VALUES (?, 1, ?)`,
        [userId, today]
      );
      return res.json({ current_streak_days: 1, is_active_today: true });
    }

    const streak = rows[0];
    const lastActivity = streak.last_activity_date ? new Date(streak.last_activity_date).toISOString().split('T')[0] : null;

    // Si ya activó la racha hoy, no hacer nada
    if (lastActivity === today) {
      return res.json({
        current_streak_days: streak.current_streak_days,
        is_active_today: true
      });
    }

    // Calcular diferencia de días
    let newStreak = 1;
    if (lastActivity) {
      const lastDate = new Date(lastActivity);
      const todayDate = new Date(today);
      const diffTime = todayDate - lastDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Día consecutivo, incrementar racha
        newStreak = streak.current_streak_days + 1;
      } else if (diffDays > 1) {
        // Se rompió la racha, reiniciar
        newStreak = 1;
      }
    }

    // Actualizar racha
    await pool.query(
      `UPDATE user_streaks 
       SET current_streak_days = ?, last_activity_date = ?
       WHERE user_id = ?`,
      [newStreak, today, userId]
    );

    res.json({
      current_streak_days: newStreak,
      is_active_today: true
    });
  } catch (error) {
    console.error("updateStreak error:", error);
    res.status(500).json({ error: "Error al actualizar racha" });
  }
};
