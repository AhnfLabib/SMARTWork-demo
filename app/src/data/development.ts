import type { DevelopmentPlan } from "../types/development";

export const DEVELOPMENT_PLANS: DevelopmentPlan[] = [
  {
    personId: "ahnaf-labib",
    planTitle: "Development Plan",
    period: "July 6, 2026 - December 31, 2026",
    startupPeriod: "July 13, 2026 - August 11, 2026",
    quarterlyPeriod: "July 6, 2026 - September 30, 2026",
    semiannualPeriod: "July 6, 2026 - December 31, 2026",
    planBasis: "Initial role-based development guidance based on Ahnaf's current project manager role, capacity assignment, outcomes, responsibilities, and competency model. Future updates should be informed by manager/employee review conversations, role outcome evidence, competency assessment, and capacity priorities.",
    startupPurpose: "Help Ahnaf reconnect to active workstreams, clarify stepped-up ownership expectations, and begin operating as a project/product operations contributor rather than an intern support role.",
    startupAssignments: [
      [
        "Noble",
        "Reconnect to project status and next steps",
        "Review current project materials, identify open items, confirm upcoming milestones, and clarify coordination support with Nick.",
        "Current project summary, open-items list, next-step tracker"
      ],
      [
        "MLK",
        "Understand deliverables and communication rhythm",
        "Review project background, meetings, deliverables, and stakeholder needs; begin maintaining notes or status updates.",
        "Project rhythm documented, meeting notes current, deliverables tracker updated"
      ],
      [
        "Westfield",
        "Step into higher-capacity coordination",
        "Clarify milestones, active dependencies, and weekly work expectations early because this is the largest project allocation.",
        "Westfield workplan or tracker updated; weekly status view established"
      ],
      [
        "Shepherd",
        "Clarify scope and handoff points",
        "Review current scope, identify what needs coordination, and document how the role supports progress.",
        "Scope notes, action-item list, handoff or coordination notes"
      ],
      [
        "WINS / SMARTWork",
        "Reconnect to product logic and active workflows",
        "Review product materials, current workflow assumptions, implementation questions, and where project support is needed.",
        "Product notes, workflow questions, implementation support list"
      ],
      [
        "WFInsights / GWC",
        "Understand product and data context",
        "Review current product status, data/dashboard needs, and implementation or support tasks.",
        "Product/data context summary, next-step notes"
      ],
      [
        "Data & IT Work Group",
        "Re-enter internal systems support",
        "Confirm current Data & IT priorities, tools, recurring needs, and where technical or project coordination support is expected.",
        "Workgroup notes, priority list, technical/context questions"
      ]
    ],
    startupWeeks: [
      [
        "Week 1: Re-entry and Context Refresh",
        "Regain current-state awareness.",
        "Meet with Nick to confirm expectations and priority order; review assigned project and product materials; identify what changed since the internship; build one consolidated startup tracker.",
        "Assignment tracker; questions list; project/product status notes; confirmed check-in rhythm with Nick"
      ],
      [
        "Week 2: Workstream Mapping",
        "Understand how each assignment moves.",
        "Map project milestones, owners, dependencies, and recurring meetings; clarify what he owns versus supports; begin updating trackers and notes; identify unclear handoffs as questions.",
        "Project-by-project workstream map; updated trackers; product workflow notes"
      ],
      [
        "Week 3: Active Coordination",
        "Begin operating in the stepped-up role.",
        "Run or support follow-up loops; prepare status updates; own selected documentation or coordination tasks; test where he can independently move work forward.",
        "Weekly status update; meeting notes and action items; updated project trackers; one technical/product question advanced"
      ],
      [
        "Week 4: Role Step-Up Review",
        "Confirm what he is ready to own going forward.",
        "Review the first month with Nick; identify workstreams he can manage with less prompting; confirm where more context, training, or decision access is needed.",
        "30-day reflection; manager feedback notes; updated capacity or assignment clarity if needed; next 60-day focus areas"
      ]
    ],
    startupManagerSupport: [
      "Provide one clear priority order across all assignments.",
      "Give Ahnaf examples of strong project trackers and status notes.",
      "Identify which meetings he should attend, support, or eventually help run.",
      "Give feedback on one tracker or work product each week.",
      "Clarify what ownership means for Westfield versus the smaller allocations."
    ],
    startupReflection: [
      "What feels familiar from my internship?",
      "What feels different now that I am in a Project Manager role?",
      "Which project do I understand best right now?",
      "Which assignment has the most unclear expectations?",
      "What can I own independently by the end of 30 days?",
      "What support do I need from Nick to move faster?"
    ],
    focusAreas: [
      [
        "Project & Workstream Coordination",
        "Build reliable rhythms for Noble, MLK, Westfield, and Shepherd through trackers, meeting notes, milestones, status updates, and follow-through."
      ],
      [
        "Product Operations",
        "Connect WINS, SMARTWork, WFInsights, and GWC work to usable product notes, workflow maps, implementation questions, and product support outputs."
      ],
      [
        "Automation & Prototype Support",
        "Grow confidence testing lightweight workflows, documenting assumptions, troubleshooting technical issues, and refining prototype concepts."
      ],
      [
        "Dashboard & Data Support",
        "Support workforce intelligence through organized data inputs, validation notes, dashboard files, and clear data-flow assumptions."
      ],
      [
        "Documentation & Handoff",
        "Create records that make scope, status, technical logic, and next steps easy for Nick and other teammates to understand or continue."
      ]
    ],
    quarterlyGoals: [
      [
        "Establish weekly project rhythm",
        "Noble, MLK, Westfield, and Shepherd coordination",
        "Current trackers, recurring updates, meeting notes, next-step lists, and open-item follow-through"
      ],
      [
        "Clarify product support responsibilities",
        "WINS / SMARTWork and WFInsights / GWC",
        "Product notes, workflow maps, implementation questions, and prioritized product support tasks"
      ],
      [
        "Support data and dashboard readiness",
        "Data & IT Work Group",
        "Validated files, dashboard inputs, data-flow notes, and documented assumptions"
      ],
      [
        "Practice technical troubleshooting routines",
        "Automation and prototype support",
        "Issue logs, tested options, questions escalated, and decisions documented"
      ],
      [
        "Create useful handoff documentation",
        "Documentation & Handoff competency",
        "Handoff notes, status summaries, process documentation, and reusable templates"
      ]
    ],
    quarterlyPrompts: [
      "What workstreams can Ahnaf explain clearly without heavy manager context?",
      "Which projects have reliable tracking, milestones, and next steps?",
      "Where is he still blocked by unclear tools, data, decisions, or technical assumptions?",
      "What documentation has made someone else's work easier to continue?",
      "Which assignment should receive more manager context before the next quarter?"
    ],
    semiannualOutcomes: [
      [
        "More independent multi-workstream ownership",
        "Ahnaf can manage recurring coordination routines across assigned projects with fewer reminders, clearer prioritization, and timely escalation."
      ],
      [
        "Stronger product operations judgment",
        "He can connect product ideas to workflow steps, implementation considerations, and reusable support documentation with less prompting."
      ],
      [
        "Improved technical problem framing",
        "He can identify issues, test options, document tradeoffs, and recommend practical next steps before escalating."
      ],
      [
        "Reliable data and dashboard support habits",
        "He can organize inputs, validate files, explain assumptions, and maintain clearer data-flow documentation."
      ],
      [
        "Reusable documentation as a default work habit",
        "His notes, trackers, and handoffs make it easier for Nick, project teams, or future team members to continue the work."
      ]
    ],
    managerSupport: [
      "Hold a weekly project priority check-in.",
      "Clarify escalation paths for blocked technical issues.",
      "Provide examples of strong project documentation and status updates.",
      "Give feedback on one work product per week during onboarding.",
      "Review capacity mix and assignment clarity monthly."
    ],
    employeeReflection: [
      "What project or product area is becoming clearest?",
      "Where do I need more context?",
      "What tools or systems do I need more practice with?",
      "What documentation am I creating that others can use?",
      "What work am I ready to own with more independence?"
    ]
  }
];
