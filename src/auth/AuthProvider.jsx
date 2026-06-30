import { createContext, useContext, useMemo, useState } from "react";
import { toast } from "sonner";

import { authApi } from "../api/authApi.js";
import { tokenStorage } from "../utils/tokenStorage.js";
import { extractRolesFromJwt } from "../utils/jwtUtils.js";

const AuthContext = createContext(null);

function normalizeRoleInput(roles) {
  if (Array.isArray(roles)) return roles;

  return String(roles || "")
    .replace("[", "")
    .replace("]", "")
    .split(/[,\s]+/)
    .map((role) => role.trim())
    .filter(Boolean);
}

function buildUserFromAuthResponse(data) {
  const responseRoles = normalizeRoleInput(data.roles || data.role || data.authorities);
  const jwtRoles = extractRolesFromJwt(data.accessToken);

  return {
    id: data.id || data.userId || data.user?.id || null,
    name: data.name || data.user?.name || "",
    email: data.email || data.user?.email || "",
    roles: responseRoles.length > 0 ? responseRoles : jwtRoles,
    tokenType: data.tokenType || "Bearer",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStorage.getUser());
  const [bootstrapped] = useState(true);

  const isAuthenticated = Boolean(tokenStorage.getAccessToken() && user);

  async function login(credentials) {
    const response = await authApi.login(credentials);
    const data = response.data;

    const nextUser = buildUserFromAuthResponse(data);

    tokenStorage.saveSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: nextUser,
    });

    setUser(nextUser);

    return nextUser;
  }

  function saveOAuthSession(data) {
    const rolesFromQuery = normalizeRoleInput(data.roles || data.role || data.authorities);
    const rolesFromJwt = extractRolesFromJwt(data.accessToken);
    const finalRoles = rolesFromQuery.length > 0 ? rolesFromQuery : rolesFromJwt;

    const nextUser = {
      id: data.id || data.userId || null,
      name: data.name || "",
      email: data.email || "",
      roles: finalRoles,
      tokenType: data.tokenType || "Bearer",
    };

    tokenStorage.saveSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: nextUser,
    });

    setUser(nextUser);

    return nextUser;
  }

  async function logout() {
    const refreshToken = tokenStorage.getRefreshToken();

    try {
      if (refreshToken) {
        await authApi.logout({ refreshToken });
      }
    } catch {
      toast.error("Logout request failed, but local session was cleared.");
    } finally {
      tokenStorage.clearSession();
      setUser(null);
    }
  }

  function clearSession() {
    tokenStorage.clearSession();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      bootstrapped,
      isAuthenticated,
      login,
      logout,
      clearSession,
      saveOAuthSession,
    }),
    [user, bootstrapped, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
