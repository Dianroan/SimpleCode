import { useMemo } from "react";
import { useRoutes } from "react-router-dom";
import { routes as baseRoutes } from "./routes.jsx";
import SimpleNavbar from "./SimpleNavbar.jsx";

export default function App() {
  const element = useRoutes(useMemo(() => baseRoutes, []));
  return (
    <>
      <SimpleNavbar />
      {element}
    </>
  );
}
