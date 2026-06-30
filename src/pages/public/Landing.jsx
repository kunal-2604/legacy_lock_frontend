import { Link } from "react-router-dom";
import { LockKeyhole, ShieldCheck, UsersRound } from "lucide-react";

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
              Create encrypted capsules, assign trusted receivers, attach secure
              files, and control release through inactivity-based policies.
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

            <h2>Encrypted Capsule</h2>
            <p className="muted">
              Private content, trusted receivers, reminder emails, secure file
              release, and full audit visibility.
            </p>

            <div className="mini-stats">
              <div>
                <strong>256-bit</strong>
                <span>Encryption ready</span>
              </div>
              <div>
                <strong>2 Roles</strong>
                <span>Owner + Receiver</span>
              </div>
            </div>
          </div>
        </section>

        <section className="feature-grid">
          <FeatureCard
            icon={<ShieldCheck />}
            title="Encrypted capsules"
            text="Keep messages and files protected until release conditions are met."
          />
          <FeatureCard
            icon={<UsersRound />}
            title="Trusted receivers"
            text="Assign people who can access released capsules through their email."
          />
          <FeatureCard
            icon={<LockKeyhole />}
            title="Inactivity release"
            text="Use check-ins, grace periods, and reminder emails before release."
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
