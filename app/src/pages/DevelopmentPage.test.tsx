import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import DevelopmentPage from "./DevelopmentPage";
import * as developmentExportModule from "../lib/developmentExport";
import * as printModule from "../lib/print";

function renderDevelopment(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/person/${id}/development`]}>
      <Routes>
        <Route path="/person/:id/development" element={<DevelopmentPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("DevelopmentPage", () => {
  it("renders Ahnaf startup week flow and Westfield assignment", () => {
    renderDevelopment("ahnaf-labib");

    expect(screen.getByRole("heading", { level: 2, name: "Ahnaf Labib" })).toBeInTheDocument();
    expect(screen.getByText("Week 1: Re-entry and Context Refresh")).toBeInTheDocument();
    expect(screen.getAllByText("Westfield").length).toBeGreaterThan(0);
    expect(screen.getByText("30-Day Startup Plan")).toBeInTheDocument();
    expect(screen.getByText("Quarterly Plan")).toBeInTheDocument();
    expect(screen.getByText("Semiannual Plan")).toBeInTheDocument();
    expect(screen.getByText("Project & Workstream Coordination")).toBeInTheDocument();
  });

  it("shows PersonContextBar with active Development link", () => {
    renderDevelopment("ahnaf-labib");

    expect(screen.getByRole("navigation", { name: "Ahnaf Labib navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Development" })).toHaveAttribute(
      "href",
      "/person/ahnaf-labib/development",
    );
    expect(screen.getByRole("link", { name: "Development" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("renders NotFound for unknown person id", () => {
    renderDevelopment("unknown-person");

    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  });

  describe("export and print actions", () => {
    afterEach(() => {
      vi.restoreAllMocks();
      delete document.body.dataset.printMode;
    });

    it("exports development plan with local notes", async () => {
      const user = userEvent.setup();
      const exportSpy = vi
        .spyOn(developmentExportModule, "exportDevelopmentNotes")
        .mockImplementation(() => {});

      renderDevelopment("ahnaf-labib");
      const textareas = screen.getAllByRole("textbox");
      await user.type(textareas[0], "Startup reflection note.");
      await user.click(screen.getByRole("button", { name: "Export plan" }));

      expect(exportSpy).toHaveBeenCalledOnce();
      expect(exportSpy.mock.calls[0]?.[0]?.id).toBe("ahnaf-labib");
      expect(exportSpy.mock.calls[0]?.[2]?.some((field) => field.value.includes("Startup reflection note."))).toBe(
        true,
      );
    });

    it("prints development plan", async () => {
      const user = userEvent.setup();
      const printSpy = vi.spyOn(printModule, "printDevelopment").mockImplementation(() => {});

      renderDevelopment("ahnaf-labib");
      await user.click(screen.getByRole("button", { name: "Print / Save PDF" }));

      expect(printSpy).toHaveBeenCalledOnce();
    });
  });
});
