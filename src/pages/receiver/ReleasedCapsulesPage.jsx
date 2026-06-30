import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Inbox, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import AppLayout from "../../layouts/AppLayout.jsx";
import StatusPill from "../../components/ui/StatusPill.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { GridSkeleton } from "../../components/ui/Skeleton.jsx";
import { receiverCapsuleApi } from "../../api/receiverCapsuleApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";
import { formatDateTime } from "../../utils/dateUtils.js";

export default function ReleasedCapsulesPage() {
  const [capsules, setCapsules] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadCapsules() {
    setLoading(true);

    try {
      const response = await receiverCapsuleApi.listReleasedCapsules();
      setCapsules(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load released capsules."));
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
      `${capsule.title || ""} ${capsule.description || ""} ${capsule.ownerEmail || ""} ${capsule.ownerName || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [capsules, query]);

  return (
    <AppLayout>
      <section className="page-heading-row">
        <div>
          <p className="eyebrow">Receiver Inbox</p>
          <h2>Released capsules</h2>
          <p className="muted">
            Capsules released to your email appear here. Open one to view decrypted content and files.
          </p>
        </div>
      </section>

      <section className="toolbar glass-card">
        <div className="search-box">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search released capsules..."
          />
        </div>

        <button className="glass-button ghost" type="button" onClick={loadCapsules}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </section>

      {loading ? (
        <GridSkeleton count={6} />
      ) : filteredCapsules.length === 0 ? (
        <EmptyState
          icon={<Inbox size={34} />}
          eyebrow="Receiver Inbox"
          title="No released capsules yet"
          text="Access appears only after an owner releases a capsule to your registered email."
        />
      ) : (
        <section className="receiver-capsule-grid">
          {filteredCapsules.map((capsule) => {
            const capsuleId = capsule.id || capsule.capsuleId;
            const accessGrantId = capsule.accessGrantId || capsule.grantId;

            return (
              <article className="receiver-capsule-card glass-card glass-card-hover" key={capsuleId}>
                <div className="capsule-card-top">
                  <div className="capsule-icon receiver-icon">
                    <ShieldCheck size={22} />
                  </div>

                  <StatusPill status={capsule.status || capsule.grantStatus || "RELEASED"} />
                </div>

                <h3>{capsule.title || "Released Capsule"}</h3>
                <p className="muted">
                  {capsule.description || "No description provided."}
                </p>

                <div className="receiver-capsule-meta">
                  <div>
                    <span>Owner</span>
                    <strong>{capsule.ownerName || capsule.ownerEmail || "Owner"}</strong>
                  </div>

                  <div>
                    <span>Granted</span>
                    <strong>{formatDateTime(capsule.grantedAt || capsule.releasedAt || capsule.createdAt)}</strong>
                  </div>
                </div>

                <Link
                  className="glass-button primary"
                  to={`/receiver/capsules/${capsuleId}`}
                  state={{ accessGrantId }}
                >
                  <Eye size={16} />
                  Open Capsule
                </Link>
              </article>
            );
          })}
        </section>
      )}
    </AppLayout>
  );
}
