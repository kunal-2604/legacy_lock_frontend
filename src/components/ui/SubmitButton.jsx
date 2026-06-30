import { Loader2 } from "lucide-react";

export default function SubmitButton({
  children,
  loading = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`glass-button primary submit-button ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 size={17} className="spin" />}
      {children}
    </button>
  );
}
