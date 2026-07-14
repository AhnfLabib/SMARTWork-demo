export type ProfilePrintMode = "profile-summary" | "profile-full";

export function printProfile(mode: ProfilePrintMode): void {
  const clearPrintMode = () => {
    delete document.body.dataset.printMode;
  };

  window.addEventListener("afterprint", clearPrintMode, { once: true });
  document.body.dataset.printMode = mode;
  window.print();
}
