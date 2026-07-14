import { afterEach, describe, expect, it, vi } from "vitest";
import { printProfile } from "./print";

describe("printProfile", () => {
  afterEach(() => {
    delete document.body.dataset.printMode;
    vi.restoreAllMocks();
  });

  it("sets print mode, calls window.print, and clears on afterprint", () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {
      expect(document.body.dataset.printMode).toBe("profile-summary");
      window.dispatchEvent(new Event("afterprint"));
    });

    printProfile("profile-summary");

    expect(printSpy).toHaveBeenCalledOnce();
    expect(document.body.dataset.printMode).toBeUndefined();
  });
});
