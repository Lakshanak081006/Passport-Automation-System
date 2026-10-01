import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import { useToast } from "../context/ToastContext";
import { register } from "../services/authService";
import { errorMessage, fieldErrors } from "../services/api";

const initial = {
  fullName: "", dateOfBirth: "", gender: "", email: "", mobile: "",
  address: "", password: "", confirmPassword: "",
};

function validate(f) {
  const e = {};
  if (!f.fullName.trim()) e.fullName = "Full name is required";
  if (!f.dateOfBirth) e.dateOfBirth = "Date of birth is required";
  else if (new Date(f.dateOfBirth) >= new Date()) e.dateOfBirth = "Date of birth must be in the past";
  if (!f.gender) e.gender = "Select a gender";
  if (!f.email.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email";
  if (!f.mobile) e.mobile = "Mobile number is required";
  else if (!/^[6-9][0-9]{9}$/.test(f.mobile)) e.mobile = "Enter a valid 10-digit mobile number";
  if (!f.address.trim()) e.address = "Address is required";
  if (!f.password) e.password = "Password is required";
  else if (f.password.length < 8) e.password = "Password must be at least 8 characters";
  if (!f.confirmPassword) e.confirmPassword = "Confirm your password";
  else if (f.password !== f.confirmPassword) e.confirmPassword = "Passwords do not match";
  return e;
}

export default function Register() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      await register({ ...form, email: form.email.trim() });
      toast.success("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="card auth-card wide" onSubmit={handleSubmit} noValidate>
        <h2>Create Applicant Account</h2>
        <div className="form-grid">
          <FormField label="Full Name" error={errors.fullName}>
            <input name="fullName" value={form.fullName} onChange={handleChange} />
          </FormField>
          <FormField label="Date of Birth" error={errors.dateOfBirth}>
            <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
          </FormField>
          <FormField label="Gender" error={errors.gender}>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </FormField>
          <FormField label="Email" error={errors.email}>
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </FormField>
          <FormField label="Mobile Number" error={errors.mobile}>
            <input name="mobile" value={form.mobile} onChange={handleChange} maxLength={10} placeholder="10-digit number" />
          </FormField>
          <FormField label="Address" error={errors.address}>
            <textarea name="address" rows={2} value={form.address} onChange={handleChange} />
          </FormField>
          <FormField label="Password" error={errors.password}>
            <input type="password" name="password" value={form.password} onChange={handleChange} />
          </FormField>
          <FormField label="Confirm Password" error={errors.confirmPassword}>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
          </FormField>
        </div>
        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
        <p className="auth-switch">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
