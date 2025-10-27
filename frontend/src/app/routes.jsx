import React from "react";
import { Navigate } from "react-router-dom";

import LandingPage from "@ds/pages/LandingPage.jsx";
import LoginPage from "@modules/auth/pages/LoginPage.jsx";
import RegisterPage from "@modules/auth/pages/RegisterPage.jsx";
import DashboardPage from "@modules/core/pages/DashboardPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export const routes = [
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/dashboard",
    element: <ProtectedRoute element={<DashboardPage />} />,
  },
  { path: "*", element: <Navigate to="/" replace /> },
];
