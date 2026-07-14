import { DEVELOPMENT_PLANS, getRoleById } from "../data";
import type { DevelopmentPlan } from "../types/development";
import type { Role, Triple } from "../types/role";

function firstName(person = "Team member"): string {
  return String(person).split(" ")[0] || "Team member";
}

function defaultQuarterlyGoals(
  role: Role,
  responsibilities: Triple[],
): DevelopmentPlan["quarterlyGoals"] {
  const rows = responsibilities.slice(0, 5).map(([area, responsibility, products]) => [
    `Stabilize ${area.toLowerCase()} execution`,
    responsibility,
    products,
  ]);

  if (rows.length) return rows;

  return role.outcomes.slice(0, 5).map(([outcome, success, evidence]) => [
    `Advance ${outcome.toLowerCase()}`,
    success,
    evidence,
  ]);
}

function defaultSemiannualOutcomes(
  role: Role,
  competencies: Triple[],
): DevelopmentPlan["semiannualOutcomes"] {
  const rows = competencies.slice(0, 5).map(([competency, definition, behavior]) => [
    `Stronger ${competency.toLowerCase()} ownership`,
    `${definition} By the semiannual review point, this should show up through more independent judgment, cleaner follow-through, and observable behaviors such as: ${behavior}`,
  ]);

  if (rows.length) return rows;

  return role.outcomes.slice(0, 5).map(([outcome, success]) => [
    `Stronger ownership of ${outcome.toLowerCase()}`,
    `${success} By the semiannual review point, evidence should show more independent ownership, stronger quality, and more consistent follow-through.`,
  ]);
}

export function buildDefaultDevelopmentPlan(role: Role): DevelopmentPlan {
  const name = firstName(role.person);
  const responsibilities = role.responsibilities.slice(0, 5);
  const competencies = role.competencies.slice(0, 5);
  const roleAnchor = role.standardizedTitle || role.sourceTitle;
  const includeStartupPlan = role.id === "adelai-elsener";
  const isAdelai = role.id === "adelai-elsener";
  const planPeriod = isAdelai
    ? "August 1, 2026 - January 31, 2027"
    : "July 1, 2026 - December 31, 2026";
  const startupPeriod = isAdelai
    ? "August 1, 2026 - August 30, 2026"
    : "First 30 days of the current plan cycle";
  const quarterlyPeriod = isAdelai
    ? "August 1, 2026 - October 31, 2026"
    : "July 1, 2026 - September 30, 2026";
  const semiannualPeriod = isAdelai
    ? "August 1, 2026 - January 31, 2027"
    : "July 1, 2026 - December 31, 2026";

  return {
    personId: role.id,
    planTitle: "Development Plan",
    period: planPeriod,
    startupPeriod: includeStartupPlan ? startupPeriod : "",
    quarterlyPeriod,
    semiannualPeriod,
    planBasis: `Initial role-based development guidance based on ${name}'s current ${roleAnchor} role profile, role outcomes, responsibilities, and competency expectation map. Future updates should be informed by manager/employee review conversations, role outcome evidence, competency assessment, and capacity priorities.`,
    startupPurpose: includeStartupPlan
      ? `Help ${name} confirm current priorities, reconnect role expectations to active work, and identify the support needed to operate clearly in the role.`
      : "",
    startupAssignments: includeStartupPlan
      ? responsibilities.slice(0, 4).map(([area, responsibility, products]) => [
          area,
          `Clarify current ownership for ${area.toLowerCase()}.`,
          responsibility,
          products,
        ])
      : [],
    startupWeeks: includeStartupPlan
      ? [
          [
            "Week 1: Role Context and Priorities",
            "Confirm current-state expectations.",
            `Review the role profile with the manager, confirm priority outcomes, and identify the most important workstreams connected to ${roleAnchor}.`,
            "Priority list; questions log; confirmed check-in rhythm",
          ],
          [
            "Week 2: Workstream and Evidence Mapping",
            "Connect responsibilities to current work.",
            "Map active responsibilities, deliverables, stakeholders, tools, and evidence that should show progress.",
            "Workstream map; deliverable list; stakeholder/context notes",
          ],
          [
            "Week 3: Active Ownership Practice",
            "Move work forward with clear evidence.",
            "Own or support selected responsibilities, produce visible work products, and request feedback on quality, timing, and communication.",
            "Updated work products; feedback notes; follow-up tracker",
          ],
          [
            "Week 4: Development Check-In",
            "Confirm next-quarter focus.",
            "Review what is clear, what still needs support, and which responsibilities should become more independent during the quarter.",
            "30-day reflection; manager feedback; quarterly focus updates",
          ],
        ]
      : [],
    startupManagerSupport: includeStartupPlan
      ? [
          `Confirm the most important outcomes for ${name}'s role this quarter.`,
          "Clarify decision rights, escalation paths, and expected work products.",
          "Provide examples of strong work quality for the role.",
          "Give feedback on at least one current work product or deliverable.",
          "Identify where more context, tools, or stakeholder access would help.",
        ]
      : [],
    startupReflection: includeStartupPlan
      ? [
          "Which parts of my role are clearest right now?",
          "Which responsibilities need more context or examples?",
          "What work products best show progress in this role?",
          "Where do I need manager input before moving independently?",
          "What should I be ready to own more consistently by the next check-in?",
        ]
      : [],
    focusAreas: competencies.map(([competency, definition]) => [competency, definition]),
    quarterlyGoals: defaultQuarterlyGoals(role, responsibilities),
    quarterlyPrompts: [
      `Which outcomes can ${name} explain and evidence clearly this quarter?`,
      "Which responsibilities are being completed with stronger consistency and follow-through?",
      "Where is the role still blocked by unclear decisions, tools, data, or stakeholder context?",
      "Which competency expectation level needs the most practice or coaching?",
      "What should be reinforced before the semiannual review point?",
    ],
    semiannualOutcomes: defaultSemiannualOutcomes(role, competencies),
    managerSupport: [
      "Hold a recurring role-priority and progress check-in.",
      "Clarify what good work looks like for the highest-priority outcomes.",
      "Connect feedback to the competency expectation map.",
      "Remove blockers related to tools, context, stakeholder access, or decision clarity.",
      "Document any role expectation clarifications that should be reflected in the profile.",
    ],
    employeeReflection: [
      "What outcome am I most confident I can evidence?",
      "Which competency expectation is becoming more consistent?",
      "Where do I need clearer examples, tools, or context?",
      "What work products best show my current contribution?",
      "What should I focus on before the semiannual review point?",
    ],
  };
}

export function getDevelopmentPlan(roleId: string): DevelopmentPlan | null {
  const configuredPlan = DEVELOPMENT_PLANS.find((item) => item.personId === roleId);
  if (configuredPlan) return configuredPlan;
  const role = getRoleById(roleId);
  return role ? buildDefaultDevelopmentPlan(role) : null;
}
