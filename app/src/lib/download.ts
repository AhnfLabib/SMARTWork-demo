export function downloadTextFile(filename: string, text: string): void {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  triggerDownload(filename, urlFromBlob(blob));
}

export function downloadJsonFile(filename: string, payload: unknown): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  triggerDownload(filename, urlFromBlob(blob));
}

function urlFromBlob(blob: Blob): string {
  return URL.createObjectURL(blob);
}

function triggerDownload(filename: string, url: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
