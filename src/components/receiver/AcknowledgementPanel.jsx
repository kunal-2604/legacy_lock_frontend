import { useEffect, useState } from "react";
import { CheckCircle2, MessageSquareText, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import SubmitButton from "../ui/SubmitButton.jsx";
import { receiverCapsuleApi } from "../../api/receiverCapsuleApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";
import { formatDateTime } from "../../utils/dateUtils.js";

export default function AcknowledgementPanel({ accessGrantId }) {
  const [acknowledgement, setAcknowledgement] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(Boolean(accessGrantId));
  const [saving, setSaving] = useState(false);

  async function loadAcknowledgement() {
    if (!accessGrantId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await receiverCapsuleApi.getAcknowledgement(accessGrantId);
      setAcknowledgement(response.data || null);
    } catch {
      setAcknowledgement(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAcknowledgement();
  }, [accessGrantId]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!accessGrantId) {
      toast.error("Access grant id is missing.");
      return;
    }

    setSaving(true);

    try {
      const response = await receiverCapsuleApi.acknowledge(accessGrantId, {
        message,
      });

      setAcknowledgement(response.data || { message, createdAt: new Date().toISOString() });
      setMessage("");
      toast.success("Acknowledgement submitted.");
      loadAcknowledgement();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to submit acknowledgement."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="glass-card receiver-detail-panel">
      <div className="panel-heading-row">
        <div>
          <p className="eyebrow">Acknowledgement</p>
          <h3>Confirm receipt</h3>
          <p className="muted">
            Let the owner record that you have received and viewed this capsule.
          </p>
        </div>

        <button className="glass-button ghost" type="button" onClick={loadAcknowledgement}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="muted">Checking acknowledgement status...</p>
      ) : acknowledgement ? (
        <div className="ack-success-box">
          <div className="auth-success-icon">
            <CheckCircle2 size={34} />
          </div>

          <div>
            <h4>Receipt acknowledged</h4>
            <p className="muted">
              {formatDateTime(
                acknowledgement.createdAt ||
                  acknowledgement.acknowledgedAt ||
                  acknowledgement.updatedAt
              )}
            </p>

            {acknowledgement.message && (
              <blockquote>{acknowledgement.message}</blockquote>
            )}
          </div>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Optional message</span>
            <textarea
              className="glass-input glass-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="I have received and read this capsule."
            />
          </label>

          <SubmitButton loading={saving}>
            <MessageSquareText size={17} />
            {saving ? "Submitting..." : "Acknowledge Receipt"}
          </SubmitButton>
        </form>
      )}
    </section>
  );
}
