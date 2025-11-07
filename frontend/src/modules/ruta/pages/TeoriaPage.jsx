import { useParams, useNavigate } from "react-router-dom";
import Card from "../../../design-system/atoms/Card.jsx";
import Button from "../../../design-system/atoms/Button.jsx";
import { steps } from "../data/mockSteps.js";

const codeSample = `using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
        }
    }
}
`;

function SideRail() {
  const icons = ["▸", "≡", "✪", "✕", "⚙"];
  return (
    <div
      className="d-flex flex-column align-items-center gap-4 bg-light"
      style={{ width: 48, minHeight: "100%", paddingTop: 16 }}
    >
      {icons.map((i, k) => (
        <div key={k} className="text-dark" style={{ fontSize: 20 }}>
          {i}
        </div>
      ))}
    </div>
  );
}

export default function TeoriaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const step = steps.find((s) => String(s.id) === String(id)) || {
    title: "Lección",
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <SideRail />

      <main className="flex-grow-1 bg-secondary bg-opacity-50 p-4">
        <h2 className="fw-bold" style={{ color: "#fff" }}>
          {step.title} <span className="fw-normal">Tutorial</span>
        </h2>

        <p className="mt-3" style={{ maxWidth: 780, color: "#fff" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>

        <h3 className="mt-4 fw-bold" style={{ color: "#fff" }}>
          Ejemplo
        </h3>

        <Card className="mt-2" style={{ maxWidth: 820 }}>
          <pre
            className="m-0 p-3"
            style={{ background: "#f1f1f1", whiteSpace: "pre-wrap" }}
          >
            {codeSample}
          </pre>
        </Card>

        <div
          className="d-flex justify-content-end mt-4"
          style={{ maxWidth: 820 }}
        >
          <Button
            variant="primary"
            className="rounded-pill px-4"
            onClick={() => navigate("/ruta")}
          >
            Siguiente
          </Button>
        </div>
      </main>

      <div className="p-3">
        <div
          className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
          style={{ width: 36, height: 36 }}
        >
          <span role="img" aria-label="profile">
            👤
          </span>
        </div>
      </div>
    </div>
  );
}
