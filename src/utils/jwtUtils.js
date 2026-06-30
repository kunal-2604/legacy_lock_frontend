export function decodeJwtPayload(token) {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function extractRolesFromJwt(token) {
  const payload = decodeJwtPayload(token);

  if (!payload) return [];

  const possibleRoles =
    payload.roles ||
    payload.role ||
    payload.authorities ||
    payload.scope ||
    payload.scopes ||
    [];

  if (Array.isArray(possibleRoles)) {
    return possibleRoles;
  }

  return String(possibleRoles)
    .split(/[,\s]+/)
    .map((role) => role.trim())
    .filter(Boolean);
}
