import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { homePathFor, useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { login } from "../services/authService";
import { errorMessage } from "../services/api";

export default function Login() {
  const { user, loginUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={homePathFor(user.role)} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      loginUser(data);
      toast.success(`Welcome back, ${data.name}`);
      navigate(homePathFor(data.role), { replace: true });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container-flex">
        <div className="auth-side-panel">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
            alt="International Travel Flight"
            className="auth-side-img"
          />
          <div className="auth-side-overlay">
            <h3>Start Your Journey</h3>
            <p>Access your application, track police verification schedules, and manage status updates securely.</p>
          </div>
        </div>

        <form className="card auth-card" onSubmit={handleSubmit} noValidate>
          <h2>Account Login</h2>
          <p className="muted">Applicants and Status Changer staff use the same portal login.</p>
          <div className="form-field">
            <label>Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoFocus />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Your password" />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Signing in..." : "Login to Portal"}
          </button>
          <p className="auth-switch">New applicant? <Link to="/register">Create an account</Link></p>
        </form>
      </div>
    </div>
  );
}
