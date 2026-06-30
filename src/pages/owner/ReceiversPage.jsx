import { useEffect, useMemo, useState } from "react";
import { Mail, Phone, Plus, RefreshCw, Search, Trash2, UserRoundPlus } from "lucide-react";
import { toast } from "sonner";

import AppLayout from "../../layouts/AppLayout.jsx";
import FormField from "../../components/ui/FormField.jsx";
import SubmitButton from "../../components/ui/SubmitButton.jsx";
import { receiverApi } from "../../api/receiverApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";

export default function ReceiversPage() {
  const [receivers, setReceivers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  async function loadReceivers() {
    setLoading(true);

    try {
      const response = await receiverApi.list();
      setReceivers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load receivers."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReceivers();
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate(event) {
    event.preventDefault();

    if (!form.name || !form.email) {
      toast.error("Name and email are required.");
      return;
    }

    setSaving(true);

    try {
      await receiverApi.create(form);
      toast.success("Receiver added.");
      setForm({ name: "", email: "", phone: "" });
      loadReceivers();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to add receiver."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(receiverId) {
    const confirmed = window.confirm("Remove this receiver contact?");

    if (!confirmed) return;

    try {
      await receiverApi.remove(receiverId);
      toast.success("Receiver removed.");
      loadReceivers();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to remove receiver."));
    }
  }

  const filteredReceivers = useMemo(() => {
    const q = query.toLowerCase().trim();

    if (!q) return receivers;

    return receivers.filter((receiver) =>
      `${receiver.name || ""} ${receiver.email || ""} ${receiver.phone || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [receivers, query]);

  return (
    <AppLayout>
      <section className="page-heading-row">
        <div>
          <p className="eyebrow">Owner Workspace</p>
          <h2>Receivers</h2>
          <p className="muted">
            Add trusted contacts who can receive released capsules.
          </p>
        </div>
      </section>

      <section className="split-grid">
        <form className="glass-card receiver-form-card auth-form" onSubmit={handleCreate}>
          <div>
            <p className="eyebrow">Add Receiver</p>
            <h3>Trusted contact</h3>
          </div>

          <FormField
            label="Name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Receiver name"
            required
          />

          <FormField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="receiver@example.com"
            required
          />

          <FormField
            label="Phone"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="Optional phone number"
          />

          <SubmitButton loading={saving}>
            <Plus size={17} />
            {saving ? "Adding..." : "Add Receiver"}
          </SubmitButton>
        </form>

        <section className="receiver-list-section">
          <div className="toolbar glass-card">
            <div className="search-box">
              <Search size={17} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search receivers..."
              />
            </div>

            <button className="glass-button ghost" onClick={loadReceivers}>
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {loading ? (
            <section className="empty-dashboard glass-card">
              <h3>Loading receivers...</h3>
            </section>
          ) : filteredReceivers.length === 0 ? (
            <section className="empty-dashboard glass-card">
              <div className="empty-icon">
                <UserRoundPlus size={34} />
              </div>
              <h3>No receivers found</h3>
              <p className="muted">Add your first trusted receiver contact.</p>
            </section>
          ) : (
            <div className="receiver-list">
              {filteredReceivers.map((receiver) => (
                <article className="receiver-card glass-card" key={receiver.id || receiver.receiverId}>
                  <div className="receiver-avatar">
                    {(receiver.name || receiver.email || "R").charAt(0).toUpperCase()}
                  </div>

                  <div className="receiver-info">
                    <h3>{receiver.name || "Unnamed Receiver"}</h3>
                    <p>
                      <Mail size={14} />
                      {receiver.email}
                    </p>
                    {receiver.phone && (
                      <p>
                        <Phone size={14} />
                        {receiver.phone}
                      </p>
                    )}
                  </div>

                  <button
                    className="icon-danger-button"
                    onClick={() => handleDelete(receiver.id || receiver.receiverId)}
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </AppLayout>
  );
}
