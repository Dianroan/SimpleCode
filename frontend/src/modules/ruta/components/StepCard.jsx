/**
 * Componente StepCard - Tarjeta de visualización de paso en la ruta
 *
 * Muestra información del paso con estilos dinámicos según estado:
 * - isCompleted: Verde con check, indica paso finalizado
 * - isNext: Naranja con badge "Siguiente", anima con pulse
 * - isAvailable: Azul, indica que se puede acceder
 * - Bloqueado: Gris, no se puede acceder aún
 *
 * @param {string} kind - Tipo: "theory" o "exercise"
 * @param {string} title - Título del paso
 * @param {boolean} isCompleted - Si está completado
 * @param {boolean} isAvailable - Si está disponible para hacer
 * @param {boolean} isNext - Si es el siguiente paso recomendado
 * @param {number} stepOrder - Número del paso en la secuencia
 */

import Card from "../../../design-system/atoms/Card";

export default function StepCard({
  kind,
  title,
  isCompleted,
  isAvailable,
  isNext,
  stepOrder,
}) {
  // Determinar estilos basados en el estado con colores vibrantes
  let borderStyle = "2px solid #e5e7eb";
  let backgroundColor = "#fff";
  let borderLeftColor = "#e5e7eb";
  let iconColor = "#9ca3af";
  let badgeStyle = {};

  if (isCompleted) {
    borderStyle = "2px solid #10b981";
    backgroundColor =
      "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.05) 100%)";
    borderLeftColor = "#10b981";
    iconColor = "#10b981";
  } else if (isNext) {
    borderStyle = "2px solid #f59e0b";
    backgroundColor =
      "linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(251, 191, 36, 0.08) 100%)";
    borderLeftColor = "#f59e0b";
    iconColor = "#f59e0b";
    badgeStyle = {
      background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
      color: "white",
      padding: "0.375rem 0.875rem",
      borderRadius: "50px",
      fontWeight: "600",
      fontSize: "0.75rem",
      boxShadow: "0 4px 12px rgba(245, 158, 11, 0.4)",
      animation: "pulse 2s infinite",
    };
  } else if (isAvailable) {
    borderStyle = "2px solid #667eea";
    borderLeftColor = "#667eea";
    iconColor = "#667eea";
  }

  const isTheory = kind === "theory";

  return (
    <Card
      className="px-3 py-3 hover-lift"
      style={{
        border: borderStyle,
        background: backgroundColor,
        borderLeft: `5px solid ${borderLeftColor}`,
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        borderRadius: "1rem",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div className="flex-grow-1">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span style={{ fontSize: "1.25rem" }}>
              {isTheory ? "📘" : "💻"}
            </span>
            <div
              className="small"
              style={{ color: iconColor, fontWeight: "600" }}
            >
              Paso {stepOrder} · {kind === "theory" ? "Teoría" : "Práctica"}
            </div>
          </div>
          <div
            className="fw-semibold"
            style={{ fontSize: "1rem", color: "#1f2937" }}
          >
            {title}
          </div>
        </div>
        {isCompleted && (
          <div
            className="ms-3"
            style={{
              fontSize: "24px",
              color: "#10b981",
              filter: "drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))",
            }}
          >
            ✓
          </div>
        )}
        {isNext && !isCompleted && (
          <div className="ms-3" style={badgeStyle}>
            🚀 Siguiente
          </div>
        )}
        {!isAvailable && (
          <div className="ms-3" style={{ fontSize: "24px", opacity: 0.5 }}>
            🔒
          </div>
        )}
      </div>
    </Card>
  );
}
