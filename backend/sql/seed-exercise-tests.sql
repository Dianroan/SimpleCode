-- SQL: Crear tabla exercise_tests y sembrar casos de prueba de ejemplo

CREATE TABLE IF NOT EXISTS `exercise_tests` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `exercise_id` int(10) UNSIGNED NOT NULL,
  `test_order` int(11) NOT NULL DEFAULT 1,
  `input_data` text,
  `expected_output` text,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `exercise_id_idx` (`exercise_id`),
  CONSTRAINT `exercise_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercise_activities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Ejemplos de 5 tests para Sumar (exercise_id = 9)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(9, 1, '[3,5]', '8', 'Suma 3 + 5'),
(9, 2, '[10,2]', '12', 'Suma 10 + 2'),
(9, 3, '[-1,1]', '0', 'Suma -1 + 1'),
(9, 4, '[0,0]', '0', 'Suma 0 + 0'),
(9, 5, '[100,200]', '300', 'Suma 100 + 200');

-- Ejemplos de 5 tests para Restar (exercise_id = 10)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(10, 1, '[8,5]', '3', 'Resta 8 - 5'),
(10, 2, '[10,20]', '-10', 'Resta 10 - 20'),
(10, 3, '[100,1]', '99', 'Resta 100 - 1'),
(10, 4, '[0,5]', '-5', 'Resta 0 - 5'),
(10, 5, '[-3,-2]', '-1', 'Resta -3 - (-2)');

-- Ejemplos de 5 tests para Multiplicar (exercise_id = 11)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(11, 1, '[3,5]', '15', 'Multiplica 3 * 5'),
(11, 2, '[10,2]', '20', 'Multiplica 10 * 2'),
(11, 3, '[7,-3]', '-21', 'Multiplica 7 * -3'),
(11, 4, '[0,100]', '0', 'Multiplica 0 * 100'),
(11, 5, '[-4,-5]', '20', 'Multiplica -4 * -5');

-- Ejemplos de 5 tests para Dividir (exercise_id = 12)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(12, 1, '[10,2]', '5', 'Division 10 / 2'),
(12, 2, '[9,3]', '3', 'Division 9 / 3'),
(12, 3, '[7,2]', '3', 'Division entera 7 / 2 -> 3'),
(12, 4, '[5,0]', '0', 'Denominador cero -> retornar 0'),
(12, 5, '[-7,2]', '-3', 'Division con negativos');

-- Nota: Ajusta los exercise_id según tu base de datos si es necesario.
