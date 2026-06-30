export function downloadBlob(blobData, filename = "legacylock-file") {
  const blob = blobData instanceof Blob ? blobData : new Blob([blobData]);
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

export function getFilenameFromHeaders(headers, fallback = "legacylock-file") {
  const contentDisposition = headers?.["content-disposition"];

  if (!contentDisposition) return fallback;

  const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);

  if (!filenameMatch?.[1]) return fallback;

  return filenameMatch[1];
}
