import { useNavigate } from "react-router-dom";
import { steps } from "../data/mockSteps.js";
import StepDot from "./StepDot.jsx";
import StepCard from "./StepCard.jsx";

export default function RutaPath() {
  const navigate = useNavigate();

  const goTo = (s) => {
    if (s.kind === "theory") navigate(`/teoria/${s.id}`);
    else navigate(`/practica/${s.id}`);
  };

  return (
    <div className="w-100 d-flex flex-column align-items-center py-4 position-relative">
      {/* header derecho */}
      <div className="w-100 d-flex align-items-center justify-content-end gap-3 px-3">
        <div className="d-flex align-items-center gap-1">
          <span style={{ fontSize: 22 }}>🔥</span>
          <span className="fw-bold">3</span>
        </div>
        <div
          className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
          style={{ width: 32, height: 32 }}
        >
          <span role="img" aria-label="profile">
            👤
          </span>
        </div>
      </div>

      {/* camino zig-zag */}
      <div className="w-100" style={{ maxWidth: 780 }}>
        {steps.map((s, idx) => {
          const left = idx % 2 === 0;
          return (
            <div key={s.id} className="my-4 d-flex" style={{ minHeight: 80 }}>
              <div className={left ? "flex-grow-0 me-auto" : "ms-auto"}>
                <div className="d-flex align-items-center gap-3">
                  {left && (
                    <div onClick={() => goTo(s)} style={{ cursor: "pointer" }}>
                      <StepDot kind={s.kind} />
                    </div>
                  )}
                  <div onClick={() => goTo(s)} style={{ cursor: "pointer" }}>
                    <StepCard kind={s.kind} title={s.title} />
                  </div>
                  {!left && (
                    <div onClick={() => goTo(s)} style={{ cursor: "pointer" }}>
                      <StepDot kind={s.kind} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
