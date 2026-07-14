import type { Role } from "../types/role";
import type {
  AnyPrivateResponsePayload,
  PrivateResponsePayload,
  ResponseField,
  ReviewAudience,
  ReviewKind,
} from "../types/review";

const WORKFLOW_LABELS: Record<ReviewKind, string> = {
  "360-review": "360 Review",
  "development-plan": "Development Plan",
};

export function validateResponsePayload(
  payload: unknown,
  role: Role,
  kind: ReviewKind,
  expectedAudience: ReviewAudience,
): string {
  const data = payload as Partial<AnyPrivateResponsePayload> | null | undefined;

  if (!data || data.schema !== "bbs-role-tool-response-v1") {
    return "This file does not look like a BBS role response export.";
  }
  if (data.kind !== kind) {
    return `This file is for ${WORKFLOW_LABELS[data.kind as ReviewKind] || data.kind}, not ${WORKFLOW_LABELS[kind]}.`;
  }
  if (data.personId !== role.id) {
    return `This response is for ${data.person || "another role"}, not ${role.person}.`;
  }
  if (data.audience !== expectedAudience) {
    return `This file is marked as ${data.audience || "unknown"} input, not ${expectedAudience} input.`;
  }
  return "";
}

export function ratingScore(value: string): number {
  const scores: Record<string, number> = {
    Emerging: 1,
    Meeting: 2,
    Strong: 3,
    "Level I": 1,
    "Level II": 2,
    "Level III": 3,
  };
  return scores[value] || 0;
}

export function comparisonStatus(gap: number): "priority" | "conversation" | "aligned" {
  if (gap >= 2) return "priority";
  if (gap === 1) return "conversation";
  return "aligned";
}

export interface AlignmentComparison {
  key: string;
  group: string;
  label: string;
  managerValue: string;
  employeeValue: string;
  managerScore: number;
  employeeScore: number;
  gap: number;
  status: "priority" | "conversation" | "aligned";
  recommendation: string;
}

export interface AlignmentAnalysis {
  comparisons: AlignmentComparison[];
  priority: AlignmentComparison[];
  conversation: AlignmentComparison[];
  aligned: AlignmentComparison[];
  completed: number;
  averageGap: number;
  summary: string;
}

function comparisonRecommendation(item: AlignmentComparison): string {
  if (item.status === "priority") {
    return item.employeeScore > item.managerScore
      ? "Priority calibration conversation: the employee is rating this area materially higher than the manager. Compare evidence, clarify the current standard, and decide whether coaching, training, or a more explicit development plan is needed."
      : "Priority confidence/support conversation: the manager is rating this area materially higher than the employee. Explore whether expectations are clear, whether confidence is lagging evidence, and what support would help the employee internalize progress.";
  }
  if (item.status === "conversation") {
    return "Conversation item: compare examples behind each selection, clarify what the selected level looks like for this role, and agree on one next support or practice step.";
  }
  return "Aligned rating: reinforce what evidence supports the shared view and identify how to maintain or extend the current pattern.";
}

export function buildAlignmentAnalysis(
  managerPayload: AnyPrivateResponsePayload,
  employeePayload: AnyPrivateResponsePayload,
): AlignmentAnalysis {
  const managerSelections = new Map(
    (managerPayload?.selections || []).map((item) => [item.key, item]),
  );
  const employeeSelections = new Map(
    (employeePayload?.selections || []).map((item) => [item.key, item]),
  );
  const comparisons: AlignmentComparison[] = [];

  employeeSelections.forEach((employeeItem, key) => {
    if (employeeItem.group === "Manager Support Feedback") return;
    const managerItem = managerSelections.get(key);
    if (!managerItem || !managerItem.value || !employeeItem.value) return;

    const managerScore = ratingScore(managerItem.value);
    const employeeScore = ratingScore(employeeItem.value);
    if (!managerScore || !employeeScore) return;

    const gap = Math.abs(managerScore - employeeScore);
    const item: AlignmentComparison = {
      key,
      group: employeeItem.group || managerItem.group || "Ratings",
      label: employeeItem.label || managerItem.label || key,
      managerValue: managerItem.value,
      employeeValue: employeeItem.value,
      managerScore,
      employeeScore,
      gap,
      status: comparisonStatus(gap),
      recommendation: "",
    };
    item.recommendation = comparisonRecommendation(item);
    comparisons.push(item);
  });

  const priority = comparisons.filter((item) => item.status === "priority");
  const conversation = comparisons.filter((item) => item.status === "conversation");
  const aligned = comparisons.filter((item) => item.status === "aligned");
  const completed = comparisons.length;
  const averageGap = completed
    ? comparisons.reduce((sum, item) => sum + item.gap, 0) / completed
    : 0;

  return {
    comparisons,
    priority,
    conversation,
    aligned,
    completed,
    averageGap,
    summary: completed
      ? `${aligned.length} aligned ratings, ${conversation.length} one-level differences, and ${priority.length} priority misalignments across ${completed} rated items.`
      : "No shared numeric ratings were available to compare. Use the narrative responses to guide the combined conversation.",
  };
}

export interface BuildPrivateResponsePayloadInput {
  role: Role;
  kind: ReviewKind;
  audience: ReviewAudience;
  selections: ResponseField[];
  fields: ResponseField[];
  exportedAt?: string;
}

export function buildPrivateResponsePayload(
  input: BuildPrivateResponsePayloadInput,
): PrivateResponsePayload {
  const { role, kind, audience, selections, fields, exportedAt } = input;
  return {
    schema: "bbs-role-tool-response-v1",
    schemaVersion: 1,
    product: "bridge360",
    kind,
    audience,
    personId: role.id,
    person: role.person,
    roleTitle: role.standardizedTitle,
    roleFamily: role.roleFamily,
    exportedAt: exportedAt ?? new Date().toISOString(),
    selections,
    fields,
  };
}
