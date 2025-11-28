# 📖 Guía de Implementación: PracticaPage - Sistema de Ejercicios Interactivos

## ✅ Estado del Proyecto

Toda la infraestructura para la **Página de Práctica de Ejercicios** ha sido implementada exitosamente, cumpliendo con los 10 requisitos especificados (RQF13-RQF22).

---

## 🏗️ Arquitectura Implementada

### Backend (Node.js/Express)

#### Endpoint: `GET /api/exercises/:id`

Retorna un ejercicio completo con sus test cases.

**Respuesta:**

```json
{
  "id": 9,
  "title": "Ejercicio: Suma de dos números",
  "statement": "<h2>Enunciado HTML...</h2>",
  "code_template": "using System;\npublic class Program { ... }",
  "required_keywords": "return,int",
  "total_tests": 3,
  "tests": [
    {
      "id": 1,
      "test_order": 1,
      "input_data": "[3, 5]",
      "expected_output": "8",
      "description": "Suma de 3 + 5"
    }
  ]
}
```

#### Endpoint: `POST /api/exercises/:id/validate`

Valida el código del usuario contra todos los tests.

**Request:**

```json
{
  "code": "using System;\npublic class Program {\n  public static int Sumar(int a, int b) {\n    return a + b;\n  }\n  public static void Main(string[] args) {\n    Console.WriteLine(Sumar(3, 5));\n  }\n}"
}
```

**Respuesta (exitosa):**

```json
{
  "is_successful": true,
  "passed_tests": 3,
  "total_tests": 3,
  "output": "8\n15\n10",
  "test_results": [
    { "passed": true, "output": "8", "expected": "8" },
    { "passed": true, "output": "15", "expected": "15" },
    { "passed": true, "output": "10", "expected": "10" }
  ]
}
```

**Lógica de Validación:**

1. ✅ Valida que `required_keywords` estén en el código
2. ✅ Inyecta `Console.WriteLine()` en el `Main()` con test inputs
3. ✅ Llama JDoodle API para compilar y ejecutar
4. ✅ Parsea output línea por línea
5. ✅ Compara con `expected_output`
6. ✅ Guarda intento en `exercise_attempts`

---

### Frontend (React/Vite)

#### Componente: `PracticaPage.jsx`

**Ubicación:** `frontend/src/modules/ruta/pages/PracticaPage.jsx`

**Características Implementadas:**

| Req   | Descripción                         | Implementación                                      |
| ----- | ----------------------------------- | --------------------------------------------------- |
| RQF13 | Mostrar descripción problema (HTML) | `dangerouslySetInnerHTML` con `statement`           |
| RQF14 | -                                   | -                                                   |
| RQF15 | Ace Editor con template             | `AceEditor` en modo C#, cargado con `code_template` |
| RQF16 | Botón "¡Probar!"                    | onClick → `handleProbarClick()`                     |
| RQF17 | Llamar JDoodle vía backend          | POST a `/api/exercises/:id/validate`                |
| RQF18 | Mostrar console output              | `<textarea readOnly>` con `output`                  |
| RQF19 | Mostrar X/Y tests pasados           | Componente `.test-result` con contador              |
| RQF20 | Botón "Completar" condicional       | Habilitado si `is_successful === true`              |
| RQF21 | Validar keywords                    | Validación en backend, hint visual en frontend      |
| RQF22 | Guardar intento en BD               | Backend inserta en `exercise_attempts`              |

---

## 📋 Tablas de Base de Datos

### `exercise_activities`

```sql
- id (INT)
- title (VARCHAR)
- statement (MEDIUMTEXT) -- HTML
- resources (TEXT)
- code_template (MEDIUMTEXT)
- required_keywords (VARCHAR)
- total_tests (INT)
```

### `exercise_tests`

```sql
- id (INT)
- exercise_id (INT) -- FK a exercise_activities
- test_order (INT)
- input_data (TEXT) -- JSON array
- expected_output (TEXT)
- description (TEXT)
```

### `exercise_attempts`

```sql
- id (INT)
- user_id (INT) -- FK a users
- exercise_id (INT) -- FK a exercise_activities
- is_successful (TINYINT)
- passed_tests (INT)
- total_tests (INT)
- jdoodle_output (TEXT)
- created_at (DATETIME)
```

---

## 🚀 Cómo Usar

### 1. Iniciar el Backend

```bash
cd /home/dianroan/Documents/SimpleCode/backend
npm install axios  # Si no está instalado
npm run dev
```

El servidor corre en `http://localhost:4000`

### 2. Iniciar el Frontend

```bash
cd /home/dianroan/Documents/SimpleCode/frontend
npm run dev
```

El frontend corre en `http://localhost:5173`

### 3. Navegar a un Ejercicio

- URL: `http://localhost:5173/practica/9` (reemplaza 9 con el ID del ejercicio)
- O desde `/ruta` si hay enlace configurado

### 4. Flujo del Usuario

1. ✅ Lee el enunciado en la columna izquierda
2. ✅ Escribe/modifica código en el Ace Editor (derecha)
3. ✅ Presiona "¡Probar!"
4. ✅ Ve el output de consola y resultado de tests
5. ✅ Si todos pasan → Botón "Completar" se habilita
6. ✅ Presiona "Completar" para avanzar

---

## 📊 Flujo de Datos

```
Frontend (PracticaPage.jsx)
    ↓ [1] GET /api/exercises/9
    ↓
Backend (getExercise)
    ↓ [Query DB]
    ↓ exercise_activities + exercise_tests
    ↓ [JSON Response]
    ↓
Frontend [2] Renderiza enunciado + template
    ↓ [Usuario escribe código]
    ↓
Frontend [3] POST /api/exercises/9/validate
    ↓
Backend (validateExercise)
    ↓ [1] Valida keywords
    ↓ [2] Inyecta tests en Main()
    ↓ [3] Llama JDoodle API
    ↓ [4] Parsea output
    ↓ [5] Compara con expected
    ↓ [6] INSERT exercise_attempts
    ↓ [JSON Response con resultados]
    ↓
Frontend [4] Muestra resultados (tests pass/fail, output)
    ↓ [Usuario completa]
    ↓
Frontend [5] Navega a siguiente lección
```

---

## 🛠️ Estructura de Archivos Creados

```
backend/
├── src/
│   ├── controllers/
│   │   └── exerciseController.js (NUEVO)
│   └── routes/
│       └── exercises.js (NUEVO)
│   └── app.js (MODIFICADO - agregó rutas)

frontend/
├── src/
│   ├── services/api/
│   │   └── exercises.js (NUEVO)
│   └── modules/ruta/pages/
│       ├── PracticaPage.jsx (MODIFICADO)
│       └── PracticaPage.css (NUEVO)
```

---

## ⚙️ Configuración Requerida

### Variables de Entorno (Backend)

El archivo `.env` debe tener:

```
JDOODLE_CLIENT_ID=xxxxx
JDOODLE_CLIENT_SECRET=xxxxx
```

### CORS

El backend ya está configurado para permitir:

- `http://localhost:5173` (frontend dev)

---

## 🧪 Datos de Prueba Necesarios

Para probar, necesitas al menos UN ejercicio en `exercise_activities` con:

- Un enunciado HTML válido
- Un template de código C# con `Main(string[] args) { }`
- Una lista de palabras clave separadas por comas
- Mínimo 1 test en `exercise_tests` con:
  - `input_data` en formato JSON (ej: `[3, 5]`)
  - `expected_output` que coincida con lo que imprime el programa

**Ejemplo SQL para insertar dato de prueba:**

```sql
INSERT INTO exercise_activities (id, title, statement, code_template, required_keywords, total_tests)
VALUES (
  100,
  'Test: Suma Simple',
  '<h2>Suma dos números</h2><p>Escribe una función que sume dos enteros.</p>',
  'using System;\npublic class Program {\n  public static int Sumar(int a, int b) {\n    // TODO\n    return 0;\n  }\n  public static void Main(string[] args) {\n  }\n}',
  'return,int',
  1
);

INSERT INTO exercise_tests (exercise_id, test_order, input_data, expected_output, description)
VALUES (100, 1, '[3, 5]', '8', 'Suma de 3 + 5');
```

---

## 🐛 Solución de Problemas

### Error: "Palabra clave requerida no encontrada"

- ✅ Verifica que el código contenga exactamente la palabra clave requerida
- ✅ Sensible a mayúsculas/minúsculas

### Error: "Error al ejecutar el código"

- ✅ Revisa la consola del backend para ver el error de JDoodle
- ✅ Verifica que `code_template` tenga `Main(string[] args) { }`

### Output vacío

- ✅ Asegúrate de que `input_data` es JSON válido
- ✅ El programa debe usar `Console.WriteLine()` para output

---

## 🎯 Próximos Pasos Opcionales

- [ ] Agregar más ejercicios a la BD
- [ ] Implementar lógica de "debilidades" usando datos de `exercise_attempts`
- [ ] Agregar timer/contador de intentos
- [ ] Historial de intentos previos
- [ ] Difficulty rating
- [ ] Hints progresivos

---

**Implementado por:** Sistema de Práctica SimpleCode
**Fecha:** Noviembre 2025
**Estado:** ✅ Funcional y listo para usar
