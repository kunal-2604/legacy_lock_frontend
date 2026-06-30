import { Link } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  Download,
  FileCheck2,
  Inbox,
  MailOpen,
} from "lucide-react";

import AppLayout from "../../layouts/AppLayout.jsx";

export default function ReceiverDashboard() {
  return (
    <AppLayout>
      <section className="dashboard-hero glass-card">
        <div>
          <p className="eyebrow">Receiver Inbox</p>
          <h2>Your released capsules will appear here</h2>
          <p className="muted">
            When an owner releases a capsule to your email, you can open its
            decrypted content, download files, and acknowledge receipt.
          </p>
        </div>

        <Link to="/receiver/capsules" className="glass-button primary">
          <Inbox size={17} />
          Open Inbox
        </Link>
      </section>

      <section className="metric-grid receiver-metrics">
        <MetricCard
          icon={<Boxes />}
          label="Released Capsules"
          value="0"
          helper="No released capsules yet"
        />
        <MetricCard
          icon={<Download />}
          label="Files Available"
          value="0"
          helper="Decrypted on download"
        />
        <MetricCard
          icon={<FileCheck2 />}
          label="Acknowledgements"
          value="0"
          helper="Receipts submitted"
        />
      </section>

      <section className="empty-dashboard glass-card">
        <div className="empty-icon">
          <MailOpen size={34} />
        </div>

        <h3>No released capsules yet</h3>
        <p className="muted">
          Access appears only after a capsule is released to your account email.
          Until then, your receiver inbox stays empty and private.
        </p>

        <Link to="/app" className="glass-button ghost">
          Back to overview <ArrowRight size={17} />
        </Link>
      </section>
    </AppLayout>
  );
}

function MetricCard({ icon, label, value, helper }) {
  return (
    <article className="metric-card glass-card">
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <p className="muted">{helper}</p>
    </article>
  );
}
