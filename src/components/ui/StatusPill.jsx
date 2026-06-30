export default function StatusPill({ status = "UNKNOWN" }) {
  const normalized = String(status).toUpperCase();

  return (
    <span className={`status-pill ${getClassName(normalized)}`}>
      {normalized.replaceAll("_", " ")}
    </span>
  );
}

function getClassName(status) {
  if (["ACTIVE", "VERIFIED", "COMPLETED"].includes(status)) return "success";
  if (["DRAFT", "PENDING", "PENDING_VERIFICATION"].includes(status)) return "warning";
  if (["DELETED", "REVOKED", "FAILED"].includes(status)) return "danger";
  if (["RELEASED"].includes(status)) return "info";
  return "neutral";
}
