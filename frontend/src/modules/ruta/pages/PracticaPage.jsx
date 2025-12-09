/**
 * Página PracticaPage - Ejercicios de programación
 *
 * Permite al usuario:
 * 1. Cargar el ejercicio con su descripción y template de código
 * 2. Escribir código C# en AceEditor
 * 3. Probar el código con "¡Probar!" (envía a JDoodle para compilar/ejecutar)
 * 4. Ver resultados de tests unitarios (X/Y tests pasados)
 * 5. Al pasar todos los tests, se habilita "Continuar" que marca como completado
 *
 * El sistema:
 * - Resetea estado al cambiar de ejercicio
 * - Registra fallos en puntos débiles automáticamente
 * - Actualiza racha al completar ejercicio
 * - Muestra output de consola y detalles de cada test
 */

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
  completeActivityAndUpdateStreakApi,
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
  const [completingExercise, setCompletingExercise] = useState(false);

  // RQF13: Cargar ejercicio con su descripción
  useEffect(() => {
    const loadExercise = async () => {
      try {
        setLoading(true);

        // Scroll al inicio de la página
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Resetear todos los estados cuando se carga un nuevo ejercicio
        setOutput("");
        setTestResult(null);
        setError("");
        setCompletingExercise(false);
        setTesting(false);

        const data = await getExerciseApi(id);
        setExercise(data);
        setCode(data.code_template || "");
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
          details: result.test_results || [],
        });
      } else {
        // RQF19: Mensaje de fallo con X/Y tests
        setTestResult({
          success: false,
          message: `${result.passed_tests}/${result.total_tests} tests pasados`,
          passed: result.passed_tests,
          total: result.total_tests,
          details: result.test_results || [],
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
    // Doble verificación: solo permitir si tests pasaron
    if (!isCompleted || !testResult?.success) {
      setError("Debes pasar todos los tests antes de completar el ejercicio");
      return;
    }

    try {
      setCompletingExercise(true);
      setError("");

      // Guardar progreso en backend Y actualizar racha antes de navegar
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
      console.error("Error completing exercise:", e);
      const errorMsg =
        e.response?.data?.message ||
        e.message ||
        "Error al completar el ejercicio";
      setError(errorMsg);
    } finally {
      setCompletingExercise(false);
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

            {/* Mostrar tests disponibles */}
            {exercise.tests && exercise.tests.length > 0 && (
              <div className="tests-preview">
                <h3>📋 Casos de Prueba ({exercise.tests.length})</h3>
                <div className="tests-list">
                  {exercise.tests.map((test, idx) => (
                    <div key={test.id || idx} className="test-case-preview">
                      <div className="test-header">
                        <span className="test-number">
                          Test {test.test_order}
                        </span>
                        {test.description && (
                          <span className="test-description">
                            {test.description}
                          </span>
                        )}
                      </div>
                      <div className="test-io">
                        <div className="test-input">
                          <strong>Entrada:</strong>
                          <code>{test.input_data || "sin parámetros"}</code>
                        </div>
                        <div className="test-expected">
                          <strong>Salida esperada:</strong>
                          <code>{test.expected_output}</code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RQF15: Columna derecha - Editor de código */}
        <div className="practica-right">
          <div className="editor-section">
            <h3>Tu Código C#</h3>
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

          {/* Mostrar código de ejemplo de las pruebas */}
          {exercise.example_tests_code && (
            <div className="editor-section">
              <h3>📋 Código de Pruebas (Referencia)</h3>
              <p className="tests-info">
                Estas son las llamadas que se harán a tu función. Solo es de
                referencia visual.
              </p>
              <AceEditor
                mode="csharp"
                theme="github"
                value={exercise.example_tests_code}
                readOnly={true}
                name="testsViewer"
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  useWorker: false,
                  fontSize: 13,
                  fontFamily: "'Courier New', monospace",
                  showLineNumbers: true,
                  tabSize: 4,
                  readOnly: true,
                  highlightActiveLine: false,
                  highlightGutterLine: false,
                }}
                style={{ width: "100%", height: "150px", opacity: 0.85 }}
              />
            </div>
          )}

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

            {/* RQF20: Botón "Completar" - solo habilitado si tests pasaron */}
            <button
              className="btn btn-success"
              onClick={handleCompletar}
              disabled={!isCompleted || completingExercise}
              title={!isCompleted ? "Debes pasar todos los tests primero" : ""}
            >
              {completingExercise ? "Completando..." : "Completar"}
            </button>

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

              {/* Mostrar detalles de cada test */}
              {testResult.details && testResult.details.length > 0 && (
                <div className="test-details">
                  <h4>Detalles de los tests:</h4>
                  <div className="tests-result-list">
                    {testResult.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className={`test-detail ${
                          detail.passed ? "passed" : "failed"
                        }`}
                      >
                        <div className="test-header-result">
                          <span className="test-status">
                            {detail.passed ? "✓ PASÓ" : "✗ FALLÓ"}
                          </span>
                          <span className="test-num">
                            Test {detail.test_number}
                          </span>
                          {detail.description && (
                            <span className="test-desc">
                              {detail.description}
                            </span>
                          )}
                        </div>
                        <div className="test-io-result">
                          <div className="row">
                            <div className="input-col">
                              <strong>Entrada:</strong>
                              <code>{detail.input}</code>
                            </div>
                            <div className="expected-col">
                              <strong>Esperado:</strong>
                              <code>{detail.expected}</code>
                            </div>
                            <div className="actual-col">
                              <strong>Obtenido:</strong>
                              <code
                                className={
                                  detail.passed
                                    ? "success-output"
                                    : "error-output"
                                }
                              >
                                {detail.actual || "(vacío)"}
                              </code>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
