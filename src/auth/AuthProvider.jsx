import { createContext, useContext, useMemo, useState } from "react";
import { toast } from "sonner";

import { authApi } from "../api/authApi";
import { tokenStorage } from "../utils/tokenStorage";
import { extractRolesFromJwt } from "../utils/jwtUtils.js";

const AuthContext = createContext(null);

function buildUserFromAuthResponse(data) {
  return {
    id: data.id || data.userId || null,
    name: data.name || "",
    email: data.email || "",
    roles: data.roles || [],
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
    const rolesFromQuery = Array.isArray(data.roles)
      ? data.roles
      : String(data.roles || "")
          .replace("[", "")
          .replace("]", "")
          .split(/[,\s]+/)
          .map((role) => role.trim())
          .filter(Boolean);

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
