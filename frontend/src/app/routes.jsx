// src/app/routes.jsx
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

const Cursos = () => <div className="p-3">Cursos</div>;
const Desafios = () => <div className="p-3">Desafíos</div>;
const Debilidades = () => <div className="p-3">Debilidades</div>;
const Perfil = () => <div className="p-3">Perfil</div>;

export const routes = [
  // PÚBLICAS: si hay sesión -> /ruta
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

  // PRIVADAS (todas cuelgan del layout con SideNav)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "ruta", element: <RutaPage /> },
      { path: "cursos", element: <Cursos /> },
      { path: "desafios", element: <Desafios /> },
      { path: "debilidades", element: <Debilidades /> },
      { path: "perfil", element: <Perfil /> },
      { path: "teoria/:id", element: <TeoriaPage /> },
      { path: "practica/:id", element: <PracticaPage /> },
    ],
  },

  // Si no matchea:
  { path: "*", element: <Navigate to="/" replace /> },
];
