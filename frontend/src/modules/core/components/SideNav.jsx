/**
 * Componente SideNav - Barra lateral de navegación
 *
 * Menú de navegación principal del dashboard con:
 * - Logo de SimpleCode
 * - Enlaces a: RUTA, DEBILIDADES, PERFIL
 * - Resaltado dinámico del enlace activo
 * - Footer con copyright
 */

import { NavLink } from "react-router-dom";

export default function SideNav() {
  const items = [
    { to: "/ruta", label: "RUTA", icon: "🎯" },
    { to: "/debilidades", label: "DEBILIDADES", icon: "📊" },
    { to: "/perfil", label: "PERFIL", icon: "👤" },
  ];

  const sidebarStyles = {
    width: 220,
    minHeight: "100%",
    background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
    boxShadow: "4px 0 15px rgba(0, 0, 0, 0.1)",
    padding: "2rem 1rem",
  };

  const logoStyles = {
    fontSize: "1.5rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #fff 0%, #e0e7ff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "2rem",
    textAlign: "center",
  };

  return (
    <aside
      className="d-flex flex-column animate-slide-in-left"
      style={sidebarStyles}
    >
      <div style={logoStyles}>SimpleCode</div>

      {items.map((i) => (
        <NavLink
          key={i.to}
          to={i.to}
          className={({ isActive }) =>
            "fw-semibold mb-3 text-decoration-none d-flex align-items-center gap-2 px-3 py-2 rounded-3 " +
            (isActive ? "text-white" : "text-white text-opacity-75")
          }
          style={({ isActive }) => ({
            background: isActive ? "rgba(255, 255, 255, 0.25)" : "transparent",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            backdropFilter: isActive ? "blur(10px)" : "none",
            transform: isActive ? "translateX(5px)" : "translateX(0)",
            boxShadow: isActive ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none",
          })}
        >
          <span style={{ fontSize: "1.25rem" }}>{i.icon}</span>
          <span>{i.label}</span>
        </NavLink>
      ))}

      {/* Footer del sidebar */}
      <div
        className="mt-auto pt-4"
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          color: "rgba(255, 255, 255, 0.7)",
          fontSize: "0.75rem",
          textAlign: "center",
        }}
      >
        <p className="mb-0">© 2025 SimpleCode</p>
      </div>
    </aside>
  );
}
