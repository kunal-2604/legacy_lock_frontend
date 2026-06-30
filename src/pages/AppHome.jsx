import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  FileLock2,
  Inbox,
  KeyRound,
  MailCheck,
  Shield,
} from "lucide-react";

import AppLayout from "../layouts/AppLayout.jsx";
import { useAuth } from "../auth/AuthProvider.jsx";
import { isOwner, isReceiver } from "../auth/roleUtils.js";

export default function AppHome() {
  const { user } = useAuth();

  const userIsOwner = isOwner(user);
  const userIsReceiver = isReceiver(user);

  return (
    <AppLayout>
      <section className="dashboard-hero glass-card">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h2>
            Hi, <span className="gradient-text">{user?.name || user?.email}</span>
          </h2>
          <p className="muted">
            Choose the workspace you want to use today. You can manage your own vault or view items shared with you.
          </p>
        </div>

        <div className="hero-security-card">
          <KeyRound size={22} />
          <span>Secure sign-in active</span>
        </div>
      </section>

      <section className="workspace-switch-grid">
        {userIsOwner && (
          <Link to="/owner" className="workspace-switch-card glass-card glass-card-hover">
            <div className="switch-icon owner">
              <Shield size={26} />
            </div>

            <div>
              <p className="eyebrow">Owner Workspace</p>
              <h3>Create and control capsules</h3>
              <p className="muted">
                Create capsules, manage trusted people, add files, and control when access is shared.
              </p>
            </div>

            <span className="switch-action">
              Open workspace <ArrowRight size={17} />
            </span>
          </Link>
        )}

        {userIsReceiver && (
          <Link
            to="/receiver"
            className="workspace-switch-card glass-card glass-card-hover"
          >
            <div className="switch-icon receiver">
              <Inbox size={26} />
            </div>

            <div>
              <p className="eyebrow">Receiver Inbox</p>
              <h3>View released items</h3>
              <p className="muted">
                View items shared with your email, download files, and confirm receipt.
              </p>
            </div>

            <span className="switch-action">
              Open inbox <ArrowRight size={17} />
            </span>
          </Link>
        )}
      </section>

      <section className="security-grid">
        <SecurityCard
          icon={<MailCheck />}
          title="Verified account"
          text="Your account is ready for secure workspace access."
          status="Active"
        />
        <SecurityCard
          icon={<FileLock2 />}
          title="Private capsules"
          text="Your important messages and files stay protected."
          status="Protected"
        />
        <SecurityCard
          icon={<CheckCircle2 />}
          title="Release reminders"
          text="Important release events are easy to review."
          status="Enabled"
        />
      </section>
    </AppLayout>
  );
}

function SecurityCard({ icon, title, text, status }) {
  return (
    <article className="security-card glass-card">
      <div className="security-icon">{icon}</div>

      <div>
        <h3>{title}</h3>
        <p className="muted">{text}</p>
      </div>

      <span className="status-pill success">{status}</span>
    </article>
  );
}
