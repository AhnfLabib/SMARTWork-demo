import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NotFound from "../components/NotFound";
import PersonContextBar from "../components/PersonContextBar";
import { getRoleById } from "../data";
import { expectedCompetencyLevel, COMPETENCY_LEVELS } from "../lib/competency";
import { downloadJsonFile } from "../lib/download";
import { buildPrivateResponsePayload } from "../lib/reviewPayload";
import type { ResponseField, ReviewAudience } from "../types/review";
import "../styles/profile.css";
import "../styles/review.css";

const OUTCOME_LEVELS = ["Emerging", "Meeting", "Strong"] as const;

const MANAGER_SUPPORT_SELECTS = [
  ["manager-support-clarity", "Goal and priority clarity"],
  ["manager-support-feedback", "Feedback quality and frequency"],
  ["manager-support-autonomy", "Autonomy and decision support"],
  ["manager-support-resources", "Tools, context, and resources"],
  ["manager-support-coaching", "Coaching and development support"],
] as const;

type PrivateResponsePageProps = {
  audience: ReviewAudience;
};

export default function PrivateResponsePage({ audience }: PrivateResponsePageProps) {
  const { id } = useParams<{ id: string }>();
  const role = id ? getRoleById(id) : undefined;
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [fields, setFields] = useState<Record<string, string>>({});

  const expectedLevel = useMemo(
    () => (role ? expectedCompetencyLevel(role) : "Level II"),
    [role],
  );

  if (!role) return <NotFound />;

  const isManager = audience === "manager";
  const audienceLabel = isManager ? "Manager" : "Employee";

  function setSelection(key: string, value: string) {
    setSelections((current) => ({ ...current, [key]: value }));
  }

  function setField(key: string, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function handleExport() {
    const selectionRows: ResponseField[] = [];
    const fieldRows: ResponseField[] = [];

    role!.outcomes.forEach(([title], index) => {
      selectionRows.push({
        key: `outcome-${index}-level`,
        group: "Role Outcomes",
        label: `${title} level`,
        value: selections[`outcome-${index}-level`] ?? "",
      });
      fieldRows.push({
        key: `outcome-${index}-notes`,
        group: "Role Outcomes",
        label: `${title} notes`,
        value: fields[`outcome-${index}-notes`] ?? "",
      });
    });

    role!.competencies.forEach(([name], index) => {
      selectionRows.push({
        key: `competency-${index}-level`,
        group: "Competency Map",
        label: `${name} level`,
        value: selections[`competency-${index}-level`] ?? "",
      });
      fieldRows.push({
        key: `competency-${index}-notes`,
        group: "Competency Map",
        label: `${name} notes`,
        value: fields[`competency-${index}-notes`] ?? "",
      });
    });

    MANAGER_SUPPORT_SELECTS.forEach(([key, label]) => {
      selectionRows.push({
        key,
        group: "Manager Support Feedback",
        label,
        value: selections[key] ?? "",
      });
    });
    fieldRows.push(
      {
        key: "manager-support-start-stop-continue",
        group: "Manager Support Feedback",
        label: "Start, stop, or continue",
        value: fields["manager-support-start-stop-continue"] ?? "",
      },
      {
        key: "manager-support-follow-up",
        group: "Manager Support Feedback",
        label: "Support follow-up notes",
        value: fields["manager-support-follow-up"] ?? "",
      },
    );

    const payload = buildPrivateResponsePayload({
      role: role!,
      kind: "360-review",
      audience,
      selections: selectionRows,
      fields: fieldRows,
    });
    downloadJsonFile(`${role!.id}-360-review-${audience}-response.json`, payload);
  }

  return (
    <article className="profile-page">
      <PersonContextBar role={role} />
      <div className="profile-card review-card">
        <header className="profile-hero review-hero">
          <div className="profile-hero-main">
            <Link to="/" className="profile-title-block" aria-label="Return to Bridge360 home">
              <img
                className="profile-logo"
                src="/assets/brand/bbs-logo-white-lockup.png"
                alt="Bridge Builder Strategies"
              />
              <p className="profile-kicker">360 Review · {audienceLabel} Private Input</p>
              <h2>{role.person}</h2>
              <p className="profile-hero-title">{role.standardizedTitle}</p>
            </Link>
          </div>
          <div className="hero-actions">
            <button className="action-button" type="button" onClick={handleExport}>
              Export {audienceLabel} response
            </button>
            <Link className="ghost-button" to={`/person/${role.id}/review`}>
              Back to 360 launch
            </Link>
          </div>
        </header>

        <section className="private-workflow-intro">
          <span className="card-label">Local privacy workflow</span>
          <p>
            Complete this {audienceLabel.toLowerCase()} response privately, then export the
            JSON file. Files stay on your machine until someone imports them in Combine.
          </p>
          <div className="review-guidance">
            <strong>Rating baseline</strong>
            <span>
              Outcomes use Emerging / Meeting / Strong. Competencies use Level I / II / III.
              Role expectation for this profile: <em>{expectedLevel}</em>.
            </span>
          </div>
        </section>

        <section className="profile-section">
          <h3>Role Outcomes</h3>
          <div className="private-card-grid">
            {role.outcomes.map(([title, success, evidence], index) => (
              <article key={title} className="outcome-review-card">
                <h4>{title}</h4>
                <p>{success}</p>
                <p className="muted">Evidence: {evidence}</p>
                <fieldset className="outcome-rating">
                  <legend>{title} level</legend>
                  <div className="rating-choices">
                    {OUTCOME_LEVELS.map((level) => (
                      <label key={level}>
                        <input
                          type="radio"
                          name={`outcome-${index}-level`}
                          value={level}
                          checked={selections[`outcome-${index}-level`] === level}
                          onChange={() => setSelection(`outcome-${index}-level`, level)}
                        />
                        <span>{level}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="review-field full">
                  <span>{title} notes</span>
                  <textarea
                    rows={3}
                    value={fields[`outcome-${index}-notes`] ?? ""}
                    placeholder={
                      isManager
                        ? "Document manager evidence, examples, context, or coaching notes."
                        : "Document your self-reflection, evidence, context, or support needs."
                    }
                    onChange={(event) => setField(`outcome-${index}-notes`, event.target.value)}
                  />
                </label>
              </article>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h3>Competency Map</h3>
          <div className="private-card-grid competency-card-grid">
            {role.competencies.map(([name, definition, behavior], index) => (
              <article key={name} className="competency-map-card">
                <h4>{name}</h4>
                <p>{definition}</p>
                <p className="muted">{behavior}</p>
                <fieldset className="competency-assessment-map">
                  <legend>{name} level</legend>
                  <div className="rating-choices">
                    {COMPETENCY_LEVELS.map((level) => (
                      <label
                        key={level}
                        className={level === expectedLevel ? "role-expected" : undefined}
                      >
                        <input
                          type="radio"
                          name={`competency-${index}-level`}
                          value={level}
                          checked={selections[`competency-${index}-level`] === level}
                          onChange={() => setSelection(`competency-${index}-level`, level)}
                        />
                        <span>
                          {level}
                          {level === expectedLevel ? " (role expectation)" : ""}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="review-field full">
                  <span>{name} notes</span>
                  <textarea
                    rows={3}
                    value={fields[`competency-${index}-notes`] ?? ""}
                    onChange={(event) =>
                      setField(`competency-${index}-notes`, event.target.value)
                    }
                  />
                </label>
              </article>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h3>Manager Support Feedback</h3>
          <div className="private-card-grid">
            {MANAGER_SUPPORT_SELECTS.map(([key, label]) => (
              <label key={key} className="response-select-field">
                <span>{label}</span>
                <select
                  value={selections[key] ?? ""}
                  onChange={(event) => setSelection(key, event.target.value)}
                >
                  <option value="">Choose level</option>
                  {OUTCOME_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <label className="review-field full">
              <span>Start, stop, or continue</span>
              <textarea
                rows={3}
                value={fields["manager-support-start-stop-continue"] ?? ""}
                onChange={(event) =>
                  setField("manager-support-start-stop-continue", event.target.value)
                }
              />
            </label>
            <label className="review-field full">
              <span>Support follow-up notes</span>
              <textarea
                rows={3}
                value={fields["manager-support-follow-up"] ?? ""}
                onChange={(event) => setField("manager-support-follow-up", event.target.value)}
              />
            </label>
          </div>
        </section>
      </div>
    </article>
  );
}
