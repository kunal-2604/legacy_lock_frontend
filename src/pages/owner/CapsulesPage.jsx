import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileLock2, Plus, RefreshCw, Search, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";

import AppLayout from "../../layouts/AppLayout.jsx";
import StatusPill from "../../components/ui/StatusPill.jsx";
import { capsuleApi } from "../../api/capsuleApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";
import { formatDate } from "../../utils/dateUtils.js";

export default function CapsulesPage() {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  async function loadCapsules() {
    setLoading(true);

    try {
      const response = await capsuleApi.list();
      setCapsules(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load capsules."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCapsules();
  }, []);

  const filteredCapsules = useMemo(() => {
    const q = query.toLowerCase().trim();

    if (!q) return capsules;

    return capsules.filter((capsule) =>
      `${capsule.title || ""} ${capsule.description || ""} ${capsule.status || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [capsules, query]);

  async function handleActivate(capsuleId) {
    try {
      await capsuleApi.activate(capsuleId);
      toast.success("Capsule activated.");
      loadCapsules();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to activate capsule."));
    }
  }

  async function handleDelete(capsuleId) {
    const confirmed = window.confirm("Delete this capsule? This action cannot be undone.");

    if (!confirmed) return;

    try {
      await capsuleApi.remove(capsuleId);
      toast.success("Capsule deleted.");
      loadCapsules();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete capsule."));
    }
  }

  return (
    <AppLayout>
      <section className="page-heading-row">
        <div>
          <p className="eyebrow">Owner Workspace</p>
          <h2>Capsules</h2>
          <p className="muted">
            Create encrypted capsules, activate them, and prepare them for receivers.
          </p>
        </div>

        <Link to="/owner/capsules/new" className="glass-button primary">
          <Plus size={17} />
          New Capsule
        </Link>
      </section>

      <section className="toolbar glass-card">
        <div className="search-box">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search capsules..."
          />
        </div>

        <button className="glass-button ghost" onClick={loadCapsules}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </section>

      {loading ? (
        <section className="empty-dashboard glass-card">
          <h3>Loading capsules...</h3>
          <p className="muted">Fetching your secure capsule list.</p>
        </section>
      ) : filteredCapsules.length === 0 ? (
        <section className="empty-dashboard glass-card">
          <div className="empty-icon">
            <FileLock2 size={34} />
          </div>
          <h3>No capsules found</h3>
          <p className="muted">
            Create your first capsule to store encrypted legacy content.
          </p>
          <Link to="/owner/capsules/new" className="glass-button primary">
            Create Capsule
          </Link>
        </section>
      ) : (
        <section className="capsule-grid">
          {filteredCapsules.map((capsule) => (
            <article className="capsule-card glass-card glass-card-hover" key={capsule.id || capsule.capsuleId}>
              <div className="capsule-card-top">
                <div className="capsule-icon">
                  <FileLock2 size={22} />
                </div>
                <StatusPill status={capsule.status || "DRAFT"} />
              </div>

              <h3>{capsule.title || "Untitled Capsule"}</h3>
              <p className="muted">
                {capsule.description || "No description added yet."}
              </p>

              <div className="capsule-meta">
                <span>Created</span>
                <strong>{formatDate(capsule.createdAt)}</strong>
              </div>

              <div className="card-actions">
                <Link
                  className="glass-button ghost"
                  to={`/owner/capsules/${capsule.id || capsule.capsuleId}`}
                >
                  Open
                </Link>

                {String(capsule.status).toUpperCase() === "DRAFT" && (
                  <button
                    className="glass-button secondary"
                    onClick={() => handleActivate(capsule.id || capsule.capsuleId)}
                  >
                    <Zap size={15} />
                    Activate
                  </button>
                )}

                <button
                  className="icon-danger-button"
                  onClick={() => handleDelete(capsule.id || capsule.capsuleId)}
                  title="Delete capsule"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </AppLayout>
  );
}
