import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <section className="dashboard-content">
        <Outlet />
      </section>
    </div>
  );
}
