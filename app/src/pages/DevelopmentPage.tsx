import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CapacityDetail from "../components/CapacityDetail";
import DataTable, { SectionBlock } from "../components/DataTable";
import NotFound from "../components/NotFound";
import PersonContextBar from "../components/PersonContextBar";
import { getRoleById } from "../data";
import { getCapacityProfile, capacityTotals } from "../lib/capacity";
import {
  exportDevelopmentNotes,
  hasStartupPlan,
  personFirstName,
  type DevelopmentNoteField,
} from "../lib/developmentExport";
import { getDevelopmentPlan } from "../lib/developmentPlan";
import { printDevelopment } from "../lib/print";
import "../styles/profile.css";

type PromptNotesProps = {
  items: string[];
  noteKeyPrefix: string;
  notes: Record<string, string>;
  onNoteChange: (key: string, value: string) => void;
};

function PromptNotes({ items, noteKeyPrefix, notes, onNoteChange }: PromptNotesProps) {
  return (
    <div className="development-prompt-list">
      {items.map((item, index) => {
        const key = `${noteKeyPrefix}-${index}`;
        return (
          <label key={key} className="review-field full development-prompt">
            <span>
              {index + 1}. {item}
            </span>
            <textarea
              rows={3}
              value={notes[key] ?? ""}
              placeholder="Add notes, examples, context, or follow-up items."
              onChange={(event) => onNoteChange(key, event.target.value)}
            />
          </label>
        );
      })}
    </div>
  );
}

function DevelopmentPillStrip({
  role,
  planPeriod,
}: {
  role: NonNullable<ReturnType<typeof getRoleById>>;
  planPeriod: string;
}) {
  const capacity = getCapacityProfile(role.id);
  const totals = capacity ? capacityTotals(capacity) : null;

  return (
    <div className="development-pill-strip">
      <span>
        <strong>Plan period</strong> {planPeriod}
      </span>
      <span>
        <strong>Role</strong> {role.standardizedTitle}
      </span>
      <span>
        <strong>Manager</strong> {role.reportsTo}
      </span>
      {totals ? (
        <span>
          <strong>Capacity</strong> Project {totals.Project || 0}% / Product{" "}
          {totals.Product || 0}% / Internal {totals.Internal || 0}%
        </span>
      ) : null}
    </div>
  );
}

export default function DevelopmentPage() {
  const { id } = useParams<{ id: string }>();
  const role = id ? getRoleById(id) : undefined;
  const plan = id ? getDevelopmentPlan(id) : null;
  const capacity = id ? getCapacityProfile(id) : null;
  const [notes, setNotes] = useState<Record<string, string>>({});

  const noteFields = useMemo<DevelopmentNoteField[]>(() => {
    if (!plan) return [];

    const fields: DevelopmentNoteField[] = [];

    plan.startupReflection.forEach((item, index) => {
      const key = `startup-reflection-${index}`;
      fields.push({ label: `${index + 1}. ${item}`, value: notes[key]?.trim() ?? "" });
    });
    plan.quarterlyPrompts.forEach((item, index) => {
      const key = `quarterly-prompt-${index}`;
      fields.push({ label: `${index + 1}. ${item}`, value: notes[key]?.trim() ?? "" });
    });
    plan.employeeReflection.forEach((item, index) => {
      const key = `employee-reflection-${index}`;
      fields.push({ label: `${index + 1}. ${item}`, value: notes[key]?.trim() ?? "" });
    });
    fields.push({
      label: "Manager support notes",
      value: notes["manager-support-notes"]?.trim() ?? "",
    });
    fields.push({
      label: "Shared summary",
      value: notes["shared-notes"]?.trim() ?? "",
    });

    return fields;
  }, [notes, plan]);

  if (!role || !plan) {
    return <NotFound />;
  }

  const includesStartup = hasStartupPlan(plan);
  const personName = personFirstName(role);

  function handleNoteChange(key: string, value: string) {
    setNotes((current) => ({ ...current, [key]: value }));
  }

  function handleExport() {
    exportDevelopmentNotes(role!, plan!, noteFields);
  }

  return (
    <article className="profile-page">
      <PersonContextBar role={role} />

      <div className="profile-card development-card">
        <header className="profile-hero development-hero">
          <div className="profile-hero-main">
            <Link to="/" className="profile-title-block" aria-label="Return to SMARTWork home">
              <img
                className="profile-logo"
                src="/assets/brand/bbs-logo-white-lockup.png"
                alt="Bridge Builder Strategies"
              />
              <p className="profile-kicker">Development Plan</p>
              <h2>{role.person}</h2>
              <p className="profile-hero-title">{role.standardizedTitle}</p>
            </Link>
          </div>

          <div className="hero-actions development-controls">
            <button className="action-button" type="button" onClick={handleExport}>
              Export plan
            </button>
            <button
              className="action-button secondary"
              type="button"
              onClick={() => printDevelopment()}
            >
              Print / Save PDF
            </button>
            <Link className="ghost-button" to={`/person/${role.id}`}>
              Back to profile
            </Link>
          </div>

          <div className="profile-brand-rail" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </header>

        <DevelopmentPillStrip role={role} planPeriod={plan.period} />

        <div className="development-intro">
          <div>
            <span className="card-label">Developmental roadmap</span>
            <h3>
              {includesStartup
                ? "Startup, quarterly, and semiannual growth plan"
                : "Quarterly and semiannual growth plan"}
            </h3>
            <p>{plan.planBasis}</p>
          </div>
          <dl>
            {includesStartup ? (
              <div>
                <dt>30-day startup</dt>
                <dd>{plan.startupPeriod}</dd>
              </div>
            ) : null}
            <div>
              <dt>Quarterly plan</dt>
              <dd>{plan.quarterlyPeriod}</dd>
            </div>
            <div>
              <dt>Semiannual plan</dt>
              <dd>{plan.semiannualPeriod}</dd>
            </div>
            <div>
              <dt>Primary role basis</dt>
              <dd>{role.roleFamily}</dd>
            </div>
            <div>
              <dt>Primary use</dt>
              <dd>
                {includesStartup
                  ? "Developmental clarity and onboarding support"
                  : "Quarterly development clarity and role support"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="profile-body development-body">
          {includesStartup ? (
            <SectionBlock title="30-Day Startup Plan">
              <section className="development-section startup-section">
                <div className="development-guidance startup-guidance">
                  <strong>{plan.startupPeriod}</strong>
                  <span>{plan.startupPurpose}</span>
                </div>
                <DataTable
                  headers={[
                    "Area",
                    "First 30-Day Focus",
                    `What ${personName} Should Do`,
                    "Evidence By Day 30",
                  ]}
                  rows={plan.startupAssignments.map((row) => [...row])}
                  caption="30-day startup assignments"
                />
                <h4 className="subsection-heading">Four-Week Startup Flow</h4>
                <div className="startup-week-grid">
                  {plan.startupWeeks.map(([week, goal, focus, evidence]) => (
                    <article key={week} className="startup-week-card">
                      <span className="card-label">{week}</span>
                      <h4>{goal}</h4>
                      <p>{focus}</p>
                      <strong>Evidence by week end</strong>
                      <small>{evidence}</small>
                    </article>
                  ))}
                </div>
                <h4 className="subsection-heading">Manager Support During Startup</h4>
                <ul className="development-checklist">
                  {plan.startupManagerSupport.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <h4 className="subsection-heading">30-Day Startup Reflection</h4>
                <PromptNotes
                  items={plan.startupReflection}
                  noteKeyPrefix="startup-reflection"
                  notes={notes}
                  onNoteChange={handleNoteChange}
                />
              </section>
            </SectionBlock>
          ) : null}

          <SectionBlock title="Development Focus Areas">
            <div className="development-focus-grid">
              {plan.focusAreas.map(([area, why]) => (
                <article key={area} className="development-focus-card">
                  <h4>{area}</h4>
                  <p>{why}</p>
                </article>
              ))}
            </div>
          </SectionBlock>

          {capacity ? (
            <SectionBlock title="Capacity Anchor">
              <CapacityDetail role={role} capacity={capacity} compact />
            </SectionBlock>
          ) : null}

          <SectionBlock title="Quarterly Plan">
            <section className="development-section">
              <div className="development-guidance">
                <strong>{plan.quarterlyPeriod}</strong>
                <span>
                  Next-90-days execution focus: use this section to clarify immediate work
                  rhythms, ownership, deliverables, and practical evidence for the next
                  quarterly conversation.
                </span>
              </div>
              <DataTable
                headers={[
                  "90-Day Execution Focus",
                  "Current Role Connection",
                  "Quarterly Evidence",
                ]}
                rows={plan.quarterlyGoals.map((row) => [...row])}
                caption="Quarterly development goals"
              />
              <h4 className="subsection-heading">Quarterly Check-In Prompts</h4>
              <PromptNotes
                items={plan.quarterlyPrompts}
                noteKeyPrefix="quarterly-prompt"
                notes={notes}
                onNoteChange={handleNoteChange}
              />
            </section>
          </SectionBlock>

          <SectionBlock title="Semiannual Plan">
            <section className="development-section">
              <div className="development-guidance">
                <strong>{plan.semiannualPeriod}</strong>
                <span>
                  Six-month growth arc: use this section to define what should become stronger
                  across two quarters, especially independence, judgment, consistency, and
                  role-scope ownership.
                </span>
              </div>
              <DataTable
                headers={["Six-Month Growth Theme", "What Should Be Stronger By Semiannual Review"]}
                rows={plan.semiannualOutcomes.map((row) => [...row])}
                caption="Semiannual development outcomes"
              />
            </section>
          </SectionBlock>

          <SectionBlock title="Manager Support Plan">
            <ul className="development-checklist">
              {plan.managerSupport.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionBlock>

          <SectionBlock title={`${personName} Employee Reflection`}>
            <PromptNotes
              items={plan.employeeReflection}
              noteKeyPrefix="employee-reflection"
              notes={notes}
              onNoteChange={handleNoteChange}
            />
          </SectionBlock>

          <SectionBlock title="Manager Support Notes">
            <label className="review-field full development-prompt">
              <span>Manager support notes</span>
              <textarea
                rows={5}
                value={notes["manager-support-notes"] ?? ""}
                placeholder="Document context, support commitments, check-in cadence, or manager follow-up."
                onChange={(event) => handleNoteChange("manager-support-notes", event.target.value)}
              />
            </label>
          </SectionBlock>

          <SectionBlock title="Shared Development Notes">
            <label className="review-field full development-prompt">
              <span>Shared summary</span>
              <textarea
                rows={6}
                value={notes["shared-notes"] ?? ""}
                placeholder="Capture shared takeaways, next learning priorities, manager commitments, or follow-up items."
                onChange={(event) => handleNoteChange("shared-notes", event.target.value)}
              />
            </label>
          </SectionBlock>
        </div>
      </div>
    </article>
  );
}
