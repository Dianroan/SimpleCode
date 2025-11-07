import Card from "../../../design-system/atoms/Card";
export default function StepCard({ kind, title }) {
  return (
    <Card className="px-3 py-2">
      <div className="small text-muted">
        {kind === "theory" ? "Teoría" : "Práctica"}
      </div>
      <div className="fw-semibold">{title}</div>
    </Card>
  );
}
