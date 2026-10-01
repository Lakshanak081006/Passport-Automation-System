import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const applicantLinks = [
  { to: "/", label: "Home", icon: "🏠", end: true },
  { to: "/about", label: "About", icon: "ℹ️" },
  { to: "/applicant/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/applicant/apply", label: "Apply Passport", icon: "📝" },
  { to: "/applicant/status", label: "View Status", icon: "📍" },
  { to: "/applicant/history", label: "Application History", icon: "🕘" },
];

const changerLinks = [
  { to: "/status-changer/dashboard", label: "Dashboard", icon: "📊" },
];

export default function Sidebar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === "STATUS_CHANGER" ? changerLinks : applicantLinks;

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title">{user?.role === "STATUS_CHANGER" ? "Staff Panel" : "Applicant Menu"}</div>
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} end={l.end} className="sidebar-link">
          <span>{l.icon}</span> {l.label}
        </NavLink>
      ))}
      <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
        <span>🚪</span> Logout
      </button>
    </aside>
  );
}
