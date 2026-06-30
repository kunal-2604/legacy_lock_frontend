import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileLock2, Save, ShieldAlert, UsersRound, Zap } from "lucide-react";
import { toast } from "sonner";

import AppLayout from "../../layouts/AppLayout.jsx";
import StatusPill from "../../components/ui/StatusPill.jsx";
import SubmitButton from "../../components/ui/SubmitButton.jsx";
import FileUploadPanel from "../../components/files/FileUploadPanel.jsx";
import FileListPanel from "../../components/files/FileListPanel.jsx";
import AssignReceiversPanel from "../../components/receiver/AssignReceiversPanel.jsx";
import ReleasePolicyPanel from "../../components/release/ReleasePolicyPanel.jsx";
import ReminderTimeline from "../../components/release/ReminderTimeline.jsx";
import { capsuleApi } from "../../api/capsuleApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";
import { formatDateTime } from "../../utils/dateUtils.js";

const tabs = ["Overview", "Content", "Files", "Receivers", "Release Policy"];

export default function CapsuleDetailPage() {
  const { capsuleId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Overview");
  const [capsule, setCapsule] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [fileRefreshKey, setFileRefreshKey] = useState(0);

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadCapsule() {
    setLoading(true);

    try {
      const response = await capsuleApi.get(capsuleId);
      const data = response.data;

      setCapsule(data);
      setForm({
        title: data.title || "",
        description: data.description || "",
        content: data.content || "",
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load capsule."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCapsule();
  }, [capsuleId]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleUpdate(event) {
    event.preventDefault();

    setSaving(true);

    try {
      await capsuleApi.update(capsuleId, form);
      toast.success("Capsule updated.");
      loadCapsule();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update capsule."));
    } finally {
      setSaving(false);
    }
  }

  async function handleActivate() {
    try {
      await capsuleApi.activate(capsuleId);
      toast.success("Capsule activated.");
      loadCapsule();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to activate capsule."));
    }
  }

  const isDraft = String(capsule?.status || "").toUpperCase() === "DRAFT";

  return (
    <AppLayout>
      <section className="page-heading-row">
        <div>
          <p className="eyebrow">Capsule Detail</p>
          <h2>{loading ? "Loading capsule..." : capsule?.title || "Untitled Capsule"}</h2>
          <p className="muted">
            Manage content, encrypted files, assigned receivers, release policy, and reminders.
          </p>
        </div>

        <div className="card-actions">
          <button className="glass-button ghost" onClick={() => navigate("/owner/capsules")}>
            <ArrowLeft size={17} />
            Capsules
          </button>

          <Link
            className="glass-button secondary"
            to={`/owner/capsules/${capsuleId}/release-status`}
          >
            <ShieldAlert size={17} />
            Release Status
          </Link>
        </div>
      </section>

      {loading ? (
        <section className="empty-dashboard glass-card">
          <h3>Loading secure capsule...</h3>
        </section>
      ) : !capsule ? (
        <section className="empty-dashboard glass-card">
          <h3>Capsule not found</h3>
          <p className="muted">The capsule may have been removed or is unavailable.</p>
        </section>
      ) : (
        <>
          <section className="detail-summary-grid">
            <article className="glass-card detail-summary-card">
              <span>Status</span>
              <StatusPill status={capsule.status || "DRAFT"} />
            </article>

            <article className="glass-card detail-summary-card">
              <span>Created</span>
              <strong>{formatDateTime(capsule.createdAt)}</strong>
            </article>

            <article className="glass-card detail-summary-card">
              <span>Updated</span>
              <strong>{formatDateTime(capsule.updatedAt)}</strong>
            </article>
          </section>

          <section className="tab-bar glass-card">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </section>

          {activeTab === "Overview" && (
            <section className="overview-grid">
              <article className="glass-card overview-card">
                <div className="empty-icon">
                  <FileLock2 size={30} />
                </div>
                <h3>{capsule.title}</h3>
                <p className="muted">{capsule.description || "No description added."}</p>
                <StatusPill status={capsule.status || "DRAFT"} />

                {isDraft && (
                  <button className="glass-button secondary" onClick={handleActivate}>
                    <Zap size={16} />
                    Activate Capsule
                  </button>
                )}
              </article>

              <article className="glass-card overview-card">
                <div className="empty-icon">
                  <UsersRound size={30} />
                </div>
                <h3>Next setup steps</h3>
                <p className="muted">
                  Upload files, assign receivers, create a release policy, then track release status.
                </p>

                <div className="setup-step-list">
                  <span>1. Add encrypted files</span>
                  <span>2. Assign receivers</span>
                  <span>3. Configure release policy</span>
                  <span>4. Monitor reminders</span>
                </div>
              </article>

              <ReminderTimeline policy={policy} />
            </section>
          )}

          {activeTab === "Content" && (
            <section className="editor-shell glass-card">
              <div className="editor-side">
                <h3>Capsule content</h3>
                <p className="muted">
                  Draft capsules can be edited. Active or released capsules may be restricted by backend rules.
                </p>

                {isDraft && (
                  <button className="glass-button secondary" onClick={handleActivate}>
                    <Zap size={16} />
                    Activate Capsule
                  </button>
                )}
              </div>

              <form className="auth-form editor-form" onSubmit={handleUpdate}>
                <label className="form-field">
                  <span>Title</span>
                  <input
                    className="glass-input"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                  />
                </label>

                <label className="form-field">
                  <span>Description</span>
                  <textarea
                    className="glass-input glass-textarea"
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                </label>

                <label className="form-field">
                  <span>Private content</span>
                  <textarea
                    className="glass-input glass-textarea large"
                    value={form.content}
                    onChange={(e) => updateField("content", e.target.value)}
                  />
                </label>

                <SubmitButton loading={saving}>
                  <Save size={17} />
                  {saving ? "Saving..." : "Save Changes"}
                </SubmitButton>
              </form>
            </section>
          )}

          {activeTab === "Files" && (
            <section className="split-grid">
              <FileUploadPanel
                capsuleId={capsuleId}
                onUploaded={() => setFileRefreshKey((prev) => prev + 1)}
              />
              <FileListPanel capsuleId={capsuleId} refreshKey={fileRefreshKey} />
            </section>
          )}

          {activeTab === "Receivers" && (
            <AssignReceiversPanel capsuleId={capsuleId} />
          )}

          {activeTab === "Release Policy" && (
            <section className="split-grid">
              <ReleasePolicyPanel capsuleId={capsuleId} onPolicyChange={setPolicy} />
              <ReminderTimeline policy={policy} />
            </section>
          )}
        </>
      )}
    </AppLayout>
  );
}
