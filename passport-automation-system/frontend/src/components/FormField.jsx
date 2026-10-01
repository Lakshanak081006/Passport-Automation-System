export default function FormField({ label, error, required = true, children }) {
  return (
    <div className={`form-field ${error ? "has-error" : ""}`}>
      <label>
        {label} {required && <span className="req">*</span>}
      </label>
      {children}
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}
