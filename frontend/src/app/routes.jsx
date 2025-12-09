/**
 * Configuración de todas las rutas de la aplicación
 *
 * RUTAS PÚBLICAS (solo accesibles sin autenticación):
 * - Si el usuario ya tiene sesión, redirige automáticamente a /ruta
 *
 * RUTAS PRIVADAS (requieren autenticación):
 * - Usan DashboardLayout que incluye el SideNav (menú lateral)
 * - Si no hay sesión, ProtectedRoute redirige al login
 *
 * RUTAS ANIDADAS:
 * - Las rutas hijas se renderizan dentro del DashboardLayout
 * - teoria/:id y practica/:id reciben el ID como parámetro de URL
 */

import React from "react";
import { Navigate } from "react-router-dom";

import LandingPage from "@ds/pages/LandingPage.jsx";
import LoginPage from "@modules/auth/pages/LoginPage.jsx";
import RegisterPage from "@modules/auth/pages/RegisterPage.jsx";

import ProtectedRoute from "@app/ProtectedRoute.jsx";
import PublicRoute from "@app/PublicRoute.jsx";

import DashboardLayout from "@core/layouts/DashboardLayout.jsx";
import RutaPage from "@modules/ruta/pages/RutaPage.jsx";

import TeoriaPage from "@modules/ruta/pages/TeoriaPage.jsx";
import PracticaPage from "@modules/ruta/pages/PracticaPage.jsx";
import LearningPathPage from "../modules/ruta/pages/LearningPathPage";
import PerfilPage from "@modules/core/pages/PerfilPage.jsx";
import DebilidadesPage from "@modules/core/pages/DebilidadesPage.jsx";

const Cursos = () => <div className="p-3">Cursos</div>;
const Desafios = () => <div className="p-3">Desafíos</div>;

export const routes = [
  // ========== RUTAS PÚBLICAS ==========
  {
    path: "/",
    element: (
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },

  // ========== RUTAS PRIVADAS ==========
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout /> {/* Layout con SideNav + <Outlet /> para hijos */}
      </ProtectedRoute>
    ),
    children: [
      { path: "ruta", element: <RutaPage /> },
      { path: "cursos", element: <Cursos /> },
      { path: "desafios", element: <Desafios /> },
      { path: "debilidades", element: <DebilidadesPage /> },
      { path: "perfil", element: <PerfilPage /> },
      { path: "teoria/:id", element: <TeoriaPage /> },
      { path: "practica/:id", element: <PracticaPage /> },
    ],
  },

  // Redirigir rutas no encontradas
  { path: "*", element: <Navigate to="/" replace /> },
];
