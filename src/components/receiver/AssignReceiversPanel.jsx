import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCw, Trash2, UserRoundPlus } from "lucide-react";
import { toast } from "sonner";

import ConfirmModal from "../ui/ConfirmModal.jsx";
import PageLoader from "../ui/PageLoader.jsx";
import { capsuleApi } from "../../api/capsuleApi.js";
import { receiverApi } from "../../api/receiverApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";

export default function AssignReceiversPanel({ capsuleId }) {
  const [allReceivers, setAllReceivers] = useState([]);
  const [assignedReceivers, setAssignedReceivers] = useState([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [receiverToRemove, setReceiverToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);

  async function loadData() {
    setLoading(true);

    try {
      const [allResponse, assignedResponse] = await Promise.all([
        receiverApi.list(),
        capsuleApi.listAssignedReceivers(capsuleId),
      ]);

      setAllReceivers(Array.isArray(allResponse.data) ? allResponse.data : []);
      setAssignedReceivers(
        Array.isArray(assignedResponse.data) ? assignedResponse.data : []
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load receiver assignments."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [capsuleId]);

  const assignedIds = useMemo(() => {
    return new Set(
      assignedReceivers.map((receiver) =>
        String(receiver.id || receiver.receiverId)
      )
    );
  }, [assignedReceivers]);

  const availableReceivers = allReceivers.filter(
    (receiver) => !assignedIds.has(String(receiver.id || receiver.receiverId))
  );

  async function handleAssign(event) {
    event.preventDefault();

    if (!selectedReceiverId) {
      toast.error("Select a receiver first.");
      return;
    }

    setAssigning(true);

    try {
      await capsuleApi.assignReceiver(capsuleId, selectedReceiverId);
      toast.success("Receiver assigned.");
      setSelectedReceiverId("");
      loadData();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to assign receiver."));
    } finally {
      setAssigning(false);
    }
  }

  async function handleRemoveConfirmed() {
    if (!receiverToRemove) return;

    const receiverId = receiverToRemove.id || receiverToRemove.receiverId;
    setRemoving(true);

    try {
      await capsuleApi.removeAssignedReceiver(capsuleId, receiverId);
      toast.success("Receiver removed from capsule.");
      setReceiverToRemove(null);
      loadData();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to remove assignment."));
    } finally {
      setRemoving(false);
    }
  }

  return (
    <section className="glass-card assignment-panel">
      <div className="panel-heading-row">
        <div>
          <p className="eyebrow">Receiver Assignment</p>
          <h3>Assign trusted receivers</h3>
        </div>

        <button className="glass-button ghost" type="button" onClick={loadData}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <PageLoader title="Loading receiver data..." text="Checking receiver assignments." />
      ) : (
        <>
          <form className="assign-form" onSubmit={handleAssign}>
            {allReceivers.length === 0 ? (
              <div className="inline-alert warning">
                No receiver contacts available.{" "}
                <Link to="/owner/receivers">Add a receiver first.</Link>
              </div>
            ) : availableReceivers.length === 0 ? (
              <div className="inline-alert warning">
                All receiver contacts are already assigned to this capsule.
              </div>
            ) : (
              <>
                <select
                  className="glass-input"
                  value={selectedReceiverId}
                  onChange={(e) => setSelectedReceiverId(e.target.value)}
                >
                  <option value="">Select receiver</option>
                  {availableReceivers.map((receiver) => {
                    const receiverId = receiver.id || receiver.receiverId;

                    return (
                      <option key={receiverId} value={receiverId}>
                        {receiver.name} — {receiver.email}
                      </option>
                    );
                  })}
                </select>

                <button className="glass-button primary" type="submit" disabled={assigning}>
                  <Plus size={16} />
                  {assigning ? "Assigning..." : "Assign"}
                </button>
              </>
            )}
          </form>

          {assignedReceivers.length === 0 ? (
            <div className="mini-empty">
              <UserRoundPlus size={28} />
              <h4>No receivers assigned</h4>
              <p className="muted">Assign at least one receiver before release.</p>
            </div>
          ) : (
            <div className="assigned-list">
              {assignedReceivers.map((receiver) => {
                const receiverId = receiver.id || receiver.receiverId;

                return (
                  <article className="assigned-row" key={receiverId}>
                    <div className="receiver-avatar">
                      {(receiver.name || receiver.email || "R").charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h4>{receiver.name || "Unnamed Receiver"}</h4>
                      <p className="muted">{receiver.email}</p>
                    </div>

                    <button
                      className="icon-danger-button"
                      type="button"
                      onClick={() => setReceiverToRemove(receiver)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      <ConfirmModal
        open={Boolean(receiverToRemove)}
        title="Remove receiver from capsule?"
        text={`This removes ${
          receiverToRemove?.name || receiverToRemove?.email || "this receiver"
        } from this capsule assignment.`}
        confirmText="Remove Assignment"
        loading={removing}
        onClose={() => setReceiverToRemove(null)}
        onConfirm={handleRemoveConfirmed}
      />
    </section>
  );
}
