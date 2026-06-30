import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileLock2 } from "lucide-react";
import { toast } from "sonner";

import AppLayout from "../../layouts/AppLayout.jsx";
import FormField from "../../components/ui/FormField.jsx";
import SubmitButton from "../../components/ui/SubmitButton.jsx";
import { capsuleApi } from "../../api/capsuleApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";

export default function NewCapsulePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title || !form.content) {
      toast.error("Title and content are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await capsuleApi.create(form);
      toast.success("Capsule created.");

      const capsuleId = response.data?.id || response.data?.capsuleId;
      navigate(capsuleId ? `/owner/capsules/${capsuleId}` : "/owner/capsules");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create capsule."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <section className="page-heading-row">
        <div>
          <p className="eyebrow">New Capsule</p>
          <h2>Create private capsule</h2>
          <p className="muted">
            Add the message or information you want to protect. Files and receivers can be added after creation.
          </p>
        </div>

        <button className="glass-button ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={17} />
          Back
        </button>
      </section>

      <section className="editor-shell glass-card">
        <div className="editor-side">
          <div className="secure-orb auth-orb">
            <FileLock2 size={36} />
          </div>
          <h3>Draft capsule</h3>
          <p className="muted">
            Write clear information so your receivers understand what matters when the time comes.
          </p>
        </div>

        <form className="auth-form editor-form" onSubmit={handleSubmit}>
          <FormField
            label="Title"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Family documents, emergency note, final instructions..."
            required
          />

          <label className="form-field">
            <span>Description</span>
            <textarea
              className="glass-input glass-textarea"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Short explanation for this capsule"
            />
          </label>

          <label className="form-field">
            <span>Private content</span>
            <textarea
              className="glass-input glass-textarea large"
              value={form.content}
              onChange={(e) => updateField("content", e.target.value)}
              placeholder="Write the secure content you want to protect..."
              required
            />
          </label>

          <SubmitButton loading={loading}>
            {loading ? "Creating capsule..." : "Create Capsule"}
          </SubmitButton>
        </form>
      </section>
    </AppLayout>
  );
}
