# 📚 Guía de Lectura del Código - SimpleCode

Esta guía te ayudará a entender el proyecto SimpleCode de manera ordenada y lógica, cubriendo los archivos esenciales tanto del backend como del frontend.

---

## 🎯 Orden Recomendado de Lectura

### **FASE 1: Entender la Estructura General (2 archivos)**

1. **`README.md`** - Visión general del proyecto
2. **`DOCUMENTACION.md`** - Guía de la funcionalidad principal

---

## 🔧 BACKEND (Node.js + Express + Mysql)

### **FASE 2: Configuración e Infraestructura (3 archivos)**

3. **`backend/src/config/env.js`** - Variables de entorno y configuración
4. **`backend/src/db/pool.js`** - Conexión a Mysql
5. **`backend/src/server.js`** - Punto de entrada del servidor

### **FASE 3: Aplicación Principal y Middlewares (3 archivos)**

6. **`backend/src/app.js`** - Configuración de Express y rutas
7. **`backend/src/middleware/auth.js`** - Autenticación con JWT
8. **`backend/src/middleware/validate.js`** - Validación con Zod

### **FASE 4: Rutas del Backend (6 archivos)**

9. **`backend/src/routes/auth.js`** - Rutas de autenticación (login, register)
10. **`backend/src/routes/learningPath.js`** - Rutas de la ruta de aprendizaje
11. **`backend/src/routes/exercises.js`** - Rutas de ejercicios
12. **`backend/src/routes/weaknesses.js`** - Rutas de análisis de debilidades
13. **`backend/src/routes/streaks.js`** - Rutas de rachas de aprendizaje
14. **`backend/src/routes/jdoodle.routes.js`** - Rutas para ejecutar código C#

### **FASE 5: Controladores del Backend (5 archivos)**

15. **`backend/src/controllers/authController.js`** - Lógica de autenticación
16. **`backend/src/controllers/exerciseController.js`** - Lógica de ejercicios y validación
17. **`backend/src/controllers/weaknessController.js`** - Análisis de puntos débiles
18. **`backend/src/controllers/streakController.js`** - Gestión de rachas
19. **`backend/src/utils/hash.js`** - Utilidades de bcrypt

---

## 🎨 FRONTEND (React + Vite)

### **FASE 6: Punto de Entrada y Configuración (3 archivos)**

20. **`frontend/src/main.jsx`** - Punto de entrada de React
21. **`frontend/vite.config.js`** - Configuración de Vite y alias
22. **`frontend/src/app/App.jsx`** - Componente raíz de la aplicación

### **FASE 7: Autenticación y Rutas (4 archivos)**

23. **`frontend/src/context/AuthContext.jsx`** - Contexto global de autenticación
24. **`frontend/src/app/routes.jsx`** - Configuración de rutas
25. **`frontend/src/app/ProtectedRoute.jsx`** - Protección de rutas privadas
26. **`frontend/src/services/api/http.js`** - Cliente HTTP con JWT

### **FASE 8: Servicios de API (4 archivos clave)**

27. **`frontend/src/services/api/auth.js`** - Login, registro, obtener usuario
28. **`frontend/src/services/api/learningPath.js`** - Ruta de aprendizaje y progreso
29. **`frontend/src/services/api/exercises.js`** - Obtener y validar ejercicios
30. **`frontend/src/services/api/weaknesses.js`** - Análisis de debilidades

### **FASE 9: Páginas Principales (5 archivos)**

31. **`frontend/src/design-system/pages/LandingPage.jsx`** - Página de inicio
32. **`frontend/src/modules/auth/pages/LoginPage.jsx`** - Página de login
33. **`frontend/src/modules/core/layouts/DashboardLayout.jsx`** - Layout del dashboard
34. **`frontend/src/modules/ruta/components/RutaPath.jsx`** - Visualización de la ruta
35. **`frontend/src/modules/ruta/pages/PracticaPage.jsx`** - Ejercicios interactivos

### **FASE 10: Componentes Clave (5 archivos)**

36. **`frontend/src/design-system/atoms/Button.jsx`** - Sistema de botones
37. **`frontend/src/design-system/molecules/TextField.jsx`** - Campos de formulario
38. **`frontend/src/modules/auth/hooks/useLoginForm.js`** - Hook de formulario con validación
39. **`frontend/src/modules/core/components/StreakIndicator.jsx`** - Indicador de racha 🔥
40. **`frontend/src/modules/core/components/WeaknessCharts.jsx`** - Gráficas con Chart.js

---

## 📊 Flujo de Datos Clave

### **Autenticación**

```
LoginPage → useLoginForm → loginApi → authController → JWT → localStorage → AuthContext
```

### **Ruta de Aprendizaje**

```
RutaPath → getLearningPathApi → learningPath routes → DB (courses table) → RutaPath
```

### **Ejercicios**

```
PracticaPage → validateExerciseApi → exerciseController → JDoodle API →
→ Test validation → Weakness tracking → DB update
```

### **Rachas**

```
StreakIndicator → getCurrentStreakApi → streakController → DB (user_streaks) → Display
```

---

## 🗂️ Archivos de Soporte (Opcionales)

Si necesitas profundizar más:

- **`frontend/src/utils/validate.js`** - Validaciones del frontend
- **`frontend/src/modules/ruta/pages/TeoriaPage.jsx`** - Actividades de teoría
- **`frontend/src/modules/core/pages/PerfilPage.jsx`** - Perfil del usuario
- **`frontend/src/modules/core/pages/DebilidadesPage.jsx`** - Análisis completo
- **`backend/sql/*.sql`** - Scripts de base de datos

---

## 💡 Tips para Leer el Código

1. **Sigue el flujo de datos**: Usuario → Frontend → API → Backend → DB → Respuesta
2. **Busca los comentarios de documentación**: Cada archivo tiene un header explicativo
3. **Identifica patrones**:
   - Backend: Rutas → Controladores → Base de datos
   - Frontend: Páginas → Hooks → Servicios API → Componentes
4. **Usa el buscador**: Si ves una función, busca dónde se usa con `Ctrl+Shift+F`
5. **Ejecuta el proyecto**: Prueba las funcionalidades mientras lees el código

---

## 🎓 Conceptos Clave del Proyecto

- **JWT Authentication**: Token en localStorage, validado en cada request
- **Protected Routes**: Rutas que requieren autenticación
- **Learning Path**: Secuencia lineal de actividades (teoría/ejercicios)
- **JDoodle Integration**: API externa para ejecutar código C#
- **Weakness Tracking**: Sistema que registra fallos para análisis
- **Streaks**: Sistema de rachas para motivar aprendizaje diario
- **Atomic Design**: Organización del frontend (atoms → molecules → organisms → pages)

---

## 🚀 Siguientes Pasos

Después de leer estos 40 archivos, tendrás una comprensión completa de:

- ✅ Cómo funciona la autenticación
- ✅ Cómo se estructura la ruta de aprendizaje
- ✅ Cómo se validan los ejercicios con tests
- ✅ Cómo se rastrean las debilidades
- ✅ Cómo funcionan las rachas
- ✅ La arquitectura general del sistema
