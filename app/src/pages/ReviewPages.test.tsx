import type { ReactElement } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ReviewLaunchPage from "./ReviewLaunchPage";
import PrivateResponsePage from "./PrivateResponsePage";
import ReviewCombinePage from "./ReviewCombinePage";

function renderAt(path: string, element: ReactElement) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/person/:id/review" element={element} />
        <Route path="/person/:id/review/manager" element={element} />
        <Route path="/person/:id/review/employee" element={element} />
        <Route path="/person/:id/review/combine" element={element} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("360 review pages", () => {
  it("shows launch actions for manager, employee, and combine", () => {
    renderAt("/person/ahnaf-labib/review", <ReviewLaunchPage />);
    expect(screen.getByRole("heading", { name: "Ahnaf Labib" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Manager input/i })).toHaveAttribute(
      "href",
      "/person/ahnaf-labib/review/manager",
    );
    expect(screen.getByRole("link", { name: /Employee input/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Combine responses/i })).toBeInTheDocument();
  });

  it("renders manager private form fields and export control", () => {
    renderAt(
      "/person/ahnaf-labib/review/manager",
      <PrivateResponsePage audience="manager" />,
    );
    expect(screen.getByRole("button", { name: /Export Manager response/i })).toBeInTheDocument();
    expect(screen.getByText(/Rating baseline/i)).toBeInTheDocument();
    expect(screen.getByText(/Role Outcomes/i)).toBeInTheDocument();
  });

  it("shows an error when combine gets invalid JSON", async () => {
    const user = userEvent.setup();
    renderAt("/person/ahnaf-labib/review/combine", <ReviewCombinePage />);

    const file = new File(["{not-json"], "bad.json", { type: "application/json" });
    const inputs = document.querySelectorAll('input[type="file"]');
    await user.upload(inputs[0] as HTMLInputElement, file);

    expect(
      await screen.findByText(/could not be read as JSON/i),
    ).toBeInTheDocument();
  });
});
