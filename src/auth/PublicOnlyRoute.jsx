import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthProvider";

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return children;
}
