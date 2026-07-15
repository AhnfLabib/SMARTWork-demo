import { describe, expect, it } from "vitest";
import { getRoleById } from "../data";
import { getCapacityProfile } from "./capacity";
import { buildProfileSummaryText, profileSummaryFilename } from "./profileExport";

describe("profileExport", () => {
  const role = getRoleById("ahnaf-labib")!;

  it("builds summary text with person, purpose, outcomes, responsibilities, and competencies", () => {
    const capacity = getCapacityProfile(role.id);
    const text = buildProfileSummaryText(role, capacity);

    expect(text).toContain("SMARTWork — Bridge Builder Strategies");
    expect(text).toContain(`Person: ${role.person}`);
    expect(text).toContain("Role purpose:");
    expect(text).toContain(role.rolePurpose);
    expect(text).toContain("Role outcomes:");
    expect(text).toContain("Core responsibilities:");
    expect(text).toContain("Competency expectation map:");
    expect(text).toContain("Current capacity assignment:");
    expect(text).toContain("Project");
  });

  it("uses a slugged filename for export", () => {
    expect(profileSummaryFilename(role)).toBe("ahnaf-labib-role-summary.txt");
  });
});
