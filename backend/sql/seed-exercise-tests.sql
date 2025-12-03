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

-- Ejemplos de 5 tests para SumarNumerosGrandes (exercise_id = 14)
-- Nota: Usando strings para números long muy grandes para preservar precisión
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(14, 1, '["2000000000","2000000000"]', '4000000000', 'Suma de números grandes'),
(14, 2, '["9223372036854775800","5"]', '9223372036854775805', 'Suma cerca del límite de long'),
(14, 3, '["1000000000","1000000000"]', '2000000000', 'Suma de 1 billón + 1 billón'),
(14, 4, '["0","0"]', '0', 'Suma de ceros'),
(14, 5, '["-1000000000","1000000000"]', '0', 'Suma de negativos y positivos');

-- Ejemplos de 5 tests para CompararStrings (exercise_id = 16)
-- Nota: El output será "True" o "False" (en C# bool se imprime así)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(16, 1, '["hola","hola"]', 'True', 'Strings iguales'),
(16, 2, '["hola","mundo"]', 'False', 'Strings diferentes'),
(16, 3, '["",""]', 'True', 'Strings vacíos iguales'),
(16, 4, '["ABC","abc"]', 'False', 'Case sensitive - diferentes'),
(16, 5, '["test","test "]', 'False', 'Con espacio al final - diferentes');

-- Ejemplos de 5 tests para EsMenor (exercise_id = 17)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(17, 1, '[3,5]', 'True', '3 es menor que 5'),
(17, 2, '[10,2]', 'False', '10 no es menor que 2'),
(17, 3, '[5,5]', 'False', '5 no es menor que 5 (igual)'),
(17, 4, '[-5,0]', 'True', '-5 es menor que 0'),
(17, 5, '[0,-5]', 'False', '0 no es menor que -5');

-- Ejemplos de 5 tests para EsMayor (exercise_id = 18)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(18, 1, '[10,5]', 'True', '10 es mayor que 5'),
(18, 2, '[3,7]', 'False', '3 no es mayor que 7'),
(18, 3, '[5,5]', 'False', '5 no es mayor que 5 (igual)'),
(18, 4, '[0,-5]', 'True', '0 es mayor que -5'),
(18, 5, '[-10,-5]', 'False', '-10 no es mayor que -5');

-- Nota: Ajusta los exercise_id según tu base de datos si es necesario.

-- Ejemplos de 5 tests para Ejercicio 20: Comprobar si número es mayor que un valor fijo (threshold = 10)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(20, 1, '[11]', 'True', '11 > 10'),
(20, 2, '[10]', 'False', '10 == 10 -> not greater'),
(20, 3, '[9]', 'False', '9 < 10'),
(20, 4, '[100]', 'True', '100 > 10'),
(20, 5, '[-1]', 'False', '-1 not greater than 10');

-- Ejemplos de 5 tests para Ejercicio 22: Uso de && (ej: retorna true si ambos son positivos)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(22, 1, '[1,2]', 'True', 'ambos positivos'),
(22, 2, '[1,0]', 'False', 'segundo no positivo'),
(22, 3, '[-1,2]', 'False', 'primer no positivo'),
(22, 4, '[5,5]', 'True', 'ambos positivos mayores'),
(22, 5, '[0,0]', 'False', 'ninguno positivo');

-- Ejemplos de 5 tests para Ejercicio 23: Uso de || (ej: retorna true si alguno cumple la condicion)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(23, 1, '[1,0]', 'True', 'primer cumple'),
(23, 2, '[0,0]', 'False', 'ninguno cumple'),
(23, 3, '[-1,2]', 'True', 'segundo cumple'),
(23, 4, '[0,5]', 'True', 'segundo cumple'),
(23, 5, '[-1,-2]', 'False', 'ninguno cumple');

-- Ejemplos de 5 tests para Ejercicio 25: Determinar si un número es par (True si par)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(25, 1, '[2]', 'True', '2 es par'),
(25, 2, '[3]', 'False', '3 es impar'),
(25, 3, '[0]', 'True', '0 es par'),
(25, 4, '[-4]', 'True', '-4 es par'),
(25, 5, '[7]', 'False', '7 es impar');
