import { useEffect, useState } from "react";
import { Pause, Play, RefreshCw, Save, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import SubmitButton from "../ui/SubmitButton.jsx";
import StatusPill from "../ui/StatusPill.jsx";
import { releaseApi } from "../../api/releaseApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";

export default function ReleasePolicyPanel({ capsuleId, onPolicyChange }) {
  const [policy, setPolicy] = useState(null);
  const [form, setForm] = useState({
    inactivityDays: 30,
    graceDays: 7,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadPolicy() {
    setLoading(true);

    try {
      const response = await releaseApi.getPolicy(capsuleId);
      const data = response.data;

      setPolicy(data);
      setForm({
        inactivityDays: data.inactivityDays || 30,
        graceDays: data.graceDays ?? 7,
      });

      onPolicyChange?.(data);
    } catch {
      setPolicy(null);
      onPolicyChange?.(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPolicy();
  }, [capsuleId]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: Number(value) }));
  }

  async function handleSave(event) {
    event.preventDefault();

    if (form.inactivityDays < 0) {
      toast.error("Inactivity days must be at least 1.");
      return;
    }

    if (form.graceDays < 0) {
      toast.error("Grace days cannot be negative.");
      return;
    }

    setSaving(true);

    try {
      const response = policy
        ? await releaseApi.updatePolicy(capsuleId, form)
        : await releaseApi.createPolicy(capsuleId, form);

      setPolicy(response.data);
      onPolicyChange?.(response.data);
      toast.success(policy ? "Release policy updated." : "Release policy created.");
      loadPolicy();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save release policy."));
    } finally {
      setSaving(false);
    }
  }

  async function handlePause() {
    try {
      await releaseApi.pausePolicy(capsuleId);
      toast.success("Release policy paused.");
      loadPolicy();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to pause policy."));
    }
  }

  async function handleActivate() {
    try {
      await releaseApi.activatePolicy(capsuleId);
      toast.success("Release policy activated.");
      loadPolicy();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to activate policy."));
    }
  }

  return (
    <section className="glass-card release-policy-panel">
      <div className="panel-heading-row">
        <div>
          <p className="eyebrow">Release Policy</p>
          <h3>Inactivity-based release</h3>
        </div>

        <button className="glass-button ghost" type="button" onClick={loadPolicy}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="muted">Loading release policy...</p>
      ) : (
        <>
          <div className="policy-status-row">
            <div className="empty-icon">
              <ShieldAlert size={28} />
            </div>

            <div>
              <h4>{policy ? "Policy configured" : "No policy yet"}</h4>
              <p className="muted">
                {policy
                  ? "Reminders and access sharing are ready for this capsule."
                  : "Create a policy to decide when access should be shared."}
              </p>
            </div>

            {policy?.status && <StatusPill status={policy.status} />}
          </div>

          <form className="policy-form" onSubmit={handleSave}>
            <label className="form-field">
              <span>Days without check-in</span>
              <input
                className="glass-input"
                type="number"
                min="0"
                value={form.inactivityDays}
                onChange={(e) => updateField("inactivityDays", e.target.value)}
              />
            </label>

            <label className="form-field">
              <span>Reminder period in days</span>
              <input
                className="glass-input"
                type="number"
                min="0"
                value={form.graceDays}
                onChange={(e) => updateField("graceDays", e.target.value)}
              />
            </label>

            <SubmitButton loading={saving}>
              <Save size={16} />
              {saving ? "Saving..." : policy ? "Update Policy" : "Create Policy"}
            </SubmitButton>
          </form>

          {policy && (
            <div className="policy-actions">
              <button className="glass-button ghost" type="button" onClick={handlePause}>
                <Pause size={16} />
                Pause
              </button>

              <button className="glass-button secondary" type="button" onClick={handleActivate}>
                <Play size={16} />
                Activate
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
