import { useEffect, useState } from "react";
import { CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import AppLayout from "../../layouts/AppLayout.jsx";
import SubmitButton from "../../components/ui/SubmitButton.jsx";
import { checkInApi } from "../../api/checkInApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";
import { formatDateTime } from "../../utils/dateUtils.js";

export default function CheckInsPage() {
  const [note, setNote] = useState("");
  const [checkIns, setCheckIns] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  async function loadData() {
    setLoading(true);

    try {
      const [listResponse, latestResponse] = await Promise.allSettled([
        checkInApi.list(),
        checkInApi.latest(),
      ]);

      if (listResponse.status === "fulfilled") {
        setCheckIns(Array.isArray(listResponse.value.data) ? listResponse.value.data : []);
      }

      if (latestResponse.status === "fulfilled") {
        setLatest(latestResponse.value.data || null);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load check-ins."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCheckIn(event) {
    event.preventDefault();

    setCheckingIn(true);

    try {
      await checkInApi.create(note ? { note } : {});
      toast.success("Check-in recorded.");
      setNote("");
      loadData();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to check in."));
    } finally {
      setCheckingIn(false);
    }
  }

  return (
    <AppLayout>
      <section className="dashboard-hero glass-card">
        <div>
          <p className="eyebrow">Owner Check-in</p>
          <h2>Keep your inactivity timeline safe</h2>
          <p className="muted">
            A check-in confirms you are active and helps prevent unintended capsule release.
          </p>
        </div>

        <div className="hero-security-card">
          <Clock size={20} />
          Latest: {formatDateTime(latest?.createdAt || latest?.checkInAt)}
        </div>
      </section>

      <section className="split-grid">
        <form className="glass-card receiver-form-card auth-form" onSubmit={handleCheckIn}>
          <div className="empty-icon">
            <CheckCircle2 size={30} />
          </div>

          <div>
            <p className="eyebrow">Quick Check-in</p>
            <h3>Confirm activity</h3>
            <p className="muted">
              You can add an optional note, or submit an empty check-in.
            </p>
          </div>

          <label className="form-field">
            <span>Optional note</span>
            <textarea
              className="glass-input glass-textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Still active. No release needed."
            />
          </label>

          <SubmitButton loading={checkingIn}>
            {checkingIn ? "Checking in..." : "Check In Now"}
          </SubmitButton>
        </form>

        <section>
          <div className="toolbar glass-card">
            <div>
              <p className="eyebrow">History</p>
              <h3>Recent check-ins</h3>
            </div>

            <button className="glass-button ghost" onClick={loadData}>
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {loading ? (
            <section className="empty-dashboard glass-card">
              <h3>Loading check-ins...</h3>
            </section>
          ) : checkIns.length === 0 ? (
            <section className="empty-dashboard glass-card">
              <h3>No check-ins yet</h3>
              <p className="muted">Your check-in history will appear here.</p>
            </section>
          ) : (
            <div className="timeline-list">
              {checkIns.map((item) => (
                <article className="timeline-item glass-card" key={item.id || item.checkInId || item.createdAt}>
                  <div className="timeline-dot" />
                  <div>
                    <h3>{formatDateTime(item.createdAt || item.checkInAt)}</h3>
                    <p className="muted">{item.note || "No note added."}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </AppLayout>
  );
}
