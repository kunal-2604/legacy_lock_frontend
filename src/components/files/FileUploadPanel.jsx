import { useRef, useState } from "react";
import { FileUp, Upload } from "lucide-react";
import { toast } from "sonner";

import SubmitButton from "../ui/SubmitButton.jsx";
import { fileApi } from "../../api/fileApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";

export default function FileUploadPanel({ capsuleId, onUploaded }) {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(event) {
    event.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    setUploading(true);

    try {
      await fileApi.upload(capsuleId, selectedFile);
      toast.success("File uploaded successfully.");
      setSelectedFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      onUploaded?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "File upload failed."));
    } finally {
      setUploading(false);
    }
  }

  return (
    <form className="file-upload-panel glass-card" onSubmit={handleUpload}>
      <div className="empty-icon">
        <FileUp size={30} />
      </div>

      <div>
        <p className="eyebrow">File Upload</p>
        <h3>Attach secure files</h3>
        <p className="muted">
          Add supporting documents to this capsule. They will stay private until release.
        </p>
      </div>

      <label className="file-dropzone">
        <input
          ref={inputRef}
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />

        <Upload size={22} />

        {selectedFile ? (
          <span>{selectedFile.name}</span>
        ) : (
          <span>Choose a file to upload</span>
        )}

        {selectedFile && (
          <small>{Math.ceil(selectedFile.size / 1024)} KB selected</small>
        )}
      </label>

      <SubmitButton loading={uploading}>
        {uploading ? "Uploading..." : "Upload File"}
      </SubmitButton>
    </form>
  );
}
