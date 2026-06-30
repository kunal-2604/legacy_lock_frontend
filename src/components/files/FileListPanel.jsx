import { useEffect, useState } from "react";
import { FileLock2, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

import ConfirmModal from "../ui/ConfirmModal.jsx";
import PageLoader from "../ui/PageLoader.jsx";
import { fileApi } from "../../api/fileApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";
import { formatDateTime } from "../../utils/dateUtils.js";

export default function FileListPanel({ capsuleId, refreshKey = 0 }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function loadFiles() {
    setLoading(true);

    try {
      const response = await fileApi.list(capsuleId);
      setFiles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load files."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFiles();
  }, [capsuleId, refreshKey]);

  async function handleDeleteConfirmed() {
    if (!fileToDelete) return;

    const fileId = fileToDelete.id || fileToDelete.fileId;
    setDeleting(true);

    try {
      await fileApi.remove(capsuleId, fileId);
      toast.success("File deleted.");
      setFileToDelete(null);
      loadFiles();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete file."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="glass-card files-panel">
      <div className="panel-heading-row">
        <div>
          <p className="eyebrow">Capsule Files</p>
          <h3>Attached files</h3>
        </div>

        <button className="glass-button ghost" type="button" onClick={loadFiles}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <PageLoader title="Loading files..." text="Preparing your capsule files." />
      ) : files.length === 0 ? (
        <div className="mini-empty">
          <FileLock2 size={28} />
          <h4>No files uploaded yet</h4>
          <p className="muted">Upload files before release setup.</p>
        </div>
      ) : (
        <div className="file-list">
          {files.map((file) => {
            const fileId = file.id || file.fileId;

            return (
              <article className="file-row" key={fileId}>
                <div className="file-row-icon">
                  <FileLock2 size={19} />
                </div>

                <div className="file-row-info">
                  <h4>{file.originalFilename || file.filename || "Secure file"}</h4>
                  <p className="muted">
                    Uploaded {formatDateTime(file.createdAt || file.uploadedAt)}
                  </p>
                </div>

                {file.encrypted && (
                  <span className="status-pill success">
                    <ShieldCheck size={13} />
                    Protected
                  </span>
                )}

                <button
                  className="icon-danger-button"
                  type="button"
                  onClick={() => setFileToDelete(file)}
                >
                  <Trash2 size={16} />
                </button>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={Boolean(fileToDelete)}
        title="Delete file?"
        text={`This will remove ${
          fileToDelete?.originalFilename || fileToDelete?.filename || "this file"
        } from this capsule.`}
        confirmText="Delete File"
        loading={deleting}
        onClose={() => setFileToDelete(null)}
        onConfirm={handleDeleteConfirmed}
      />
    </section>
  );
}
