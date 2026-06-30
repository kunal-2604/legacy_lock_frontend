import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import AppLayout from "../../layouts/AppLayout.jsx";
import StatusPill from "../../components/ui/StatusPill.jsx";
import { releaseApi } from "../../api/releaseApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";
import { formatDateTime } from "../../utils/dateUtils.js";

export default function ReleaseStatusPage() {
  const { capsuleId } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadStatus() {
    setLoading(true);

    try {
      const response = await releaseApi.getReleaseStatus(capsuleId);
      setStatus(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load release status."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, [capsuleId]);

  const assignedReceivers =
    status?.assignedReceivers ||
    status?.receivers ||
    status?.receiverStatuses ||
    [];

  const grants = status?.accessGrants || status?.grants || [];
  const acknowledgements = status?.acknowledgements || [];

  return (
    <AppLayout>
      <section className="page-heading-row">
        <div>
          <p className="eyebrow">Release Status</p>
          <h2>Capsule release progress</h2>
          <p className="muted">
            Track receiver assignments, access grants, and acknowledgements.
          </p>
        </div>

        <div className="card-actions">
          <button className="glass-button ghost" onClick={() => navigate(`/owner/capsules/${capsuleId}`)}>
            <ArrowLeft size={17} />
            Capsule
          </button>

          <button className="glass-button secondary" onClick={loadStatus}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </section>

      {loading ? (
        <section className="empty-dashboard glass-card">
          <h3>Loading release status...</h3>
        </section>
      ) : !status ? (
        <section className="empty-dashboard glass-card">
          <h3>No release status available</h3>
          <p className="muted">
            Release status may appear after policy and receiver setup.
          </p>
        </section>
      ) : (
        <>
          <section className="metric-grid receiver-metrics">
            <MetricCard label="Assigned Receivers" value={assignedReceivers.length} />
            <MetricCard label="Access Grants" value={grants.length} />
            <MetricCard label="Acknowledgements" value={acknowledgements.length} />
          </section>

          <section className="release-status-grid">
            <StatusList
              title="Assigned Receivers"
              empty="No assigned receivers."
              items={assignedReceivers}
              renderItem={(item) => (
                <>
                  <div>
                    <h4>{item.name || item.receiverName || item.email}</h4>
                    <p className="muted">{item.email || item.receiverEmail}</p>
                  </div>
                  {item.status && <StatusPill status={item.status} />}
                </>
              )}
            />

            <StatusList
              title="Access Grants"
              empty="No access grants created yet."
              items={grants}
              renderItem={(item) => (
                <>
                  <div>
                    <h4>{item.receiverEmail || item.email || "Receiver grant"}</h4>
                    <p className="muted">
                      Granted {formatDateTime(item.grantedAt || item.createdAt)}
                    </p>
                  </div>
                  {item.status && <StatusPill status={item.status} />}
                </>
              )}
            />

            <StatusList
              title="Acknowledgements"
              empty="No acknowledgements yet."
              items={acknowledgements}
              renderItem={(item) => (
                <>
                  <div>
                    <h4>{item.receiverEmail || item.email || "Acknowledgement"}</h4>
                    <p className="muted">
                      {item.message || "No message."} ·{" "}
                      {formatDateTime(item.createdAt || item.acknowledgedAt)}
                    </p>
                  </div>
                  <ShieldCheck size={18} />
                </>
              )}
            />
          </section>
        </>
      )}
    </AppLayout>
  );
}

function MetricCard({ label, value }) {
  return (
    <article className="metric-card glass-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p className="muted">Backend release data</p>
    </article>
  );
}

function StatusList({ title, empty, items, renderItem }) {
  return (
    <section className="glass-card status-list-panel">
      <h3>{title}</h3>

      {items.length === 0 ? (
        <p className="muted">{empty}</p>
      ) : (
        <div className="status-list">
          {items.map((item, index) => (
            <article className="status-list-row" key={item.id || item.grantId || index}>
              {renderItem(item)}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
