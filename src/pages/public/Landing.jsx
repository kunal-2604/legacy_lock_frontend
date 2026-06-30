import { Link } from "react-router-dom";
import { LockKeyhole, ShieldCheck, UsersRound } from "lucide-react";
import ThemeToggle from "../../components/ui/ThemeToggle.jsx";

export default function Landing() {
  return (
    <main className="app-shell">
      <div className="page-container landing-page">
        <nav className="landing-nav">
          <Link to="/" className="brand">
            <span className="brand-mark">L</span>
            LegacyLock
          </Link>

          <div className="nav-actions">
            <ThemeToggle compact />
            <Link to="/login" className="glass-button ghost">
              Login
            </Link>
            <Link to="/register" className="glass-button primary">
              Get Started
            </Link>
          </div>
        </nav>

        <section className="hero-grid">
          <div className="hero-copy animate-fade-up">
            <p className="eyebrow">Secure digital legacy platform</p>
            <h1>
              Secure what matters.{" "}
              <span className="gradient-text">Release it only when it is time.</span>
            </h1>
            <p className="hero-description">
              Store important messages and files, choose trusted receivers, and control when access should be shared.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="glass-button primary">
                Get Started
              </Link>
              <Link to="/login" className="glass-button secondary">
                Login
              </Link>
            </div>
          </div>

          <div className="hero-panel glass-card animate-float">
            <div className="secure-orb">
              <LockKeyhole size={52} />
            </div>

            <h2>Private Capsule</h2>
            <p className="muted">
              A calm place for sensitive notes, trusted receivers, timely reminders, and clear access history.
            </p>

            <div className="mini-stats">
              <div>
                <strong>Private</strong>
                <span>Protected storage</span>
              </div>
              <div>
                <strong>Flexible</strong>
                <span>Owner + receiver</span>
              </div>
            </div>
          </div>
        </section>

        <section className="feature-grid">
          <FeatureCard
            icon={<ShieldCheck />}
            title="Private capsules"
            text="Keep important notes and files safe until access is needed."
          />
          <FeatureCard
            icon={<UsersRound />}
            title="Trusted receivers"
            text="Assign people who can access released capsules through their email."
          />
          <FeatureCard
            icon={<LockKeyhole />}
            title="Planned release"
            text="Use check-ins, grace periods, and reminders before access is shared."
          />
        </section>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <article className="glass-card glass-card-hover feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p className="muted">{text}</p>
    </article>
  );
}
