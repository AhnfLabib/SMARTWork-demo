import { describe, it, expect } from "vitest";
import { roleMatchesQuery, filterRoles } from "./search";
import { ROLES } from "../data";

describe("filterRoles", () => {
  it("finds Ahnaf by name substring", () => {
    const result = filterRoles(ROLES, { query: "ahnaf", function: "All", family: "All", reportsTo: "All" });
    expect(result.map((r) => r.id)).toContain("ahnaf-labib");
  });

  it("returns empty for nonsense query", () => {
    const result = filterRoles(ROLES, { query: "zzzz-no-match", function: "All", family: "All", reportsTo: "All" });
    expect(result).toHaveLength(0);
  });
});
