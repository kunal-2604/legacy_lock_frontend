import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FileLock2,
  Plus,
  ShieldCheck,
  UserRoundPlus,
} from "lucide-react";

import AppLayout from "../../layouts/AppLayout.jsx";
import { capsuleApi } from "../../api/capsuleApi.js";
import { receiverApi } from "../../api/receiverApi.js";
import { checkInApi } from "../../api/checkInApi.js";
import { formatDateTime } from "../../utils/dateUtils.js";

export default function OwnerDashboard() {
  const [stats, setStats] = useState({
    capsules: 0,
    receivers: 0,
    latestCheckIn: null,
  });

  useEffect(() => {
    async function loadStats() {
      const [capsulesRes, receiversRes, latestRes] = await Promise.allSettled([
        capsuleApi.list(),
        receiverApi.list(),
        checkInApi.latest(),
      ]);

      setStats({
        capsules:
          capsulesRes.status === "fulfilled" && Array.isArray(capsulesRes.value.data)
            ? capsulesRes.value.data.length
            : 0,
        receivers:
          receiversRes.status === "fulfilled" && Array.isArray(receiversRes.value.data)
            ? receiversRes.value.data.length
            : 0,
        latestCheckIn:
          latestRes.status === "fulfilled" ? latestRes.value.data : null,
      });
    }

    loadStats();
  }, []);

  return (
    <AppLayout>
      <section className="dashboard-hero glass-card">
        <div>
          <p className="eyebrow">Owner Dashboard</p>
          <h2>Control your secure legacy vault</h2>
          <p className="muted">
            Create capsules, attach encrypted files, add receivers, and keep your
            release policy safe with check-ins.
          </p>
        </div>

        <Link to="/owner/capsules/new" className="glass-button primary">
          <Plus size={17} />
          New Capsule
        </Link>
      </section>

      <section className="metric-grid">
        <MetricCard
          icon={<FileLock2 />}
          label="Capsules"
          value={stats.capsules}
          helper="Secure capsule records"
        />
        <MetricCard
          icon={<UserRoundPlus />}
          label="Receivers"
          value={stats.receivers}
          helper="Trusted contacts"
        />
        <MetricCard
          icon={<CheckCircle2 />}
          label="Latest Check-in"
          value={stats.latestCheckIn ? "Done" : "—"}
          helper={formatDateTime(stats.latestCheckIn?.createdAt || stats.latestCheckIn?.checkInAt)}
        />
        <MetricCard
          icon={<Activity />}
          label="Release Risk"
          value="Low"
          helper="Release policy comes next"
        />
      </section>

      <section className="quick-action-grid">
        <QuickAction
          to="/owner/capsules"
          icon={<FileLock2 />}
          title="Manage capsules"
          text="View, create, activate, and organize your encrypted capsules."
        />
        <QuickAction
          to="/owner/receivers"
          icon={<UserRoundPlus />}
          title="Manage receivers"
          text="Add trusted people who can receive released capsules."
        />
        <QuickAction
          to="/owner/check-ins"
          icon={<ShieldCheck />}
          title="Check in now"
          text="Reset inactivity timelines and keep release policies paused safely."
        />
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

function QuickAction({ to, icon, title, text }) {
  return (
    <Link to={to} className="quick-action-card glass-card glass-card-hover">
      <div className="quick-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p className="muted">{text}</p>
      </div>
      <ArrowRight size={18} />
    </Link>
  );
}
