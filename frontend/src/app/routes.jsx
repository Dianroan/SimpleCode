import React from "react";
import { Navigate } from "react-router-dom";

import LoginPage from "@modules/auth/pages/LoginPage.jsx";
import RegisterPage from "@modules/auth/pages/RegisterPage.jsx";
import LandingPage from "@ds/pages/LandingPage.jsx";

export const routes = [
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "*",
    element: (
      <div className="container py-5">
        <h1>Página no encontrada</h1>
      </div>
    ),
  },
];
