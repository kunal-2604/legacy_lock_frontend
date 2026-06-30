import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import AppLayout from "../../layouts/AppLayout.jsx";
import StatusPill from "../../components/ui/StatusPill.jsx";
import PageLoader from "../../components/ui/PageLoader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
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

  const receivers = useMemo(() => {
    return Array.isArray(status?.receivers) ? status.receivers : [];
  }, [status]);

  const accessGrantedReceivers = useMemo(() => {
    return receivers.filter((receiver) => receiver.accessGranted);
  }, [receivers]);

  const acknowledgedReceivers = useMemo(() => {
    return receivers.filter((receiver) => receiver.acknowledged);
  }, [receivers]);

  return (
    <AppLayout>
      <section className="page-heading-row">
        <div>
          <p className="eyebrow">Release Status</p>
          <h2>{status?.capsuleTitle || "Capsule release progress"}</h2>
          <p className="muted">
            Track receiver assignments, access grants, and receiver acknowledgements.
          </p>
        </div>

        <div className="card-actions">
          <button
            className="glass-button ghost"
            onClick={() => navigate(`/owner/capsules/${capsuleId}`)}
          >
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
        <PageLoader title="Loading release status..." text="Checking latest receiver release data." />
      ) : !status ? (
        <EmptyState title="No release status available" text="Release status may appear after policy and receiver setup." />
      ) : (
        <>
          <section className="metric-grid receiver-metrics">
            <MetricCard
              icon={<UserRound />}
              label="Assigned Receivers"
              value={status.totalAssignedReceivers ?? receivers.length}
              helper="Receivers attached to capsule"
            />

            <MetricCard
              icon={<ShieldCheck />}
              label="Access Grants"
              value={status.totalAccessGrants ?? accessGrantedReceivers.length}
              helper="Receivers with released access"
            />

            <MetricCard
              icon={<CheckCircle2 />}
              label="Acknowledged"
              value={status.totalAcknowledged ?? acknowledgedReceivers.length}
              helper="Receivers who confirmed receipt"
            />
          </section>

          <section className="release-status-grid-fixed">
            <section className="glass-card status-list-panel wide">
              <div className="panel-heading-row">
                <div>
                  <p className="eyebrow">Receiver Progress</p>
                  <h3>All assigned receivers</h3>
                </div>

                {status.capsuleStatus && <StatusPill status={status.capsuleStatus} />}
              </div>

              {receivers.length === 0 ? (
                <p className="muted">No receivers assigned to this capsule.</p>
              ) : (
                <div className="status-list">
                  {receivers.map((receiver) => (
                    <article
                      className="release-receiver-row"
                      key={receiver.receiverId}
                    >
                      <div className="receiver-avatar">
                        {(receiver.receiverName || receiver.receiverEmail || "R")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="release-receiver-main">
                        <h4>{receiver.receiverName || "Unnamed Receiver"}</h4>
                        <p className="muted">{receiver.receiverEmail}</p>

                        <div className="release-mini-meta">
                          <span>
                            Assigned: {formatDateTime(receiver.assignedAt)}
                          </span>

                          {receiver.accessGranted && (
                            <span>
                              Granted: {formatDateTime(receiver.grantedAt)}
                            </span>
                          )}

                          {receiver.acknowledged && (
                            <span>
                              Acknowledged:{" "}
                              {formatDateTime(receiver.acknowledgedAt)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="release-status-stack">
                        <StatusPill status={receiver.receiverStatus || "ACTIVE"} />

                        {receiver.accessGranted ? (
                          <span className="status-pill info">
                            Access Granted
                          </span>
                        ) : (
                          <span className="status-pill neutral">
                            Not Granted
                          </span>
                        )}

                        {receiver.acknowledged ? (
                          <span className="status-pill success">
                            Acknowledged
                          </span>
                        ) : (
                          <span className="status-pill warning">
                            Pending Ack
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="glass-card status-list-panel">
              <div className="panel-heading-row">
                <div>
                  <p className="eyebrow">Acknowledgements</p>
                  <h3>Receiver receipts</h3>
                </div>
              </div>

              {acknowledgedReceivers.length === 0 ? (
                <div className="mini-empty">
                  <Clock size={28} />
                  <h4>No acknowledgements yet</h4>
                  <p className="muted">
                    After a receiver submits acknowledgement, it will appear here.
                  </p>
                </div>
              ) : (
                <div className="ack-list">
                  {acknowledgedReceivers.map((receiver) => (
                    <article className="ack-row" key={receiver.acknowledgementId}>
                      <div className="auth-success-icon small">
                        <MessageSquareText size={22} />
                      </div>

                      <div>
                        <h4>{receiver.receiverName || receiver.receiverEmail}</h4>
                        <p className="muted">
                          {formatDateTime(receiver.acknowledgedAt)}
                        </p>

                        {receiver.acknowledgementMessage ? (
                          <blockquote>
                            {receiver.acknowledgementMessage}
                          </blockquote>
                        ) : (
                          <p className="muted">No message added.</p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </section>
        </>
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
