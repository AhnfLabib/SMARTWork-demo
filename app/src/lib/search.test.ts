import { describe, it, expect } from "vitest";
import { filterRoles, orgNodeMatchesQuery, countOrgMatches } from "./search";
import { ROLES, ORG_TREE } from "../data";
import { getRoleById } from "../data";

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

describe("org search", () => {
  it("finds Ahnaf in the org tree", () => {
    const role = getRoleById("ahnaf-labib");
    const ahnaf = ORG_TREE.children![1].children![1].children![0];
    expect(orgNodeMatchesQuery(ahnaf, "ahnaf", role)).toBe(true);
    expect(countOrgMatches(ORG_TREE, "ahnaf", getRoleById)).toBe(1);
  });
});
