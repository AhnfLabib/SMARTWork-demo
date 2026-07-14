import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect } from "vitest";
import ProfilePage from "./ProfilePage";

function renderProfile(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/person/${id}`]}>
      <Routes>
        <Route path="/person/:id" element={<ProfilePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProfilePage", () => {
  it("renders Ahnaf profile with capacity strip and tabs", () => {
    renderProfile("ahnaf-labib");

    expect(screen.getByRole("heading", { level: 2, name: "Ahnaf Labib" })).toBeInTheDocument();
    expect(screen.getAllByText("Project Manager").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Capacity allocation summary")).toHaveTextContent("Project");
    expect(screen.getByLabelText("Capacity allocation summary")).toHaveTextContent("80%");
    expect(screen.getByLabelText("Capacity allocation summary")).toHaveTextContent("Product");
    expect(screen.getByLabelText("Capacity allocation summary")).toHaveTextContent("15%");
    expect(screen.getByLabelText("Capacity allocation summary")).toHaveTextContent("Internal");
    expect(screen.getByLabelText("Capacity allocation summary")).toHaveTextContent("5%");
    expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Outcomes" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Competencies" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Reference" })).toBeInTheDocument();
  });

  it("links Development and 360 CTAs to person routes", () => {
    renderProfile("ahnaf-labib");

    expect(screen.getByRole("link", { name: "Development plan" })).toHaveAttribute(
      "href",
      "/person/ahnaf-labib/development",
    );
    expect(screen.getByRole("link", { name: "360 review" })).toHaveAttribute(
      "href",
      "/person/ahnaf-labib/review",
    );
  });

  it("shows PersonContextBar with active Profile link", () => {
    renderProfile("ahnaf-labib");

    expect(screen.getByRole("navigation", { name: "Ahnaf Labib navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
      "href",
      "/person/ahnaf-labib",
    );
    expect(screen.getByRole("link", { name: "Development" })).toHaveAttribute(
      "href",
      "/person/ahnaf-labib/development",
    );
    expect(screen.getByRole("link", { name: "360" })).toHaveAttribute(
      "href",
      "/person/ahnaf-labib/review",
    );
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("aria-current", "page");
  });

  it("renders NotFound for unknown person id", () => {
    renderProfile("unknown-person");

    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(screen.queryByText("Ahnaf Labib")).not.toBeInTheDocument();
  });
});
