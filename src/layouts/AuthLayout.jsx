import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

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
          <Link to="/" className="brand">
            <span className="brand-mark">L</span>
            LegacyLock
          </Link>

          <div className="auth-brand-content">
            <div className="secure-orb auth-orb">
              <ShieldCheck size={42} />
            </div>

            <p className="eyebrow">Secure Digital Legacy</p>
            <h1>
              Private capsules, trusted receivers, and controlled release.
            </h1>
            <p className="muted">
              LegacyLock keeps your important messages and files protected until
              the right moment.
            </p>
          </div>

          <div className="auth-security-strip">
            <span>Email verification</span>
            <span>Encrypted content</span>
            <span>JWT refresh</span>
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
