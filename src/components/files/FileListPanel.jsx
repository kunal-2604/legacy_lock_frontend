import { useEffect, useState } from "react";
import { FileLock2, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { fileApi } from "../../api/fileApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";
import { formatDateTime } from "../../utils/dateUtils.js";

export default function FileListPanel({ capsuleId, refreshKey = 0 }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

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

  async function handleDelete(fileId) {
    const confirmed = window.confirm("Delete this file from the capsule?");

    if (!confirmed) return;

    try {
      await fileApi.remove(capsuleId, fileId);
      toast.success("File deleted.");
      loadFiles();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete file."));
    }
  }

  return (
    <section className="glass-card files-panel">
      <div className="panel-heading-row">
        <div>
          <p className="eyebrow">Capsule Files</p>
          <h3>Encrypted attachments</h3>
        </div>

        <button className="glass-button ghost" type="button" onClick={loadFiles}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="muted">Loading files...</p>
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
                    Encrypted
                  </span>
                )}

                <button
                  className="icon-danger-button"
                  type="button"
                  onClick={() => handleDelete(fileId)}
                >
                  <Trash2 size={16} />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
