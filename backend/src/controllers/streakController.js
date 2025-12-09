/**
 * Controller de Rachas (Streaks)
 * 
 * Gestiona las rachas de estudio del usuario - días consecutivos de actividad.
 * Una racha se mantiene si el usuario completa al menos una actividad cada día.
 * Se rompe si pasa más de 1 día sin actividad.
 */

import { pool } from "../db/pool.js";

/**
 * GET /api/streaks/current
 * Obtiene la racha actual del usuario autenticado
 * 
 * Calcula:
 * - Días consecutivos de actividad actual
 * - Última fecha de actividad
 * - Fecha de inicio de la racha
 * - Si la racha está activa hoy
 * - Si se rompió la racha (más de 1 día sin actividad)
 * 
 * @param {Request} req - Petición con req.user.id del middleware de auth
 * @param {Response} res - Respuesta JSON con información de la racha
 */
export const getCurrentStreak = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Autenticación requerida" });
    }

    // Obtener registro de racha del usuario
    const [rows] = await pool.query(
      `SELECT current_streak_days, last_activity_date 
       FROM user_streaks 
       WHERE user_id = ?`,
      [userId]
    );

    // Si no tiene racha registrada, retornar racha en 0
    if (rows.length === 0) {
      return res.json({
        current_streak_days: 0,
        last_activity_date: null,
        is_active_today: false
      });
    }

    const streak = rows[0];
    const today = new Date().toISOString().split('T')[0]; // Formato: YYYY-MM-DD
    const lastActivity = streak.last_activity_date 
      ? new Date(streak.last_activity_date).toISOString().split('T')[0] 
      : null;

    // Verificar si ya hubo actividad hoy
    const isActiveToday = lastActivity === today;

    // Calcular si la racha se rompió
    let currentStreak = streak.current_streak_days;
    let streakStartDate = null;
    
    if (lastActivity) {
      const lastDate = new Date(lastActivity);
      const todayDate = new Date(today);
      const diffTime = todayDate - lastDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Si pasaron más de 1 día, la racha se rompió
      if (diffDays > 1) {
        currentStreak = 0;
        // Actualizar en BD para reflejar que se rompió
        await pool.query(
          `UPDATE user_streaks SET current_streak_days = 0 WHERE user_id = ?`,
          [userId]
        );
      } else if (currentStreak > 0) {
        // Calcular fecha de inicio de la racha actual
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

/**
 * POST /api/streaks/update
 * Actualiza la racha del usuario cuando completa una actividad
 * 
 * Se llama automáticamente cuando el usuario:
 * - Completa un ejercicio exitosamente
 * - Termina de leer contenido teórico
 * - Realiza cualquier actividad de aprendizaje
 * 
 * Lógica:
 * - Si es el primer día: racha = 1
 * - Si es consecutivo (ayer tuvo actividad): racha + 1
 * - Si ya activó hoy: no hace nada (solo cuenta 1 vez por día)
 * - Si pasó más de 1 día: reinicia la racha a 1
 * 
 * @param {Request} req - Petición con req.user.id
 * @param {Response} res - Respuesta JSON con racha actualizada
 */
export const updateStreak = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Autenticación requerida" });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Obtener racha actual del usuario
    const [rows] = await pool.query(
      `SELECT current_streak_days, last_activity_date 
       FROM user_streaks 
       WHERE user_id = ?`,
      [userId]
    );

    // Primera vez: crear registro de racha
    if (rows.length === 0) {
      await pool.query(
        `INSERT INTO user_streaks (user_id, current_streak_days, last_activity_date)
         VALUES (?, 1, ?)`,
        [userId, today]
      );
      return res.json({ current_streak_days: 1, is_active_today: true });
    }

    const streak = rows[0];
    const lastActivity = streak.last_activity_date 
      ? new Date(streak.last_activity_date).toISOString().split('T')[0] 
      : null;

    // Si ya hubo actividad hoy, no incrementar la racha
    if (lastActivity === today) {
      return res.json({
        current_streak_days: streak.current_streak_days,
        is_active_today: true
      });
    }

    // Calcular nueva racha basada en diferencia de días
    let newStreak = 1;
    if (lastActivity) {
      const lastDate = new Date(lastActivity);
      const todayDate = new Date(today);
      const diffTime = todayDate - lastDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Día consecutivo: incrementar racha
        newStreak = streak.current_streak_days + 1;
      } else if (diffDays > 1) {
        // Se rompió la racha: reiniciar a 1
        newStreak = 1;
      }
    }

    // Actualizar racha en la base de datos
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
