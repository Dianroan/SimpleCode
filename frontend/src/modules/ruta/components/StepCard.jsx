import Card from "../../../design-system/atoms/Card";

export default function StepCard({
  kind,
  title,
  isCompleted,
  isAvailable,
  isNext,
  stepOrder,
}) {
  // Determinar el borde basado en el estado
  let borderStyle = "2px solid #dee2e6";
  let backgroundColor = "#fff";

  if (isCompleted) {
    borderStyle = "2px solid #28a745";
    backgroundColor = "#f8fff9";
  } else if (isNext) {
    borderStyle = "2px solid #ffc107";
    backgroundColor = "#fffbf0";
  } else if (isAvailable) {
    borderStyle = "2px solid #28a745";
  }

  return (
    <Card
      className="px-3 py-2"
      style={{
        border: borderStyle,
        backgroundColor,
        transition: "all 0.3s ease",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div className="flex-grow-1">
          <div className="small text-muted">
            Paso {stepOrder} · {kind === "theory" ? "Teoría" : "Práctica"}
          </div>
          <div className="fw-semibold">{title}</div>
        </div>
        {isCompleted && (
          <div className="text-success ms-2" style={{ fontSize: "20px" }}>
            ✓
          </div>
        )}
        {isNext && !isCompleted && (
          <div className="badge bg-warning text-dark ms-2">Siguiente</div>
        )}
        {!isAvailable && (
          <div className="text-muted ms-2" style={{ fontSize: "20px" }}>
            🔒
          </div>
        )}
      </div>
    </Card>
  );
}
