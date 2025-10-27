import { useMemo } from "react";
import { useRoutes } from "react-router-dom";
import { routes as baseRoutes } from "./routes.jsx";

export default function App() {
  const element = useRoutes(useMemo(() => baseRoutes, []));
  return element;
}
