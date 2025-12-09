# 🎓 SimpleCode - Plataforma de Aprendizaje de C#

SimpleCode es una plataforma educativa interactiva diseñada para enseñar programación en C# desde cero. Los usuarios aprenden a través de una ruta de aprendizaje estructurada con teoría, ejercicios prácticos, y un sistema de seguimiento de progreso.

---

## ✨ Características Principales

### 🎯 Ruta de Aprendizaje Estructurada

- Secuencia ordenada de actividades de teoría y práctica
- Progreso lineal: desbloquea el siguiente paso al completar el actual
- Visualización clara del avance con indicadores de estado

### 💻 Ejercicios Interactivos

- Editor de código integrado (Ace Editor)
- Validación automática con tests unitarios
- Ejecución de código C# en tiempo real usando JDoodle API
- Feedback inmediato con resultados detallados

### 📊 Sistema de Análisis

- **Debilidades**: Detecta automáticamente conceptos con más errores
- **Gráficas visuales**: Radar y barras para análisis de puntos débiles
- **Ejercicios fallados**: Lista con opción de reintentar

### 🔥 Rachas de Aprendizaje

- Sistema de streaks para motivar práctica diaria
- Indicador visual de racha activa/inactiva
- Actualización automática al completar actividades

### 🔐 Autenticación Segura

- Login y registro con validación de datos
- Tokens JWT para sesiones seguras
- Rutas protegidas en frontend y backend

---

## 🛠️ Stack Tecnológico

### Backend

- **Node.js** v18+
- **Express.js** - Framework web
- **MySQL** - Base de datos (XAMPP/LAMPP)
- **JWT** - Autenticación
- **Zod** - Validación de esquemas
- **bcryptjs** - Hash de contraseñas
- **Axios** - Cliente HTTP para JDoodle

### Frontend

- **React** 19.1.1
- **Vite** 7.1.7 - Build tool
- **React Router** 7.9.4 - Navegación
- **Bootstrap** 5.3.8 - Estilos base
- **Ace Editor** - Editor de código
- **Chart.js** - Gráficas

---

## 📁 Estructura del Proyecto

```
SimpleCode/
├── backend/                    # Servidor Node.js
│   ├── src/
│   │   ├── config/            # Configuración (env.js)
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── db/                # Conexión a MySQL
│   │   ├── middleware/        # Auth y validación
│   │   ├── routes/            # Definición de rutas
│   │   └── utils/             # Utilidades (hash)
│   ├── sql/                   # Scripts SQL
│   └── package.json
│
├── frontend/                  # Aplicación React
│   ├── src/
│   │   ├── app/              # Core (App, rutas, navbar)
│   │   ├── context/          # Contextos React (Auth)
│   │   ├── design-system/    # Componentes reutilizables
│   │   │   ├── atoms/        # Button, Input, Card...
│   │   │   ├── molecules/    # TextField
│   │   │   └── pages/        # LandingPage
│   │   ├── modules/          # Módulos funcionales
│   │   │   ├── auth/         # Login, Register
│   │   │   ├── core/         # Dashboard, Perfil, Debilidades
│   │   │   └── ruta/         # Ruta de aprendizaje
│   │   ├── services/         # API clients
│   │   ├── styles/           # CSS global
│   │   └── utils/            # Validaciones
│   ├── public/
│   └── package.json
│
├── GUIA_LECTURA_CODIGO.md    # Guía de lectura del código
├── PRACTICA_PAGE_GUIDE.md    # Guía técnica de ejercicios
└── README.md                 # Este archivo
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** v18 o superior
- **MySQL** (XAMPP/LAMPP)
- **JDoodle API Key** (para ejecutar código C#)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Dianroan/SimpleCode.git
cd SimpleCode
```

### 2. Configurar Base de Datos

Inicia MySQL:

```bash
sudo /opt/lampp/lampp start
```

Importa el esquema:

```bash
mysql -u root -p < frontend/public/simplecode_db.sql
```

O usa scripts individuales en `backend/sql/`:

- `create-exercise-failure-count.sql`
- `fix-user-streaks.sql`
- `seed-exercise-tests.sql`
- `seed-weaknesses.sql`

### 3. Configurar Backend

```bash
cd backend
npm install
```

Crea `.env` en `backend/`:

```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=simplecode_db
DB_PORT=3306

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui_cambialo

# JDoodle API
JDOODLE_CLIENT_ID=tu_client_id_aqui
JDOODLE_CLIENT_SECRET=tu_client_secret_aqui

# Servidor
PORT=4000
```

Inicia el servidor:

```bash
npm run dev
```

El backend corre en `http://localhost:4000`

### 4. Configurar Frontend

```bash
cd frontend
npm install
```

Inicia la aplicación:

```bash
npm run dev
```

El frontend corre en `http://localhost:5173`

---

## 📖 Uso de la Plataforma

### Para Estudiantes

1. **Registro**: Crea una cuenta con username, email y contraseña
2. **Login**: Inicia sesión con tus credenciales
3. **Dashboard**: Accede al menú lateral con:
   - **RUTA**: Sigue la secuencia de aprendizaje
   - **DEBILIDADES**: Analiza tus puntos débiles
   - **PERFIL**: Ve tu progreso y racha
4. **Teoría**: Lee el contenido, ejecuta ejemplos interactivos
5. **Práctica**: Resuelve ejercicios, prueba tu código, completa tests
6. **Progreso**: Completa actividades para desbloquear las siguientes

### Para Administradores

Los usuarios con rol `admin` pueden:

- Acceder a todos los pasos sin restricciones
- Agregar nuevos ejercicios vía SQL
- Modificar contenido de teoría

---

## 🔌 API Endpoints

### Autenticación

- `POST /api/auth/register` - Crear cuenta
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Ruta de Aprendizaje

- `GET /api/learning-path` - Obtener toda la ruta
- `GET /api/learning-path/progress` - Obtener progreso
- `GET /api/learning-path/theory/:id` - Contenido de teoría
- `POST /api/learning-path/complete/:id` - Completar actividad

### Ejercicios

- `GET /api/exercises/:id` - Obtener ejercicio con tests
- `POST /api/exercises/:id/validate` - Validar código

### Debilidades

- `GET /api/weaknesses/top` - Top 6 debilidades
- `GET /api/weaknesses/category` - Debilidades por categoría
- `GET /api/weaknesses/failed-exercises` - Ejercicios fallados

### Rachas

- `GET /api/streaks/current` - Racha actual
- `POST /api/streaks/update` - Actualizar racha

### JDoodle

- `POST /api/jdoodle/run-example` - Ejecutar código de ejemplo

---

## 🎨 Arquitectura

### Patrón de Diseño: Atomic Design (Frontend)

- **Atoms**: Componentes básicos (Button, Input, Label)
- **Molecules**: Combinaciones simples (TextField)
- **Organisms**: Componentes complejos (LoginForm, RutaPath)
- **Pages**: Páginas completas (LoginPage, PracticaPage)

### Flujo de Autenticación

```
Usuario → LoginForm → loginApi → Backend (JWT) → localStorage → AuthContext → Rutas Protegidas
```

### Flujo de Ejercicios

```
PracticaPage → validateExerciseApi → Backend → JDoodle API → Validación Tests →
→ Registro Debilidades → Response → UI Update
```

---

## 🧪 Testing

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

---

## 📚 Documentación Adicional

- **[GUIA_LECTURA_CODIGO.md](./GUIA_LECTURA_CODIGO.md)** - Orden recomendado para leer el código
- **[DOCUMENTACION.md](./DOCUMENTACION.md)** - Guía técnica del sistema de ejercicios

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo [LICENSE](./LICENSE) para más detalles.

---

## 👤 Autor

**Diana Roan**

- GitHub: [@Dianroan](https://github.com/Dianroan)

---

## 🙏 Agradecimientos

- **JDoodle** - Por proporcionar la API de ejecución de código
- **Chart.js** - Por las hermosas gráficas
- **Ace Editor** - Por el editor de código integrado

---

## 🔮 Roadmap

- [ ] Sistema de badges y logros
- [ ] Chat de ayuda entre estudiantes
- [ ] Modo oscuro
- [ ] Más lenguajes de programación
- [ ] Sistema de hints progresivos
- [ ] Exportar progreso a PDF
- [ ] Modo competitivo/ranking

---

**¡Feliz aprendizaje! 🚀**
