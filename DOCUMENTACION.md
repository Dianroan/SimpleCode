# 📚 Documentación Completa del Proyecto SimpleCode

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Configuración Inicial](#configuración-inicial)
5. [Estructura del Backend](#estructura-del-backend)
6. [Estructura del Frontend](#estructura-del-frontend)
7. [Flujos de Datos](#flujos-de-datos)
8. [Guía de Uso](#guía-de-uso)
9. [API Endpoints](#api-endpoints)
10. [Base de Datos](#base-de-datos)

---

## Descripción General

**SimpleCode** es una plataforma educativa para el aprendizaje de programación que incluye:

- Sistema de autenticación de usuarios
- Rutas de aprendizaje con teoría y práctica
- Ejercicios de programación con evaluación automática
- Seguimiento de rachas (streaks) de estudio
- Análisis de debilidades del estudiante
- Integración con JDoodle para ejecutar código

### Propósito

Facilitar el aprendizaje de programación mediante ejercicios prácticos, evaluación automática y seguimiento del progreso del estudiante.

---

## Arquitectura del Proyecto

El proyecto sigue una arquitectura **cliente-servidor** con separación clara entre frontend y backend:

```
┌─────────────────┐         HTTP/REST API        ┌─────────────────┐
│                 │ ←──────────────────────────→ │                 │
│   FRONTEND      │                               │    BACKEND      │
│   (React +      │    JSON Web Tokens (JWT)      │   (Express.js)  │
│    Vite)        │                               │                 │
└─────────────────┘                               └────────┬────────┘
                                                           │
                                                           │ SQL
                                                           ↓
                                                  ┌─────────────────┐
                                                  │     MySQL       │
                                                  │   (Base de      │
                                                  │     Datos)      │
                                                  └─────────────────┘
```

### Patrón de Diseño

- **Backend**: Arquitectura MVC (Model-View-Controller) adaptada para API REST
- **Frontend**: Arquitectura basada en componentes con Atomic Design

---

## Tecnologías Utilizadas

### Backend

| Tecnología | Versión | Propósito                             |
| ---------- | ------- | ------------------------------------- |
| Node.js    | -       | Entorno de ejecución JavaScript       |
| Express.js | 5.1.0   | Framework web para crear API REST     |
| MySQL      | -       | Base de datos relacional              |
| mysql2     | 3.15.3  | Cliente MySQL para Node.js            |
| JWT        | 9.0.2   | Autenticación basada en tokens        |
| bcrypt     | 6.0.0   | Encriptación de contraseñas           |
| Zod        | 4.1.12  | Validación de esquemas                |
| Axios      | 1.13.2  | Cliente HTTP para peticiones externas |
| dotenv     | 17.2.3  | Gestión de variables de entorno       |
| CORS       | 2.8.5   | Control de acceso entre dominios      |

### Frontend

| Tecnología   | Versión | Propósito                             |
| ------------ | ------- | ------------------------------------- |
| React        | 19.1.1  | Biblioteca para interfaces de usuario |
| React Router | 7.9.4   | Enrutamiento en aplicación SPA        |
| Vite         | 7.1.7   | Build tool y dev server               |
| Bootstrap    | 5.3.8   | Framework CSS para diseño             |
| Axios        | 1.13.2  | Cliente HTTP para API                 |
| Chart.js     | 4.5.1   | Gráficas para visualización de datos  |
| React Ace    | 14.0.1  | Editor de código integrado            |
| ace-builds   | 1.43.4  | Motor del editor de código            |

---

## Configuración Inicial

### Prerrequisitos

- Node.js (v16 o superior)
- MySQL Server (v8.0 o superior)
- XAMPP/LAMPP (opcional, para gestión de MySQL)
- npm o yarn

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/Dianroan/SimpleCode.git
cd SimpleCode
```

### Paso 2: Configurar Base de Datos

1. Iniciar MySQL Server:

```bash
sudo /opt/lampp/lampp start
```

2. Crear la base de datos:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE simplecode_db;
USE simplecode_db;
SOURCE frontend/public/simplecode_db.sql;
```

### Paso 3: Configurar Backend

1. Navegar a la carpeta backend:

```bash
cd backend
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear archivo `.env`:

```bash
touch .env
```

4. Configurar variables de entorno en `.env`:

```env
# Puerto del servidor
PORT=4000

# Entorno
NODE_ENV=development

# JWT Secret (cambiar en producción)
JWT_SECRET=tu-secreto-super-seguro-aqui

# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=tu-contraseña
DB_NAME=simplecode_db

# JDoodle API (si aplica)
JDOODLE_CLIENT_ID=tu-client-id
JDOODLE_CLIENT_SECRET=tu-client-secret
```

5. Iniciar servidor de desarrollo:

```bash
npm run dev
```

### Paso 4: Configurar Frontend

1. Abrir nueva terminal y navegar a frontend:

```bash
cd frontend
```

2. Instalar dependencias:

```bash
npm install
```

3. Iniciar servidor de desarrollo:

```bash
npm run dev
```

4. Abrir navegador en: `http://localhost:5173`

---

## Estructura del Backend

### Árbol de Directorios

```
backend/
├── src/
│   ├── app.js              # Configuración de Express
│   ├── server.js           # Punto de entrada
│   ├── config/
│   │   └── env.js          # Variables de entorno
│   ├── controllers/        # Lógica de negocio
│   │   ├── authController.js
│   │   ├── exerciseController.js
│   │   ├── streakController.js
│   │   └── weaknessController.js
│   ├── db/
│   │   └── pool.js         # Pool de conexiones MySQL
│   ├── middleware/         # Funciones intermedias
│   │   ├── auth.js         # Verificación JWT
│   │   └── validate.js     # Validación de datos
│   ├── routes/             # Definición de endpoints
│   │   ├── auth.js
│   │   ├── exercises.js
│   │   ├── health.js
│   │   ├── jdoodle.routes.js
│   │   ├── learningPath.js
│   │   ├── streaks.js
│   │   └── weaknesses.js
│   └── utils/
│       └── hash.js         # Utilidades de encriptación
└── sql/                    # Scripts SQL
    ├── create-exercise-failure-count.sql
    ├── fix-user-streaks.sql
    ├── seed-exercise-tests.sql
    └── seed-weaknesses.sql
```

### Componentes Principales

#### 1. `server.js` - Punto de Entrada

```javascript
// Inicia el servidor HTTP
// Importa y ejecuta la aplicación Express
// Escucha en el puerto configurado
```

#### 2. `app.js` - Configuración de Express

**Propósito**: Configura la aplicación Express con middlewares y rutas.

**Middlewares configurados**:

- **CORS**: Permite peticiones desde `http://localhost:5173`
- **express.json()**: Parsea cuerpos JSON en las peticiones

**Rutas registradas**:

- `/api/auth` - Autenticación (login, registro)
- `/api/health` - Health check
- `/api/learning-path` - Rutas de aprendizaje
- `/api/jdoodle` - Ejecución de código
- `/api/exercises` - Gestión de ejercicios
- `/api/weaknesses` - Análisis de debilidades
- `/api/streaks` - Seguimiento de rachas

#### 3. `config/env.js` - Variables de Entorno

**Propósito**: Centraliza la configuración de variables de entorno.

**Variables exportadas**:

```javascript
{
  port: 4000,                    // Puerto del servidor
  nodeEnv: "development",        // Entorno de ejecución
  jwtSecret: "...",              // Secreto para JWT
  db: {
    host: "localhost",           // Host de MySQL
    port: 3306,                  // Puerto de MySQL
    user: "root",                // Usuario de BD
    password: "",                // Contraseña de BD
    database: "simplecode_db"    // Nombre de BD
  }
}
```

#### 4. `db/pool.js` - Conexión a Base de Datos

**Propósito**: Crea un pool de conexiones a MySQL.

**Características**:

- Usa `mysql2/promise` para operaciones asíncronas
- Pool de conexiones para mejor rendimiento
- Configuración centralizada desde `env.js`

#### 5. Controllers - Lógica de Negocio

**authController.js**:

- `register`: Registra nuevos usuarios
- `login`: Autentica usuarios y genera JWT
- Encripta contraseñas con bcrypt
- Valida datos de entrada

**exerciseController.js**:

- `getExercises`: Obtiene lista de ejercicios
- `getExerciseById`: Obtiene ejercicio específico
- `submitExercise`: Evalúa solución del estudiante
- Registra resultados en base de datos

**streakController.js**:

- `getStreak`: Obtiene racha actual del usuario
- `updateStreak`: Actualiza racha diaria
- Calcula días consecutivos de estudio

**weaknessController.js**:

- `getWeaknesses`: Analiza debilidades del usuario
- `getWeaknessStats`: Estadísticas de errores
- Identifica temas problemáticos

#### 6. Middleware

**auth.js** - Autenticación JWT:

```javascript
// Verifica token JWT en headers
// Decodifica payload del token
// Añade userId a req.user
// Protege rutas privadas
```

**validate.js** - Validación de Datos:

```javascript
// Usa esquemas Zod
// Valida cuerpo de peticiones
// Retorna errores 400 si falla
```

#### 7. Routes - Endpoints API

Cada archivo de rutas define los endpoints de un módulo específico:

- Usa `express.Router()`
- Aplica middlewares de autenticación
- Conecta con controllers correspondientes

---

## Estructura del Frontend

### Árbol de Directorios

```
frontend/
├── src/
│   ├── main.jsx                 # Punto de entrada React
│   ├── app/
│   │   ├── App.jsx              # Componente raíz
│   │   ├── routes.jsx           # Configuración de rutas
│   │   ├── SimpleNavbar.jsx     # Barra de navegación
│   │   ├── ProtectedRoute.jsx   # HOC para rutas privadas
│   │   └── PublicRoute.jsx      # HOC para rutas públicas
│   ├── context/                 # Context API
│   │   ├── AuthContext.jsx
│   │   └── AuthProvider.jsx
│   ├── design-system/           # Componentes reutilizables
│   │   ├── atoms/               # Componentes básicos
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── FormError.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Label.jsx
│   │   ├── molecules/           # Componentes compuestos
│   │   │   └── TextField.jsx
│   │   └── pages/
│   │       └── LandingPage.jsx
│   ├── modules/                 # Módulos por funcionalidad
│   │   ├── auth/                # Autenticación
│   │   │   ├── hooks/
│   │   │   ├── organisms/
│   │   │   └── pages/
│   │   ├── core/                # Dashboard y perfil
│   │   │   ├── components/
│   │   │   ├── layouts/
│   │   │   └── pages/
│   │   └── ruta/                # Rutas de aprendizaje
│   │       ├── components/
│   │       ├── data/
│   │       └── pages/
│   ├── services/                # Servicios API
│   │   └── api/
│   │       ├── auth.js
│   │       ├── exercises.js
│   │       ├── http.js
│   │       ├── jdoodle.js
│   │       ├── learningPath.js
│   │       ├── streaks.js
│   │       └── weaknesses.js
│   ├── styles/                  # Estilos globales
│   │   ├── global.css
│   │   └── overrides.css
│   └── utils/
│       └── validate.js
└── public/
    └── simplecode_db.sql        # Schema de BD
```

### Arquitectura de Componentes (Atomic Design)

#### Atoms (Átomos) - Componentes Básicos

Los elementos más pequeños e indivisibles:

**Button.jsx**:

```jsx
// Botón reutilizable con variantes
// Props: variant, size, onClick, children
// Estilos: primary, secondary, danger
```

**Input.jsx**:

```jsx
// Campo de entrada básico
// Props: type, value, onChange, placeholder
```

**Label.jsx**:

```jsx
// Etiqueta para formularios
// Props: htmlFor, children
```

**Card.jsx**:

```jsx
// Contenedor de tarjeta
// Props: className, children
```

**FormError.jsx**:

```jsx
// Mensaje de error de formulario
// Props: message
```

#### Molecules (Moléculas) - Componentes Compuestos

Combinación de átomos:

**TextField.jsx**:

```jsx
// Campo de texto completo
// Combina: Label + Input + FormError
// Props: label, error, ...inputProps
```

#### Organisms (Organismos) - Secciones Complejas

**LoginForm.jsx**:

```jsx
// Formulario de inicio de sesión
// Usa: TextField, Button
// Maneja: validación, submit, errores
```

**RegisterForm.jsx**:

```jsx
// Formulario de registro
// Validación de email, contraseña
// Crea nueva cuenta de usuario
```

#### Pages (Páginas) - Vistas Completas

**LandingPage.jsx**: Página de inicio
**LoginPage.jsx**: Página de login
**RegisterPage.jsx**: Página de registro
**DashboardPage.jsx**: Panel principal
**DebilidadesPage.jsx**: Análisis de debilidades
**PerfilPage.jsx**: Perfil de usuario
**RutaPage.jsx**: Vista de ruta de aprendizaje
**LearningPathPage.jsx**: Lista de rutas
**TeoriaPage.jsx**: Contenido teórico
**PracticaPage.jsx**: Ejercicios prácticos

### Sistema de Rutas

**routes.jsx** define todas las rutas de la aplicación:

```javascript
// Rutas públicas (sin autenticación)
/                    → LandingPage
/login              → LoginPage
/register           → RegisterPage

// Rutas protegidas (requieren autenticación)
/dashboard          → DashboardPage
/debilidades        → DebilidadesPage
/perfil             → PerfilPage
/ruta               → RutaPage
/ruta/:stepId       → LearningPathPage
/ruta/:stepId/teoria → TeoriaPage
/ruta/:stepId/practica → PracticaPage
```

### Context API - Gestión de Estado Global

**AuthContext.jsx**:

```javascript
// Provee estado de autenticación
// Funciones: login, logout, checkAuth
// Estado: user, isAuthenticated, loading
```

**Flujo de autenticación**:

1. Usuario hace login
2. Backend devuelve JWT
3. Frontend guarda token en localStorage
4. AuthContext mantiene estado del usuario
5. ProtectedRoute verifica autenticación

### Servicios API

**http.js** - Cliente HTTP Base:

```javascript
// Axios configurado con:
// - baseURL: http://localhost:4000/api
// - Interceptor para añadir JWT automáticamente
// - Manejo de errores centralizado
```

**auth.js**:

```javascript
login(email, password); // POST /auth/login
register(userData); // POST /auth/register
getCurrentUser(); // GET /auth/me
```

**exercises.js**:

```javascript
getExercises(); // GET /exercises
getExerciseById(id); // GET /exercises/:id
submitExercise(data); // POST /exercises/submit
```

**streaks.js**:

```javascript
getStreak(userId); // GET /streaks/:userId
updateStreak(userId); // POST /streaks/:userId
```

**weaknesses.js**:

```javascript
getWeaknesses(userId); // GET /weaknesses/:userId
getStats(userId); // GET /weaknesses/:userId/stats
```

**learningPath.js**:

```javascript
getSteps(); // GET /learning-path
getStepById(id); // GET /learning-path/:id
```

**jdoodle.js**:

```javascript
executeCode(code, lang); // POST /jdoodle/execute
// Ejecuta código en servidor remoto
```

---

## Flujos de Datos

### 1. Flujo de Autenticación

```
┌─────────────┐
│   Usuario   │
│ ingresa     │
│ credenciales│
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────┐
│ Frontend: LoginForm.jsx                 │
│ - Valida formato de datos               │
│ - Llama a authService.login()           │
└──────┬──────────────────────────────────┘
       │ POST /api/auth/login
       │ { email, password }
       ↓
┌─────────────────────────────────────────┐
│ Backend: authController.login()         │
│ 1. Busca usuario en BD                  │
│ 2. Verifica contraseña con bcrypt       │
│ 3. Genera JWT con userId                │
│ 4. Retorna { token, user }              │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│ Frontend: AuthContext                   │
│ 1. Guarda token en localStorage         │
│ 2. Actualiza estado global              │
│ 3. Redirige a /dashboard                │
└─────────────────────────────────────────┘
```

### 2. Flujo de Ejercicio Práctico

```
┌─────────────┐
│   Usuario   │
│  escribe    │
│   código    │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────┐
│ Frontend: PracticaPage.jsx              │
│ - Editor React Ace muestra código       │
│ - Botón "Ejecutar" activa submit        │
└──────┬──────────────────────────────────┘
       │ POST /api/exercises/submit
       │ { exerciseId, code, userId }
       ↓
┌─────────────────────────────────────────┐
│ Backend: exerciseController.submit()    │
│ 1. Obtiene casos de prueba de BD        │
│ 2. Ejecuta código vs cada test          │
│ 3. Compara output esperado vs real      │
│ 4. Calcula score (% tests pasados)      │
│ 5. Guarda resultado en BD               │
│ 6. Actualiza estadísticas usuario       │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│ Frontend: Muestra Resultados            │
│ - Tests pasados/fallados                │
│ - Mensaje de éxito/error                │
│ - Actualiza progreso en UI              │
└─────────────────────────────────────────┘
```

### 3. Flujo de Análisis de Debilidades

```
┌─────────────┐
│   Usuario   │
│   accede    │
│ /debilidades│
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────┐
│ Frontend: DebilidadesPage.jsx           │
│ - Llama weaknessService.getWeaknesses() │
└──────┬──────────────────────────────────┘
       │ GET /api/weaknesses/:userId
       │
       ↓
┌─────────────────────────────────────────┐
│ Backend: weaknessController.get()       │
│ 1. Query a BD: ejercicios fallados      │
│ 2. Agrupa por tema/categoría            │
│ 3. Calcula porcentaje de error          │
│ 4. Ordena por frecuencia                │
│ 5. Retorna estadísticas                 │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│ Frontend: WeaknessCharts.jsx            │
│ - Renderiza gráficas con Chart.js       │
│ - Muestra barras por tema                │
│ - Indica áreas de mejora                │
└─────────────────────────────────────────┘
```

---

## API Endpoints

### Autenticación (`/api/auth`)

#### POST `/api/auth/register`

Registra un nuevo usuario.

**Request Body**:

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response** (201):

```json
{
  "message": "Usuario registrado exitosamente",
  "userId": 123
}
```

#### POST `/api/auth/login`

Inicia sesión.

**Request Body**:

```json
{
  "email": "string",
  "password": "string"
}
```

**Response** (200):

```json
{
  "token": "jwt-token-aqui",
  "user": {
    "id": 123,
    "username": "string",
    "email": "string"
  }
}
```

### Ejercicios (`/api/exercises`)

#### GET `/api/exercises`

Obtiene lista de ejercicios.

**Headers**: `Authorization: Bearer <token>`

**Response** (200):

```json
[
  {
    "id": 1,
    "title": "Suma de dos números",
    "description": "Crea una función que sume dos números",
    "difficulty": "easy",
    "topic": "fundamentos"
  }
]
```

#### GET `/api/exercises/:id`

Obtiene ejercicio específico con detalles.

**Headers**: `Authorization: Bearer <token>`

**Response** (200):

```json
{
  "id": 1,
  "title": "Suma de dos números",
  "description": "...",
  "starterCode": "function suma(a, b) {\n  // Tu código aquí\n}",
  "testCases": [...]
}
```

#### POST `/api/exercises/submit`

Envía solución de ejercicio.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "exerciseId": 1,
  "code": "function suma(a, b) { return a + b; }"
}
```

**Response** (200):

```json
{
  "success": true,
  "score": 100,
  "testResults": [
    { "passed": true, "input": "[1, 2]", "expected": "3", "actual": "3" }
  ]
}
```

### Rachas (`/api/streaks`)

#### GET `/api/streaks/:userId`

Obtiene racha actual del usuario.

**Headers**: `Authorization: Bearer <token>`

**Response** (200):

```json
{
  "currentStreak": 5,
  "longestStreak": 12,
  "lastActivity": "2025-12-09"
}
```

#### POST `/api/streaks/:userId`

Actualiza racha (se llama automáticamente al completar ejercicio).

**Headers**: `Authorization: Bearer <token>`

**Response** (200):

```json
{
  "currentStreak": 6,
  "message": "Racha actualizada"
}
```

### Debilidades (`/api/weaknesses`)

#### GET `/api/weaknesses/:userId`

Obtiene análisis de debilidades.

**Headers**: `Authorization: Bearer <token>`

**Response** (200):

```json
[
  {
    "topic": "Bucles",
    "failureCount": 8,
    "totalAttempts": 15,
    "failureRate": 53.3
  },
  {
    "topic": "Recursión",
    "failureCount": 5,
    "totalAttempts": 7,
    "failureRate": 71.4
  }
]
```

### Ruta de Aprendizaje (`/api/learning-path`)

#### GET `/api/learning-path`

Obtiene todos los pasos de la ruta.

**Headers**: `Authorization: Bearer <token>`

**Response** (200):

```json
[
  {
    "id": 1,
    "title": "Fundamentos de JavaScript",
    "description": "...",
    "order": 1,
    "completed": true
  }
]
```

#### GET `/api/learning-path/:id`

Obtiene paso específico con contenido.

**Headers**: `Authorization: Bearer <token>`

**Response** (200):

```json
{
  "id": 1,
  "title": "Fundamentos de JavaScript",
  "theory": "...",
  "exercises": [...]
}
```

### JDoodle (`/api/jdoodle`)

#### POST `/api/jdoodle/execute`

Ejecuta código en servidor remoto.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "script": "console.log('Hola mundo');",
  "language": "javascript",
  "versionIndex": "0"
}
```

**Response** (200):

```json
{
  "output": "Hola mundo\n",
  "statusCode": 200,
  "memory": "123456",
  "cpuTime": "0.05"
}
```

---

## Base de Datos

### Esquema de Tablas

#### Tabla: `users`

Almacena información de usuarios registrados.

| Campo      | Tipo         | Descripción                    |
| ---------- | ------------ | ------------------------------ |
| id         | INT (PK)     | ID único del usuario           |
| username   | VARCHAR(50)  | Nombre de usuario              |
| email      | VARCHAR(100) | Email (único)                  |
| password   | VARCHAR(255) | Contraseña encriptada (bcrypt) |
| created_at | TIMESTAMP    | Fecha de registro              |
| updated_at | TIMESTAMP    | Última actualización           |

#### Tabla: `exercises`

Almacena ejercicios de programación.

| Campo        | Tipo         | Descripción                 |
| ------------ | ------------ | --------------------------- |
| id           | INT (PK)     | ID del ejercicio            |
| title        | VARCHAR(200) | Título del ejercicio        |
| description  | TEXT         | Descripción detallada       |
| difficulty   | ENUM         | easy, medium, hard          |
| topic        | VARCHAR(100) | Tema (bucles, arrays, etc.) |
| starter_code | TEXT         | Código inicial              |
| solution     | TEXT         | Solución ejemplo            |
| created_at   | TIMESTAMP    | Fecha de creación           |

#### Tabla: `exercise_tests`

Casos de prueba para ejercicios.

| Campo           | Tipo     | Descripción              |
| --------------- | -------- | ------------------------ |
| id              | INT (PK) | ID del test              |
| exercise_id     | INT (FK) | Referencia a exercise    |
| input           | TEXT     | Entrada de prueba (JSON) |
| expected_output | TEXT     | Salida esperada          |
| is_hidden       | BOOLEAN  | Si es test oculto        |

#### Tabla: `user_exercises`

Registro de intentos de ejercicios.

| Campo        | Tipo         | Descripción            |
| ------------ | ------------ | ---------------------- |
| id           | INT (PK)     | ID del registro        |
| user_id      | INT (FK)     | Referencia a user      |
| exercise_id  | INT (FK)     | Referencia a exercise  |
| code         | TEXT         | Código enviado         |
| score        | DECIMAL(5,2) | Puntuación (0-100)     |
| passed       | BOOLEAN      | Si aprobó el ejercicio |
| attempted_at | TIMESTAMP    | Fecha del intento      |

#### Tabla: `user_streaks`

Seguimiento de rachas de estudio.

| Campo              | Tipo      | Descripción          |
| ------------------ | --------- | -------------------- |
| id                 | INT (PK)  | ID del registro      |
| user_id            | INT (FK)  | Referencia a user    |
| current_streak     | INT       | Racha actual (días)  |
| longest_streak     | INT       | Racha más larga      |
| last_activity_date | DATE      | Última actividad     |
| updated_at         | TIMESTAMP | Última actualización |

#### Tabla: `weaknesses`

Análisis de debilidades por tema.

| Campo          | Tipo         | Descripción       |
| -------------- | ------------ | ----------------- |
| id             | INT (PK)     | ID del registro   |
| user_id        | INT (FK)     | Referencia a user |
| topic          | VARCHAR(100) | Tema problemático |
| failure_count  | INT          | Número de fallos  |
| total_attempts | INT          | Total de intentos |
| last_failed_at | TIMESTAMP    | Último fallo      |

#### Tabla: `learning_path`

Pasos de la ruta de aprendizaje.

| Campo          | Tipo         | Descripción       |
| -------------- | ------------ | ----------------- |
| id             | INT (PK)     | ID del paso       |
| title          | VARCHAR(200) | Título del paso   |
| description    | TEXT         | Descripción       |
| theory_content | TEXT         | Contenido teórico |
| order          | INT          | Orden en la ruta  |
| created_at     | TIMESTAMP    | Fecha de creación |

#### Tabla: `user_progress`

Progreso del usuario en la ruta.

| Campo        | Tipo      | Descripción                |
| ------------ | --------- | -------------------------- |
| id           | INT (PK)  | ID del registro            |
| user_id      | INT (FK)  | Referencia a user          |
| step_id      | INT (FK)  | Referencia a learning_path |
| completed    | BOOLEAN   | Si completó el paso        |
| completed_at | TIMESTAMP | Fecha de completado        |

### Relaciones

```
users ──┬─── user_exercises ─── exercises
        ├─── user_streaks
        ├─── weaknesses
        └─── user_progress ─── learning_path

exercises ─── exercise_tests
```

---

## Guía de Uso

### Para Estudiantes

#### 1. Crear Cuenta

1. Acceder a `http://localhost:5173`
2. Click en "Registrarse"
3. Llenar formulario con username, email y password
4. Click en "Crear cuenta"

#### 2. Iniciar Sesión

1. Click en "Iniciar Sesión"
2. Ingresar email y contraseña
3. Click en "Entrar"

#### 3. Navegar el Dashboard

El dashboard muestra:

- Racha actual de días consecutivos
- Progreso general
- Acceso rápido a rutas de aprendizaje
- Gráfica de debilidades

#### 4. Seguir Ruta de Aprendizaje

1. Click en "Ruta de Aprendizaje"
2. Seleccionar un paso (ej: "Fundamentos de JS")
3. Leer contenido teórico
4. Realizar ejercicios prácticos

#### 5. Resolver Ejercicio

1. Leer descripción del ejercicio
2. Escribir código en el editor
3. Click en "Ejecutar" para probar
4. Ver resultados de tests
5. Ajustar código si es necesario
6. Click en "Enviar" cuando esté correcto

#### 6. Ver Debilidades

1. Click en "Debilidades" en el menú
2. Ver gráficas de temas con más errores
3. Identificar áreas de mejora
4. Practicar ejercicios del tema débil

### Para Desarrolladores

#### Agregar Nuevo Ejercicio

1. **Insertar en base de datos**:

```sql
INSERT INTO exercises (title, description, difficulty, topic, starter_code)
VALUES (
  'Palíndromo',
  'Verifica si una palabra es palíndromo',
  'medium',
  'strings',
  'function esPalindromo(palabra) {\n  // Tu código\n}'
);
```

2. **Agregar casos de prueba**:

```sql
INSERT INTO exercise_tests (exercise_id, input, expected_output)
VALUES
  (LAST_INSERT_ID(), '["ana"]', 'true'),
  (LAST_INSERT_ID(), '["hola"]', 'false');
```

#### Agregar Nueva Ruta

1. **Backend**: Crear endpoint en `routes/learningPath.js`
2. **Frontend**: Crear componente de página
3. **Configurar ruta** en `routes.jsx`

#### Modificar Estilos

1. Estilos globales: `frontend/src/styles/global.css`
2. Estilos de componente: CSS modules o inline styles
3. Overrides de Bootstrap: `frontend/src/styles/overrides.css`

---

## Solución de Problemas Comunes

### Backend no inicia

**Error**: `Cannot connect to database`
**Solución**:

1. Verificar que MySQL esté corriendo: `sudo /opt/lampp/lampp status`
2. Revisar credenciales en `.env`
3. Verificar que la base de datos existe

### Frontend no puede conectar con Backend

**Error**: `Network Error` en consola
**Solución**:

1. Verificar que backend esté corriendo en puerto 4000
2. Revisar CORS en `backend/src/app.js`
3. Verificar baseURL en `frontend/src/services/api/http.js`

### JWT Inválido

**Error**: `Token expired` o `Invalid token`
**Solución**:

1. Cerrar sesión y volver a iniciar
2. Limpiar localStorage del navegador
3. Verificar JWT_SECRET en backend

### Ejercicio no se evalúa

**Solución**:

1. Verificar que existan casos de prueba en BD
2. Revisar logs del servidor
3. Verificar formato de código enviado

---

## Seguridad

### Medidas Implementadas

1. **Contraseñas Encriptadas**: Bcrypt con salt rounds
2. **JWT**: Tokens con expiración
3. **Validación de Entrada**: Zod schemas
4. **SQL Injection Prevention**: Prepared statements
5. **CORS**: Configurado para origen específico
6. **Headers de Seguridad**: Por implementar (helmet.js)

### Buenas Prácticas

- Nunca commitear `.env` al repositorio
- Cambiar `JWT_SECRET` en producción
- Usar HTTPS en producción
- Implementar rate limiting
- Sanitizar inputs del usuario

---

## Próximos Pasos / Mejoras Futuras

1. **Tests Automatizados**: Jest + React Testing Library
2. **CI/CD**: GitHub Actions para deploy automático
3. **Docker**: Contenedores para fácil deployment
4. **WebSockets**: Ejecución de código en tiempo real
5. **Gamificación**: Badges, puntos, leaderboard
6. **Social Features**: Compartir soluciones, comentarios
7. **Admin Panel**: Gestión de ejercicios desde UI
8. **Analytics**: Métricas de uso y rendimiento
9. **Mobile App**: React Native
10. **Multi-idioma**: i18n para internacionalización

---

## Contribuir

### Proceso de Contribución

1. Fork del repositorio
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Hacer commits: `git commit -m 'Agrega nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abrir Pull Request

### Estándares de Código

- **JavaScript**: ES6+ features
- **React**: Functional components + Hooks
- **Naming**: camelCase para variables, PascalCase para componentes
- **Comments**: JSDoc para funciones complejas
- **Commits**: Mensajes descriptivos en español

---

## Licencia

Ver archivo `LICENSE` en la raíz del proyecto.

---

## Contacto y Soporte

- **Repositorio**: https://github.com/Dianroan/SimpleCode
- **Issues**: Reportar bugs en GitHub Issues
- **Documentación adicional**: Ver `PRACTICA_PAGE_GUIDE.md`

---

## Glosario

- **JWT**: JSON Web Token - Sistema de autenticación basado en tokens
- **bcrypt**: Algoritmo de hash para contraseñas
- **CORS**: Cross-Origin Resource Sharing - Permite peticiones entre dominios
- **SPA**: Single Page Application - Aplicación de una sola página
- **REST API**: Architectural style para APIs web
- **Pool**: Conjunto de conexiones reutilizables a BD
- **Middleware**: Función intermedia en el flujo de peticiones
- **Hook**: Función React para usar estado y efectos
- **Context**: Sistema de React para estado global
- **Atomic Design**: Metodología de diseño de componentes

---

**Última actualización**: Diciembre 9, 2025  
**Versión**: 1.0.0
