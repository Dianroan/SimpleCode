// src/modules/ruta/pages/TeoriaPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Card from "@ds/atoms/Card.jsx";
import Button from "@ds/atoms/Button.jsx";
import { getTheoryActivityApi } from "@services/api/learningPath.js";
import { runJdoodleExampleApi } from "@services/api/jdoodle.js";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/theme-github";

const CONSOLE_WRITE_EXAMPLE = `using System;

class Program
{
    static void Main(string[] args)
    {
        Console.Write("Tu nombre es: ");
        Console.WriteLine("Diego");
        Console.WriteLine("Este es un ejemplo de salida usando Console.WriteLine.");
    }
}`;

export default function TeoriaPage() {
  const { id } = useParams(); // id del course (PK en courses)
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // estados para el ejemplo interactivo (JDoodle)
  const [exampleOutput, setExampleOutput] = useState("");
  const [exampleLoading, setExampleLoading] = useState(false);
  const [exampleError, setExampleError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getTheoryActivityApi(id);
        // data debería ser { id, title, content, ... }
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
    // Más adelante: actualizar progreso y racha, y mandar al siguiente paso
    navigate("/ruta");
  };

  const handleRunExample = async () => {
    setExampleError("");
    setExampleOutput("");
    try {
      setExampleLoading(true);
      const data = await runJdoodleExampleApi(CONSOLE_WRITE_EXAMPLE);

      if (data.error) {
        setExampleError(data.error);
      }

      setExampleOutput(data.output || "");
    } catch (e) {
      console.error(e);
      setExampleError("No se pudo ejecutar el ejemplo.");
    } finally {
      setExampleLoading(false);
    }
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
            {/* Renderizamos el HTML que viene de la BD */}
            <div
              className="theory-content"
              style={{ marginBottom: 0 }}
              dangerouslySetInnerHTML={{ __html: activity.content }}
            />
          </Card>

          {/* 🔹 Ejemplo interactivo SOLO para la lección 4 */}
          {Number(activity.id) === 4 && (
            <section className="mt-4">
              <h2 className="h5 mb-3">
                Ejemplo interactivo de Console.Write y Console.WriteLine
              </h2>

              <p className="mb-2">
                El siguiente código está escrito en C#. Puedes ejecutarlo para
                ver exactamente qué imprime en la consola.
              </p>

              <AceEditor
                mode="csharp"
                theme="github"
                name="consoleWriteExample"
                value={CONSOLE_WRITE_EXAMPLE}
                width="100%"
                height="220px"
                readOnly={true}
                setOptions={{
                  useWorker: false,
                }}
                editorProps={{ $blockScrolling: true }}
              />

              <div className="mt-3 d-flex gap-2 align-items-center">
                <Button
                  variant="primary"
                  onClick={handleRunExample}
                  disabled={exampleLoading}
                >
                  {exampleLoading ? "Ejecutando..." : "Ejecutar ejemplo"}
                </Button>
              </div>

              <div className="mt-3">
                <h3 className="h6">Salida de la consola</h3>
                <Card className="p-2">
                  {exampleError && (
                    <p
                      className="text-danger mb-2"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {exampleError}
                    </p>
                  )}
                  <pre
                    style={{
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      fontFamily: "monospace",
                      minHeight: "2em",
                    }}
                  >
                    {exampleOutput}
                  </pre>
                </Card>
              </div>
            </section>
          )}

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
