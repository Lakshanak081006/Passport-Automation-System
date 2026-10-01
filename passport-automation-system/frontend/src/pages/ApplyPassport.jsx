import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import Loading from "../components/Loading";
import { useToast } from "../context/ToastContext";
import { getMyApplication, getProfile, submitApplication } from "../services/applicationService";
import { errorMessage, fieldErrors } from "../services/api";

const emptyForm = {
  fullName: "", dateOfBirth: "", gender: "", fatherName: "", motherName: "", maritalStatus: "",
  email: "", mobile: "", address: "", city: "", state: "", pincode: "",
  passportType: "ORDINARY", applicationType: "FRESH", previousPassportNumber: "",
  placeOfBirth: "", countryOfBirth: "India", nationality: "Indian",
};

const required = {
  fullName: "Full name", dateOfBirth: "Date of birth", gender: "Gender", fatherName: "Father's name",
  motherName: "Mother's name", maritalStatus: "Marital status", email: "Email", mobile: "Mobile number",
  address: "Address", city: "City", state: "State", pincode: "Pincode",
  placeOfBirth: "Place of birth", countryOfBirth: "Country of birth", nationality: "Nationality",
};

function validate(f) {
  const e = {};
  Object.entries(required).forEach(([key, label]) => {
    if (!String(f[key]).trim()) e[key] = `${label} is required`;
  });
  if (f.dateOfBirth && new Date(f.dateOfBirth) >= new Date()) e.dateOfBirth = "Date of birth must be in the past";
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email";
  if (f.mobile && !/^[6-9][0-9]{9}$/.test(f.mobile)) e.mobile = "Enter a valid 10-digit mobile number";
  if (f.pincode && !/^[1-9][0-9]{5}$/.test(f.pincode)) e.pincode = "Pincode must be 6 digits";
  if (f.applicationType === "RENEWAL" && !f.previousPassportNumber.trim()) {
    e.previousPassportNumber = "Previous passport number is required for renewal";
  }
  return e;
}

export default function ApplyPassport() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existing, setExisting] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getMyApplication(), getProfile()])
      .then(([app, profile]) => {
        if (app && app.status !== "REJECTED") {
          setExisting(app);
        } else {
          // pre-fill from the registration details
          setForm((f) => ({
            ...f,
            fullName: profile.fullName || "",
            dateOfBirth: profile.dateOfBirth || "",
            gender: profile.gender || "",
            email: profile.email || "",
            mobile: profile.mobile || "",
            address: profile.address || "",
          }));
        }
      })
      .catch((e) => toast.error(errorMessage(e)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast.error("Please correct the highlighted fields");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        previousPassportNumber: form.applicationType === "RENEWAL" ? form.previousPassportNumber : null,
      };
      const app = await submitApplication(payload);
      toast.success(`Application submitted. Your Application ID is ${app.applicationNumber}`);
      navigate("/applicant/status");
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  if (existing) {
    return (
      <div className="card empty">
        <h3>You already have an active application</h3>
        <p>Application ID: <strong>{existing.applicationNumber}</strong></p>
        <Link className="btn btn-primary" to="/applicant/status">View Status</Link>
      </div>
    );
  }

  const input = (name, props = {}) => (
    <input name={name} value={form[name]} onChange={handleChange} {...props} />
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="page-title">Apply for Passport</h1>

      <div className="card">
        <h3 className="card-title">Personal Details</h3>
        <div className="form-grid">
          <FormField label="Full Name" error={errors.fullName}>{input("fullName")}</FormField>
          <FormField label="Date of Birth" error={errors.dateOfBirth}>{input("dateOfBirth", { type: "date" })}</FormField>
          <FormField label="Gender" error={errors.gender}>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
            </select>
          </FormField>
          <FormField label="Marital Status" error={errors.maritalStatus}>
            <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange}>
              <option value="">Select</option><option>Single</option><option>Married</option>
              <option>Divorced</option><option>Widowed</option>
            </select>
          </FormField>
          <FormField label="Father's Name" error={errors.fatherName}>{input("fatherName")}</FormField>
          <FormField label="Mother's Name" error={errors.motherName}>{input("motherName")}</FormField>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Contact Details</h3>
        <div className="form-grid">
          <FormField label="Email" error={errors.email}>{input("email", { type: "email" })}</FormField>
          <FormField label="Mobile Number" error={errors.mobile}>{input("mobile", { maxLength: 10 })}</FormField>
          <FormField label="Address" error={errors.address}>
            <textarea name="address" rows={2} value={form.address} onChange={handleChange} />
          </FormField>
          <FormField label="City" error={errors.city}>{input("city")}</FormField>
          <FormField label="State" error={errors.state}>{input("state")}</FormField>
          <FormField label="Pincode" error={errors.pincode}>{input("pincode", { maxLength: 6 })}</FormField>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Passport Details</h3>
        <div className="form-grid">
          <FormField label="Passport Type" error={errors.passportType}>
            <select name="passportType" value={form.passportType} onChange={handleChange}>
              <option value="ORDINARY">Ordinary</option>
              <option value="TATKAL">Tatkal</option>
            </select>
          </FormField>
          <FormField label="Application Type" error={errors.applicationType}>
            <select name="applicationType" value={form.applicationType} onChange={handleChange}>
              <option value="FRESH">Fresh Passport</option>
              <option value="RENEWAL">Renewal</option>
            </select>
          </FormField>
          {form.applicationType === "RENEWAL" && (
            <FormField label="Previous Passport Number" error={errors.previousPassportNumber}>
              {input("previousPassportNumber", { maxLength: 30 })}
            </FormField>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Other Details</h3>
        <div className="form-grid">
          <FormField label="Place of Birth" error={errors.placeOfBirth}>{input("placeOfBirth")}</FormField>
          <FormField label="Country of Birth" error={errors.countryOfBirth}>{input("countryOfBirth")}</FormField>
          <FormField label="Nationality" error={errors.nationality}>{input("nationality")}</FormField>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => setForm(emptyForm)}>Clear Form</button>
      </div>
    </form>
  );
}
