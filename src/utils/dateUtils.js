export function formatDateTime(value) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

export function formatDate(value) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}
