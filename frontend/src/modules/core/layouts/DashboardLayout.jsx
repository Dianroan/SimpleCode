import { Outlet } from "react-router-dom";
import SideNav from "@core/components/SideNav.jsx";

export default function DashboardLayout() {
  return (
    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)",
      }}
    >
      <SideNav />
      <main
        className="flex-grow-1"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(240, 242, 245, 0.5) 100%)",
          backdropFilter: "blur(10px)",
          position: "relative",
          overflow: "auto",
        }}
      >
        {/* Elementos decorativos de fondo */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            right: "10%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "15%",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
