import { useEffect, useState } from "react";
import { Download, FileLock2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { receiverCapsuleApi } from "../../api/receiverCapsuleApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";
import { formatDateTime } from "../../utils/dateUtils.js";
import { downloadBlob, getFilenameFromHeaders } from "../../utils/downloadUtils.js";

export default function ReceiverFilesPanel({ capsuleId }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState("");

  async function loadFiles() {
    setLoading(true);

    try {
      const response = await receiverCapsuleApi.listFiles(capsuleId);
      setFiles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load capsule files."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFiles();
  }, [capsuleId]);

  async function handleDownload(file) {
    const fileId = file.id || file.fileId;

    setDownloadingId(fileId);

    try {
      const response = await receiverCapsuleApi.downloadFile(capsuleId, fileId);

      const filename = getFilenameFromHeaders(
        response.headers,
        file.originalFilename || file.filename || "legacylock-file"
      );

      downloadBlob(response.data, filename);
      toast.success("File downloaded.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "File download failed."));
    } finally {
      setDownloadingId("");
    }
  }

  return (
    <section className="glass-card receiver-detail-panel">
      <div className="panel-heading-row">
        <div>
          <p className="eyebrow">Files</p>
          <h3>Available files</h3>
          <p className="muted">
            Download the files that were shared with this capsule.
          </p>
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
          <h4>No files available</h4>
          <p className="muted">This capsule does not include downloadable files.</p>
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
                    Available since {formatDateTime(file.createdAt || file.uploadedAt)}
                  </p>
                </div>

                <button
                  className="glass-button secondary"
                  type="button"
                  onClick={() => handleDownload(file)}
                  disabled={downloadingId === fileId}
                >
                  <Download size={16} />
                  {downloadingId === fileId ? "Downloading..." : "Download"}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
