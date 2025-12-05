import Button from "../../../design-system/atoms/Button";

export default function StepDot({ kind, isCompleted, isAvailable, isNext }) {
  const isTheory = kind === "theory";

  // Determinar el color y estilo basado en el estado
  let backgroundColor = "#f8f9fa";
  let borderColor = "#dee2e6";
  let color = "#6c757d";

  if (isCompleted) {
    backgroundColor = "#28a745";
    borderColor = "#28a745";
    color = "white";
  } else if (isNext) {
    backgroundColor = "#ffc107";
    borderColor = "#ffc107";
    color = "white";
  } else if (isAvailable) {
    backgroundColor = "#fff";
    borderColor = "#28a745";
    color = "#28a745";
  }

  return (
    <div
      className="rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm position-relative"
      style={{
        width: 64,
        height: 64,
        fontWeight: 700,
        backgroundColor,
        border: `3px solid ${borderColor}`,
        color,
        fontSize: "24px",
        transition: "all 0.3s ease",
        flexShrink: 0,
      }}
      title={isTheory ? "Teoría" : "Práctica"}
    >
      {isTheory ? "📘" : "<>"}
      {isCompleted && (
        <div
          className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
          style={{
            bottom: "-4px",
            right: "-4px",
            width: "24px",
            height: "24px",
            backgroundColor: "#28a745",
            border: "2px solid white",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          ✓
        </div>
      )}
    </div>
  );
}
