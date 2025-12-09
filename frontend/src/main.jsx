/**
 * Punto de entrada de la aplicación React
 *
 * Inicializa la aplicación montando el componente raíz con los providers necesarios:
 * 1. React.StrictMode - Detecta problemas potenciales en desarrollo
 * 2. BrowserRouter - Habilita el enrutamiento con React Router
 * 3. AuthProvider - Provee el contexto de autenticación global
 * 4. App - Componente raíz que contiene las rutas
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import App from "@app/App.jsx";
import { AuthProvider } from "@context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
