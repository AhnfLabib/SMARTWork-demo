export type ProfilePrintMode = "profile-summary" | "profile-full";
export type PrintMode = ProfilePrintMode | "development" | "combined";

function printWithMode(mode: PrintMode): void {
  const clearPrintMode = () => {
    delete document.body.dataset.printMode;
  };

  window.addEventListener("afterprint", clearPrintMode, { once: true });
  document.body.dataset.printMode = mode;
  window.print();
}

export function printProfile(mode: ProfilePrintMode): void {
  printWithMode(mode);
}

export function printDevelopment(): void {
  printWithMode("development");
}

export function printCombined(): void {
  printWithMode("combined");
}
