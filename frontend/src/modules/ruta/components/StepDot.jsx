import Button from "../../../design-system/atoms/Button";
export default function StepDot({ kind }) {
  const isTheory = kind === "theory";
  return (
    <Button
      type="button"
      variant="light"
      className="rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm"
      style={{ width: 56, height: 56, fontWeight: 700 }}
      title={isTheory ? "Teoría" : "Práctica"}
    >
      {isTheory ? "📘" : "<>"}
    </Button>
  );
}
