import type { DevelopmentPlan } from "../types/development";
import type { Role } from "../types/role";
import { downloadTextFile } from "./download";

export type DevelopmentNoteField = {
  label: string;
  value: string;
};

function firstName(person = "Team member"): string {
  return String(person).split(" ")[0] || "Team member";
}

export function hasStartupPlan(plan: DevelopmentPlan): boolean {
  return Boolean(plan.startupPeriod && plan.startupWeeks.length);
}

export function buildDevelopmentPlanText(
  role: Role,
  plan: DevelopmentPlan,
  noteFields: DevelopmentNoteField[],
): string {
  const includesStartup = hasStartupPlan(plan);
  const startupLines = includesStartup
    ? [
        `30-day startup plan: ${plan.startupPeriod}`,
        "",
        "30-day startup assignment plan:",
        ...plan.startupAssignments.map(
          (row) =>
            `- ${row[0]} | Focus: ${row[1]} | Action: ${row[2]} | Evidence by day 30: ${row[3]}`,
        ),
        "",
        "Four-week startup flow:",
        ...plan.startupWeeks.map(
          (row) =>
            `- ${row[0]} | Goal: ${row[1]} | Focus: ${row[2]} | Evidence: ${row[3]}`,
        ),
        "",
        "Startup manager support:",
        ...plan.startupManagerSupport.map((item) => `- ${item}`),
        "",
      ]
    : [];

  const lines = [
    "Bridge Builder Strategies - Development Plan",
    "",
    `Person: ${role.person}`,
    `Role: ${role.standardizedTitle}`,
    `Plan period: ${plan.period}`,
    ...startupLines,
    `Quarterly plan: ${plan.quarterlyPeriod}`,
    `Semiannual plan: ${plan.semiannualPeriod}`,
    "",
    "Development focus areas:",
    ...plan.focusAreas.map(([area, why]) => `- ${area}: ${why}`),
    "",
    "Quarterly plan - next-90-days execution focus:",
    ...plan.quarterlyGoals.map(
      (row) =>
        `- ${row[0]} | Current role connection: ${row[1]} | Quarterly evidence: ${row[2]}`,
    ),
    "",
    "Semiannual plan - six-month growth arc:",
    ...plan.semiannualOutcomes.map((row) => `- ${row[0]}: ${row[1]}`),
    "",
    "Manager support:",
    ...plan.managerSupport.map((item) => `- ${item}`),
    "",
    "Notes:",
    ...noteFields.map((field) => `${field.label}: ${field.value}`),
  ];

  return lines.join("\n");
}

export function developmentPlanFilename(role: Role): string {
  return `${role.person.toLowerCase().replaceAll(" ", "-")}-development-plan.txt`;
}

export function exportDevelopmentNotes(
  role: Role,
  plan: DevelopmentPlan,
  noteFields: DevelopmentNoteField[],
): void {
  downloadTextFile(
    developmentPlanFilename(role),
    buildDevelopmentPlanText(role, plan, noteFields),
  );
}

export function personFirstName(role: Role): string {
  return firstName(role.person);
}
