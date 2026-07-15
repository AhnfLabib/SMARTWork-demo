import { describe, it, expect } from "vitest";
import { getRoleById } from "../data";
import {
  COMPETENCY_LEVELS,
  competencyExamples,
  competencyExpectationExportLines,
  competencyLevelContent,
  expectedCompetencyLevel,
} from "./competency";

describe("competency helpers", () => {
  it("assigns Level II to Ahnaf", () => {
    const role = getRoleById("ahnaf-labib");
    expect(role).toBeDefined();
    expect(expectedCompetencyLevel(role!)).toBe("Level II");
  });

  it("assigns Level I to intern roles", () => {
    expect(expectedCompetencyLevel({ id: "tapan-mandal" })).toBe("Level I");
    expect(expectedCompetencyLevel({ id: "owen-nguyen" })).toBe("Level I");
  });

  it("assigns Level III to senior roles by default", () => {
    expect(expectedCompetencyLevel({ id: "jack-dougher" })).toBe("Level III");
  });

  it("parses behavior examples from competency text", () => {
    const examples = competencyExamples(
      "Tracks next steps, prepares updates, coordinates handoffs, and follows through on assigned actions.",
    );
    expect(examples).toHaveLength(4);
    expect(examples[0]).toBe("Tracks next steps");
  });

  it("builds level content with expectations and examples", () => {
    const content = competencyLevelContent(
      "Level II",
      "Project Coordination",
      "Organizes workstreams and deliverables.",
      "Tracks next steps, prepares updates, coordinates handoffs.",
    );

    expect(content.expectations).toHaveLength(2);
    expect(content.examples).toHaveLength(3);
    expect(content.expectations[0]).toContain("Project Coordination");
  });

  it("exports competency lines for each level", () => {
    const role = getRoleById("ahnaf-labib");
    expect(role).toBeDefined();

    const lines = competencyExpectationExportLines(role!);
    const firstCompetency = role!.competencies[0][0];

    expect(lines.some((line) => line === `- ${firstCompetency}`)).toBe(true);
    expect(lines.filter((line) => line.startsWith("  Expected for role:"))).toHaveLength(
      role!.competencies.length,
    );
    COMPETENCY_LEVELS.forEach((level) => {
      expect(lines.some((line) => line === `${level}:`)).toBe(true);
    });
  });
});
