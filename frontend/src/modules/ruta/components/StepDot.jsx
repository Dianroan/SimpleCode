/**
 * Componente StepDot - Círculo indicador de paso
 *
 * Círculo visual que representa un paso en la ruta:
 * - Icono: 📘 para teoría, 💻 para práctica
 * - Completado: Gradiente verde con checkmark ✅
 * - Siguiente: Gradiente naranja con animación pulse
 * - Disponible: Borde azul
 * - Bloqueado: Gris
 *
 * @param {string} kind - "theory" o "exercise"
 * @param {boolean} isCompleted - Si está completado
 * @param {boolean} isAvailable - Si está disponible
 * @param {boolean} isNext - Si es el siguiente paso
 */

import Button from "../../../design-system/atoms/Button";

export default function StepDot({ kind, isCompleted, isAvailable, isNext }) {
  const isTheory = kind === "theory";

  // Determinar el color y estilo basado en el estado con gradientes
  let background = "#f3f4f6";
  let borderColor = "#e5e7eb";
  let color = "#9ca3af";
  let boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  let animation = "";

  if (isCompleted) {
    background = "linear-gradient(135deg, #10b981 0%, #22d3ee 100%)";
    borderColor = "#10b981";
    color = "white";
    boxShadow = "0 8px 20px rgba(16, 185, 129, 0.4)";
  } else if (isNext) {
    background = "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)";
    borderColor = "#f59e0b";
    color = "white";
    boxShadow = "0 8px 20px rgba(245, 158, 11, 0.5)";
    animation = "pulse 2s infinite";
  } else if (isAvailable) {
    background = "#ffffff";
    borderColor = "#667eea";
    color = "#667eea";
    boxShadow = "0 6px 15px rgba(102, 126, 234, 0.2)";
  }

  return (
    <div
      className="rounded-circle d-inline-flex align-items-center justify-content-center position-relative hover-grow"
      style={{
        width: 72,
        height: 72,
        fontWeight: 700,
        background,
        border: `4px solid ${borderColor}`,
        color,
        fontSize: "28px",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        flexShrink: 0,
        boxShadow,
        animation,
      }}
      title={isTheory ? "Teoría" : "Práctica"}
    >
      {isTheory ? "📘" : "💻"}
      {isCompleted && (
        <div
          className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
          style={{
            bottom: "-6px",
            right: "-6px",
            width: "28px",
            height: "28px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            border: "3px solid white",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(16, 185, 129, 0.4)",
          }}
        >
          ✓
        </div>
      )}
      {isNext && !isCompleted && (
        <div
          className="position-absolute"
          style={{
            top: "-8px",
            right: "-8px",
            width: "20px",
            height: "20px",
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            borderRadius: "50%",
            border: "2px solid white",
            boxShadow: "0 2px 8px rgba(239, 68, 68, 0.5)",
            animation: "pulse 1.5s infinite",
          }}
        />
      )}
    </div>
  );
}
