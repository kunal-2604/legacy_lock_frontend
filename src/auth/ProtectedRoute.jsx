import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "./AuthProvider.jsx";
import { hasRole } from "./roleUtils.js";
import ForbiddenPage from "../pages/ForbiddenPage.jsx";
import PageLoader from "../components/ui/PageLoader.jsx";

export function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, bootstrapped } = useAuth();
  const location = useLocation();

  if (!bootstrapped) {
    return (
      <main className="app-shell center-screen">
        <PageLoader
          title="Loading secure session..."
          text="Checking your workspace access."
        />
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && !hasRole(user, requiredRole)) {
    return <ForbiddenPage requiredRole={requiredRole} />;
  }

  return children;
}
