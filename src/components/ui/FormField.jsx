export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  helper,
  autoComplete,
  required = false,
}) {
  return (
    <label className="form-field">
      <span>{label}</span>

      <input
        className={`glass-input ${error ? "input-error" : ""}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
      />

      {error && <small className="field-error">{error}</small>}
      {!error && helper && <small className="field-helper">{helper}</small>}
    </label>
  );
}
