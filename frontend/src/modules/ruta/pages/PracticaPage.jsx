import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../design-system/atoms/Button.jsx";

export default function PracticaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div
      className="p-4 bg-secondary bg-opacity-50"
      style={{ minHeight: "100vh" }}
    >
      <h2 className="fw-bold text-white">Práctica #{id}</h2>
      <p className="text-white-50">Aquí irá el entorno de ejercicios/katas.</p>
      <Button
        variant="primary"
        className="mt-3"
        onClick={() => navigate("/ruta")}
      >
        Volver a la Ruta
      </Button>
    </div>
  );
}
