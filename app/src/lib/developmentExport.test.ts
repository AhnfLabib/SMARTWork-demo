import { describe, expect, it } from "vitest";
import { getRoleById } from "../data";
import { buildDevelopmentPlanText, hasStartupPlan } from "./developmentExport";
import { getDevelopmentPlan } from "./developmentPlan";

describe("development export", () => {
  it("includes Ahnaf startup week and Westfield assignment content", () => {
    const role = getRoleById("ahnaf-labib");
    const plan = getDevelopmentPlan("ahnaf-labib");
    expect(role).toBeDefined();
    expect(plan).toBeDefined();
    if (!role || !plan) return;

    expect(hasStartupPlan(plan)).toBe(true);
    const text = buildDevelopmentPlanText(role, plan, []);
    expect(text).toContain("Week 1: Re-entry and Context Refresh");
    expect(text).toContain("Westfield");
    expect(text).toContain("July 13, 2026 - August 11, 2026");
  });
});
