import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  text = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  tone = "danger",
  onConfirm,
  onClose,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="confirm-modal glass-card"
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close-button" type="button" onClick={onClose}>
          <X size={18} />
        </button>

        <div className={`modal-icon ${tone}`}>
          <AlertTriangle size={28} />
        </div>

        <h3>{title}</h3>
        <p className="muted">{text}</p>

        <div className="modal-actions">
          <button className="glass-button ghost" type="button" onClick={onClose}>
            {cancelText}
          </button>

          <button
            className={`glass-button ${tone === "danger" ? "danger" : "primary"}`}
            type="button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </section>
    </div>
  );
}
