import type { Role, Triple } from "../types/role";

export const COMPETENCY_LEVELS = ["Level I", "Level II", "Level III"] as const;
export type CompetencyLevel = (typeof COMPETENCY_LEVELS)[number];

const LEVEL_ONE_ROLES = new Set([
  "tapan-mandal",
  "keagan-combs",
  "brady-trebley",
  "austin-cooper",
  "owen-nguyen",
]);

const LEVEL_TWO_ROLES = new Set([
  "ahnaf-labib",
  "adelai-elsener",
  "chelsea-neulieb",
  "derek-miller",
  "nick-schramm",
]);

export function expectedCompetencyLevel(role: Pick<Role, "id">): CompetencyLevel {
  if (LEVEL_ONE_ROLES.has(role.id)) return "Level I";
  if (LEVEL_TWO_ROLES.has(role.id)) return "Level II";
  return "Level III";
}

export function competencyExamples(behavior: string, limit = 4): string[] {
  return behavior
    .split(/,\s+|;\s+/)
    .map((item) => item.replace(/\.$/, "").trim())
    .filter(Boolean)
    .slice(0, limit);
}

function lowerFirst(value: string): string {
  return value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
}

function naturalList(items: string[]): string {
  const cleanItems = items.filter(Boolean);
  if (cleanItems.length <= 1) return cleanItems[0] || "";
  if (cleanItems.length === 2) return `${cleanItems[0]} and ${cleanItems[1]}`;
  return `${cleanItems.slice(0, -1).join(", ")}, and ${cleanItems[cleanItems.length - 1]}`;
}

export function competencySuccessExamples(
  level: CompetencyLevel,
  name: string,
  behavior: string,
): string[] {
  const behaviorExamples = competencyExamples(behavior);
  const anchors = behaviorExamples.length ? behaviorExamples : [name];

  if (level === "Level I") {
    return anchors
      .slice(0, 3)
      .map(
        (item) =>
          `Drafts, updates, checks, or gathers inputs for ${lowerFirst(item)} with direction before handoff.`,
      );
  }

  if (level === "Level II") {
    return anchors
      .slice(0, 3)
      .map(
        (item) =>
          `Owns ${lowerFirst(item)} from planning through completion and adjusts based on context, feedback, and quality needs.`,
      );
  }

  return anchors
    .slice(0, 3)
    .map(
      (item) =>
        `Defines standards, decision logic, or reusable methods for ${lowerFirst(item)} and helps others apply them consistently.`,
    );
}

export interface CompetencyLevelContent {
  expectations: string[];
  examples: string[];
}

export function competencyLevelContent(
  level: CompetencyLevel,
  name: string,
  definition: string,
  behavior: string,
): CompetencyLevelContent {
  const cleanDefinition = definition.replace(/\s+/g, " ").trim();
  const behaviorExamples = competencyExamples(behavior, 3);
  const behaviorFocus = naturalList(behaviorExamples);
  const examples = competencySuccessExamples(level, name, behavior);

  if (level === "Level I") {
    return {
      expectations: [
        `Understands the purpose of ${name}: ${cleanDefinition}`,
        `Supports assigned pieces of ${lowerFirst(behaviorFocus || name)} with guidance, examples, or review.`,
      ],
      examples,
    };
  }

  if (level === "Level II") {
    return {
      expectations: [
        `Applies ${name} independently in current role work: ${cleanDefinition}`,
        `Owns ${lowerFirst(behaviorFocus || name)} with reliable quality, follow-through, and stakeholder awareness.`,
      ],
      examples,
    };
  }

  return {
    expectations: [
      `Sets direction for how ${name} should shape role, team, or organization decisions.`,
      `Defines standards for ${lowerFirst(behaviorFocus || name)} and aligns others around consistent execution.`,
    ],
    examples,
  };
}

export function competencyLevelPlainText(
  level: CompetencyLevel,
  name: string,
  definition: string,
  behavior: string,
): string[] {
  const content = competencyLevelContent(level, name, definition, behavior);
  return [
    `${level}:`,
    ...content.expectations.map((item) => `    Expectation: ${item}`),
    ...content.examples.map((item) => `    Example: ${item}`),
  ];
}

export function competencyExpectationExportLines(role: Role): string[] {
  const expectedLevel = expectedCompetencyLevel(role);

  return role.competencies.flatMap(([name, definition, behavior]) => [
    `- ${name}`,
    ...COMPETENCY_LEVELS.flatMap((level) =>
      competencyLevelPlainText(level, name, definition, behavior),
    ),
    `  Expected for role: ${expectedLevel}`,
  ]);
}

export function parseCompetency(competency: Triple): {
  name: string;
  definition: string;
  behavior: string;
} {
  const [name, definition, behavior] = competency;
  return { name, definition, behavior };
}
