import type { CapacityProfile } from "../types/capacity";
import type { Role } from "../types/role";
import { competencyExpectationExportLines } from "./competency";
import { formatDate } from "./capacity";
import { downloadTextFile } from "./download";

export function buildProfileSummaryText(
  role: Role,
  capacity: CapacityProfile | null,
): string {
  const capacityLines = capacity
    ? [
        "",
        "Current capacity assignment:",
        `Effective date: ${formatDate(capacity.effectiveDate)}`,
        ...capacity.allocations.map(
          (item) => `- ${item.category}: ${item.name} (${item.percent}%)`,
        ),
      ]
    : [];

  const lines = [
    "Bridge360 — Bridge Builder Strategies",
    "",
    `Person: ${role.person}`,
    `Current source title: ${role.sourceTitle}`,
    `Recommended standardized title: ${role.standardizedTitle}`,
    `Recommended role family: ${role.roleFamily}`,
    `Reports to: ${role.reportsTo}`,
    `Function: ${role.function}`,
    `Primary use: ${role.primaryUse}`,
    "",
    "Observed work profile:",
    role.observedWorkProfile,
    "",
    "Role purpose:",
    role.rolePurpose,
    ...capacityLines,
    "",
    "Role outcomes:",
    ...role.outcomes.map(
      (row) => `- ${row[0]}: ${row[1]} Evidence / success measures: ${row[2]}`,
    ),
    "",
    "Core responsibilities:",
    ...role.responsibilities.map(
      (row) => `- ${row[0]}: ${row[1]} Work products: ${row[2]}`,
    ),
    "",
    "Competency expectation map:",
    "Expected for role is a role-scope marker only, not a person-specific assessment.",
    ...competencyExpectationExportLines(role),
    "",
    "Core skills:",
    role.skills.join(", "),
    "",
    "Key tools, systems, and work products:",
    role.tools.join(", "),
    "",
    "O*NET alignment:",
    ...role.onet.map((row) => `- ${row[0]} ${row[1]} (${row[2]}): ${row[3]}`),
    "",
    role.designNote ? `Role design note: ${role.designNote}` : "",
  ].filter((line) => line !== "");

  return lines.join("\n");
}

export function exportSummary(
  role: Role,
  capacity: CapacityProfile | null,
): void {
  downloadTextFile(profileSummaryFilename(role), buildProfileSummaryText(role, capacity));
}

export function profileSummaryFilename(role: Role): string {
  return `${role.person.toLowerCase().replaceAll(" ", "-")}-role-summary.txt`;
}
