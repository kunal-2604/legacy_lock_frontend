import { useEffect, useMemo, useState } from "react";
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
import EmptyState from "../../components/ui/EmptyState.jsx";
import { receiverCapsuleApi } from "../../api/receiverCapsuleApi.js";

export default function ReceiverDashboard() {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCapsules() {
      setLoading(true);

      try {
        const response = await receiverCapsuleApi.listReleasedCapsules();
        setCapsules(Array.isArray(response.data) ? response.data : []);
      } catch {
        setCapsules([]);
      } finally {
        setLoading(false);
      }
    }

    loadCapsules();
  }, []);

  const unacknowledged = useMemo(() => {
    return capsules.filter((capsule) => {
      const acknowledged =
        capsule.acknowledged ||
        capsule.hasAcknowledgement ||
        capsule.acknowledgementStatus === "COMPLETED";

      return !acknowledged;
    }).length;
  }, [capsules]);

  return (
    <AppLayout>
      <section className="dashboard-hero glass-card">
        <div>
          <p className="eyebrow">Receiver Inbox</p>
          <h2>Your released capsules</h2>
          <p className="muted">
            When an owner releases a capsule to your email, you can open its decrypted content,
            download files, and acknowledge receipt.
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
          value={loading ? "..." : capsules.length}
          helper="Granted to your email"
        />
        <MetricCard
          icon={<Download />}
          label="Files Available"
          value="—"
          helper="Open a capsule to view files"
        />
        <MetricCard
          icon={<FileCheck2 />}
          label="Pending Acknowledgements"
          value={loading ? "..." : unacknowledged}
          helper="Receipts still pending"
        />
      </section>

      {capsules.length === 0 && !loading ? (
        <EmptyState
          icon={<MailOpen size={34} />}
          title="No released capsules yet"
          text="Access appears only after a capsule is released to your account email. Until then, your receiver inbox stays empty and private."
          action={
            <Link to="/app" className="glass-button ghost">
              Back to overview <ArrowRight size={17} />
            </Link>
          }
        />
      ) : (
        <section className="glass-card recent-receiver-panel">
          <div className="panel-heading-row">
            <div>
              <p className="eyebrow">Recent Access</p>
              <h3>Latest released capsules</h3>
            </div>

            <Link to="/receiver/capsules" className="glass-button ghost">
              View all
            </Link>
          </div>

          <div className="recent-receiver-list">
            {capsules.slice(0, 4).map((capsule) => {
              const capsuleId = capsule.id || capsule.capsuleId;

              return (
                <Link
                  to={`/receiver/capsules/${capsuleId}`}
                  className="recent-receiver-row"
                  key={capsuleId}
                >
                  <div className="capsule-icon receiver-icon">
                    <Inbox size={18} />
                  </div>

                  <div>
                    <h4>{capsule.title || "Released Capsule"}</h4>
                    <p className="muted">
                      {capsule.ownerEmail || capsule.ownerName || "Owner"}
                    </p>
                  </div>

                  <ArrowRight size={17} />
                </Link>
              );
            })}
          </div>
        </section>
      )}
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
