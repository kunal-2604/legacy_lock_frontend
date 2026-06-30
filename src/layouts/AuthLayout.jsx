import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";

export default function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}) {
  return (
    <main className="app-shell auth-page">
      <div className="auth-shell">
        <section className="auth-brand-panel glass-card">
          <div className="auth-brand-topline">
            <Link to="/" className="brand">
              <span className="brand-mark">L</span>
              LegacyLock
            </Link>
            <ThemeToggle compact />
          </div>

          <div className="auth-brand-content">
            <div className="secure-orb auth-orb">
              <ShieldCheck size={42} />
            </div>

            <p className="eyebrow">Secure Digital Legacy</p>
            <h1>
              Keep important information safe for the people who need it.
            </h1>
            <p className="muted">
              Create private capsules, choose trusted receivers, and stay in control of when access is shared.
            </p>
          </div>

          <div className="auth-security-strip">
            <span>Verified access</span>
            <span>Private by design</span>
            <span>Secure sign-in</span>
          </div>
        </section>

        <section className="auth-card glass-card">
          <div className="auth-card-header">
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
            {subtitle && <p className="muted">{subtitle}</p>}
          </div>

          {children}

          {footer && <div className="auth-footer">{footer}</div>}
        </section>
      </div>
    </main>
  );
}
