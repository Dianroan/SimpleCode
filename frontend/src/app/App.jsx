/**
 * Componente raíz de la aplicación
 *
 * Renderiza la barra de navegación superior (SimpleNavbar) y el contenido
 * de la ruta actual usando React Router.
 */

import { useMemo } from "react";
import { useRoutes } from "react-router-dom";
import { routes as baseRoutes } from "./routes.jsx";
import SimpleNavbar from "./SimpleNavbar.jsx";

export default function App() {
  // useRoutes renderiza el componente correspondiente a la ruta actual
  const element = useRoutes(useMemo(() => baseRoutes, []));

  return (
    <>
      <SimpleNavbar />
      {element}
    </>
  );
}
