import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarClock, FileText, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";

import AppLayout from "../../layouts/AppLayout.jsx";
import StatusPill from "../../components/ui/StatusPill.jsx";
import ReceiverFilesPanel from "../../components/receiver/ReceiverFilesPanel.jsx";
import AcknowledgementPanel from "../../components/receiver/AcknowledgementPanel.jsx";
import { receiverCapsuleApi } from "../../api/receiverCapsuleApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";
import { formatDateTime } from "../../utils/dateUtils.js";

export default function ReceiverCapsuleDetailPage() {
  const { capsuleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadCapsule() {
    setLoading(true);

    try {
      const response = await receiverCapsuleApi.getCapsule(capsuleId);
      setCapsule(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load released capsule."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCapsule();
  }, [capsuleId]);

  const accessGrantId = useMemo(() => {
    return (
      capsule?.accessGrantId ||
      capsule?.grantId ||
      capsule?.accessGrant?.id ||
      capsule?.accessGrant?.accessGrantId ||
      location.state?.accessGrantId ||
      ""
    );
  }, [capsule, location.state]);

  return (
    <AppLayout>
      <section className="page-heading-row">
        <div>
          <p className="eyebrow">Receiver Inbox</p>
          <h2>{loading ? "Loading capsule..." : capsule?.title || "Released Capsule"}</h2>
          <p className="muted">
            View decrypted capsule content, download files, and acknowledge receipt.
          </p>
        </div>

        <button className="glass-button ghost" onClick={() => navigate("/receiver/capsules")}>
          <ArrowLeft size={17} />
          Inbox
        </button>
      </section>

      {loading ? (
        <section className="empty-dashboard glass-card">
          <h3>Loading released capsule...</h3>
          <p className="muted">Fetching decrypted receiver access.</p>
        </section>
      ) : !capsule ? (
        <section className="empty-dashboard glass-card">
          <h3>Capsule unavailable</h3>
          <p className="muted">
            This capsule may not be released to your email or access may have changed.
          </p>
          <Link to="/receiver/capsules" className="glass-button primary">
            Back to inbox
          </Link>
        </section>
      ) : (
        <>
          <section className="receiver-detail-summary">
            <article className="glass-card detail-summary-card">
              <span>Status</span>
              <StatusPill status={capsule.status || capsule.grantStatus || "RELEASED"} />
            </article>

            <article className="glass-card detail-summary-card">
              <span>Owner</span>
              <strong>{capsule.ownerName || capsule.ownerEmail || "Owner"}</strong>
            </article>

            <article className="glass-card detail-summary-card">
              <span>Granted</span>
              <strong>
                {formatDateTime(capsule.grantedAt || capsule.releasedAt || capsule.createdAt)}
              </strong>
            </article>
          </section>

          <section className="receiver-detail-grid">
            <article className="glass-card receiver-content-panel">
              <div className="receiver-content-header">
                <div className="empty-icon">
                  <FileText size={30} />
                </div>

                <div>
                  <p className="eyebrow">Decrypted Content</p>
                  <h3>{capsule.title || "Released Capsule"}</h3>
                  <p className="muted">{capsule.description || "No description provided."}</p>
                </div>
              </div>

              <div className="receiver-content-box">
                {capsule.content || capsule.decryptedContent || "No content available."}
              </div>

              <div className="receiver-content-meta">
                <div>
                  <UserRound size={16} />
                  <span>{capsule.ownerEmail || "Owner email unavailable"}</span>
                </div>

                <div>
                  <CalendarClock size={16} />
                  <span>
                    {formatDateTime(capsule.grantedAt || capsule.releasedAt || capsule.createdAt)}
                  </span>
                </div>

                <div>
                  <ShieldCheck size={16} />
                  <span>Secure receiver access</span>
                </div>
              </div>
            </article>

            <div className="receiver-side-stack">
              <AcknowledgementPanel accessGrantId={accessGrantId} />
              <ReceiverFilesPanel capsuleId={capsuleId} />
            </div>
          </section>
        </>
      )}
    </AppLayout>
  );
}
