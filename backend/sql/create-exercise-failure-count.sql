-- Crear tabla para rastrear cuántas veces un usuario ha fallado un ejercicio
-- (no completó todas las pruebas)

CREATE TABLE IF NOT EXISTS `exercise_failure_count` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(10) UNSIGNED NOT NULL,
  `exercise_id` int(10) UNSIGNED NOT NULL,
  `failure_count` int(11) NOT NULL DEFAULT 0,
  `last_attempt_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_exercise_uq` (`user_id`, `exercise_id`),
  KEY `user_idx` (`user_id`),
  KEY `exercise_idx` (`exercise_id`),
  CONSTRAINT `fk_failure_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_failure_exercise` FOREIGN KEY (`exercise_id`) REFERENCES `exercise_activities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
