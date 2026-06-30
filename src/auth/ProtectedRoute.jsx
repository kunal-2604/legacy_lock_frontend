import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "./AuthProvider.jsx";
import { hasRole } from "./roleUtils.js";

export function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, bootstrapped } = useAuth();
  const location = useLocation();

  if (!bootstrapped) {
    return (
      <main className="app-shell center-screen">
        <div className="glass-card auth-state-card">
          <p className="eyebrow">LegacyLock</p>
          <h1>Loading secure session...</h1>
          <p className="muted">Checking your encrypted workspace access.</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && !hasRole(user, requiredRole)) {
    return (
      <main className="app-shell center-screen">
        <div className="glass-card auth-state-card">
          <p className="eyebrow">Access restricted</p>
          <h1>You do not have access to this area.</h1>
          <p className="muted">
            Your account does not currently include the {requiredRole} workspace.
          </p>
        </div>
      </main>
    );
  }

  return children;
}
