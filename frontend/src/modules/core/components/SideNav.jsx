import { NavLink } from "react-router-dom";

export default function SideNav() {
  const items = [
    { to: "/ruta", label: "RUTA" },
    { to: "/cursos", label: "CURSOS" },
    { to: "/desafios", label: "DESAFIOS" },
    { to: "/debilidades", label: "DEBILIDADES" },
    { to: "/perfil", label: "PERFIL" },
  ];
  return (
    <aside
      className="bg-light d-flex flex-column py-4 px-3"
      style={{ width: 180, minHeight: "100%" }}
    >
      {items.map((i) => (
        <NavLink
          key={i.to}
          to={i.to}
          className={({ isActive }) =>
            "fw-semibold mb-3 text-decoration-none " +
            (isActive ? "text-primary" : "text-dark")
          }
        >
          {i.label}
        </NavLink>
      ))}
    </aside>
  );
}
