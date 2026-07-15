import { describe, it, expect } from "vitest";
import { CAPACITY_DATA } from "../data";
import {
  getCapacityProfile,
  capacityTotals,
  groupedAllocations,
} from "./capacity";

describe("capacity helpers", () => {
  it("returns Ahnaf capacity profile by person id", () => {
    const profile = getCapacityProfile("ahnaf-labib");
    expect(profile).toBeDefined();
    expect(profile?.personId).toBe("ahnaf-labib");
    expect(profile?.allocations.length).toBeGreaterThan(0);
  });

  it("returns null for unknown person id", () => {
    expect(getCapacityProfile("unknown-person")).toBeNull();
  });

  it("computes Ahnaf category totals and overall 100%", () => {
    const profile = getCapacityProfile("ahnaf-labib");
    expect(profile).not.toBeNull();
    const totals = capacityTotals(profile!);

    expect(totals.total).toBe(100);
    expect(totals.Project).toBe(80);
    expect(totals.Product).toBe(15);
    expect(totals.Internal).toBe(5);
  });

  it("groups Ahnaf allocations by category with percents summing to 100", () => {
    const profile = CAPACITY_DATA.find((p) => p.personId === "ahnaf-labib");
    expect(profile).toBeDefined();

    const groups = groupedAllocations(profile!);

    expect(groups.Project).toHaveLength(4);
    expect(groups.Product).toHaveLength(2);
    expect(groups.Internal).toHaveLength(1);

    const projectTotal = groups.Project.reduce((sum, a) => sum + a.percent, 0);
    const productTotal = groups.Product.reduce((sum, a) => sum + a.percent, 0);
    const internalTotal = groups.Internal.reduce((sum, a) => sum + a.percent, 0);

    expect(projectTotal).toBe(80);
    expect(productTotal).toBe(15);
    expect(internalTotal).toBe(5);
    expect(projectTotal + productTotal + internalTotal).toBe(100);
  });
});
