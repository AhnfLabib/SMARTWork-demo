import { useState } from "react";
import type { CapacityProfile } from "../types/capacity";
import type { Role } from "../types/role";
import {
  COMPETENCY_LEVELS,
  competencyLevelContent,
  expectedCompetencyLevel,
  parseCompetency,
} from "../lib/competency";
import CapacityDetail from "./CapacityDetail";
import DataTable, { SectionBlock } from "./DataTable";

type ProfileTabsProps = {
  role: Role;
  capacity: CapacityProfile | null;
};

type TabId = "overview" | "outcomes" | "competencies" | "reference";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "outcomes", label: "Outcomes" },
  { id: "competencies", label: "Competencies" },
  { id: "reference", label: "Reference" },
];

function CompetencyExpectationMap({ role }: { role: Role }) {
  const expectedLevel = expectedCompetencyLevel(role);

  return (
    <div className="competency-expectation-map">
      <div className="competency-expectation-intro">
        <strong>Role-scope marker:</strong>
        <span>
          The expected level describes where this role is designed to operate. It is not a
          person-specific assessment.
        </span>
      </div>
      <div className="table-wrap competency-expectation-wrap">
        <table className="data-table competency-expectation-table">
          <caption className="sr-only">Competency expectation map for {role.person}</caption>
          <thead>
            <tr>
              <th scope="col">Competency</th>
              {COMPETENCY_LEVELS.map((level) => (
                <th key={level} scope="col">
                  {level}
                </th>
              ))}
              <th scope="col">Expected for Role</th>
            </tr>
          </thead>
          <tbody>
            {role.competencies.map((competency) => {
              const { name, definition, behavior } = parseCompetency(competency);
              return (
                <tr key={name}>
                  <td>
                    <strong>{name}</strong>
                  </td>
                  {COMPETENCY_LEVELS.map((level) => {
                    const content = competencyLevelContent(level, name, definition, behavior);
                    return (
                      <td
                        key={level}
                        className={level === expectedLevel ? "expected-level-cell" : undefined}
                      >
                        <div className="competency-level-block">
                          <strong>Expectations</strong>
                          <ul>
                            {content.expectations.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                          <strong>Examples of Success</strong>
                          <ul>
                            {content.examples.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    );
                  })}
                  <td className="expected-role-cell">
                    <span className="expected-level-badge">{expectedLevel}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WorkStyleGuide({ role }: { role: Role }) {
  if (!role.workStyleGuide) return null;

  return (
    <div className="work-style-guide">
      <div className="work-style-intro">
        <strong>How to use this section</strong>
        <p>{role.workStyleGuide.basis}</p>
      </div>
      <div className="work-style-card-grid">
        {role.workStyleGuide.cards.map((card) => (
          <article key={card.title} className="work-style-card">
            <h4>{card.title}</h4>
            <ul>
              {card.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

function OnetBenchmark({ role }: { role: Role }) {
  const primary = role.onet[0];
  const secondary = role.onet.slice(1);
  const highMatches = role.onet.filter((row) => row[2] === "High").length;
  const mediumMatches = role.onet.filter((row) => row[2] === "Medium").length;

  return (
    <div className="onet-benchmark">
      <div className="onet-summary-grid">
        <div className="onet-summary-card primary">
          <span className="card-label">Primary O*NET Anchor</span>
          <strong>{primary[0]}</strong>
          <p>{primary[1]}</p>
          <span className={`fit-badge ${primary[2].toLowerCase()}`}>{primary[2]} fit</span>
        </div>
        <div className="onet-summary-card">
          <span className="card-label">Secondary Occupations</span>
          <strong>{secondary.length}</strong>
          <p>{secondary.map((row) => row[1]).join(", ")}</p>
        </div>
        <div className="onet-summary-card">
          <span className="card-label">Standardized Basis</span>
          <strong>
            {highMatches} High / {mediumMatches} Medium
          </strong>
          <p>
            Aligned using current responsibilities, competencies, skills, tools, and work
            products already documented in the role profile.
          </p>
        </div>
      </div>

      <div className="benchmark-note">
        <strong>Hybrid role interpretation:</strong> BBS roles may align to more than one
        O*NET occupation because current-state work can span strategy, delivery, operations,
        analytics, product support, and external relationship responsibilities.
      </div>

      <div className="benchmark-detail-grid">
        <div className="benchmark-panel">
          <h4>Occupation Benchmark</h4>
          <dl className="benchmark-definition-list">
            <div>
              <dt>Primary code</dt>
              <dd>{primary[0]}</dd>
            </div>
            <div>
              <dt>Primary occupation</dt>
              <dd>{primary[1]}</dd>
            </div>
            <div>
              <dt>Fit basis</dt>
              <dd>{primary[3]}</dd>
            </div>
          </dl>
        </div>
        <div className="benchmark-panel">
          <h4>Role Profile Mapping Fields</h4>
          <ul className="benchmark-checklist">
            <li>Role outcomes</li>
            <li>Core responsibilities</li>
            <li>Competency model</li>
            <li>Core skills</li>
            <li>Tools, systems, and work products</li>
          </ul>
        </div>
      </div>

      <div className="benchmark-detail-grid wide">
        <div className="benchmark-panel">
          <h4>Representative BBS Tasks</h4>
          <ul>
            {role.responsibilities.map(([area, responsibility]) => (
              <li key={area}>
                <strong>{area}:</strong> {responsibility}
              </li>
            ))}
          </ul>
        </div>
        <div className="benchmark-panel">
          <h4>Skills And Competencies</h4>
          <ul>
            {role.competencies.map(([name, definition]) => (
              <li key={name}>
                <strong>{name}:</strong> {definition}
              </li>
            ))}
          </ul>
        </div>
        <div className="benchmark-panel">
          <h4>Technology / Work Product Anchors</h4>
          <ul>
            {role.tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SourceDocuments({ role }: { role: Role }) {
  if (!role.sources.length) {
    return <p className="muted">No source document is attached for this role yet.</p>;
  }

  return (
    <div className="source-grid">
      {role.sources.map((src, index) => {
        const isImage = /\.(png|jpe?g|webp|gif)$/i.test(src);
        const filename = src.split("/").pop();
        return (
          <a
            key={src}
            className={`source-card ${isImage ? "source-image" : "source-file"}`}
            href={src}
            target="_blank"
            rel="noopener noreferrer"
          >
            {isImage ? (
              <img src={src} alt={`${role.person} source profile ${index + 1}`} />
            ) : (
              <span className="source-file-icon" aria-hidden="true">
                DOC
              </span>
            )}
            <span>
              {isImage ? `Source profile ${index + 1}` : filename || `Source document ${index + 1}`}
            </span>
          </a>
        );
      })}
    </div>
  );
}

function OverviewTab({ role, capacity }: ProfileTabsProps) {
  return (
    <div className="profile-tab-panel">
      <div className="notice">
        <strong>Observed work profile:</strong> {role.observedWorkProfile}
      </div>

      <SectionBlock title="Role Purpose">
        <p className="narrative">{role.rolePurpose}</p>
      </SectionBlock>

      {capacity ? (
        <SectionBlock title="Current Capacity Assignment">
          <CapacityDetail role={role} capacity={capacity} compact />
        </SectionBlock>
      ) : null}

      <SectionBlock title="Core Responsibilities">
        <DataTable
          headers={[
            "Responsibility Area",
            "Core Responsibilities",
            "Example Work Products",
          ]}
          rows={role.responsibilities}
          caption="Core responsibilities summary"
        />
      </SectionBlock>
    </div>
  );
}

function OutcomesTab({ role }: { role: Role }) {
  return (
    <div className="profile-tab-panel">
      <SectionBlock title="Role Outcomes">
        <DataTable
          headers={["Outcome", "What Success Looks Like", "Evidence / Success Measures"]}
          rows={role.outcomes}
          caption="Full role outcomes"
        />
      </SectionBlock>
    </div>
  );
}

function CompetenciesTab({ role }: { role: Role }) {
  return (
    <div className="profile-tab-panel">
      <SectionBlock title="Competency Expectation Map">
        <CompetencyExpectationMap role={role} />
      </SectionBlock>
      {role.workStyleGuide ? (
        <SectionBlock title="Work Style & Collaboration Guide">
          <WorkStyleGuide role={role} />
        </SectionBlock>
      ) : null}
    </div>
  );
}

function ReferenceTab({ role }: { role: Role }) {
  return (
    <div className="profile-tab-panel">
      <SectionBlock title="Core Skills">
        <ul className="pill-list">
          {role.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock title="Key Tools, Systems, and Work Products">
        <ul className="pill-list">
          {role.tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock title="O*NET Benchmark">
        <OnetBenchmark role={role} />
      </SectionBlock>

      {role.designNote ? (
        <SectionBlock title="Role Design Note">
          <p className="narrative">{role.designNote}</p>
        </SectionBlock>
      ) : null}

      <SectionBlock title="Supporting Source Documents">
        <SourceDocuments role={role} />
      </SectionBlock>
    </div>
  );
}

export default function ProfileTabs({ role, capacity }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="profile-tabs">
      <div className="profile-tab-list" role="tablist" aria-label="Profile sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`profile-tab${activeTab === tab.id ? " is-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="profile-tab-content"
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === "overview" ? <OverviewTab role={role} capacity={capacity} /> : null}
        {activeTab === "outcomes" ? <OutcomesTab role={role} /> : null}
        {activeTab === "competencies" ? <CompetenciesTab role={role} /> : null}
        {activeTab === "reference" ? <ReferenceTab role={role} /> : null}
      </div>
    </div>
  );
}
