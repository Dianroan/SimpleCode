import { Outlet } from "react-router-dom";
import SideNav from "@core/components/SideNav.jsx";

export default function DashboardLayout() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <SideNav />
      <main className="flex-grow-1 bg-secondary bg-opacity-50">
        <Outlet />
      </main>
    </div>
  );
}
