const state = {
  query: "",
  function: "All",
  family: "All",
  reportsTo: "All",
  selectedId: null,
  collapsedLevels: new Set()
};

let printRestoreQueue = [];
let printMode = "profile";

const els = {
  search: document.querySelector("#searchInput"),
  functionFilter: document.querySelector("#functionFilter"),
  familyFilter: document.querySelector("#familyFilter"),
  reportsFilter: document.querySelector("#reportsFilter"),
  clear: document.querySelector("#clearFilters"),
  list: document.querySelector("#roleList"),
  count: document.querySelector("#resultCount"),
  detail: document.querySelector("#detailRoot"),
  orgChart: document.querySelector("#orgChart"),
  orgSearch: document.querySelector("#orgSearchInput"),
  orgSearchClear: document.querySelector("#orgSearchClear"),
  orgSearchMeta: document.querySelector("#orgSearchMeta"),
  homeBrand: document.querySelector("#homeBrand")
};

const ORG_TREE = {
  name: "Mike Simmons",
  title: "CEO & Founder",
  type: "executive",
  profileId: "mike-simmons",
  children: [
    {
      name: "John Brandon",
      title: "VP of Nonprofit Sector",
      type: "executive",
      profileId: "john-brandon"
    },
    {
      name: "Jack Dougher",
      title: "Director of Workforce Development",
      type: "director",
      profileId: "jack-dougher",
      children: [
        {
              name: "Derek Miller",
              title: "Project Manager",
              type: "manager",
              profileId: "derek-miller",
              children: [{ name: "Brady Trebley", title: "Research and Business Development Intern", type: "intern", profileId: "brady-trebley" }]
            },
            {
              name: "Nick Schramm",
              title: "Project Manager",
              type: "manager",
              profileId: "nick-schramm",
              children: [
                { name: "Ahnaf Labib", title: "Project Manager", type: "manager", profileId: "ahnaf-labib" },
                { name: "Austin Cooper", title: "Marketing and Business Development Intern", type: "intern", profileId: "austin-cooper" },
                { name: "Tapan Mandal", title: "Data and Strategy Intern", type: "intern", profileId: "tapan-mandal" }
              ]
        }
      ]
    },
    {
      name: "Hoyt Stafford",
      title: "Director of Project Management",
      type: "director",
      profileId: "hoyt-stafford",
      children: [
        { name: "Owen Nguyen", title: "Financial Analysis & Product Strategy Intern", type: "intern", profileId: "owen-nguyen" },
        { name: "Keagan Combs", title: "Research Intern", type: "intern", profileId: "keagan-combs" }
      ]
    },
    {
      name: "Gary Raikes",
      title: "Senior Vice President, Business Development & Growth Strategy",
      type: "executive",
      profileId: "gary-raikes",
      children: [
        { name: "Adelai Elsener", title: "Marketing and Sales Operations Coordinator", type: "manager", profileId: "adelai-elsener" }
      ]
    },
    { name: "Chelsea Neulieb", title: "Consultant", type: "consultant", profileId: "chelsea-neulieb" },
    { name: "Bryan Alig", title: "Director of Work-Based Learning", type: "director", profileId: "bryan-alig" },
    { name: "Eric Kilbride", title: "Part-Time Business Development Advisor", type: "consultant", profileId: "eric-kilbride" },
    { name: "Ben Neumann", title: "Director, Southeast U.S. Business Development", type: "consultant", profileId: "ben-neumann" }
  ]
};

const CAPACITY_DATA = [
  {
    personId: "ahnaf-labib",
    effectiveDate: "2026-07-06",
    basis: "Planned working capacity allocation for onboarding and assignment clarity.",
    allocations: [
      { category: "Project", name: "Noble", percent: 15 },
      { category: "Project", name: "MLK", percent: 15 },
      { category: "Project", name: "Westfield", percent: 30 },
      { category: "Project", name: "Shepherd", percent: 20 },
      { category: "Product", name: "WINS / SMARTWork", percent: 10 },
      { category: "Product", name: "WFInsights / GWC", percent: 5 },
      { category: "Internal", name: "Data & IT Work Group", percent: 5 }
    ]
  }
];

const DEVELOPMENT_PLAN_DATA = [
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
      ["Noble", "Reconnect to project status and next steps", "Review current project materials, identify open items, confirm upcoming milestones, and clarify coordination support with Nick.", "Current project summary, open-items list, next-step tracker"],
      ["MLK", "Understand deliverables and communication rhythm", "Review project background, meetings, deliverables, and stakeholder needs; begin maintaining notes or status updates.", "Project rhythm documented, meeting notes current, deliverables tracker updated"],
      ["Westfield", "Step into higher-capacity coordination", "Clarify milestones, active dependencies, and weekly work expectations early because this is the largest project allocation.", "Westfield workplan or tracker updated; weekly status view established"],
      ["Shepherd", "Clarify scope and handoff points", "Review current scope, identify what needs coordination, and document how the role supports progress.", "Scope notes, action-item list, handoff or coordination notes"],
      ["WINS / SMARTWork", "Reconnect to product logic and active workflows", "Review product materials, current workflow assumptions, implementation questions, and where project support is needed.", "Product notes, workflow questions, implementation support list"],
      ["WFInsights / GWC", "Understand product and data context", "Review current product status, data/dashboard needs, and implementation or support tasks.", "Product/data context summary, next-step notes"],
      ["Data & IT Work Group", "Re-enter internal systems support", "Confirm current Data & IT priorities, tools, recurring needs, and where technical or project coordination support is expected.", "Workgroup notes, priority list, technical/context questions"]
    ],
    startupWeeks: [
      ["Week 1: Re-entry and Context Refresh", "Regain current-state awareness.", "Meet with Nick to confirm expectations and priority order; review assigned project and product materials; identify what changed since the internship; build one consolidated startup tracker.", "Assignment tracker; questions list; project/product status notes; confirmed check-in rhythm with Nick"],
      ["Week 2: Workstream Mapping", "Understand how each assignment moves.", "Map project milestones, owners, dependencies, and recurring meetings; clarify what he owns versus supports; begin updating trackers and notes; identify unclear handoffs as questions.", "Project-by-project workstream map; updated trackers; product workflow notes"],
      ["Week 3: Active Coordination", "Begin operating in the stepped-up role.", "Run or support follow-up loops; prepare status updates; own selected documentation or coordination tasks; test where he can independently move work forward.", "Weekly status update; meeting notes and action items; updated project trackers; one technical/product question advanced"],
      ["Week 4: Role Step-Up Review", "Confirm what he is ready to own going forward.", "Review the first month with Nick; identify workstreams he can manage with less prompting; confirm where more context, training, or decision access is needed.", "30-day reflection; manager feedback notes; updated capacity or assignment clarity if needed; next 60-day focus areas"]
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
      ["Project & Workstream Coordination", "Build reliable rhythms for Noble, MLK, Westfield, and Shepherd through trackers, meeting notes, milestones, status updates, and follow-through."],
      ["Product Operations", "Connect WINS, SMARTWork, WFInsights, and GWC work to usable product notes, workflow maps, implementation questions, and product support outputs."],
      ["Automation & Prototype Support", "Grow confidence testing lightweight workflows, documenting assumptions, troubleshooting technical issues, and refining prototype concepts."],
      ["Dashboard & Data Support", "Support workforce intelligence through organized data inputs, validation notes, dashboard files, and clear data-flow assumptions."],
      ["Documentation & Handoff", "Create records that make scope, status, technical logic, and next steps easy for Nick and other teammates to understand or continue."]
    ],
    quarterlyGoals: [
      ["Establish weekly project rhythm", "Noble, MLK, Westfield, and Shepherd coordination", "Current trackers, recurring updates, meeting notes, next-step lists, and open-item follow-through"],
      ["Clarify product support responsibilities", "WINS / SMARTWork and WFInsights / GWC", "Product notes, workflow maps, implementation questions, and prioritized product support tasks"],
      ["Support data and dashboard readiness", "Data & IT Work Group", "Validated files, dashboard inputs, data-flow notes, and documented assumptions"],
      ["Practice technical troubleshooting routines", "Automation and prototype support", "Issue logs, tested options, questions escalated, and decisions documented"],
      ["Create useful handoff documentation", "Documentation & Handoff competency", "Handoff notes, status summaries, process documentation, and reusable templates"]
    ],
    quarterlyPrompts: [
      "What workstreams can Ahnaf explain clearly without heavy manager context?",
      "Which projects have reliable tracking, milestones, and next steps?",
      "Where is he still blocked by unclear tools, data, decisions, or technical assumptions?",
      "What documentation has made someone else's work easier to continue?",
      "Which assignment should receive more manager context before the next quarter?"
    ],
    semiannualOutcomes: [
      ["More independent multi-workstream ownership", "Ahnaf can manage recurring coordination routines across assigned projects with fewer reminders, clearer prioritization, and timely escalation."],
      ["Stronger product operations judgment", "He can connect product ideas to workflow steps, implementation considerations, and reusable support documentation with less prompting."],
      ["Improved technical problem framing", "He can identify issues, test options, document tradeoffs, and recommend practical next steps before escalating."],
      ["Reliable data and dashboard support habits", "He can organize inputs, validate files, explain assumptions, and maintain clearer data-flow documentation."],
      ["Reusable documentation as a default work habit", "His notes, trackers, and handoffs make it easier for Nick, project teams, or future team members to continue the work."]
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

function uniqueValues(getter) {
  return ["All", ...Array.from(new Set(ROLE_DATA.map(getter).filter(Boolean))).sort()];
}

function populateSelect(select, values) {
  select.innerHTML = values.map(value => `<option value="${escapeAttr(value)}">${escapeHtml(value)}</option>`).join("");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value = "") {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function safeId(value = "") {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getCapacityProfile(roleId) {
  return CAPACITY_DATA.find(item => item.personId === roleId) || null;
}

function firstName(person = "Team member") {
  return String(person).split(" ")[0] || "Team member";
}

function defaultQuarterlyGoals(role, responsibilities) {
  const rows = responsibilities.slice(0, 5).map(([area, responsibility, products]) => [
    `Stabilize ${area.toLowerCase()} execution`,
    responsibility,
    products
  ]);

  if (rows.length) return rows;

  return role.outcomes.slice(0, 5).map(([outcome, success, evidence]) => [
    `Advance ${outcome.toLowerCase()}`,
    success,
    evidence
  ]);
}

function defaultSemiannualOutcomes(role, competencies) {
  const rows = competencies.slice(0, 5).map(([competency, definition, behavior]) => [
    `Stronger ${competency.toLowerCase()} ownership`,
    `${definition} By the semiannual review point, this should show up through more independent judgment, cleaner follow-through, and observable behaviors such as: ${behavior}`
  ]);

  if (rows.length) return rows;

  return role.outcomes.slice(0, 5).map(([outcome, success]) => [
    `Stronger ownership of ${outcome.toLowerCase()}`,
    `${success} By the semiannual review point, evidence should show more independent ownership, stronger quality, and more consistent follow-through.`
  ]);
}

function buildDefaultDevelopmentPlan(role) {
  const name = firstName(role.person);
  const outcomes = role.outcomes.slice(0, 5);
  const responsibilities = role.responsibilities.slice(0, 5);
  const competencies = role.competencies.slice(0, 5);
  const roleAnchor = role.standardizedTitle || role.sourceTitle;
  const includeStartupPlan = role.id === "adelai-elsener";
  const isAdelai = role.id === "adelai-elsener";
  const planPeriod = isAdelai ? "August 1, 2026 - January 31, 2027" : "July 1, 2026 - December 31, 2026";
  const startupPeriod = isAdelai ? "August 1, 2026 - August 30, 2026" : "First 30 days of the current plan cycle";
  const quarterlyPeriod = isAdelai ? "August 1, 2026 - October 31, 2026" : "July 1, 2026 - September 30, 2026";
  const semiannualPeriod = isAdelai ? "August 1, 2026 - January 31, 2027" : "July 1, 2026 - December 31, 2026";

  return {
    personId: role.id,
    planTitle: "Development Plan",
    period: planPeriod,
    startupPeriod: includeStartupPlan ? startupPeriod : "",
    quarterlyPeriod,
    semiannualPeriod,
    planBasis: `Initial role-based development guidance based on ${name}'s current ${roleAnchor} role profile, role outcomes, responsibilities, and competency expectation map. Future updates should be informed by manager/employee review conversations, role outcome evidence, competency assessment, and capacity priorities.`,
    startupPurpose: includeStartupPlan ? `Help ${name} confirm current priorities, reconnect role expectations to active work, and identify the support needed to operate clearly in the role.` : "",
    startupAssignments: includeStartupPlan ? responsibilities.slice(0, 4).map(([area, responsibility, products]) => [
      area,
      `Clarify current ownership for ${area.toLowerCase()}.`,
      responsibility,
      products
    ]) : [],
    startupWeeks: includeStartupPlan ? [
      ["Week 1: Role Context and Priorities", "Confirm current-state expectations.", `Review the role profile with the manager, confirm priority outcomes, and identify the most important workstreams connected to ${roleAnchor}.`, "Priority list; questions log; confirmed check-in rhythm"],
      ["Week 2: Workstream and Evidence Mapping", "Connect responsibilities to current work.", "Map active responsibilities, deliverables, stakeholders, tools, and evidence that should show progress.", "Workstream map; deliverable list; stakeholder/context notes"],
      ["Week 3: Active Ownership Practice", "Move work forward with clear evidence.", "Own or support selected responsibilities, produce visible work products, and request feedback on quality, timing, and communication.", "Updated work products; feedback notes; follow-up tracker"],
      ["Week 4: Development Check-In", "Confirm next-quarter focus.", "Review what is clear, what still needs support, and which responsibilities should become more independent during the quarter.", "30-day reflection; manager feedback; quarterly focus updates"]
    ] : [],
    startupManagerSupport: includeStartupPlan ? [
      `Confirm the most important outcomes for ${name}'s role this quarter.`,
      "Clarify decision rights, escalation paths, and expected work products.",
      "Provide examples of strong work quality for the role.",
      "Give feedback on at least one current work product or deliverable.",
      "Identify where more context, tools, or stakeholder access would help."
    ] : [],
    startupReflection: includeStartupPlan ? [
      "Which parts of my role are clearest right now?",
      "Which responsibilities need more context or examples?",
      "What work products best show progress in this role?",
      "Where do I need manager input before moving independently?",
      "What should I be ready to own more consistently by the next check-in?"
    ] : [],
    focusAreas: competencies.map(([competency, definition]) => [competency, definition]),
    quarterlyGoals: defaultQuarterlyGoals(role, responsibilities),
    quarterlyPrompts: [
      `Which outcomes can ${name} explain and evidence clearly this quarter?`,
      "Which responsibilities are being completed with stronger consistency and follow-through?",
      "Where is the role still blocked by unclear decisions, tools, data, or stakeholder context?",
      "Which competency expectation level needs the most practice or coaching?",
      "What should be reinforced before the semiannual review point?"
    ],
    semiannualOutcomes: defaultSemiannualOutcomes(role, competencies),
    managerSupport: [
      "Hold a recurring role-priority and progress check-in.",
      "Clarify what good work looks like for the highest-priority outcomes.",
      "Connect feedback to the competency expectation map.",
      "Remove blockers related to tools, context, stakeholder access, or decision clarity.",
      "Document any role expectation clarifications that should be reflected in the profile."
    ],
    employeeReflection: [
      "What outcome am I most confident I can evidence?",
      "Which competency expectation is becoming more consistent?",
      "Where do I need clearer examples, tools, or context?",
      "What work products best show my current contribution?",
      "What should I focus on before the semiannual review point?"
    ]
  };
}

function getDevelopmentPlan(roleId) {
  const configuredPlan = DEVELOPMENT_PLAN_DATA.find(item => item.personId === roleId);
  if (configuredPlan) return configuredPlan;
  const role = ROLE_DATA.find(item => item.id === roleId);
  return role ? buildDefaultDevelopmentPlan(role) : null;
}

function hasStartupPlan(plan) {
  return Boolean(plan?.startupPeriod && plan?.startupWeeks?.length && plan?.startupAssignments?.length);
}

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function roleSearchText(role) {
  const capacity = getCapacityProfile(role.id);
  return [
    role.person,
    role.sourceTitle,
    role.standardizedTitle,
    role.roleFamily,
    role.reportsTo,
    role.function,
    role.primaryUse,
    role.observedWorkProfile,
    role.rolePurpose,
    role.designNote,
    role.outcomes.flat().join(" "),
    role.responsibilities.flat().join(" "),
    role.competencies.flat().join(" "),
    role.skills.join(" "),
    role.tools.join(" "),
    role.onet.flat().join(" "),
    capacity ? capacity.allocations.map(item => `${item.category} ${item.name} ${item.percent}`).join(" ") : ""
  ].join(" ").toLowerCase();
}

function matchesFilter(role) {
  const query = state.query.trim().toLowerCase();
  const queryMatch = !query || roleSearchText(role).includes(query);
  const functionMatch = state.function === "All" || role.function === state.function;
  const familyMatch = state.family === "All" || role.roleFamily === state.family;
  const reportsMatch = state.reportsTo === "All" || role.reportsTo === state.reportsTo;
  return queryMatch && functionMatch && familyMatch && reportsMatch;
}

function getFilteredRoles() {
  return ROLE_DATA.filter(matchesFilter);
}

function flattenOrgTree(node, level = 0, parent = "") {
  return [
    { ...node, level, parent },
    ...(node.children || []).flatMap(child => flattenOrgTree(child, level + 1, node.name))
  ];
}

function getOrgPeople() {
  return flattenOrgTree(ORG_TREE);
}

function orgPersonSearchText(person) {
  const role = person.profileId ? ROLE_DATA.find(item => item.id === person.profileId) : null;
  return [
    person.name,
    person.title,
    person.type,
    person.parent,
    role ? roleSearchText(role) : ""
  ].join(" ").toLowerCase();
}

function matchesOrgDirectory(person) {
  const role = person.profileId ? ROLE_DATA.find(item => item.id === person.profileId) : null;
  const query = state.query.trim().toLowerCase();
  const queryMatch = !query || orgPersonSearchText(person).includes(query);
  const functionMatch = state.function === "All" || (role && role.function === state.function);
  const familyMatch = state.family === "All" || (role && role.roleFamily === state.family);
  const reportsMatch = state.reportsTo === "All" || (role && role.reportsTo === state.reportsTo);
  return queryMatch && functionMatch && familyMatch && reportsMatch;
}

function getFilteredOrgPeople() {
  return getOrgPeople().filter(matchesOrgDirectory);
}

function openProfile(roleId) {
  const role = ROLE_DATA.find(item => item.id === roleId);
  if (!role) return;
  state.selectedId = roleId;
  renderDirectory();
  renderOrgChart();
  renderDetail(role);
  document.body.classList.add("detail-open");
}

function closeProfile() {
  document.body.classList.remove("detail-open");
  state.selectedId = null;
  els.detail.innerHTML = "";
  renderDirectory();
  renderOrgChart();
}

function returnHome() {
  state.query = "";
  state.function = "All";
  state.family = "All";
  state.reportsTo = "All";
  state.selectedId = null;
  document.body.classList.remove("detail-open");
  els.detail.innerHTML = "";
  els.search.value = "";
  if (els.orgSearch) els.orgSearch.value = "";
  els.functionFilter.value = "All";
  els.familyFilter.value = "All";
  els.reportsFilter.value = "All";
  renderDirectory();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function wireProfileHomeLogo() {
  document.querySelectorAll(".profile-home-link").forEach(link => {
    link.addEventListener("click", returnHome);
    link.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        returnHome();
      }
    });
  });
}

function renderOrgChart() {
  const orgLevels = [
    { label: "CEO", description: "Enterprise leadership", people: [ORG_TREE] },
    { label: "Sr. VP", description: "Senior relationship and growth leadership", people: [ORG_TREE.children[0], ORG_TREE.children[3]] },
    { label: "Directors", description: "Functional ownership and delivery leadership", people: [ORG_TREE.children[1], ORG_TREE.children[2], ORG_TREE.children[5]] },
    {
      label: "Managers",
      description: "Project execution, marketing, analytics, and implementation support",
      people: [ORG_TREE.children[1].children[0], ORG_TREE.children[1].children[1], ORG_TREE.children[1].children[1].children[0], ORG_TREE.children[3].children[0]]
    },
    {
      label: "Interns",
      description: "Early-career support across business development, marketing, data, finance, and research",
      people: [
        ORG_TREE.children[1].children[0].children[0],
        ORG_TREE.children[1].children[1].children[1],
        ORG_TREE.children[1].children[1].children[2],
        ...ORG_TREE.children[2].children
      ]
    },
    { label: "Contractors / Part-Time / Advisory", description: "Consulting, part-time, and advisory support", people: [ORG_TREE.children[4], ORG_TREE.children[6], ORG_TREE.children[7]] }
  ];

  function reportsToName(node) {
    if (node === ORG_TREE) return "";
    if (node.profileId === "eric-kilbride" || node.profileId === "ben-neumann") return "Aligned through Gary Raikes";
    if (ORG_TREE.children.includes(node)) return "Reports to Mike Simmons";
    if (ORG_TREE.children[1].children.includes(node)) return "Reports to Jack Dougher";
    if (ORG_TREE.children[2].children.includes(node)) return "Reports to Hoyt Stafford";
    if (ORG_TREE.children[3].children?.includes(node)) return "Reports to Gary Raikes";
    if (ORG_TREE.children[1].children[0].children?.includes(node)) return "Reports to Derek Miller";
    if (ORG_TREE.children[1].children[1].children?.includes(node)) return "Reports to Nick Schramm";
    return "";
  }

  function renderPersonCard(node, options = {}) {
    const hasProfile = Boolean(node.profileId);
    const role = hasProfile ? ROLE_DATA.find(item => item.id === node.profileId) : null;
    const active = node.profileId === state.selectedId;
    const tag = hasProfile ? "button" : "div";
    const attrs = hasProfile
      ? `type="button" data-profile-id="${escapeAttr(node.profileId)}" aria-label="Open profile for ${escapeAttr(node.name)}"`
      : `aria-label="${escapeAttr(node.name)} does not have a role profile yet"`;
    const tags = role
      ? role.function.split(",").slice(0, options.compact ? 1 : 2).map(item => `<span class="tag">${escapeHtml(item.trim())}</span>`).join("")
      : `<span class="tag pending">Profile pending</span>`;
    const capacityNote = role ? capacityBadge(role) : "";
    const standardLine = role
      ? `<span class="node-standard">Standardized: ${escapeHtml(role.standardizedTitle)}</span>`
      : `<span class="node-standard pending-copy">Detailed role profile not yet added.</span>`;
    const purpose = role ? role.rolePurpose : `${node.name} is represented in the current organization chart.`;
    const reportsTo = reportsToName(node);
    return `
      <${tag}
        class="org-node level-card ${options.leader ? "leader" : ""} ${escapeAttr(node.type)} ${hasProfile ? "has-profile" : "no-profile"} ${active ? "active" : ""}"
        ${attrs}
      >
        ${reportsTo ? `<span class="reports-chip">${escapeHtml(reportsTo)}</span>` : ""}
        <span class="node-name">${escapeHtml(node.name)}</span>
        <span class="node-role">${escapeHtml(node.title)}</span>
        ${standardLine}
        ${capacityNote}
        <span class="tag-row">${tags}</span>
        <span class="node-purpose">${escapeHtml(purpose)}</span>
      </${tag}>
    `;
  }

  const totalPeople = getOrgPeople().length;
  const queryActive = Boolean(state.query.trim() || state.function !== "All" || state.family !== "All" || state.reportsTo !== "All");
  const visibleLevels = orgLevels
    .map(level => ({ ...level, visiblePeople: level.people.filter(matchesOrgDirectory) }))
    .filter(level => level.visiblePeople.length || !queryActive);
  const visiblePeopleCount = visibleLevels.reduce((total, level) => total + level.visiblePeople.length, 0);

  if (els.orgSearchMeta) {
    els.orgSearchMeta.textContent = queryActive
      ? `Showing ${visiblePeopleCount} of ${totalPeople} people.`
      : `Showing all ${totalPeople} people in the current organization map.`;
  }

  if (!visiblePeopleCount) {
    els.orgChart.innerHTML = `<div class="empty-state">No people match the current search.</div>`;
    return;
  }

  els.orgChart.innerHTML = `
    <div class="level-org-board">
      ${visibleLevels.map(level => {
        const collapsed = state.collapsedLevels.has(level.label) && !queryActive;
        return `
        <section class="org-level level-${safeId(level.label)} ${level.label === "CEO" ? "top-level" : ""} ${collapsed ? "collapsed" : ""}">
          <div class="level-heading">
            <button class="level-toggle" type="button" data-level="${escapeAttr(level.label)}" aria-expanded="${collapsed ? "false" : "true"}">
              <span>${escapeHtml(level.label)}</span>
              <small>${escapeHtml(level.visiblePeople.length)} ${level.visiblePeople.length === 1 ? "person" : "people"}</small>
            </button>
            <span>${escapeHtml(level.description)}</span>
          </div>
          <div class="level-grid count-${level.visiblePeople.length}">
            ${collapsed ? "" : level.visiblePeople.map(person => renderPersonCard(person, { leader: level.label === "CEO" })).join("")}
          </div>
        </section>
      `;
      }).join("")}
    </div>
  `;

  els.orgChart.querySelectorAll(".level-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const level = button.dataset.level;
      if (state.collapsedLevels.has(level)) {
        state.collapsedLevels.delete(level);
      } else {
        state.collapsedLevels.add(level);
      }
      renderOrgChart();
    });
  });

  els.orgChart.querySelectorAll(".org-node.has-profile").forEach(node => {
    node.addEventListener("click", () => openProfile(node.dataset.profileId));
  });
}

function renderDirectory() {
  const people = getFilteredOrgPeople();
  const allPeople = getOrgPeople();
  els.count.textContent = `${people.length} of ${allPeople.length} people`;

  if (!people.length) {
    els.list.innerHTML = `<div class="empty-state">No people match the current search and filters.</div>`;
    renderOrgChart();
    return;
  }

  els.list.innerHTML = people.map(person => {
    const role = person.profileId ? ROLE_DATA.find(item => item.id === person.profileId) : null;
    const tags = role
      ? role.function.split(",").slice(0, 3).map(item => `<span class="tag">${escapeHtml(item.trim())}</span>`).join("")
      : `<span class="tag pending">Role profile pending</span>`;
    const topResponsibilities = role
      ? role.responsibilities.slice(0, 3).map(row => `<li>${escapeHtml(row[0])}</li>`).join("")
      : `<li>Profile not yet available</li>`;
    const standardLine = role
      ? `<span class="standard-title">Standardized: ${escapeHtml(role.standardizedTitle)}</span>`
      : `<span class="standard-title pending-copy">Detailed role profile not yet added.</span>`;
    const capacityNote = role ? capacityBadge(role) : "";
    const purpose = role
      ? role.rolePurpose
      : `${person.name} is included in the current organization chart. Detailed role information can be added when the role profile is available.`;
    const tagName = role ? "button" : "div";
    const attrs = role ? `type="button" data-id="${escapeAttr(role.id)}"` : "";
    return `
      <${tagName} class="role-card ${role && role.id === state.selectedId ? "active" : ""} ${role ? "" : "no-profile-card"}" ${attrs}>
        <span class="role-name">${escapeHtml(person.name)}</span>
        <span class="role-title">${escapeHtml(person.title)}</span>
        ${standardLine}
        ${capacityNote}
        <span class="tag-row">${tags}</span>
        <p class="role-purpose">${escapeHtml(purpose)}</p>
        <ol class="top-list">${topResponsibilities}</ol>
      </${tagName}>
    `;
  }).join("");

  els.list.querySelectorAll(".role-card").forEach(card => {
    if (card.dataset.id) {
      card.addEventListener("click", () => openProfile(card.dataset.id));
    }
  });

  renderOrgChart();
}

function table(headers, rows) {
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr>${headers.map(header => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function expectedCompetencyLevel(role) {
  const levelOneRoles = new Set(["tapan-mandal", "keagan-combs", "brady-trebley", "austin-cooper", "owen-nguyen"]);
  const levelTwoRoles = new Set(["ahnaf-labib", "adelai-elsener", "chelsea-neulieb", "derek-miller", "nick-schramm"]);

  if (levelOneRoles.has(role.id)) return "Level I";
  if (levelTwoRoles.has(role.id)) return "Level II";
  return "Level III";
}

function competencyExamples(behavior, limit = 4) {
  return behavior
    .split(/,\s+|;\s+/)
    .map(item => item.replace(/\.$/, "").trim())
    .filter(Boolean)
    .slice(0, limit);
}

function lowerFirst(value) {
  return value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
}

function naturalList(items) {
  const cleanItems = items.filter(Boolean);
  if (cleanItems.length <= 1) return cleanItems[0] || "";
  if (cleanItems.length === 2) return `${cleanItems[0]} and ${cleanItems[1]}`;
  return `${cleanItems.slice(0, -1).join(", ")}, and ${cleanItems[cleanItems.length - 1]}`;
}

function competencySuccessExamples(level, name, behavior) {
  const behaviorExamples = competencyExamples(behavior);
  const anchors = behaviorExamples.length ? behaviorExamples : [name];

  if (level === "Level I") {
    return anchors.slice(0, 3).map(item =>
      `Drafts, updates, checks, or gathers inputs for ${lowerFirst(item)} with direction before handoff.`
    );
  }

  if (level === "Level II") {
    return anchors.slice(0, 3).map(item =>
      `Owns ${lowerFirst(item)} from planning through completion and adjusts based on context, feedback, and quality needs.`
    );
  }

  return anchors.slice(0, 3).map(item =>
    `Defines standards, decision logic, or reusable methods for ${lowerFirst(item)} and helps others apply them consistently.`
  );
}

function competencyLevelContent(level, name, definition, behavior) {
  const cleanDefinition = definition.replace(/\s+/g, " ").trim();
  const behaviorExamples = competencyExamples(behavior, 3);
  const behaviorFocus = naturalList(behaviorExamples);
  const examples = competencySuccessExamples(level, name, behavior);

  if (level === "Level I") {
    return {
      expectations: [
        `Understands the purpose of ${name}: ${cleanDefinition}`,
        `Supports assigned pieces of ${lowerFirst(behaviorFocus || name)} with guidance, examples, or review.`
      ],
      examples
    };
  }
  if (level === "Level II") {
    return {
      expectations: [
        `Applies ${name} independently in current role work: ${cleanDefinition}`,
        `Owns ${lowerFirst(behaviorFocus || name)} with reliable quality, follow-through, and stakeholder awareness.`
      ],
      examples
    };
  }
  return {
    expectations: [
      `Sets direction for how ${name} should shape role, team, or organization decisions.`,
      `Defines standards for ${lowerFirst(behaviorFocus || name)} and aligns others around consistent execution.`
    ],
    examples
  };
}

function competencyLevelCell(level, name, definition, behavior) {
  const content = competencyLevelContent(level, name, definition, behavior);
  return `
    <div class="competency-level-block">
      <strong>Expectations</strong>
      <ul>
        ${content.expectations.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
      <strong>Examples of Success</strong>
      <ul>
        ${content.examples.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
  `;
}

function competencyLevelPlainText(level, name, definition, behavior) {
  const content = competencyLevelContent(level, name, definition, behavior);
  return [
    `${level}:`,
    ...content.expectations.map(item => `    Expectation: ${item}`),
    ...content.examples.map(item => `    Example: ${item}`)
  ];
}

function competencyExpectationMap(role) {
  const expectedLevel = expectedCompetencyLevel(role);
  const levels = ["Level I", "Level II", "Level III"];

  return `
    <div class="competency-expectation-intro">
      <strong>Role-scope marker:</strong>
      <span>The expected level describes where this role is designed to operate. It is not a person-specific assessment.</span>
    </div>
    <div class="table-wrap competency-expectation-wrap">
      <table class="data-table competency-expectation-table">
        <thead>
          <tr>
            <th>Competency</th>
            ${levels.map(level => `<th>${level}</th>`).join("")}
            <th>Expected for Role</th>
          </tr>
        </thead>
        <tbody>
          ${role.competencies.map(([name, definition, behavior]) => `
            <tr>
              <td><strong>${escapeHtml(name)}</strong></td>
              ${levels.map(level => `
                <td class="${level === expectedLevel ? "expected-level-cell" : ""}">
                  ${competencyLevelCell(level, name, definition, behavior)}
                </td>
              `).join("")}
              <td class="expected-role-cell">
                <span class="expected-level-badge">${escapeHtml(expectedLevel)}</span>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function competencyExpectationExportLines(role) {
  const expectedLevel = expectedCompetencyLevel(role);
  const levels = ["Level I", "Level II", "Level III"];

  return role.competencies.flatMap(([name, definition, behavior]) => [
    `- ${name}`,
    ...levels.flatMap(level => competencyLevelPlainText(level, name, definition, behavior)),
    `  Expected for role: ${expectedLevel}`
  ]);
}

function capacityTotals(capacity) {
  return capacity.allocations.reduce((totals, item) => {
    totals[item.category] = (totals[item.category] || 0) + item.percent;
    totals.total += item.percent;
    return totals;
  }, { total: 0 });
}

function groupedAllocations(capacity) {
  return capacity.allocations.reduce((groups, item) => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
    return groups;
  }, {});
}

function capacityCategoryClass(category) {
  return safeId(category || "Other");
}

function capacitySummary(role) {
  const capacity = getCapacityProfile(role.id);
  if (!capacity) return "";
  const totals = capacityTotals(capacity);
  return `Project ${totals.Project || 0}% / Product ${totals.Product || 0}% / Internal ${totals.Internal || 0}%`;
}

function capacityBadge(role) {
  const summary = capacitySummary(role);
  return summary
    ? `<span class="capacity-mini-badge">Capacity plan: ${escapeHtml(summary)}</span>`
    : "";
}

function capacityHeroStrip(role) {
  const capacity = getCapacityProfile(role.id);
  if (!capacity) return "";
  const totals = capacityTotals(capacity);
  return `
    <div class="capacity-hero-strip">
      <span><strong>Capacity effective</strong> ${escapeHtml(formatDate(capacity.effectiveDate))}</span>
      <span><strong>Project</strong> ${totals.Project || 0}%</span>
      <span><strong>Product</strong> ${totals.Product || 0}%</span>
      <span><strong>Internal</strong> ${totals.Internal || 0}%</span>
    </div>
  `;
}

function capacityComponent(role, options = {}) {
  const capacity = getCapacityProfile(role.id);
  if (!capacity) return "";

  const totals = capacityTotals(capacity);
  const groups = groupedAllocations(capacity);
  const categoryOrder = ["Project", "Product", "Internal"];
  const displayGroups = categoryOrder.filter(category => groups[category]?.length);
  const categoryLabels = displayGroups.map(category => ({
    category,
    percent: totals[category] || 0,
    className: capacityCategoryClass(category)
  }));

  return `
    <div class="capacity-card ${options.compact ? "compact" : ""}">
      <div class="capacity-card-header">
        <div>
          <span class="card-label">Current Assignment Clarity</span>
          <h3>${escapeHtml(role.person)}</h3>
          <p>${escapeHtml(capacity.basis)}</p>
        </div>
        <div class="capacity-total ${totals.total === 100 ? "complete" : "partial"}">
          <strong>${totals.total}%</strong>
          <span>Total planned capacity</span>
        </div>
      </div>

      <div class="capacity-meta-grid">
        <div><span>Effective date</span><strong>${escapeHtml(formatDate(capacity.effectiveDate))}</strong></div>
        ${categoryLabels.map(item => `
          <div><span>${escapeHtml(item.category)} work</span><strong>${item.percent}%</strong></div>
        `).join("")}
      </div>

      <div class="capacity-stacked-bar" aria-label="Capacity allocation bar">
        ${categoryLabels.map(item => `
          <span class="${escapeAttr(item.className)}" style="width: ${item.percent}%">
            ${escapeHtml(item.category)} ${item.percent}%
          </span>
        `).join("")}
      </div>

      <div class="capacity-group-grid">
        ${displayGroups.map(category => `
          <section class="capacity-group ${escapeAttr(capacityCategoryClass(category))}">
            <div class="capacity-group-title">
              <h4>${escapeHtml(category)} Work</h4>
              <strong>${totals[category]}%</strong>
            </div>
            <div class="allocation-list">
              ${groups[category].map(item => `
                <div class="allocation-row">
                  <span>${escapeHtml(item.name)}</span>
                  <strong>${item.percent}%</strong>
                  <div class="allocation-meter"><span style="width: ${item.percent}%"></span></div>
                </div>
              `).join("")}
            </div>
          </section>
        `).join("")}
      </div>
    </div>
  `;
}

function section(title, content) {
  return `
    <section class="section profile-section">
      <h3>${escapeHtml(title)}</h3>
      <div class="section-content">${content}</div>
    </section>
  `;
}

function collapsibleSection(title, content, open = false) {
  return `
    <details class="section profile-section collapsible-section" ${open ? "open" : ""}>
      <summary>${escapeHtml(title)}</summary>
      <div class="section-content">${content}</div>
    </details>
  `;
}

function onetBenchmark(role) {
  const primary = role.onet[0];
  const secondary = role.onet.slice(1);
  const highMatches = role.onet.filter(row => row[2] === "High").length;
  const mediumMatches = role.onet.filter(row => row[2] === "Medium").length;
  const benchmarkRows = role.onet.map(row => [
    `${row[0]} ${row[1]}`,
    row[2],
    role.responsibilities.slice(0, 3).map(item => item[0]).join("; "),
    role.competencies.slice(0, 3).map(item => item[0]).join("; "),
    role.tools.slice(0, 5).join("; ")
  ]);

  return `
    <div class="onet-summary-grid">
      <div class="onet-summary-card primary">
        <span class="card-label">Primary O*NET Anchor</span>
        <strong>${escapeHtml(primary[0])}</strong>
        <p>${escapeHtml(primary[1])}</p>
        <span class="fit-badge ${escapeAttr(primary[2].toLowerCase())}">${escapeHtml(primary[2])} fit</span>
      </div>
      <div class="onet-summary-card">
        <span class="card-label">Secondary Occupations</span>
        <strong>${secondary.length}</strong>
        <p>${escapeHtml(secondary.map(row => row[1]).join(", "))}</p>
      </div>
      <div class="onet-summary-card">
        <span class="card-label">Standardized Basis</span>
        <strong>${highMatches} High / ${mediumMatches} Medium</strong>
        <p>Aligned using current responsibilities, competencies, skills, tools, and work products already documented in the role profile.</p>
      </div>
    </div>
    <div class="benchmark-note">
      <strong>Hybrid role interpretation:</strong>
      BBS roles may align to more than one O*NET occupation because current-state work can span strategy, delivery, operations, analytics, product support, and external relationship responsibilities.
    </div>
    ${table(["O*NET Code + Occupation", "Fit", "BBS Responsibility Anchors", "BBS Competency Anchors", "BBS Tool / Work Product Anchors"], benchmarkRows)}
  `;
}

function onetDetail(role) {
  const primary = role.onet[0];
  return `
    <div class="benchmark-detail-grid">
      <div class="benchmark-panel">
        <h4>Occupation Benchmark</h4>
        <dl class="benchmark-definition-list">
          <div><dt>Primary code</dt><dd>${escapeHtml(primary[0])}</dd></div>
          <div><dt>Primary occupation</dt><dd>${escapeHtml(primary[1])}</dd></div>
          <div><dt>Fit basis</dt><dd>${escapeHtml(primary[3])}</dd></div>
        </dl>
      </div>
      <div class="benchmark-panel">
        <h4>Role Profile Mapping Fields</h4>
        <ul class="benchmark-checklist">
          <li>Role outcomes</li>
          <li>Core responsibilities</li>
          <li>Competency model</li>
          <li>Core skills</li>
          <li>Tools, systems, and work products</li>
        </ul>
      </div>
    </div>
    <div class="benchmark-detail-grid wide">
      <div class="benchmark-panel">
        <h4>Representative BBS Tasks</h4>
        <ul>${role.responsibilities.map(item => `<li><strong>${escapeHtml(item[0])}:</strong> ${escapeHtml(item[1])}</li>`).join("")}</ul>
      </div>
      <div class="benchmark-panel">
        <h4>Skills And Competencies</h4>
        <ul>${role.competencies.map(item => `<li><strong>${escapeHtml(item[0])}:</strong> ${escapeHtml(item[1])}</li>`).join("")}</ul>
      </div>
      <div class="benchmark-panel">
        <h4>Technology / Work Product Anchors</h4>
        <ul>${role.tools.map(tool => `<li>${escapeHtml(tool)}</li>`).join("")}</ul>
      </div>
    </div>
  `;
}

function workStyleGuide(role) {
  if (!role.workStyleGuide) return "";
  return `
    <div class="work-style-guide">
      <div class="work-style-intro">
        <strong>How to use this section</strong>
        <p>${escapeHtml(role.workStyleGuide.basis)}</p>
      </div>
      <div class="work-style-card-grid">
        ${role.workStyleGuide.cards.map(card => `
          <article class="work-style-card">
            <h4>${escapeHtml(card.title)}</h4>
            <ul>
              ${card.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function compactList(items, limit = 8) {
  const selected = items.slice(0, limit);
  const remaining = items.length - selected.length;
  return `${selected.join(", ")}${remaining > 0 ? `, +${remaining} more` : ""}`;
}

function profileSummaryPrint(role) {
  const expectedLevel = expectedCompetencyLevel(role);
  const topOutcomes = role.outcomes.slice(0, 5);
  const topResponsibilities = role.responsibilities.slice(0, 5);
  const topCompetencies = role.competencies.slice(0, 6);
  const primaryOnet = role.onet[0];
  const secondaryOnet = role.onet.slice(1, 4);

  return `
    <section class="profile-summary-print" aria-label="Printable profile summary">
      <div class="summary-print-header">
        <img src="assets/brand/bbs-logo-color-lockup.png" alt="Bridge Builder Strategies">
        <div>
          <span>Role Profile Summary</span>
          <h2>${escapeHtml(role.person)}</h2>
          <p>${escapeHtml(role.standardizedTitle)}</p>
        </div>
      </div>

      <dl class="summary-snapshot">
        <div><dt>Current title</dt><dd>${escapeHtml(role.sourceTitle)}</dd></div>
        <div><dt>Role family</dt><dd>${escapeHtml(role.roleFamily)}</dd></div>
        <div><dt>Reports to</dt><dd>${escapeHtml(role.reportsTo)}</dd></div>
        <div><dt>Function</dt><dd>${escapeHtml(role.function)}</dd></div>
      </dl>

      <section class="summary-block">
        <h3>Role Purpose</h3>
        <p>${escapeHtml(role.rolePurpose)}</p>
      </section>

      <section class="summary-block">
        <h3>Observed Work Profile</h3>
        <p>${escapeHtml(role.observedWorkProfile)}</p>
      </section>

      <section class="summary-block">
        <h3>Top Role Outcomes</h3>
        <table class="summary-table">
          <thead><tr><th>Outcome</th><th>Success / Evidence</th></tr></thead>
          <tbody>
            ${topOutcomes.map(([outcome, success, evidence]) => `
              <tr><td>${escapeHtml(outcome)}</td><td>${escapeHtml(success)} <strong>Evidence:</strong> ${escapeHtml(evidence)}</td></tr>
            `).join("")}
          </tbody>
        </table>
      </section>

      <section class="summary-block">
        <h3>Core Responsibilities</h3>
        <table class="summary-table">
          <thead><tr><th>Area</th><th>Current responsibilities</th></tr></thead>
          <tbody>
            ${topResponsibilities.map(([area, responsibility, products]) => `
              <tr><td>${escapeHtml(area)}</td><td>${escapeHtml(responsibility)} <strong>Work products:</strong> ${escapeHtml(products)}</td></tr>
            `).join("")}
          </tbody>
        </table>
      </section>

      <section class="summary-block">
        <h3>Competency Expectations</h3>
        <table class="summary-table competency-summary-table">
          <thead><tr><th>Competency</th><th>Expected</th><th>Examples of success</th></tr></thead>
          <tbody>
            ${topCompetencies.map(([name, definition, behavior]) => {
              const examples = competencyLevelContent(expectedLevel, name, definition, behavior).examples.slice(0, 2);
              return `
                <tr>
                  <td>${escapeHtml(name)}</td>
                  <td>${escapeHtml(expectedLevel)}</td>
                  <td>${examples.map(item => escapeHtml(item)).join("<br>")}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </section>

      <section class="summary-two-col">
        <div class="summary-block">
          <h3>Core Skills</h3>
          <p>${escapeHtml(compactList(role.skills, 12))}</p>
        </div>
        <div class="summary-block">
          <h3>Tools / Work Products</h3>
          <p>${escapeHtml(compactList(role.tools, 12))}</p>
        </div>
      </section>

      ${role.workStyleGuide ? `
        <section class="summary-block">
          <h3>Work Style & Collaboration</h3>
          <ul class="summary-list">
            ${role.workStyleGuide.cards.slice(0, 3).map(card => `<li><strong>${escapeHtml(card.title)}:</strong> ${escapeHtml(card.items.slice(0, 2).join("; "))}</li>`).join("")}
          </ul>
        </section>
      ` : ""}

      <section class="summary-block">
        <h3>O*NET Benchmark</h3>
        <p><strong>${escapeHtml(primaryOnet?.[1] || "Not provided")}</strong>${primaryOnet ? ` (${escapeHtml(primaryOnet[0])}, ${escapeHtml(primaryOnet[2])} fit). ${escapeHtml(primaryOnet[3])}` : ""}</p>
        ${secondaryOnet.length ? `<p><strong>Additional alignments:</strong> ${escapeHtml(secondaryOnet.map(row => `${row[1]} (${row[2]})`).join("; "))}</p>` : ""}
      </section>

      ${role.designNote ? `
        <section class="summary-block">
          <h3>Role Design Note</h3>
          <p>${escapeHtml(role.designNote)}</p>
        </section>
      ` : ""}
    </section>
  `;
}

function renderDetail(role) {
  if (!role) {
    els.detail.innerHTML = "";
    return;
  }

  const developmentPlan = getDevelopmentPlan(role.id);
  const capacitySection = getCapacityProfile(role.id)
    ? section("Current Capacity Assignment", capacityComponent(role, { compact: true }))
    : "";
  const developmentAction = developmentPlan
    ? `<button class="action-button development-action" type="button" id="openDevelopment">Development plan</button>`
    : "";

  const snapshot = [
    ["Person name", role.person],
    ["Current source title", role.sourceTitle],
    ["Recommended standardized title", role.standardizedTitle],
    ["Recommended role family", role.roleFamily],
    ["Reports to", role.reportsTo],
    ["Function", role.function],
    ["Primary use", role.primaryUse]
  ];

  const sourceLinks = role.sources.length
    ? role.sources.map((src, index) => {
      const isImage = /\.(png|jpe?g|webp|gif)$/i.test(src);
      const filename = src.split("/").pop();
      return `
        <a class="source-card ${isImage ? "source-image" : "source-file"}" href="${escapeAttr(src)}" target="_blank" rel="noopener">
          ${isImage ? `<img src="${escapeAttr(src)}" alt="${escapeAttr(role.person)} source profile ${index + 1}">` : `<span class="source-file-icon" aria-hidden="true">DOC</span>`}
          <span>${isImage ? `Source profile ${index + 1}` : escapeHtml(filename || `Source document ${index + 1}`)}</span>
        </a>
      `;
    }).join("")
    : `<p class="muted">No source document is attached for this role yet.</p>`;

  els.detail.innerHTML = `
    <article class="profile-card">
      <div class="profile-hero">
        <div class="profile-title-block profile-home-link" role="button" tabindex="0" aria-label="Return to Role Clarity Library home">
          <img class="profile-logo" src="assets/brand/bbs-logo-white-lockup.png" alt="Bridge Builder Strategies">
          <p class="profile-kicker">Standardized Role Profile</p>
          <h2>${escapeHtml(role.person)}</h2>
          <p>${escapeHtml(role.standardizedTitle)}</p>
        </div>
        <div class="hero-actions">
          ${developmentAction}
          <button class="action-button review-action" type="button" id="openReview">360 review worksheet</button>
          <details class="action-menu">
            <summary>Print</summary>
            <div class="action-menu-panel">
              <button class="action-button secondary" type="button" id="printProfileSummary">Print summary</button>
              <button class="action-button secondary" type="button" id="printFullProfile">Print full profile</button>
            </div>
          </details>
          <button class="action-button" type="button" id="exportProfile">Export summary</button>
          <button class="ghost-button close-profile" type="button" id="closeProfile">Close</button>
        </div>
        <div class="profile-brand-rail" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>

      <dl class="snapshot-grid">
        ${snapshot.map(([label, value]) => `
          <div class="snapshot-item">
            <dt>${escapeHtml(label)}</dt>
            <dd>${escapeHtml(value)}</dd>
          </div>
        `).join("")}
      </dl>
      ${profileSummaryPrint(role)}
      ${capacityHeroStrip(role)}

      <div class="profile-body">
        <div class="notice">
          <strong>Observed work profile:</strong> ${escapeHtml(role.observedWorkProfile)}
        </div>

        ${collapsibleSection("Role Purpose", `<p class="narrative">${escapeHtml(role.rolePurpose)}</p>`)}
        ${capacitySection}
        ${collapsibleSection("Role Outcomes", table(["Outcome", "What Success Looks Like", "Evidence / Success Measures"], role.outcomes))}
        ${collapsibleSection("Core Responsibilities", table(["Responsibility Area", "Core Responsibilities", "Example Work Products"], role.responsibilities))}
        ${collapsibleSection("Competency Expectation Map", competencyExpectationMap(role))}
        ${role.workStyleGuide ? collapsibleSection("Work Style & Collaboration Guide", workStyleGuide(role)) : ""}
        ${collapsibleSection("Core Skills", `<ul class="pill-list">${role.skills.map(skill => `<li>${escapeHtml(skill)}</li>`).join("")}</ul>`)}
        ${collapsibleSection("Key Tools, Systems, and Work Products", `<ul class="pill-list">${role.tools.map(tool => `<li>${escapeHtml(tool)}</li>`).join("")}</ul>`)}
        ${collapsibleSection("O*NET Benchmark", `${onetBenchmark(role)}${onetDetail(role)}`)}
        ${role.designNote ? collapsibleSection("Role Design Note", `<p class="narrative">${escapeHtml(role.designNote)}</p>`) : ""}
        ${collapsibleSection("Supporting Source Documents", `<div class="source-grid">${sourceLinks}</div>`)}
      </div>
    </article>
  `;

  wireProfileHomeLogo();
  document.querySelector("#printProfileSummary").addEventListener("click", printProfileSummary);
  document.querySelector("#printFullProfile").addEventListener("click", printFullProfile);
  document.querySelector("#exportProfile").addEventListener("click", () => exportSummary(role));
  document.querySelector("#openReview").addEventListener("click", () => renderReviewWorksheet(role));
  document.querySelector("#openDevelopment")?.addEventListener("click", () => renderDevelopmentPlan(role));
  document.querySelector("#closeProfile").addEventListener("click", closeProfile);
}

function printProfileSummary() {
  printMode = "profile-summary";
  document.body.classList.add("profile-summary-printing");
  window.print();
}

function printFullProfile() {
  printMode = "profile";
  document.body.classList.add("profile-full-printing");
  window.print();
}

function developmentPillStrip(role, plan) {
  const capacity = getCapacityProfile(role.id);
  const totals = capacity ? capacityTotals(capacity) : {};
  return `
    <div class="development-pill-strip">
      <span><strong>Plan period</strong> ${escapeHtml(plan.period)}</span>
      <span><strong>Role</strong> ${escapeHtml(role.standardizedTitle)}</span>
      <span><strong>Manager</strong> ${escapeHtml(role.reportsTo)}</span>
      ${capacity ? `<span><strong>Capacity</strong> Project ${totals.Project || 0}% / Product ${totals.Product || 0}% / Internal ${totals.Internal || 0}%</span>` : ""}
    </div>
  `;
}

function developmentFocusCards(plan) {
  return `
    <div class="development-focus-grid">
      ${plan.focusAreas.map(([area, why]) => `
        <article class="development-focus-card">
          <h4>${escapeHtml(area)}</h4>
          <p>${escapeHtml(why)}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function developmentPromptList(items) {
  return `
    <div class="development-prompt-list">
      ${items.map((item, index) => `
        <label class="review-field full development-prompt">
          <span>${index + 1}. ${escapeHtml(item)}</span>
          <textarea rows="3" placeholder="Add notes, examples, context, or follow-up items."></textarea>
        </label>
      `).join("")}
    </div>
  `;
}

function startupWeekCards(plan) {
  return `
    <div class="startup-week-grid">
      ${plan.startupWeeks.map(([week, goal, focus, evidence]) => `
        <article class="startup-week-card">
          <span class="card-label">${escapeHtml(week)}</span>
          <h4>${escapeHtml(goal)}</h4>
          <p>${escapeHtml(focus)}</p>
          <strong>Evidence by week end</strong>
          <small>${escapeHtml(evidence)}</small>
        </article>
      `).join("")}
    </div>
  `;
}

function renderDevelopmentPlan(role) {
  const plan = getDevelopmentPlan(role.id);
  if (!plan) return;
  const capacity = getCapacityProfile(role.id);
  const capacitySummaryBlock = capacity ? capacityComponent(role, { compact: true }) : "";
  const personFirstName = firstName(role.person);
  const includesStartup = hasStartupPlan(plan);

  els.detail.innerHTML = `
    <article class="profile-card development-card">
      <div class="profile-hero development-hero">
        <div class="profile-title-block profile-home-link" role="button" tabindex="0" aria-label="Return to Role Clarity Library home">
          <img class="profile-logo" src="assets/brand/bbs-logo-white-lockup.png" alt="Bridge Builder Strategies">
          <p class="profile-kicker">Development Plan</p>
          <h2>${escapeHtml(role.person)}</h2>
          <p>${escapeHtml(role.standardizedTitle)}</p>
        </div>
        <div class="hero-actions development-controls">
          <button class="action-button" type="button" id="exportDevelopmentText">Export plan</button>
          <button class="action-button secondary" type="button" id="openDevelopmentReflections">Reflection worksheet</button>
          <details class="action-menu">
            <summary>More</summary>
            <div class="action-menu-panel">
              <button class="action-button secondary" type="button" id="printDevelopment">Print / Save PDF</button>
              <button class="ghost-button" type="button" id="backFromDevelopment">Back to profile</button>
              <button class="ghost-button close-profile" type="button" id="closeDevelopment">Close</button>
            </div>
          </details>
        </div>
        <div class="profile-brand-rail" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>

      ${developmentPillStrip(role, plan)}

      <div class="development-intro">
        <div>
          <span class="card-label">Developmental roadmap</span>
          <h3>${includesStartup ? "Startup, quarterly, and semiannual growth plan" : "Quarterly and semiannual growth plan"}</h3>
          <p>${escapeHtml(plan.planBasis)}</p>
        </div>
        <dl>
          ${includesStartup ? `<div><dt>30-day startup</dt><dd>${escapeHtml(plan.startupPeriod)}</dd></div>` : ""}
          <div><dt>Quarterly plan</dt><dd>${escapeHtml(plan.quarterlyPeriod)}</dd></div>
          <div><dt>Semiannual plan</dt><dd>${escapeHtml(plan.semiannualPeriod)}</dd></div>
          <div><dt>Primary role basis</dt><dd>${escapeHtml(role.roleFamily)}</dd></div>
          <div><dt>Primary use</dt><dd>${includesStartup ? "Developmental clarity and onboarding support" : "Quarterly development clarity and role support"}</dd></div>
        </dl>
      </div>

      <div class="profile-body development-body">
        ${includesStartup ? `<section class="section development-section startup-section">
          <h3>30-Day Startup Plan</h3>
          <div class="development-guidance startup-guidance">
            <strong>${escapeHtml(plan.startupPeriod)}</strong>
            <span>${escapeHtml(plan.startupPurpose)}</span>
          </div>
          ${table(["Area", "First 30-Day Focus", `What ${personFirstName} Should Do`, "Evidence By Day 30"], plan.startupAssignments)}
          <h4 class="subsection-heading">Four-Week Startup Flow</h4>
          ${startupWeekCards(plan)}
          <h4 class="subsection-heading">Manager Support During Startup</h4>
          <ul class="development-checklist">${plan.startupManagerSupport.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </section>` : ""}

        <section class="section development-section">
          <h3>Development Focus Areas</h3>
          ${developmentFocusCards(plan)}
        </section>

        ${capacitySummaryBlock ? section("Capacity Anchor", capacitySummaryBlock) : ""}

        <section class="section development-section">
          <h3>Quarterly Plan</h3>
          <div class="development-guidance">
            <strong>${escapeHtml(plan.quarterlyPeriod)}</strong>
            <span>Next-90-days execution focus: use this section to clarify immediate work rhythms, ownership, deliverables, and practical evidence for the next quarterly conversation.</span>
          </div>
          ${table(["90-Day Execution Focus", "Current Role Connection", "Quarterly Evidence"], plan.quarterlyGoals)}
        </section>

        <section class="section development-section">
          <h3>Semiannual Plan</h3>
          <div class="development-guidance">
            <strong>${escapeHtml(plan.semiannualPeriod)}</strong>
            <span>Six-month growth arc: use this section to define what should become stronger across two quarters, especially independence, judgment, consistency, and role-scope ownership.</span>
          </div>
          ${table(["Six-Month Growth Theme", "What Should Be Stronger By Semiannual Review"], plan.semiannualOutcomes)}
        </section>

        <section class="section development-section">
          <h3>Manager Support Plan</h3>
          <ul class="development-checklist">${plan.managerSupport.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </section>
      </div>
    </article>
  `;

  wireProfileHomeLogo();
  document.querySelector("#printDevelopment").addEventListener("click", printDevelopmentPlan);
  document.querySelector("#exportDevelopmentText").addEventListener("click", () => exportDevelopmentNotes(role));
  document.querySelector("#openDevelopmentReflections").addEventListener("click", () => renderDevelopmentReflections(role));
  document.querySelector("#backFromDevelopment").addEventListener("click", () => renderDetail(role));
  document.querySelector("#closeDevelopment").addEventListener("click", closeProfile);
}

function renderDevelopmentReflections(role) {
  const plan = getDevelopmentPlan(role.id);
  if (!plan) return;
  const includesStartup = hasStartupPlan(plan);
  const personFirstName = firstName(role.person);

  els.detail.innerHTML = `
    <article class="profile-card development-card development-reflection-card">
      <div class="profile-hero development-hero">
        <div class="profile-title-block profile-home-link" role="button" tabindex="0" aria-label="Return to Role Clarity Library home">
          <img class="profile-logo" src="assets/brand/bbs-logo-white-lockup.png" alt="Bridge Builder Strategies">
          <p class="profile-kicker">Development Reflection Worksheet</p>
          <h2>${escapeHtml(role.person)}</h2>
          <p>${escapeHtml(role.standardizedTitle)}</p>
        </div>
        <div class="hero-actions development-controls">
          <button class="action-button" type="button" id="printDevelopmentReflections">Print / Save PDF</button>
          <details class="action-menu">
            <summary>More</summary>
            <div class="action-menu-panel">
              <button class="ghost-button" type="button" id="backToDevelopmentPlan">Back to plan</button>
              <button class="ghost-button" type="button" id="backFromDevelopmentReflections">Back to profile</button>
              <button class="ghost-button close-profile" type="button" id="closeDevelopmentReflections">Close</button>
            </div>
          </details>
        </div>
        <div class="profile-brand-rail" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>

      ${developmentPillStrip(role, plan)}

      <div class="development-intro">
        <div>
          <span class="card-label">Working notes</span>
          <h3>Prompts, reflections, and shared development notes</h3>
          <p>Use this page alongside the development plan to capture employee reflection, manager support notes, and shared follow-up commitments without crowding the planning roadmap.</p>
        </div>
        <dl>
          ${includesStartup ? `<div><dt>30-day startup</dt><dd>${escapeHtml(plan.startupPeriod)}</dd></div>` : ""}
          <div><dt>Quarterly plan</dt><dd>${escapeHtml(plan.quarterlyPeriod)}</dd></div>
          <div><dt>Semiannual plan</dt><dd>${escapeHtml(plan.semiannualPeriod)}</dd></div>
          <div><dt>Primary role basis</dt><dd>${escapeHtml(role.roleFamily)}</dd></div>
        </dl>
      </div>

      <div class="profile-body development-body">
        ${includesStartup ? `<section class="section development-section startup-section">
          <h3>30-Day Startup Reflection</h3>
          <div class="development-guidance startup-guidance">
            <strong>${escapeHtml(plan.startupPeriod)}</strong>
            <span>Reflection prompts for the first month, especially where the role is expanding from prior intern experience.</span>
          </div>
          ${developmentPromptList(plan.startupReflection)}
        </section>` : ""}

        <section class="section development-section">
          <h3>Quarterly Check-In Prompts</h3>
          <div class="development-guidance">
            <strong>${escapeHtml(plan.quarterlyPeriod)}</strong>
            <span>Use these prompts during quarterly check-ins to clarify progress, support needs, and role-growth evidence.</span>
          </div>
          ${developmentPromptList(plan.quarterlyPrompts)}
        </section>

        <section class="section development-section">
          <h3>${escapeHtml(personFirstName)} Employee Reflection</h3>
          ${developmentPromptList(plan.employeeReflection)}
        </section>

        <section class="section development-section">
          <h3>Manager Support Notes</h3>
          <label class="review-field full development-prompt">
            <span>Manager support notes</span>
            <textarea rows="5" placeholder="Document context, support commitments, check-in cadence, or manager follow-up."></textarea>
          </label>
        </section>

        <section class="section development-section">
          <h3>Shared Development Notes</h3>
          <label class="review-field full development-prompt">
            <span>Shared summary</span>
            <textarea rows="6" placeholder="Capture shared takeaways, next learning priorities, manager commitments, or follow-up items."></textarea>
          </label>
        </section>
      </div>
    </article>
  `;

  wireProfileHomeLogo();
  document.querySelector("#printDevelopmentReflections").addEventListener("click", printDevelopmentPlan);
  document.querySelector("#backToDevelopmentPlan").addEventListener("click", () => renderDevelopmentPlan(role));
  document.querySelector("#backFromDevelopmentReflections").addEventListener("click", () => renderDetail(role));
  document.querySelector("#closeDevelopmentReflections").addEventListener("click", closeProfile);
}

function printDevelopmentPlan() {
  printMode = "development";
  document.body.classList.add("development-printing");
  window.print();
}

function exportDevelopmentNotes(role) {
  const plan = getDevelopmentPlan(role.id);
  if (!plan) return;
  const includesStartup = hasStartupPlan(plan);
  const fields = Array.from(document.querySelectorAll(".development-card .review-field")).map(field => {
    const label = field.querySelector("span")?.textContent?.trim() || "Field";
    const value = field.querySelector("textarea, input")?.value?.trim() || "";
    return `${label}: ${value}`;
  });
  const startupLines = includesStartup
    ? [
      `30-day startup plan: ${plan.startupPeriod}`,
      "",
      "30-day startup assignment plan:",
      ...plan.startupAssignments.map(row => `- ${row[0]} | Focus: ${row[1]} | Action: ${row[2]} | Evidence by day 30: ${row[3]}`),
      "",
      "Four-week startup flow:",
      ...plan.startupWeeks.map(row => `- ${row[0]} | Goal: ${row[1]} | Focus: ${row[2]} | Evidence: ${row[3]}`),
      "",
      "Startup manager support:",
      ...plan.startupManagerSupport.map(item => `- ${item}`),
      ""
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
    ...plan.quarterlyGoals.map(row => `- ${row[0]} | Current role connection: ${row[1]} | Quarterly evidence: ${row[2]}`),
    "",
    "Semiannual plan - six-month growth arc:",
    ...plan.semiannualOutcomes.map(row => `- ${row[0]}: ${row[1]}`),
    "",
    "Manager support:",
    ...plan.managerSupport.map(item => `- ${item}`),
    "",
    "Notes:",
    ...fields
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${role.person.toLowerCase().replaceAll(" ", "-")}-development-plan.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const WORKFLOW_LABELS = {
  "360-review": "360 Review",
  "development-plan": "Development Plan"
};

const AUDIENCE_LABELS = {
  manager: "Manager",
  employee: "Employee"
};

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadJsonFile(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function collectPrivateResponseFields() {
  return Array.from(document.querySelectorAll("[data-response-field]")).map(field => ({
    key: field.dataset.responseField,
    group: field.dataset.responseGroup || "Response",
    label: field.dataset.responseLabel || field.closest("label")?.querySelector("span")?.textContent?.trim() || "Field",
    value: field.value?.trim() || ""
  }));
}

function collectPrivateResponseSelections() {
  const selectResponses = Array.from(document.querySelectorAll("[data-response-select]")).map(field => ({
    key: field.dataset.responseSelect,
    group: field.dataset.responseGroup || "Ratings",
    label: field.dataset.responseLabel || "Selection",
    value: field.value || ""
  }));
  const radioGroups = new Map();
  document.querySelectorAll("[data-response-radio]").forEach(field => {
    if (!radioGroups.has(field.name)) radioGroups.set(field.name, field);
  });
  const radioResponses = Array.from(radioGroups.values()).map(field => {
    const checked = Array.from(document.querySelectorAll("[data-response-radio]"))
      .find(option => option.name === field.name && option.checked);
    return {
      key: field.dataset.responseRadio,
      group: field.dataset.responseGroup || "Ratings",
      label: field.dataset.responseLabel || "Selection",
      value: checked?.value || ""
    };
  });
  return [...selectResponses, ...radioResponses];
}

function exportPrivateResponse(role, kind, audience) {
  const payload = {
    schema: "bbs-role-tool-response-v1",
    kind,
    audience,
    personId: role.id,
    person: role.person,
    roleTitle: role.standardizedTitle,
    roleFamily: role.roleFamily,
    exportedAt: new Date().toISOString(),
    selections: collectPrivateResponseSelections(),
    fields: collectPrivateResponseFields()
  };

  downloadJsonFile(`${role.id}-${kind}-${audience}-response.json`, payload);
}

function responseSelect(key, group, label) {
  return `
    <label class="response-select-field">
      <span>${escapeHtml(label)}</span>
      <select data-response-select="${escapeAttr(key)}" data-response-group="${escapeAttr(group)}" data-response-label="${escapeAttr(label)}">
        <option value="">Choose level</option>
        <option value="Emerging">Emerging</option>
        <option value="Meeting">Meeting</option>
        <option value="Strong">Strong</option>
      </select>
    </label>
  `;
}

function responseTextarea(key, group, label, placeholder = "Add notes, examples, context, or follow-up items.") {
  return `
    <label class="review-field full">
      <span>${escapeHtml(label)}</span>
      <textarea rows="4" data-response-field="${escapeAttr(key)}" data-response-group="${escapeAttr(group)}" data-response-label="${escapeAttr(label)}" placeholder="${escapeAttr(placeholder)}"></textarea>
    </label>
  `;
}

function responseTextInput(key, group, label, placeholder = "") {
  return `
    <label class="review-field">
      <span>${escapeHtml(label)}</span>
      <input type="text" data-response-field="${escapeAttr(key)}" data-response-group="${escapeAttr(group)}" data-response-label="${escapeAttr(label)}" placeholder="${escapeAttr(placeholder)}">
    </label>
  `;
}

function competencyAssessmentChoices(role, competency, index) {
  const [name, definition, behavior] = competency;
  const expectedLevel = expectedCompetencyLevel(role);
  const levels = ["Level I", "Level II", "Level III"];
  const radioName = `competency-${safeId(role.id)}-${index}-assessment`;
  const key = `competency-${index}-level`;

  return `
    <div class="competency-assessment-map" role="radiogroup" aria-label="${escapeAttr(name)} competency level">
      ${levels.map(level => {
        const content = competencyLevelContent(level, name, definition, behavior);
        return `
          <label class="competency-assessment-choice ${level === expectedLevel ? "role-expected" : ""}">
            <input
              type="radio"
              name="${escapeAttr(radioName)}"
              value="${escapeAttr(level)}"
              data-response-radio="${escapeAttr(key)}"
              data-response-group="Competency Map"
              data-response-label="${escapeAttr(`${name} level`)}"
            >
            <span class="choice-heading">
              <strong>${escapeHtml(level)}</strong>
              ${level === expectedLevel ? `<small>Expected for role</small>` : ""}
            </span>
            <span class="choice-body">
              <b>Expectations</b>
              <ul>${content.expectations.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
              <b>Examples of success</b>
              <ul>${content.examples.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            </span>
          </label>
        `;
      }).join("")}
    </div>
  `;
}

function managerSupportFeedbackContent() {
  const prompts = [
    ["manager-support-clarity", "Clarity of expectations", "My manager provides clear priorities, outcomes, deadlines, and decision context."],
    ["manager-support-feedback", "Quality of feedback", "My manager gives timely, useful feedback that helps me improve my work."],
    ["manager-support-context", "Access to context", "My manager gives me the background, stakeholder context, and information I need to make good decisions."],
    ["manager-support-barriers", "Support removing barriers", "My manager helps identify, escalate, or remove blockers when work gets stuck."],
    ["manager-support-development", "Coaching and development", "My manager helps me build skills, confidence, and independence in this role."],
    ["manager-support-rhythm", "Communication rhythm", "Check-ins and communication are frequent enough to keep work aligned without creating unnecessary overhead."],
    ["manager-support-autonomy", "Trust and autonomy", "I have the right balance of independence and support for my current role."]
  ];

  return `
    <section class="section private-section manager-support-section">
      <h3>Manager Support Feedback</h3>
      <div class="development-guidance">
        <strong>Employee-to-manager feedback</strong>
        <span>These items are employee-only inputs. They are summarized in the combined report as support strengths and support needs, not as manager/employee rating misalignment.</span>
      </div>
      <div class="private-card-grid compact">
        ${prompts.map(([key, label, description]) => `
          <article class="private-response-card manager-support-card">
            <h4>${escapeHtml(label)}</h4>
            <p>${escapeHtml(description)}</p>
            ${responseSelect(key, "Manager Support Feedback", label)}
          </article>
        `).join("")}
      </div>
      <div class="private-form-grid">
        ${responseTextarea("manager-support-start-stop-continue", "Manager Support Feedback", "Start, stop, or continue", "What should my manager start, stop, or continue to help me succeed in this role?")}
        ${responseTextarea("manager-support-follow-up", "Manager Support Feedback", "Support follow-up notes", "What support, communication, coaching, or context would be most useful next?")}
      </div>
    </section>
  `;
}

function privateReviewSetupContent(role, audience) {
  const isManager = audience === "manager";
  return `
    <section class="section private-section review-setup-private-section">
      <h3>Review Setup</h3>
      <div class="review-guidance">
        <strong>This setup travels with the exported ${escapeHtml(isManager ? "manager" : "employee")} response file.</strong>
        <span>Complete these fields before exporting so the combined report has the review period, participants, and conversation timing attached to the assessment data.</span>
      </div>
      <div class="private-form-grid">
        ${responseTextInput("review-period", "Review Setup", "Review period", "Example: Q3 2026")}
        ${responseTextInput(isManager ? "manager-reviewer-name" : "employee-reflection-name", "Review Setup", isManager ? "Manager / reviewer" : "Employee completing reflection", "Name")}
        ${responseTextInput("conversation-date", "Review Setup", "Conversation date", "Date")}
        ${responseTextInput("review-context", "Review Setup", "Review context", "30-day, quarterly, semiannual, annual, or role transition")}
        ${isManager
          ? responseTextarea("manager-setup-notes", "Review Setup", "Setup notes", "Confirm employee self-assessment status, role profile updates needed, or context for the review conversation.")
          : responseTextarea("employee-setup-notes", "Review Setup", "Setup notes", "Add anything the supervisor should know before the review conversation begins.")}
      </div>
    </section>
  `;
}

function privateReviewContent(role, audience) {
  const isManager = audience === "manager";
  return `
    ${privateReviewSetupContent(role, audience)}

    <section class="section private-section">
      <h3>Role Outcomes</h3>
      <div class="private-card-grid">
        ${role.outcomes.map((row, index) => `
          <article class="private-response-card">
            <div class="private-card-heading">
              <span>${index + 1}</span>
              <div>
                <h4>${escapeHtml(row[0])}</h4>
                <p>${escapeHtml(row[1])}</p>
              </div>
            </div>
            <p class="evidence-line"><strong>Evidence basis:</strong> ${escapeHtml(row[2])}</p>
            ${responseSelect(`outcome-${index}-level`, "Role Outcomes", `${row[0]} level`)}
            ${responseTextarea(`outcome-${index}-notes`, "Role Outcomes", `${row[0]} notes`, isManager ? "Document manager evidence, examples, context, or coaching notes." : "Document your self-reflection, evidence, context, or support needs.")}
          </article>
        `).join("")}
      </div>
    </section>

    <section class="section private-section">
      <h3>Competency Map</h3>
      <div class="private-card-grid competency-card-grid">
        ${role.competencies.map((competency, index) => {
          const [name, definition, behavior] = competency;
          return `
          <article class="private-response-card">
            <div class="private-card-heading">
              <span>${index + 1}</span>
              <div>
                <h4>${escapeHtml(name)}</h4>
                <p>${escapeHtml(definition)}</p>
              </div>
            </div>
            <p class="evidence-line"><strong>Observable behaviors:</strong> ${escapeHtml(behavior)}</p>
            ${competencyAssessmentChoices(role, competency, index)}
            ${responseTextarea(`competency-${index}-notes`, "Competency Map", `${name} notes`, isManager ? "Add evidence, examples, context, or coaching notes connected to the selected Level I, II, or III expectation." : "Add your reflection, evidence, examples, questions, or support needs connected to the selected Level I, II, or III expectation.")}
          </article>
        `;
        }).join("")}
      </div>
    </section>

    <section class="section private-section">
      <h3>${isManager ? "Manager Feedback" : "Employee Feedback"}</h3>
      <div class="private-form-grid">
        ${isManager ? `
          ${responseTextarea("manager-strengths", "Manager Feedback", "Strengths observed", "What is working well against the current role outcomes and competencies?")}
          ${responseTextarea("manager-focus-areas", "Manager Feedback", "Focus areas", "Where would clearer expectations, practice, coaching, or resources help?")}
          ${responseTextarea("manager-commitments", "Manager Feedback", "Manager commitments", "What support, feedback cadence, or context will the manager provide?")}
        ` : `
          ${responseTextarea("employee-helpful-support", "Employee Feedback", "Support that helps me do this role well", "What manager behaviors, context, tools, or decisions are most helpful?")}
          ${responseTextarea("employee-barriers", "Employee Feedback", "Barriers or unclear areas", "Where do expectations, priorities, tools, or communication need more clarity?")}
          ${responseTextarea("employee-manager-feedback", "Employee Feedback", "Feedback for my manager", "What should the manager start, stop, or continue?")}
        `}
      </div>
    </section>
    ${isManager ? "" : managerSupportFeedbackContent()}
  `;
}

function privateDevelopmentContent(role, audience) {
  const plan = getDevelopmentPlan(role.id);
  if (!plan) {
    return `
      <section class="section private-section">
        <h3>Development Plan Not Available</h3>
        <p class="empty-state">This role does not have a development plan configured yet.</p>
      </section>
    `;
  }
  const isManager = audience === "manager";
  const includesStartup = hasStartupPlan(plan);

  return `
    ${includesStartup ? `<section class="section private-section startup-section">
      <h3>30-Day Startup Plan</h3>
      <div class="development-guidance">
        <strong>${escapeHtml(plan.startupPeriod)}</strong>
        <span>${escapeHtml(plan.startupPurpose)}</span>
      </div>
      <div class="private-card-grid">
        ${plan.startupWeeks.map(([week, goal, focus, evidence], index) => `
          <article class="private-response-card">
            <div class="private-card-heading">
              <span>${index + 1}</span>
              <div>
                <h4>${escapeHtml(week)}</h4>
                <p>${escapeHtml(goal)} ${escapeHtml(focus)}</p>
              </div>
            </div>
            <p class="evidence-line"><strong>Evidence by week end:</strong> ${escapeHtml(evidence)}</p>
            ${responseSelect(`startup-week-${index}-level`, "30-Day Startup Plan", `${week} readiness level`)}
            ${responseTextarea(`startup-week-${index}-notes`, "30-Day Startup Plan", `${week} notes`, isManager ? "Add manager observations, coaching notes, or priority adjustments." : "Add what you learned, what changed, and where you need more clarity.")}
          </article>
        `).join("")}
      </div>
    </section>` : ""}

    <section class="section private-section">
      <h3>${isManager ? "Manager Development Input" : "Employee Development Input"}</h3>
      <div class="private-form-grid">
        ${isManager ? `
          ${includesStartup ? responseTextarea("manager-startup-support", "Manager Development Input", "Startup support notes", "What support, access, examples, or check-ins will help this person ramp well?") : ""}
          ${responseTextarea("manager-quarterly-guidance", "Manager Development Input", "Quarterly guidance", "What should be prioritized, reinforced, or clarified this quarter?")}
          ${responseTextarea("manager-six-month-view", "Manager Development Input", "Six-month development view", "What should stronger independence look like by the semiannual point?")}
          ${responseTextarea("manager-follow-up", "Manager Development Input", "Manager follow-up commitments", "What will the manager do next, and by when?")}
        ` : `
          ${includesStartup ? responseTextarea("employee-startup-reflection", "Employee Development Input", "30-day reflection", "What feels familiar, what feels different, and where do you need more context?") : ""}
          ${responseTextarea("employee-quarterly-focus", "Employee Development Input", "Quarterly focus", "Which workstreams or skills should become more independent this quarter?")}
          ${responseTextarea("employee-support-needed", "Employee Development Input", "Support needed", "What examples, meetings, tools, or decisions would help you move faster?")}
          ${responseTextarea("employee-confidence-builders", "Employee Development Input", "Confidence builders", "What work are you ready to own with more independence?")}
        `}
      </div>
    </section>

    <section class="section private-section">
      <h3>Development Focus Areas</h3>
      <div class="private-card-grid compact">
        ${plan.focusAreas.map(([area, description], index) => `
          <article class="private-response-card">
            <h4>${escapeHtml(area)}</h4>
            <p>${escapeHtml(description)}</p>
            ${responseSelect(`focus-area-${index}-level`, "Development Focus Areas", `${area} readiness level`)}
            ${responseTextarea(`focus-area-${index}-notes`, "Development Focus Areas", `${area} notes`, isManager ? "Add manager observations or coaching context for this focus area." : "Add your reflection, confidence level, or questions for this focus area.")}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderPrivateResponse(role, kind, audience) {
  const workflowLabel = WORKFLOW_LABELS[kind];
  const audienceLabel = AUDIENCE_LABELS[audience];
  const bodyContent = kind === "360-review" ? privateReviewContent(role, audience) : privateDevelopmentContent(role, audience);

  els.detail.innerHTML = `
    <article class="profile-card private-response-shell">
      <div class="profile-hero private-response-hero">
        <div class="profile-title-block profile-home-link" role="button" tabindex="0" aria-label="Return to Role Clarity Library home">
          <img class="profile-logo" src="assets/brand/bbs-logo-white-lockup.png" alt="Bridge Builder Strategies">
          <p class="profile-kicker">${escapeHtml(workflowLabel)} Private Input</p>
          <h2>${escapeHtml(role.person)}</h2>
          <p>${escapeHtml(audienceLabel)} response packet</p>
        </div>
        <div class="hero-actions private-response-controls">
          <button class="action-button" type="button" id="exportPrivateResponse">Export ${escapeHtml(audienceLabel)} response</button>
          <details class="action-menu">
            <summary>More</summary>
            <div class="action-menu-panel">
              <button class="action-button secondary" type="button" id="openResponseMerge">Combine responses</button>
              <button class="ghost-button" type="button" id="backToWorkflow">Back</button>
              <button class="ghost-button close-profile" type="button" id="closePrivateResponse">Close</button>
            </div>
          </details>
        </div>
        <div class="profile-brand-rail" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>
      <div class="private-workflow-intro">
        <div>
          <span class="card-label">Local privacy workflow</span>
          <h3>${escapeHtml(audienceLabel)} input stays separate until the file is shared</h3>
          <p>Fill this page individually, export the response file, and share that file only when ready for the combined conversation. This static site does not save, sync, or send responses anywhere.</p>
        </div>
        <dl>
          <div><dt>Workflow</dt><dd>${escapeHtml(workflowLabel)}</dd></div>
          <div><dt>Perspective</dt><dd>${escapeHtml(audienceLabel)}</dd></div>
          <div><dt>Role</dt><dd>${escapeHtml(role.standardizedTitle)}</dd></div>
        </dl>
      </div>
      <div class="profile-body private-response-body">
        ${bodyContent}
      </div>
    </article>
  `;

  wireProfileHomeLogo();
  document.querySelector("#exportPrivateResponse").addEventListener("click", () => exportPrivateResponse(role, kind, audience));
  document.querySelector("#openResponseMerge").addEventListener("click", () => renderResponseMergeCenter(role, kind));
  document.querySelector("#backToWorkflow").addEventListener("click", () => {
    if (kind === "360-review") renderReviewWorksheet(role);
    else renderDevelopmentPlan(role);
  });
  document.querySelector("#closePrivateResponse").addEventListener("click", closeProfile);
}

function responsePreviewHtml(payload) {
  if (!payload) {
    return `<p class="empty-state">Import a response file to preview it here.</p>`;
  }
  const entries = [...(payload.selections || []), ...(payload.fields || [])];
  const groups = entries.reduce((acc, item) => {
    const group = item.group || "Response";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  return `
    <div class="response-meta">
      <strong>${escapeHtml(AUDIENCE_LABELS[payload.audience] || payload.audience || "Response")}</strong>
      <span>${escapeHtml(payload.person || "")}</span>
      <small>${payload.exportedAt ? `Exported ${escapeHtml(new Date(payload.exportedAt).toLocaleString())}` : ""}</small>
    </div>
    ${Object.entries(groups).map(([group, items]) => `
      <div class="response-group">
        <h4>${escapeHtml(group)}</h4>
        ${items.map(item => `
          <div class="response-line">
            <span>${escapeHtml(item.label || item.key)}</span>
            <p>${escapeHtml(item.value || "No response provided.")}</p>
          </div>
        `).join("")}
      </div>
    `).join("")}
  `;
}

function validateResponsePayload(payload, role, kind, expectedAudience) {
  if (!payload || payload.schema !== "bbs-role-tool-response-v1") {
    return "This file does not look like a BBS role response export.";
  }
  if (payload.kind !== kind) {
    return `This file is for ${WORKFLOW_LABELS[payload.kind] || payload.kind}, not ${WORKFLOW_LABELS[kind]}.`;
  }
  if (payload.personId !== role.id) {
    return `This response is for ${payload.person || "another role"}, not ${role.person}.`;
  }
  if (payload.audience !== expectedAudience) {
    return `This file is marked as ${payload.audience || "unknown"} input, not ${expectedAudience} input.`;
  }
  return "";
}

function readResponseFile(file, role, kind, expectedAudience, callback) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);
      const error = validateResponsePayload(payload, role, kind, expectedAudience);
      callback(error ? null : payload, error);
    } catch (error) {
      callback(null, "The selected file could not be read as JSON.");
    }
  };
  reader.readAsText(file);
}

function ratingScore(value) {
  const scores = { Emerging: 1, Meeting: 2, Strong: 3, "Level I": 1, "Level II": 2, "Level III": 3 };
  return scores[value] || 0;
}

function comparisonStatus(gap) {
  if (gap >= 2) return "priority";
  if (gap === 1) return "conversation";
  return "aligned";
}

function comparisonRecommendation(item) {
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

function buildAlignmentAnalysis(managerPayload, employeePayload) {
  const managerSelections = new Map((managerPayload?.selections || []).map(item => [item.key, item]));
  const employeeSelections = new Map((employeePayload?.selections || []).map(item => [item.key, item]));
  const comparisons = [];

  employeeSelections.forEach((employeeItem, key) => {
    if (employeeItem.group === "Manager Support Feedback") return;
    const managerItem = managerSelections.get(key);
    if (!managerItem || !managerItem.value || !employeeItem.value) return;
    const managerScore = ratingScore(managerItem.value);
    const employeeScore = ratingScore(employeeItem.value);
    if (!managerScore || !employeeScore) return;
    const gap = Math.abs(managerScore - employeeScore);
    const item = {
      key,
      group: employeeItem.group || managerItem.group || "Ratings",
      label: employeeItem.label || managerItem.label || key,
      managerValue: managerItem.value,
      employeeValue: employeeItem.value,
      managerScore,
      employeeScore,
      gap,
      status: comparisonStatus(gap)
    };
    item.recommendation = comparisonRecommendation(item);
    comparisons.push(item);
  });

  const priority = comparisons.filter(item => item.status === "priority");
  const conversation = comparisons.filter(item => item.status === "conversation");
  const aligned = comparisons.filter(item => item.status === "aligned");
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
      : "No shared numeric ratings were available to compare. Use the narrative responses to guide the combined conversation."
  };
}

function managerSupportAnalysis(employeePayload) {
  const selections = (employeePayload?.selections || [])
    .filter(item => item.group === "Manager Support Feedback" && item.value)
    .map(item => ({
      ...item,
      score: ratingScore(item.value),
      status: item.value === "Strong" ? "aligned" : item.value === "Meeting" ? "conversation" : "priority"
    }));
  const fields = (employeePayload?.fields || [])
    .filter(item => item.group === "Manager Support Feedback" && item.value);
  const strengths = selections.filter(item => item.value === "Strong");
  const supportNeeds = selections.filter(item => item.value === "Emerging");
  const calibration = selections.filter(item => item.value === "Meeting");

  return {
    selections,
    fields,
    strengths,
    supportNeeds,
    calibration,
    summary: selections.length
      ? `${strengths.length} support strengths, ${calibration.length} adequate-but-worth-discussing items, and ${supportNeeds.length} support needs were identified by the employee.`
      : "No manager support ratings were provided by the employee."
  };
}

function managerSupportReportHtml(support) {
  if (!support.selections.length && !support.fields.length) {
    return `<p class="empty-state">No manager support feedback was provided in the employee response file.</p>`;
  }

  return `
    <div class="generated-summary-callout ${support.supportNeeds.length ? "priority" : support.calibration.length ? "conversation" : "aligned"}">
      <strong>Employee-to-manager support summary</strong>
      <p>${escapeHtml(support.summary)} Use this as a coaching and communication conversation starter, not as a manager scorecard.</p>
    </div>
    ${support.selections.length ? `
      <div class="alignment-table-wrap manager-support-table-wrap">
        <table class="data-table alignment-table manager-support-table">
          <colgroup>
            <col class="alignment-col-area">
            <col class="alignment-col-rating">
            <col class="alignment-col-prompt">
          </colgroup>
          <thead>
            <tr>
              <th>Support Area</th>
              <th>Employee Rating</th>
              <th>Suggested Conversation</th>
            </tr>
          </thead>
          <tbody>
            ${support.selections.map(item => `
              <tr class="${escapeAttr(item.status)}">
                <td><strong>${escapeHtml(item.label || item.key)}</strong><span>Manager Support Feedback</span></td>
                <td><span class="alignment-badge ${escapeAttr(item.status)}">${escapeHtml(item.value)}</span></td>
                <td>${escapeHtml(managerSupportPrompt(item))}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    ` : ""}
    ${support.fields.length ? `
      <div class="response-preview-card manager-support-notes">
        <div class="response-meta"><strong>Employee Notes For Manager Support</strong><span>Start / stop / continue and follow-up context</span></div>
        ${support.fields.map(item => `
          <div class="response-line">
            <span>${escapeHtml(item.label || item.key)}</span>
            <p>${escapeHtml(item.value)}</p>
          </div>
        `).join("")}
      </div>
    ` : ""}
  `;
}

function managerSupportPrompt(item) {
  if (item.value === "Strong") {
    return "Identify what is working well and how to keep that support pattern consistent.";
  }
  if (item.value === "Meeting") {
    return "Discuss what would move this support area from adequate to more consistently helpful.";
  }
  return "Prioritize a direct conversation about what support is missing and agree on a practical follow-up action.";
}

function reportStatusLabel(status) {
  if (status === "priority") return "Priority misalignment";
  if (status === "conversation") return "Conversation item";
  return "Aligned";
}

function generatedSummaryHtml(analysis, kind) {
  if (!analysis.completed) {
    return `
      <div class="alignment-empty">
        <strong>No rating comparison available yet.</strong>
        <p>Both files need matching selections before the report can identify numeric alignment or misalignment.</p>
      </div>
    `;
  }

  const planningNudge = analysis.priority.length
    ? "Start with the priority misalignment items. Those are the clearest candidates for a focused conversation and, if the pattern holds after discussion, a development plan, training plan, or coaching plan."
    : analysis.conversation.length
      ? "Start with the one-level differences. These are useful calibration points for expectations, examples, and near-term support."
      : "The numeric ratings are aligned. Use the discussion to reinforce what is working and identify how to sustain the role expectations.";

  return `
    <div class="alignment-summary-grid">
      <article class="alignment-stat aligned"><strong>${analysis.aligned.length}</strong><span>Aligned</span></article>
      <article class="alignment-stat conversation"><strong>${analysis.conversation.length}</strong><span>Conversation</span></article>
      <article class="alignment-stat priority"><strong>${analysis.priority.length}</strong><span>Priority</span></article>
      <article class="alignment-stat"><strong>${analysis.averageGap.toFixed(1)}</strong><span>Avg. gap</span></article>
    </div>
    <div class="generated-summary-callout ${analysis.priority.length ? "priority" : analysis.conversation.length ? "conversation" : "aligned"}">
      <strong>${escapeHtml(WORKFLOW_LABELS[kind])} generated summary</strong>
      <p>${escapeHtml(analysis.summary)} ${escapeHtml(planningNudge)}</p>
    </div>
  `;
}

function comparisonTableHtml(analysis) {
  if (!analysis.completed) return "";
  return `
    <div class="alignment-table-wrap">
      <table class="data-table alignment-table">
        <colgroup>
          <col class="alignment-col-area">
          <col class="alignment-col-rating">
          <col class="alignment-col-rating">
          <col class="alignment-col-status">
          <col class="alignment-col-prompt">
        </colgroup>
        <thead>
          <tr>
            <th>Area</th>
            <th>Manager</th>
            <th>Employee</th>
            <th>Status</th>
            <th>Conversation / Plan Prompt</th>
          </tr>
        </thead>
        <tbody>
          ${analysis.comparisons.map(item => `
            <tr class="${escapeAttr(item.status)}">
              <td><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.group)}</span></td>
              <td>${escapeHtml(item.managerValue)}</td>
              <td>${escapeHtml(item.employeeValue)}</td>
              <td><span class="alignment-badge ${escapeAttr(item.status)}">${escapeHtml(reportStatusLabel(item.status))}</span></td>
              <td>${escapeHtml(item.recommendation)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function combinedResponseText(payload, groupFilter = "") {
  const entries = [...(payload?.selections || []), ...(payload?.fields || [])]
    .filter(item => !groupFilter || item.group === groupFilter)
    .filter(item => item.value);
  if (!entries.length) return `<p class="empty-state">No response provided.</p>`;
  return entries.map(item => `
    <div class="response-line">
      <span>${escapeHtml(item.label || item.key)}</span>
      <p>${escapeHtml(item.value)}</p>
    </div>
  `).join("");
}

function reviewSetupReportHtml(managerPayload, employeePayload) {
  const setupEntries = payload => (payload?.fields || [])
    .filter(item => item.group === "Review Setup" && item.value);
  const managerSetup = setupEntries(managerPayload);
  const employeeSetup = setupEntries(employeePayload);

  if (!managerSetup.length && !employeeSetup.length) {
    return `
      <p class="empty-state">No review setup fields were included in the imported response files.</p>
    `;
  }

  const setupCard = (title, entries) => `
    <article class="response-preview-card review-setup-summary-card">
      <div class="response-meta"><strong>${escapeHtml(title)}</strong><span>Exported setup context</span></div>
      ${entries.length ? entries.map(item => `
        <div class="response-line">
          <span>${escapeHtml(item.label || item.key)}</span>
          <p>${escapeHtml(item.value)}</p>
        </div>
      `).join("") : `<p class="empty-state">No setup context provided.</p>`}
    </article>
  `;

  return `
    <div class="response-preview-grid review-setup-summary-grid">
      ${setupCard("Manager Setup", managerSetup)}
      ${setupCard("Employee Setup", employeeSetup)}
    </div>
  `;
}

function renderCombinedReport(role, kind, managerPayload, employeePayload) {
  const sharedNotes = document.querySelector("#combinedSharedNotes")?.value?.trim() || "";
  if (!managerPayload || !employeePayload) {
    window.alert("Import both the manager and employee response files before generating the combined report.");
    return;
  }

  const analysis = buildAlignmentAnalysis(managerPayload, employeePayload);
  const support = managerSupportAnalysis(employeePayload);
  const reportDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  els.detail.innerHTML = `
    <article class="profile-card combined-report-card">
      <div class="profile-hero combined-report-hero">
        <div class="profile-title-block profile-home-link" role="button" tabindex="0" aria-label="Return to Role Clarity Library home">
          <img class="profile-logo" src="assets/brand/bbs-logo-white-lockup.png" alt="Bridge Builder Strategies">
          <p class="profile-kicker">${escapeHtml(WORKFLOW_LABELS[kind])} Combined Report</p>
          <h2>${escapeHtml(role.person)}</h2>
          <p>${escapeHtml(role.standardizedTitle)}</p>
        </div>
        <div class="hero-actions combined-report-controls">
          <button class="action-button" type="button" id="printCombinedReport">Print / Save PDF</button>
          <details class="action-menu">
            <summary>More</summary>
            <div class="action-menu-panel">
              <button class="action-button secondary" type="button" id="downloadCombinedSummary">Export text summary</button>
              <button class="ghost-button" type="button" id="backToMergeCenter">Back to merge</button>
              <button class="ghost-button close-profile" type="button" id="closeCombinedReport">Close</button>
            </div>
          </details>
        </div>
        <div class="profile-brand-rail" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>

      <div class="private-workflow-intro report-intro">
        <div>
          <span class="card-label">Generated summary</span>
          <h3>Manager and employee alignment report</h3>
          <p>This report compares the imported private responses. Numeric comparisons are generated from the shared outcome scale and competency level map; narrative notes are preserved for the conversation.</p>
        </div>
        <dl>
          <div><dt>Prepared</dt><dd>${escapeHtml(reportDate)}</dd></div>
          <div><dt>Workflow</dt><dd>${escapeHtml(WORKFLOW_LABELS[kind])}</dd></div>
          <div><dt>Role family</dt><dd>${escapeHtml(role.roleFamily)}</dd></div>
        </dl>
      </div>

      <div class="profile-body combined-report-body">
        ${kind === "360-review" ? `<section class="section combined-report-section">
          <h3>Review Setup</h3>
          ${reviewSetupReportHtml(managerPayload, employeePayload)}
        </section>` : ""}

        <section class="section combined-report-section">
          <h3>Alignment Summary</h3>
          ${generatedSummaryHtml(analysis, kind)}
        </section>

        <section class="section combined-report-section">
          <h3>Rating Comparison</h3>
          ${comparisonTableHtml(analysis) || `<p class="empty-state">No comparable ratings were found.</p>`}
        </section>

        <section class="section combined-report-section manager-support-report-section">
          <h3>Manager Support Feedback</h3>
          ${managerSupportReportHtml(support)}
        </section>

        <section class="section combined-report-section">
          <h3>Response Notes</h3>
          <div class="response-preview-grid">
            <article class="response-preview-card manager-preview">
              <div class="response-meta"><strong>Manager Response</strong><span>${escapeHtml(managerPayload.person || role.person)}</span></div>
              ${combinedResponseText(managerPayload)}
            </article>
            <article class="response-preview-card employee-preview">
              <div class="response-meta"><strong>Employee Response</strong><span>${escapeHtml(employeePayload.person || role.person)}</span></div>
              ${combinedResponseText(employeePayload)}
            </article>
          </div>
        </section>

        <section class="section combined-report-section">
          <h3>Shared Conversation Notes</h3>
          <div class="shared-notes-output">${escapeHtml(sharedNotes || "No shared conversation notes added yet.")}</div>
        </section>
      </div>
    </article>
  `;

  wireProfileHomeLogo();
  document.querySelector("#printCombinedReport").addEventListener("click", printCombinedReport);
  document.querySelector("#downloadCombinedSummary").addEventListener("click", () => exportCombinedSummary(role, kind, managerPayload, employeePayload, analysis, sharedNotes));
  document.querySelector("#backToMergeCenter").addEventListener("click", () => renderResponseMergeCenter(role, kind));
  document.querySelector("#closeCombinedReport").addEventListener("click", closeProfile);
}

function printCombinedReport() {
  printMode = "combined";
  document.body.classList.add("combined-report-printing");
  window.print();
}

function exportCombinedSummary(role, kind, managerPayload, employeePayload, existingAnalysis = null, existingSharedNotes = null) {
  const sharedNotes = existingSharedNotes ?? document.querySelector("#combinedSharedNotes")?.value?.trim() ?? "";
  if (!managerPayload || !employeePayload) {
    window.alert("Import both the manager and employee response files before exporting the combined summary.");
    return;
  }
  const analysis = existingAnalysis || buildAlignmentAnalysis(managerPayload, employeePayload);
  const support = managerSupportAnalysis(employeePayload);
  const formatEntries = payload => [...(payload.selections || []), ...(payload.fields || [])]
    .map(item => `- ${item.group || "Response"} | ${item.label || item.key}: ${item.value || "No response provided."}`);
  const formatComparisons = analysis.comparisons.length
    ? analysis.comparisons.map(item => `- ${item.label}: Manager ${item.managerValue}; Employee ${item.employeeValue}; ${reportStatusLabel(item.status)}. ${item.recommendation}`)
    : ["- No comparable numeric ratings were found."];
  const formatSupport = support.selections.length
    ? support.selections.map(item => `- ${item.label}: Employee rating ${item.value}. ${managerSupportPrompt(item)}`)
    : ["- No manager support ratings were provided."];
  const formatSupportNotes = support.fields.length
    ? support.fields.map(item => `- ${item.label || item.key}: ${item.value}`)
    : ["- No manager support notes were provided."];
  const formatSetup = payload => (payload?.fields || [])
    .filter(item => item.group === "Review Setup" && item.value)
    .map(item => `- ${item.label || item.key}: ${item.value}`);
  const managerSetup = formatSetup(managerPayload);
  const employeeSetup = formatSetup(employeePayload);
  const lines = [
    `Bridge Builder Strategies - ${WORKFLOW_LABELS[kind]} Combined Conversation`,
    "",
    `Person: ${role.person}`,
    `Role: ${role.standardizedTitle}`,
    "",
    ...(kind === "360-review" ? [
      "Review setup:",
      "Manager setup:",
      ...(managerSetup.length ? managerSetup : ["- No manager setup context provided."]),
      "Employee setup:",
      ...(employeeSetup.length ? employeeSetup : ["- No employee setup context provided."]),
      ""
    ] : []),
    "Generated alignment summary:",
    analysis.summary,
    "",
    "Rating comparison prompts:",
    ...formatComparisons,
    "",
    "Manager support feedback:",
    support.summary,
    ...formatSupport,
    "",
    "Manager support notes:",
    ...formatSupportNotes,
    "",
    "Manager response:",
    ...formatEntries(managerPayload),
    "",
    "Employee response:",
    ...formatEntries(employeePayload),
    "",
    "Shared conversation notes:",
    sharedNotes || "No shared notes added."
  ];
  downloadTextFile(`${role.id}-${kind}-combined-summary.txt`, lines.join("\n"));
}

function renderResponseMergeCenter(role, kind) {
  let managerPayload = null;
  let employeePayload = null;
  const workflowLabel = WORKFLOW_LABELS[kind];

  els.detail.innerHTML = `
    <article class="profile-card private-response-shell merge-shell">
      <div class="profile-hero private-response-hero">
        <div class="profile-title-block profile-home-link" role="button" tabindex="0" aria-label="Return to Role Clarity Library home">
          <img class="profile-logo" src="assets/brand/bbs-logo-white-lockup.png" alt="Bridge Builder Strategies">
          <p class="profile-kicker">${escapeHtml(workflowLabel)} Combined Conversation</p>
          <h2>${escapeHtml(role.person)}</h2>
          <p>Import private response files when both sides are ready</p>
        </div>
        <div class="hero-actions private-response-controls">
          <button class="action-button" type="button" id="generateCombinedReport">Generate PDF report</button>
          <details class="action-menu">
            <summary>More</summary>
            <div class="action-menu-panel">
              <button class="action-button secondary" type="button" id="exportCombinedSummary">Export text summary</button>
              <button class="ghost-button" type="button" id="backToWorkflowFromMerge">Back</button>
              <button class="ghost-button close-profile" type="button" id="closeResponseMerge">Close</button>
            </div>
          </details>
        </div>
        <div class="profile-brand-rail" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>
      <div class="private-workflow-intro">
        <div>
          <span class="card-label">Two-file merge</span>
          <h3>Bring manager and employee insights together only for the conversation</h3>
          <p>Import each private JSON response file. The app validates that both files match this person and workflow, then previews the responses side by side for discussion and export.</p>
        </div>
        <dl>
          <div><dt>Workflow</dt><dd>${escapeHtml(workflowLabel)}</dd></div>
          <div><dt>Person</dt><dd>${escapeHtml(role.person)}</dd></div>
          <div><dt>Storage</dt><dd>Local files only</dd></div>
        </dl>
      </div>
      <div class="profile-body private-response-body">
        <section class="section private-section">
          <h3>Import Response Files</h3>
          <div class="merge-upload-grid">
            <label class="upload-card">
              <span>Manager response file</span>
              <input type="file" id="managerResponseFile" accept=".json,application/json">
              <small id="managerImportStatus">No file imported.</small>
            </label>
            <label class="upload-card">
              <span>Employee response file</span>
              <input type="file" id="employeeResponseFile" accept=".json,application/json">
              <small id="employeeImportStatus">No file imported.</small>
            </label>
          </div>
        </section>
        <section class="section private-section">
          <h3>Response Preview</h3>
          <div class="response-preview-grid">
            <article class="response-preview-card manager-preview" id="managerResponsePreview">${responsePreviewHtml(null)}</article>
            <article class="response-preview-card employee-preview" id="employeeResponsePreview">${responsePreviewHtml(null)}</article>
          </div>
        </section>
        <section class="section private-section">
          <h3>Generated Report</h3>
          <div class="generated-summary-callout">
            <strong>PDF output</strong>
            <p>After both files are imported, choose Generate PDF report. The next screen includes the generated alignment summary, rating comparison prompts, narrative notes, and a Print / Save PDF button.</p>
          </div>
        </section>
        <section class="section private-section">
          <h3>Shared Conversation Notes</h3>
          <label class="review-field full">
            <span>Combined discussion notes</span>
            <textarea id="combinedSharedNotes" rows="6" placeholder="Capture shared takeaways, decisions, clarifications, commitments, or next check-in items after both private responses have been reviewed."></textarea>
          </label>
        </section>
      </div>
    </article>
  `;

  wireProfileHomeLogo();
  const setImportStatus = (id, message, isError = false) => {
    const el = document.querySelector(id);
    el.textContent = message;
    el.classList.toggle("error", isError);
  };

  document.querySelector("#managerResponseFile").addEventListener("change", event => {
    const file = event.target.files?.[0];
    if (!file) return;
    readResponseFile(file, role, kind, "manager", (payload, error) => {
      managerPayload = payload;
      document.querySelector("#managerResponsePreview").innerHTML = responsePreviewHtml(payload);
      setImportStatus("#managerImportStatus", error || `Imported ${file.name}`, Boolean(error));
    });
  });

  document.querySelector("#employeeResponseFile").addEventListener("change", event => {
    const file = event.target.files?.[0];
    if (!file) return;
    readResponseFile(file, role, kind, "employee", (payload, error) => {
      employeePayload = payload;
      document.querySelector("#employeeResponsePreview").innerHTML = responsePreviewHtml(payload);
      setImportStatus("#employeeImportStatus", error || `Imported ${file.name}`, Boolean(error));
    });
  });

  document.querySelector("#generateCombinedReport").addEventListener("click", () => renderCombinedReport(role, kind, managerPayload, employeePayload));
  document.querySelector("#exportCombinedSummary").addEventListener("click", () => exportCombinedSummary(role, kind, managerPayload, employeePayload));
  document.querySelector("#backToWorkflowFromMerge").addEventListener("click", () => {
    if (kind === "360-review") renderReviewWorksheet(role);
    else renderDevelopmentPlan(role);
  });
  document.querySelector("#closeResponseMerge").addEventListener("click", closeProfile);
}

function competencyLevelCards(role, competency, index) {
  const [name, definition, behavior] = competency;
  const baseName = `competency-${safeId(role.id)}-${index}`;
  const levels = [
    ["emerging", "Level 1 - Emerging", "Demonstrates pieces of the competency but needs clearer expectations, practice, coaching, or support to apply it reliably."],
    ["meeting", "Level 2 - Meeting", "Applies the competency consistently in current work and produces dependable results against role expectations."],
    ["strong", "Level 3 - Strong", "Applies the competency with notable independence, judgment, quality, and positive influence on outcomes or team effectiveness."]
  ];

  return `
    <article class="competency-map-card">
      <div class="competency-map-heading">
        <span>${index + 1}</span>
        <div>
          <h4>${escapeHtml(name)}</h4>
          <p>${escapeHtml(definition)}</p>
        </div>
      </div>
      <p class="observable-line"><strong>Observed behaviors:</strong> ${escapeHtml(behavior)}</p>
      <div class="level-choice-grid" role="radiogroup" aria-label="${escapeAttr(name)} level selection">
        ${levels.map(([value, label, help]) => `
          <label class="level-choice">
            <input type="radio" name="${escapeAttr(baseName)}" value="${escapeAttr(value)}">
            <span>
              <strong>${escapeHtml(label)}</strong>
              <small>${escapeHtml(help)}</small>
            </span>
          </label>
        `).join("")}
      </div>
      <label class="review-field full">
        <span>Competency notes</span>
        <textarea rows="3" placeholder="Add examples, context, coaching notes, or employee reflections."></textarea>
      </label>
    </article>
  `;
}

function ratingDefinitions() {
  const definitions = [
    ["Emerging", "Performance or competency use is developing. The person shows some relevant behaviors or progress, but consistency, independence, quality, or evidence is not yet reliable for the current role expectation."],
    ["Meeting", "Performance or competency use is reliable. The person delivers the expected current-state outcome or behavior with appropriate quality, follow-through, communication, and judgment for the role."],
    ["Strong", "Performance or competency use is a clear strength. The person delivers with high independence, strong quality, useful judgment, and positive impact beyond basic completion of the expected work."]
  ];

  return `
    <div class="rating-definition-grid" aria-label="Performance rating definitions">
      ${definitions.map(([label, definition]) => `
        <article class="rating-definition-card ${escapeAttr(label.toLowerCase())}">
          <strong>${escapeHtml(label)}</strong>
          <p>${escapeHtml(definition)}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function reviewConversationProcessGuide() {
  const principles = [
    ["Start with the role", "Anchor the conversation in role purpose, outcomes, responsibilities, competencies, skills, tools, O*NET alignment, and active development goals."],
    ["Employee voice comes first", "Let the employee explain what is going well, where they are struggling, and what support they need before supervisor feedback is finalized."],
    ["Use the tool to structure the conversation", "Private inputs and the combined report support the discussion. They should not replace it."],
    ["Treat misalignment as the agenda", "Differences between employee and supervisor selections become the most important conversation items."],
    ["Leave with action", "Close with development priorities, support commitments, timelines, evidence, and follow-up cadence."]
  ];
  const steps = [
    ["1. Confirm role foundation", "Review the current role profile and confirm whether it still reflects the actual work."],
    ["2. Employee completes self-assessment", "Employee completes role outcome and competency inputs with examples, barriers, support needs, and one self-identified development priority."],
    ["3. Hold employee-first conversation", "Supervisor starts by hearing the employee's view before finalizing manager feedback."],
    ["4. Supervisor completes manager assessment", "Supervisor completes the same inputs using observable work examples tied to the role."],
    ["5. Combine responses", "Import both response files and generate the alignment report."],
    ["6. Use the report as the meeting agenda", "Start with alignment, discuss one-level differences, then focus on priority gaps."],
    ["7. Finalize the review report", "Capture strengths, alignment areas, conversation items, priority items, development priorities, and support commitments."],
    ["8. Update the development action plan", "Translate the conversation into quarterly, semiannual, or startup-plan actions as appropriate."],
    ["9. Set follow-up cadence", "Confirm 30-day, quarterly, semiannual, or annual check-ins based on the role situation."]
  ];
  const meetingFlow = [
    "Open by restating that the goal is role clarity, performance alignment, development priorities, and support.",
    "Confirm role understanding: what fits, what is missing, what is unclear, and what may need updating.",
    "Review areas of alignment first to reinforce strengths and shared expectations.",
    "Discuss conversation items where ratings are close but not identical.",
    "Address priority items where ratings are meaningfully different.",
    "Select two to four development priorities, including at least one from the employee's reflection.",
    "Confirm what the employee owns, what the supervisor owns, what will be documented, and when progress will be revisited."
  ];
  const employeeQuestions = [
    "What has gone well in your role?",
    "Where do you feel most confident?",
    "What responsibilities feel unclear?",
    "What support would help you perform better?",
    "What is one thing you personally want to improve?"
  ];
  const supervisorQuestions = [
    "Where is the employee clearly meeting expectations?",
    "Where is the employee still emerging?",
    "Where is there a gap between effort and outcome?",
    "What role outcomes need the most attention?",
    "What commitments should the supervisor make to help the employee succeed?"
  ];

  return `
    <section class="section review-section review-process-section">
      <h3>Supervisor Conversation Process</h3>
      <div class="review-process-callout">
        <strong>The tool supports the conversation. The conversation is the process.</strong>
        <span>Use this workflow to keep the review role-based, employee-informed, evidence-grounded, and action-oriented.</span>
      </div>
      <div class="review-principle-grid">
        ${principles.map(([title, text]) => `
          <article class="review-principle-card">
            <h4>${escapeHtml(title)}</h4>
            <p>${escapeHtml(text)}</p>
          </article>
        `).join("")}
      </div>
      <details class="review-process-details" open>
        <summary>Recommended Review Process</summary>
        <ol class="review-step-list">
          ${steps.map(([title, text]) => `<li><strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span></li>`).join("")}
        </ol>
      </details>
      <details class="review-process-details">
        <summary>Meeting Flow</summary>
        <ul class="review-question-list">${meetingFlow.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </details>
      <div class="review-question-grid">
        <details class="review-process-details">
          <summary>Employee Self-Reflection Prompts</summary>
          <ul class="review-question-list">${employeeQuestions.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </details>
        <details class="review-process-details">
          <summary>Supervisor Feedback Prompts</summary>
          <ul class="review-question-list">${supervisorQuestions.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </details>
      </div>
    </section>
  `;
}

function outcomeReviewRows(role) {
  return role.outcomes.map((row, index) => {
    const baseName = `outcome-${safeId(role.id)}-${index}`;
    const choices = [
      ["emerging", "Emerging"],
      ["meeting", "Meeting"],
      ["strong", "Strong"]
    ];
    return `
      <article class="outcome-review-card">
        <div>
          <span class="review-number">${index + 1}</span>
          <h4>${escapeHtml(row[0])}</h4>
          <p><strong>Success looks like:</strong> ${escapeHtml(row[1])}</p>
          <p><strong>Evidence:</strong> ${escapeHtml(row[2])}</p>
        </div>
        <div class="outcome-rating" role="radiogroup" aria-label="${escapeAttr(row[0])} outcome level">
          ${choices.map(([value, label]) => `
            <label>
              <input type="radio" name="${escapeAttr(baseName)}" value="${escapeAttr(value)}">
              <span>${escapeHtml(label)}</span>
            </label>
          `).join("")}
        </div>
        <label class="review-field full">
          <span>Outcome evidence and notes</span>
          <textarea rows="3" placeholder="Document examples, work products, impact, context, or follow-up discussion points."></textarea>
        </label>
      </article>
    `;
  }).join("");
}

function renderReviewWorksheet(role) {
  const reviewDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  els.detail.innerHTML = `
    <article class="profile-card review-card">
      <div class="profile-hero review-hero">
        <div class="profile-title-block profile-home-link" role="button" tabindex="0" aria-label="Return to Role Clarity Library home">
          <img class="profile-logo" src="assets/brand/bbs-logo-white-lockup.png" alt="Bridge Builder Strategies">
          <p class="profile-kicker">360 Performance Review Worksheet</p>
          <h2>${escapeHtml(role.person)}</h2>
          <p>${escapeHtml(role.standardizedTitle)}</p>
        </div>
        <div class="hero-actions review-controls">
          <button class="action-button secondary" type="button" id="printReview">Print / Save PDF</button>
          <details class="action-menu">
            <summary>More</summary>
            <div class="action-menu-panel">
              <button class="ghost-button" type="button" id="backToProfile">Back to profile</button>
              <button class="ghost-button close-profile" type="button" id="closeReview">Close</button>
            </div>
          </details>
        </div>
        <div class="profile-brand-rail" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>

      <div class="review-intro">
        <div>
          <span class="card-label">Review basis</span>
          <h3>Private inputs and combined analysis</h3>
          <p>This workflow is generated from the current role profile. Manager and employee responses are completed separately, then combined into an alignment report for discussion and PDF export.</p>
        </div>
        <dl>
          <div><dt>Person</dt><dd>${escapeHtml(role.person)}</dd></div>
          <div><dt>Role family</dt><dd>${escapeHtml(role.roleFamily)}</dd></div>
          <div><dt>Function</dt><dd>${escapeHtml(role.function)}</dd></div>
          <div><dt>Prepared</dt><dd>${escapeHtml(reviewDate)}</dd></div>
        </dl>
      </div>

      <div class="profile-body review-body">
        ${reviewConversationProcessGuide()}

        <section class="section review-section assessment-launch-section">
          <h3>Assessment Responses</h3>
          <div class="assessment-launch-card">
            <div>
              <span class="card-label">Private response workflow</span>
              <p>Use these actions to complete the assessment. Manager and employee inputs are filled separately, then the combined view imports both files and generates the alignment report.</p>
            </div>
            <div class="assessment-action-row">
              <button class="action-button secondary" type="button" id="reviewManagerInput">Manager input</button>
              <button class="action-button secondary" type="button" id="reviewEmployeeInput">Employee input</button>
              <button class="action-button" type="button" id="reviewCombineResponses">Combine responses</button>
            </div>
          </div>
        </section>

        <section class="section review-section">
          <h3>Rating Baseline</h3>
          <div class="review-guidance">
            <strong>Use the same baseline in the manager and employee inputs.</strong>
            <span>Role outcomes use the Emerging / Meeting / Strong scale. Competencies use the role's Level I / Level II / Level III expectation map.</span>
          </div>
          ${ratingDefinitions()}
        </section>
      </div>
    </article>
  `;

  wireProfileHomeLogo();
  document.querySelector("#printReview").addEventListener("click", printReviewWorksheet);
  document.querySelector("#reviewManagerInput").addEventListener("click", () => renderPrivateResponse(role, "360-review", "manager"));
  document.querySelector("#reviewEmployeeInput").addEventListener("click", () => renderPrivateResponse(role, "360-review", "employee"));
  document.querySelector("#reviewCombineResponses").addEventListener("click", () => renderResponseMergeCenter(role, "360-review"));
  document.querySelector("#backToProfile").addEventListener("click", () => renderDetail(role));
  document.querySelector("#closeReview").addEventListener("click", closeProfile);
}

function printReviewWorksheet() {
  printMode = "review";
  document.body.classList.add("review-printing");
  window.print();
}

function exportReviewNotes(role) {
  const fields = Array.from(document.querySelectorAll(".review-field")).map(field => {
    const label = field.querySelector("span")?.textContent?.trim() || "Field";
    const value = field.querySelector("textarea, input")?.value?.trim() || "";
    return `${label}: ${value}`;
  });
  const selected = Array.from(document.querySelectorAll(".review-card input[type='radio']:checked")).map(input => {
    const card = input.closest(".competency-map-card, .outcome-review-card");
    const heading = card?.querySelector("h4")?.textContent?.trim() || "Selection";
    const label = input.closest("label")?.textContent?.replace(/\s+/g, " ").trim() || input.value;
    return `${heading}: ${label}`;
  });
  const lines = [
    "Bridge Builder Strategies - 360 Performance Review Worksheet",
    "",
    `Person: ${role.person}`,
    `Role: ${role.standardizedTitle}`,
    `Role family: ${role.roleFamily}`,
    "",
    "Selected levels:",
    ...(selected.length ? selected.map(item => `- ${item}`) : ["- No levels selected."]),
    "",
    "Notes:",
    ...fields
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${role.person.toLowerCase().replaceAll(" ", "-")}-360-review-notes.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function openPrintSections() {
  if (printMode === "profile-summary") return;
  const selector = printMode === "review" ? ".review-process-details" : ".collapsible-section";
  const collapsibleSections = Array.from(document.querySelectorAll(selector));
  printRestoreQueue = collapsibleSections.filter(section => !section.open);

  printRestoreQueue.forEach(section => {
    section.open = true;
  });
}

function restorePrintSections() {
  document.body.classList.remove("review-printing");
  document.body.classList.remove("development-printing");
  document.body.classList.remove("combined-report-printing");
  document.body.classList.remove("profile-summary-printing");
  document.body.classList.remove("profile-full-printing");
  printRestoreQueue.forEach(section => {
    section.open = false;
  });
  printRestoreQueue = [];
  printMode = "profile";
}

function exportSummary(role) {
  const capacity = getCapacityProfile(role.id);
  const capacityLines = capacity
    ? [
      "",
      "Current capacity assignment:",
      `Effective date: ${formatDate(capacity.effectiveDate)}`,
      ...capacity.allocations.map(item => `- ${item.category}: ${item.name} (${item.percent}%)`)
    ]
    : [];
  const lines = [
    "Bridge Builder Strategies - Role Clarity Library",
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
    ...role.outcomes.map(row => `- ${row[0]}: ${row[1]} Evidence / success measures: ${row[2]}`),
    "",
    "Core responsibilities:",
    ...role.responsibilities.map(row => `- ${row[0]}: ${row[1]} Work products: ${row[2]}`),
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
    ...role.onet.map(row => `- ${row[0]} ${row[1]} (${row[2]}): ${row[3]}`),
    "",
    role.designNote ? `Role design note: ${role.designNote}` : ""
  ].filter(line => line !== "");

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${role.person.toLowerCase().replaceAll(" ", "-")}-role-summary.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function init() {
  populateSelect(els.functionFilter, uniqueValues(role => role.function));
  populateSelect(els.familyFilter, uniqueValues(role => role.roleFamily));
  populateSelect(els.reportsFilter, uniqueValues(role => role.reportsTo));

  function setQuery(value) {
    state.query = value;
    if (els.search) els.search.value = value;
    if (els.orgSearch) els.orgSearch.value = value;
    renderDirectory();
  }

  els.search.addEventListener("input", event => {
    setQuery(event.target.value);
  });
  els.orgSearch?.addEventListener("input", event => {
    setQuery(event.target.value);
  });
  els.orgSearchClear?.addEventListener("click", () => {
    setQuery("");
    els.orgSearch?.focus();
  });
  els.functionFilter.addEventListener("change", event => {
    state.function = event.target.value;
    renderDirectory();
  });
  els.familyFilter.addEventListener("change", event => {
    state.family = event.target.value;
    renderDirectory();
  });
  els.reportsFilter.addEventListener("change", event => {
    state.reportsTo = event.target.value;
    renderDirectory();
  });
  els.clear.addEventListener("click", () => {
    state.query = "";
    state.function = "All";
    state.family = "All";
    state.reportsTo = "All";
    els.search.value = "";
    if (els.orgSearch) els.orgSearch.value = "";
    els.functionFilter.value = "All";
    els.familyFilter.value = "All";
    els.reportsFilter.value = "All";
    renderDirectory();
  });
  els.homeBrand?.addEventListener("click", returnHome);
  els.homeBrand?.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      returnHome();
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.body.classList.contains("detail-open")) {
      closeProfile();
    }
  });
  window.addEventListener("beforeprint", openPrintSections);
  window.addEventListener("afterprint", restorePrintSections);

  renderDirectory();
}

init();
