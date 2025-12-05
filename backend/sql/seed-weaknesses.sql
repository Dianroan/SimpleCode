-- seed-weaknesses-full.sql
-- Crea tablas de etiquetas, relaciones ejercicio->etiqueta y debilidades por usuario
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_uq` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `exercise_tags` (
  `exercise_id` int(10) UNSIGNED NOT NULL,
  `tag_id` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`exercise_id`,`tag_id`),
  KEY `tag_idx` (`tag_id`),
  CONSTRAINT `exercise_tags_ex_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercise_activities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `exercise_tags_tag_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `user_weaknesses` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(10) UNSIGNED NOT NULL,
  `tag_id` int(10) UNSIGNED NOT NULL,
  `value` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_tag_uq` (`user_id`,`tag_id`),
  KEY `tag_idx` (`tag_id`),
  CONSTRAINT `user_weaknesses_tag_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Insertar etiquetas (tags relevantes)
INSERT IGNORE INTO tags (name) VALUES
('variables'),
('types'),
('io'),
('strings'),
('operators'),
('arithmetic'),
('comparison'),
('booleans'),
('conditions'),
('if-else'),
('switch'),
('loops'),
('for'),
('while'),
('foreach'),
('break-continue'),
('arrays'),
('arrays-2d'),
('functions'),
('methods'),
('recursion'),
('classes'),
('constructors'),
('encapsulation'),
('inheritance'),
('polymorphism'),
('interfaces'),
('bigint'),
('searching'),
('sorting');

-- Asociaciones ejercicio_id -> tags
-- Nota: adapta exercise_id si tu base difiere; estos ids provienen del dump adjunto.
-- Ejercicio 9: Sumar
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 9, id FROM tags WHERE name IN ('arithmetic','operators','functions');

-- Ejercicio 10: Restar
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 10, id FROM tags WHERE name IN ('arithmetic','operators','functions');

-- Ejercicio 11: Multiplicación
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 11, id FROM tags WHERE name IN ('arithmetic','operators','functions');

-- Ejercicio 12: División
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 12, id FROM tags WHERE name IN ('arithmetic','operators','functions');

-- Ejercicio 14: Suma de numeros grandes
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 14, id FROM tags WHERE name IN ('bigint','arithmetic','functions');

-- Ejercicio 16: Comparación de dos strings
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 16, id FROM tags WHERE name IN ('strings','comparison');

-- Ejercicio 17: EsMenor
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 17, id FROM tags WHERE name IN ('comparison','operators');

-- Ejercicio 18: EsMayor
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 18, id FROM tags WHERE name IN ('comparison','operators');

-- Ejercicio 20: Mayor que un valor fijo
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 20, id FROM tags WHERE name IN ('comparison','conditions','if-else');

-- Ejercicio 22: Uso de && (AND)
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 22, id FROM tags WHERE name IN ('booleans','conditions','operators');

-- Ejercicio 23: Uso de || (OR)
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 23, id FROM tags WHERE name IN ('booleans','conditions','operators');

-- Ejercicio 25: Par o impar (modulo)
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 25, id FROM tags WHERE name IN ('operators','arithmetic','conditions');

-- Ejercicio 27: switch-case
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 27, id FROM tags WHERE name IN ('switch','conditions');

-- Ejercicio 30: For 1..100
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 30, id FROM tags WHERE name IN ('loops','for');

-- Ejercicio 32: While - incrementar hasta objetivo
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 32, id FROM tags WHERE name IN ('loops','while');

-- Ejercicio 33: do-while (si existe)
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 33, id FROM tags WHERE name IN ('loops');

-- Ejercicio 34/35: Foreach - contar espacios en string
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 35, id FROM tags WHERE name IN ('foreach','loops','strings');

-- Ejercicio 37: Break/Continue
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 37, id FROM tags WHERE name IN ('break-continue','loops');

-- Ejercicio 38..44: Arreglos
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 40, id FROM tags WHERE name IN ('arrays','searching','loops');
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 42, id FROM tags WHERE name IN ('arrays-2d','loops');
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 44, id FROM tags WHERE name IN ('arrays','loops','foreach');

-- Ejercicio 47: Funcion suma (otra vez funciones)
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 47, id FROM tags WHERE name IN ('functions','arithmetic');

-- Ejercicio 48: TieneEspacio (strings)
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 48, id FROM tags WHERE name IN ('strings','loops');

-- Ejercicio 54: Inicializacion con constructor
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 54, id FROM tags WHERE name IN ('classes','constructors');

-- Ejercicio 57: Getters y Setters
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 57, id FROM tags WHERE name IN ('classes','encapsulation');

-- Ejercicio 62: Interfaces / POO avanzada
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 62, id FROM tags WHERE name IN ('interfaces','oop','polymorphism');

-- Mapear otros ejercicios teóricos a etiquetas generales (ajusta según necesites)
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 1, id FROM tags WHERE name IN ('types','variables');
INSERT IGNORE INTO exercise_tags (exercise_id, tag_id)
SELECT 2, id FROM tags WHERE name IN ('program-structure','variables') WHERE 1=0; -- placeholder (no tag 'program-structure' by default)

-- Si deseas añadir más asociaciones, repite el patrón:
-- INSERT IGNORE INTO exercise_tags (exercise_id, tag_id) SELECT <exercise_id>, id FROM tags WHERE name IN ('tag1','tag2');

-- Nota: si algunas filas fallan (p.ej. 'exercise_id' no existe), el INSERT IGNORE no detendrá la ejecución.