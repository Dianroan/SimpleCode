import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/theme-github";
import {
  getExerciseApi,
  validateExerciseApi,
} from "../../../services/api/exercises";
import {
  getLearningPathApi,
  completeLearningActivityApi,
} from "@services/api/learningPath.js";
import "./PracticaPage.css";

export default function PracticaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [output, setOutput] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState("");

  // RQF13: Cargar ejercicio con su descripción
  useEffect(() => {
    const loadExercise = async () => {
      try {
        setLoading(true);
        const data = await getExerciseApi(id);
        setExercise(data);
        setCode(data.code_template || "");
        setError("");
      } catch (err) {
        console.error("Error loading exercise:", err);
        setError("Error al cargar el ejercicio");
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [id]);

  // RQF16: Manejar clic en "¡Probar!"
  const handleProbarClick = async () => {
    if (testing) return;

    try {
      setTesting(true);
      setError("");
      setOutput("");
      setTestResult(null);

      // RQF17: Llamar a JDoodle via backend
      const result = await validateExerciseApi(id, code);

      // RQF19: Mostrar resultado
      if (result.is_successful) {
        setTestResult({
          success: true,
          message: "¡Correcto! Todos los tests pasaron.",
          passed: result.passed_tests,
          total: result.total_tests,
        });
      } else {
        // RQF19: Mensaje de fallo con X/Y tests
        setTestResult({
          success: false,
          message: `${result.passed_tests}/${result.total_tests} tests pasados`,
          passed: result.passed_tests,
          total: result.total_tests,
        });
      }

      // RQF18: Mostrar output de consola
      setOutput(result.output || "");
    } catch (err) {
      console.error("Error validating code:", err);
      setError(err.response?.data?.error || "Error al ejecutar el código");
    } finally {
      setTesting(false);
    }
  };

  // RQF20: Habilitar botón "Completar" solo si tests pasan
  const isCompleted = testResult?.success === true;

  const handleCompletar = async () => {
    if (!isCompleted) return;
    try {
      // Guardar progreso en backend antes de navegar
      await completeLearningActivityApi(id);

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

  const handleSalir = () => {
    navigate("/ruta");
  };

  if (loading) {
    return <div className="practica-page loading">Cargando ejercicio...</div>;
  }

  if (!exercise) {
    return <div className="practica-page error">Ejercicio no encontrado</div>;
  }

  return (
    <div className="practica-page">
      <div className="practica-container">
        {/* RQF13: Columna izquierda - Descripción del problema */}
        <div className="practica-left">
          <div className="problem-section">
            <h2>{exercise.title}</h2>
            <div
              className="problem-statement"
              dangerouslySetInnerHTML={{ __html: exercise.statement }}
            />
            {exercise.required_keywords && (
              <div className="keywords-hint">
                <strong>Palabras clave requeridas:</strong>
                <code>{exercise.required_keywords}</code>
              </div>
            )}
          </div>
        </div>

        {/* RQF15: Columna derecha - Editor de código */}
        <div className="practica-right">
          <div className="editor-section">
            <h3>Código C#</h3>
            <AceEditor
              mode="csharp"
              theme="github"
              value={code}
              onChange={setCode}
              name="codeEditor"
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                useWorker: false,
                fontSize: 14,
                fontFamily: "'Courier New', monospace",
                showLineNumbers: true,
                tabSize: 4,
              }}
              style={{ width: "100%", height: "400px" }}
            />
          </div>

          {/* Botones de control */}
          <div className="button-group">
            {/* RQF16: Botón "¡Probar!" */}
            <button
              className="btn btn-primary"
              onClick={handleProbarClick}
              disabled={testing}
            >
              {testing ? "Probando..." : "¡Probar!"}
            </button>

            {/* RQF20: Botón "Completar" - condicional */}
            {isCompleted ? (
              <button className="btn btn-success" onClick={handleCompletar}>
                Completar
              </button>
            ) : (
              <button
                className="btn btn-secondary"
                onClick={handleCompletar}
                disabled={true}
              >
                Completar
              </button>
            )}

            {/* Botón "Salir" */}
            <button className="btn btn-outline" onClick={handleSalir}>
              Salir
            </button>
          </div>

          {/* RQF18: Sección de output */}
          {output && (
            <div className="output-section">
              <h3>Output de Consola</h3>
              <textarea className="output-console" readOnly value={output} />
            </div>
          )}

          {/* RQF19: Sección de resultado de tests */}
          {testResult && (
            <div
              className={`test-result ${
                testResult.success ? "success" : "failure"
              }`}
            >
              <p className="test-message">{testResult.message}</p>
              <p className="test-count">
                {testResult.passed}/{testResult.total} tests pasados
              </p>
            </div>
          )}

          {/* Mostrar errores */}
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
