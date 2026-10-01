import { Link, NavLink, useNavigate } from "react-router-dom";
import { homePathFor, useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-logo">🛂</span> Passport Automation System
      </Link>
      <nav className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/about">About</NavLink>
        {user ? (
          <>
            <NavLink to={homePathFor(user.role)}>Dashboard</NavLink>
            <span className="nav-user">{user.name}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
