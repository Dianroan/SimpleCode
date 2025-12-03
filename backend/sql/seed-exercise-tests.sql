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
-- Nota: Usando strings para numeros long muy grandes para preservar precision
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(14, 1, '["2000000000","2000000000"]', '4000000000', 'Suma de numeros grandes'),
(14, 2, '["9223372036854775800","5"]', '9223372036854775805', 'Suma cerca del limite de long'),
(14, 3, '["1000000000","1000000000"]', '2000000000', 'Suma de 1 billon + 1 billon'),
(14, 4, '["0","0"]', '0', 'Suma de ceros'),
(14, 5, '["-1000000000","1000000000"]', '0', 'Suma de negativos y positivos');

-- Ejemplos de 5 tests para CompararStrings (exercise_id = 16)
-- Nota: El output sera "True" o "False" (en C# bool se imprime asi)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(16, 1, '["hola","hola"]', 'True', 'Strings iguales'),
(16, 2, '["hola","mundo"]', 'False', 'Strings diferentes'),
(16, 3, '["",""]', 'True', 'Strings vacios iguales'),
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

-- Ejemplos de 5 tests para Ejercicio 20: Comprobar si numero es mayor que un valor fijo (threshold = 100)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(20, 1, '[101]', 'True', '101 > 100'),
(20, 2, '[100]', 'False', '100 == 100 -> not greater'),
(20, 3, '[99]', 'False', '99 < 100'),
(20, 4, '[200]', 'True', '200 > 100'),
(20, 5, '[-1]', 'False', '-1 not greater than 100');

-- Ejemplos de 5 tests para Ejercicio 22: Uso de && (ej: retorna true si ambos son positivos)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(22, 1, '[20, true]', 'True', 'edad >= 18 y tiene identificacion'),
(22, 2, '[17, true]', 'False', 'menor de edad pero tiene identificacion'),
(22, 3, '[25, false]', 'False', 'mayor de edad pero sin identificacion'),
(22, 4, '[18, true]', 'True', 'exactamente 18 y tiene identificacion'),
(22, 5, '[16, false]', 'False', 'menor de edad y sin identificacion');

-- Ejemplos de 5 tests para Ejercicio 23: Uso de || (ej: retorna true si alguno cumple la condicion)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(23, 1, '[true, false]', 'True', 'primer cumple (es admin)'),
(23, 2, '[false, false]', 'False', 'ninguno cumple'),
(23, 3, '[false, true]', 'True', 'segundo cumple (tiene VIP)'),
(23, 4, '[false, true]', 'True', 'segundo cumple (tiene VIP)'),
(23, 5, '[false, false]', 'False', 'ninguno cumple');

-- Ejemplos de 5 tests para Ejercicio 25: Determinar si un numero es par (True si par)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(25, 1, '[2]', 'True', '2 es par'),
(25, 2, '[3]', 'False', '3 es impar'),
(25, 3, '[0]', 'True', '0 es par'),
(25, 4, '[-4]', 'True', '-4 es par'),
(25, 5, '[7]', 'False', '7 es impar');

-- Ejemplos de 5 tests para Ejercicio 27: Usar switch-case
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(27, 1, '[1]', 'Hola', 'Caso 1 retorna Hola'),
(27, 2, '[2]', 'Adios', 'Caso 2 retorna Adios'),
(27, 3, '[3]', 'Opcion invalida', 'Otro numero retorna mensaje default'),
(27, 4, '[5]', 'Opcion invalida', 'Numero 5 no tiene caso especial'),
(27, 5, '[0]', 'Opcion invalida', 'Numero 0 usa default'),
(27, 6, '[10]', 'Opcion invalida', 'Numero 10 usa default');

-- Ejemplos de 1 test para Ejercicio 30: Ciclo for del 1 al 100
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(30, 1, '[]', '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22\n23\n24\n25\n26\n27\n28\n29\n30\n31\n32\n33\n34\n35\n36\n37\n38\n39\n40\n41\n42\n43\n44\n45\n46\n47\n48\n49\n50\n51\n52\n53\n54\n55\n56\n57\n58\n59\n60\n61\n62\n63\n64\n65\n66\n67\n68\n69\n70\n71\n72\n73\n74\n75\n76\n77\n78\n79\n80\n81\n82\n83\n84\n85\n86\n87\n88\n89\n90\n91\n92\n93\n94\n95\n96\n97\n98\n99\n100', 'Imprime numeros del 1 al 100, uno por linea');

-- Ejemplos de 5 tests para Ejercicio 32: While - Incrementar hasta objetivo
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(32, 1, '[5]', '0\n1\n2\n3\n4\n5', 'Incrementar desde 0 hasta 5'),
(32, 2, '[3]', '0\n1\n2\n3', 'Incrementar desde 0 hasta 3'),
(32, 3, '[0]', '0', 'Objetivo es 0, imprime solo 0'),
(32, 4, '[10]', '0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10', 'Incrementar desde 0 hasta 10'),
(32, 5, '[7]', '0\n1\n2\n3\n4\n5\n6\n7', 'Incrementar desde 0 hasta 7');

-- Ejemplos de 5 tests para Ejercicio 35: Contar espacios con foreach
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(35, 1, '["Hola mundo"]', '1', 'Una palabra con un espacio'),
(35, 2, '["Esta frase tiene 4 espacios"]', '4', 'Contar 4 espacios en texto'),
(35, 3, '["SinEspacios"]', '0', 'String sin espacios'),
(35, 4, '["  dos al inicio"]', '4', 'Dos espacios al inicio'),
(35, 5, '["Espacio final "]', '2', 'Espacio al final del texto');

-- Ejemplos de 5 tests para Ejercicio 37: Break y Continue en for (ProcesarNumeros)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(37, 1, '[]', '1\n2\n4\n5\n7\n8\n10\n11\n13\n14', 'Imprime numeros 1..20 saltando multiplos de 3 y deteniendo en 15'),
(37, 2, '[]', '1\n2\n4\n5\n7\n8\n10\n11\n13\n14', 'Caso repetido: mismo comportamiento'),
(37, 3, '[]', '1\n2\n4\n5\n7\n8\n10\n11\n13\n14', 'Verifica continue y break'),
(37, 4, '[]', '1\n2\n4\n5\n7\n8\n10\n11\n13\n14', 'Comportamiento esperado hasta el break'),
(37, 5, '[]', '1\n2\n4\n5\n7\n8\n10\n11\n13\n14', 'Otro caso identico para consistencia');

-- Ejemplos de 5 tests para Ejercicio 40: BuscarNumero (arreglo, objetivo)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(40, 1, '[[1,3,5,7],5]', 'True', 'Buscar 5 en [1,3,5,7]'),
(40, 2, '[[2,4,6],1]', 'False', 'Buscar 1 en [2,4,6]'),
(40, 3, '[[10,20,30],20]', 'True', 'Buscar 20 en [10,20,30]'),
(40, 4, '[[],5]', 'False', 'Arreglo vacio retorna False'),
(40, 5, '[[5],5]', 'True', 'Arreglo con un elemento igual al objetivo');

-- Ejemplos de 5 tests para Ejercicio 42: ValorMayorMatriz (matriz 2D)
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(42, 1, '[[[1,3,2],[7,0,5]]]', '7', 'Matriz 2x3 con max 7'),
(42, 2, '[[[-5,-2],[-9,-1]]]', '-1', 'Matriz con negativos max -1'),
(42, 3, '[[[42]]]', '42', 'Matriz 1x1 retorna 42'),
(42, 4, '[[[0,0,0],[0,0,0]]]', '0', 'Matriz con ceros retorna 0'),
(42, 5, '[[[1,2],[3,4],[5,6]]]', '6', 'Matriz 3x2 max 6');

-- Ejemplos de 5 tests para Ejercicio 44: SumarArreglo usando foreach
INSERT INTO `exercise_tests` (exercise_id, test_order, input_data, expected_output, description) VALUES
(44, 1, '[[1,2,3]]', '6', 'Suma 1+2+3'),
(44, 2, '[[10,20,30]]', '60', 'Suma 10+20+30'),
(44, 3, '[[]]', '0', 'Arreglo vacio retorna 0'),
(44, 4, '[[-1,-5,4]]', '-2', 'Suma con numeros negativos'),
(44, 5, '[[100]]', '100', 'Arreglo con un solo elemento');
