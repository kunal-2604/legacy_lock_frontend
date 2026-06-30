import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="app-shell center-screen">
      <section className="glass-card auth-state-card forbidden-card">
        <div className="auth-success-icon">
          <Compass size={34} />
        </div>

        <p className="eyebrow">404</p>
        <h1>Page not found</h1>

        <p className="muted">
          The page you are looking for does not exist or has moved.
        </p>

        <Link to="/app" className="glass-button primary full-button">
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
