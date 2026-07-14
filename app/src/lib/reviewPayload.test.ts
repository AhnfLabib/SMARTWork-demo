import { describe, it, expect } from "vitest";
import type { Role } from "../types/role";
import type { PrivateResponsePayload } from "../types/review";
import {
  validateResponsePayload,
  buildAlignmentAnalysis,
  buildPrivateResponsePayload,
  ratingScore,
  comparisonStatus,
} from "./reviewPayload";

const role: Role = {
  id: "ahnaf-labib",
  person: "Ahnaf Labib",
  sourceTitle: "Software Engineer",
  standardizedTitle: "Software Engineer",
  roleFamily: "Software Developers",
  reportsTo: "Jack Dougher",
  function: "Engineering",
  primaryUse: "Development",
  observedWorkProfile: "Builds software",
  rolePurpose: "Deliver features",
  outcomes: [],
  responsibilities: [],
  competencies: [],
  skills: [],
  tools: [],
  onet: [],
  designNote: "",
  sources: [],
};

function basePayload(
  overrides: Partial<PrivateResponsePayload> = {},
): PrivateResponsePayload {
  return {
    schema: "bbs-role-tool-response-v1",
    schemaVersion: 1,
    product: "bridge360",
    kind: "360-review",
    audience: "manager",
    personId: "ahnaf-labib",
    person: "Ahnaf Labib",
    roleTitle: "Software Engineer",
    roleFamily: "Software Developers",
    exportedAt: "2026-07-14T12:00:00.000Z",
    selections: [],
    fields: [],
    ...overrides,
  };
}

describe("validateResponsePayload", () => {
  it("rejects wrong schema", () => {
    const payload = { ...basePayload(), schema: "other-schema" as "bbs-role-tool-response-v1" };
    expect(validateResponsePayload(payload, role, "360-review", "manager")).toBe(
      "This file does not look like a BBS role response export.",
    );
  });

  it("rejects wrong personId", () => {
    const payload = basePayload({ personId: "jack-dougher", person: "Jack Dougher" });
    expect(validateResponsePayload(payload, role, "360-review", "manager")).toBe(
      "This response is for Jack Dougher, not Ahnaf Labib.",
    );
  });

  it("rejects wrong kind", () => {
    const payload = basePayload({ kind: "development-plan" });
    expect(validateResponsePayload(payload, role, "360-review", "manager")).toBe(
      "This file is for Development Plan, not 360 Review.",
    );
  });

  it("rejects wrong audience", () => {
    const payload = basePayload({ audience: "employee" });
    expect(validateResponsePayload(payload, role, "360-review", "manager")).toBe(
      "This file is marked as employee input, not manager input.",
    );
  });

  it("accepts valid payload with schemaVersion and product", () => {
    expect(validateResponsePayload(basePayload(), role, "360-review", "manager")).toBe("");
  });

  it("accepts legacy payload without schemaVersion and product", () => {
    const { schemaVersion: _sv, product: _p, ...legacy } = basePayload();
    expect(validateResponsePayload(legacy, role, "360-review", "manager")).toBe("");
  });
});

describe("ratingScore and comparisonStatus", () => {
  it("maps outcome and competency levels to scores", () => {
    expect(ratingScore("Emerging")).toBe(1);
    expect(ratingScore("Meeting")).toBe(2);
    expect(ratingScore("Strong")).toBe(3);
    expect(ratingScore("Level I")).toBe(1);
    expect(ratingScore("Level II")).toBe(2);
    expect(ratingScore("Level III")).toBe(3);
    expect(ratingScore("")).toBe(0);
  });

  it("classifies gap status", () => {
    expect(comparisonStatus(2)).toBe("priority");
    expect(comparisonStatus(3)).toBe("priority");
    expect(comparisonStatus(1)).toBe("conversation");
    expect(comparisonStatus(0)).toBe("aligned");
  });
});

describe("buildAlignmentAnalysis", () => {
  const managerPayload = basePayload({
    audience: "manager",
    selections: [
      {
        key: "outcome-1",
        group: "Outcomes",
        label: "Outcome 1",
        value: "Emerging",
      },
      {
        key: "comp-1",
        group: "Competencies",
        label: "Competency 1",
        value: "Level III",
      },
      {
        key: "outcome-2",
        group: "Outcomes",
        label: "Outcome 2",
        value: "Meeting",
      },
    ],
  });

  const employeePayload = basePayload({
    audience: "employee",
    selections: [
      {
        key: "outcome-1",
        group: "Outcomes",
        label: "Outcome 1",
        value: "Strong",
      },
      {
        key: "comp-1",
        group: "Competencies",
        label: "Competency 1",
        value: "Level III",
      },
      {
        key: "outcome-2",
        group: "Outcomes",
        label: "Outcome 2",
        value: "Meeting",
      },
      {
        key: "support-1",
        group: "Manager Support Feedback",
        label: "Support item",
        value: "Strong",
      },
    ],
  });

  it("marks gap >= 2 as priority", () => {
    const analysis = buildAlignmentAnalysis(managerPayload, employeePayload);
    const outcome1 = analysis.comparisons.find((c) => c.key === "outcome-1");
    expect(outcome1?.gap).toBe(2);
    expect(outcome1?.status).toBe("priority");
    expect(outcome1?.recommendation).toContain("Priority calibration conversation");
    expect(analysis.priority).toHaveLength(1);
  });

  it("marks gap 0 as aligned", () => {
    const analysis = buildAlignmentAnalysis(managerPayload, employeePayload);
    const comp1 = analysis.comparisons.find((c) => c.key === "comp-1");
    expect(comp1?.gap).toBe(0);
    expect(comp1?.status).toBe("aligned");
    expect(comp1?.recommendation).toContain("Aligned rating");
    expect(analysis.aligned).toHaveLength(2);
  });

  it("skips Manager Support Feedback selections", () => {
    const analysis = buildAlignmentAnalysis(managerPayload, employeePayload);
    expect(analysis.comparisons.some((c) => c.key === "support-1")).toBe(false);
  });

  it("returns summary with counts", () => {
    const analysis = buildAlignmentAnalysis(managerPayload, employeePayload);
    expect(analysis.completed).toBe(3);
    expect(analysis.summary).toContain("2 aligned ratings");
    expect(analysis.summary).toContain("1 priority misalignments");
  });
});

describe("buildPrivateResponsePayload", () => {
  it("includes schemaVersion and product on new exports", () => {
    const payload = buildPrivateResponsePayload({
      role,
      kind: "360-review",
      audience: "manager",
      selections: [{ key: "a", group: "Ratings", label: "A", value: "Strong" }],
      fields: [{ key: "b", group: "Notes", label: "B", value: "Note" }],
    });

    expect(payload.schema).toBe("bbs-role-tool-response-v1");
    expect(payload.schemaVersion).toBe(1);
    expect(payload.product).toBe("bridge360");
    expect(payload.personId).toBe("ahnaf-labib");
    expect(payload.selections).toHaveLength(1);
    expect(payload.fields).toHaveLength(1);
    expect(payload.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
