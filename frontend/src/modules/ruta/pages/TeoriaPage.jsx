// src/modules/ruta/pages/TeoriaPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Card from "@ds/atoms/Card.jsx";
import Button from "@ds/atoms/Button.jsx";
import {
  getTheoryActivityApi,
  getLearningPathApi,
  completeActivityAndUpdateStreakApi,
} from "@services/api/learningPath.js";
import { runJdoodleExampleApi } from "@services/api/jdoodle.js";
import CodeBlockRenderer from "../components/CodeBlockRenderer.jsx";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/theme-github";

const CONSOLE_WRITE_EXAMPLE = `using System;

class Program
{
    static void Main(string[] args)
    {
    int age = 30;
        Console.Write("Tu edad es: ");
        Console.WriteLine(age + 5);
        Console.Write("Tu nombre es: ");
        Console.WriteLine("Diana");
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

    // Scroll al inicio de la página
    window.scrollTo({ top: 0, behavior: "smooth" });

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

  const handleContinue = async () => {
    try {
      // Marcar la actividad como completada (teoría) Y actualizar racha
      await completeActivityAndUpdateStreakApi(id);

      const data = await getLearningPathApi();
      const ordered = [...data].sort((a, b) => a.step_order - b.step_order);
      const currentIdx = ordered.findIndex((s) => String(s.id) === String(id));
      if (currentIdx !== -1 && currentIdx + 1 < ordered.length) {
        const next = ordered[currentIdx + 1];
        const type = (next.activity_type || next.kind || "")
          .toString()
          .toLowerCase();
        if (type.includes("theory")) navigate(`/teoria/${next.id}`);
        else if (type.includes("exercise") || type.includes("practice"))
          navigate(`/practica/${next.id}`);
        else navigate("/ruta");
      } else {
        navigate("/ruta");
      }
    } catch (e) {
      console.error("Error fetching learning path:", e);
      navigate("/ruta");
    }
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
    <main className="container py-4 animate-fade-in">
      {/* Header con botón de volver */}
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="btn hover-lift"
          style={{
            background: "white",
            border: "2px solid #e5e7eb",
            borderRadius: "0.75rem",
            padding: "0.5rem 1.25rem",
            fontWeight: "600",
            color: "#4b5563",
            transition: "all 0.25s ease",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#667eea";
            e.currentTarget.style.color = "#667eea";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(102, 126, 234, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e5e7eb";
            e.currentTarget.style.color = "#4b5563";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
          }}
        >
          ← Volver a la ruta
        </button>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div
            className="spinner mx-auto mb-3"
            style={{ width: "40px", height: "40px", borderWidth: "4px" }}
          />
          <p className="text-muted">Cargando teoría...</p>
        </div>
      )}

      {error && (
        <div
          className="alert"
          role="alert"
          style={{
            background:
              "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.1))",
            border: "none",
            borderLeft: "4px solid #ef4444",
            borderRadius: "1rem",
            color: "#dc2626",
            padding: "1.25rem",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && !activity && (
        <div
          className="text-center py-5"
          style={{
            background:
              "linear-gradient(135deg, rgba(156, 163, 175, 0.1), rgba(209, 213, 219, 0.1))",
            borderRadius: "1rem",
            padding: "3rem",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
          <p className="text-muted mb-0">
            No se encontró la actividad de teoría.
          </p>
        </div>
      )}

      {!loading && !error && activity && (
        <>
          {/* Título de la lección */}
          <div className="mb-4">
            <div className="d-flex align-items-center gap-3 mb-2">
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                }}
              >
                📖
              </div>
              <h1
                className="fw-bold mb-0"
                style={{
                  fontSize: "2rem",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {activity.title}
              </h1>
            </div>
            <div
              style={{
                height: "4px",
                width: "80px",
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "2px",
                marginTop: "0.5rem",
              }}
            />
          </div>

          {/* Contenido de la lección */}
          <div
            className="card hover-lift mb-4"
            style={{
              borderRadius: "1.5rem",
              border: "none",
              background: "white",
              padding: "2.5rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
              borderLeft: "5px solid #667eea",
            }}
          >
            <div
              style={{
                fontSize: "1.05rem",
                lineHeight: "1.8",
                color: "#1f2937",
              }}
            >
              {/* Renderizamos el HTML que viene de la BD con soporte para code blocks */}
              <CodeBlockRenderer htmlContent={activity.content} />
            </div>
          </div>

          {/* 🔹 Ejemplo interactivo SOLO para la lección 4 */}
          {Number(activity.id) === 4 && (
            <section className="mt-4">
              <div
                className="card hover-lift"
                style={{
                  borderRadius: "1.5rem",
                  border: "none",
                  background:
                    "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(34, 211, 238, 0.05) 100%)",
                  padding: "2rem",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                  borderLeft: "5px solid #10b981",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span style={{ fontSize: "1.5rem" }}>💻</span>
                  <h2 className="h5 fw-bold mb-0" style={{ color: "#10b981" }}>
                    Ejemplo Interactivo
                  </h2>
                </div>

                <p className="mb-3 text-muted">
                  El siguiente código está escrito en C#. Puedes ejecutarlo para
                  ver exactamente qué imprime en la consola.
                </p>

                <div
                  style={{
                    borderRadius: "1rem",
                    overflow: "hidden",
                    border: "2px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  }}
                >
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
                </div>

                <div className="mt-3">
                  <button
                    onClick={handleRunExample}
                    disabled={exampleLoading}
                    className="btn"
                    style={{
                      background: exampleLoading
                        ? "#9ca3af"
                        : "linear-gradient(135deg, #10b981 0%, #22d3ee 100%)",
                      color: "white",
                      fontWeight: "600",
                      borderRadius: "0.75rem",
                      padding: "0.75rem 1.5rem",
                      border: "none",
                      boxShadow: exampleLoading
                        ? "none"
                        : "0 4px 12px rgba(16, 185, 129, 0.3)",
                      cursor: exampleLoading ? "not-allowed" : "pointer",
                      transition: "all 0.25s ease",
                    }}
                  >
                    {exampleLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Ejecutando...
                      </>
                    ) : (
                      <>▶️ Ejecutar ejemplo</>
                    )}
                  </button>
                </div>

                <div className="mt-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span style={{ fontSize: "1.1rem" }}>🖥️</span>
                    <h3
                      className="h6 fw-bold mb-0"
                      style={{ color: "#4b5563" }}
                    >
                      Salida de la consola
                    </h3>
                  </div>
                  <div
                    style={{
                      background: "#1f2937",
                      borderRadius: "0.75rem",
                      padding: "1.25rem",
                      boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {exampleError && (
                      <p
                        className="mb-2"
                        style={{
                          whiteSpace: "pre-wrap",
                          color: "#fca5a5",
                          fontFamily: "monospace",
                          fontSize: "0.9rem",
                        }}
                      >
                        ❌ {exampleError}
                      </p>
                    )}
                    <pre
                      style={{
                        margin: 0,
                        whiteSpace: "pre-wrap",
                        fontFamily: "monospace",
                        minHeight: "2em",
                        color: "#22d3ee",
                        fontSize: "0.9rem",
                        lineHeight: "1.6",
                      }}
                    >
                      {exampleOutput || "// La salida aparecerá aquí..."}
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Botón de continuar */}
          <div className="mt-4 d-flex justify-content-end">
            <button
              onClick={handleContinue}
              className="btn hover-lift"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontWeight: "600",
                borderRadius: "0.75rem",
                padding: "0.75rem 2rem",
                border: "none",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                fontSize: "1rem",
              }}
            >
              Continuar →
            </button>
          </div>
        </>
      )}
    </main>
  );
}
