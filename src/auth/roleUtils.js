export function normalizeRoles(roles = []) {
  if (!Array.isArray(roles)) {
    roles = String(roles)
      .split(/[,\s]+/)
      .map((role) => role.trim())
      .filter(Boolean);
  }

  return roles.map((role) =>
    String(role)
      .replace("[", "")
      .replace("]", "")
      .replace("ROLE_", "")
      .trim()
      .toUpperCase()
  );
}

export function hasRole(user, requiredRole) {
  if (!requiredRole) return true;

  const roles = normalizeRoles(user?.roles || []);
  return roles.includes(requiredRole.toUpperCase());
}

export function isOwner(user) {
  return hasRole(user, "OWNER");
}

export function isReceiver(user) {
  return hasRole(user, "RECEIVER");
}
