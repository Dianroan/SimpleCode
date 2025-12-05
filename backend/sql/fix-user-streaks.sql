-- Arreglar tabla user_streaks para sistema de rachas

-- Paso 1: Eliminar restricciones existentes si existen
ALTER TABLE `user_streaks` DROP INDEX IF EXISTS `uq_streak_user`;

-- Paso 2: Asegurar que id sea PRIMARY KEY
ALTER TABLE `user_streaks` DROP PRIMARY KEY IF EXISTS;
ALTER TABLE `user_streaks` ADD PRIMARY KEY (`id`);

-- Paso 3: Modificar el campo id para que sea AUTO_INCREMENT
ALTER TABLE `user_streaks`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

-- Paso 4: Agregar índice único por usuario (solo puede haber una racha por usuario)
ALTER TABLE `user_streaks`
  ADD UNIQUE KEY `uq_streak_user` (`user_id`);
