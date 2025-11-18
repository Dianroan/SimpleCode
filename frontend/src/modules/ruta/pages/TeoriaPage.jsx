// src/modules/ruta/pages/TeoriaPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Card from "@ds/atoms/Card.jsx";
import Button from "@ds/atoms/Button.jsx";
import { getTheoryActivityApi } from "@services/api/learningPath.js";

export default function TeoriaPage() {
  const { id } = useParams(); // id del course (PK en courses)
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getTheoryActivityApi(id);
        // data debería ser { id, title, content, course_id, ... }
        setActivity(data);
      } catch (e) {
        console.error(e);
        setError(e.message || "No se pudo cargar la actividad de teoría.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleBack = () => {
    navigate("/ruta");
  };

  const handleContinue = () => {
    // 👇 Más adelante: aquí actualizamos progreso y racha,
    // y enviamos al siguiente paso de la ruta.
    navigate("/ruta");
  };

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="outline-secondary" onClick={handleBack}>
          ← Volver a la ruta
        </Button>
      </div>

      {loading && <p>Cargando teoría...</p>}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && !activity && (
        <p>No se encontró la actividad de teoría.</p>
      )}

      {!loading && !error && activity && (
        <>
          <h1 className="h3 mb-3">{activity.title}</h1>

          <Card className="p-3">
            <p
              style={{
                whiteSpace: "pre-wrap",
                marginBottom: 0,
              }}
            >
              {activity.content}
            </p>
          </Card>

          {/* Más adelante aquí irán ejemplos con Ace read-only, etc. */}

          <div className="mt-4 d-flex justify-content-end">
            <Button variant="primary" onClick={handleContinue}>
              Continuar
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
