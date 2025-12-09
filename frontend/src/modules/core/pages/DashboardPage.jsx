/**
 * Página DashboardPage - Página principal del dashboard
 *
 * Layout simple que muestra SideNav y un área para rutas anidadas (Outlet)
 * Las rutas /ruta, /debilidades, /perfil se renderizan aquí
 */

import { Outlet } from "react-router-dom";
import SideNav from "@core/components/SideNav.jsx";

export default function DashboardPage() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <SideNav />
      <main className="flex-grow-1 bg-secondary bg-opacity-50">
        <Outlet />
      </main>
    </div>
  );
}
