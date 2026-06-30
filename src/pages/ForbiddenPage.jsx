import { Link } from "react-router-dom";
import { LockKeyhole } from "lucide-react";

export default function ForbiddenPage({ requiredRole }) {
  return (
    <main className="app-shell center-screen">
      <section className="glass-card auth-state-card forbidden-card">
        <div className="auth-success-icon danger-icon">
          <LockKeyhole size={34} />
        </div>

        <p className="eyebrow">Access restricted</p>

        <h1>You do not have access to this area.</h1>

        <p className="muted">
          Your account does not currently include the{" "}
          <strong>{requiredRole}</strong> workspace.
        </p>

        <div className="forbidden-actions">
          <Link to="/app" className="glass-button primary">
            Back to workspace
          </Link>

          <Link to="/login" className="glass-button ghost">
            Login again
          </Link>
        </div>
      </section>
    </main>
  );
}
