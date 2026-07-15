import { describe, it, expect } from "vitest";
import { getDevelopmentPlan } from "./developmentPlan";

describe("development plan resolver", () => {
  it("returns authored startup plan for Ahnaf", () => {
    const plan = getDevelopmentPlan("ahnaf-labib");
    expect(plan?.startupWeeks?.length).toBeGreaterThan(0);
    expect(plan?.period).toContain("2026");
    expect(plan?.startupWeeks?.[0]?.[0]).toBe("Week 1: Re-entry and Context Refresh");
    expect(plan?.startupAssignments.some((row) => row[0] === "Westfield")).toBe(true);
  });

  it("builds a default plan for Jack without authored startup weeks", () => {
    const plan = getDevelopmentPlan("jack-dougher");
    expect(plan?.personId).toBe("jack-dougher");
    expect(plan?.quarterlyGoals?.length).toBeGreaterThan(0);
  });
});
