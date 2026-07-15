import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import NotFound from "../components/NotFound";
import PersonContextBar from "../components/PersonContextBar";
import { getRoleById } from "../data";
import {
  buildAlignmentAnalysis,
  validateResponsePayload,
  type AlignmentAnalysis,
} from "../lib/reviewPayload";
import { printCombined } from "../lib/print";
import type { AnyPrivateResponsePayload, ReviewAudience } from "../types/review";
import "../styles/profile.css";
import "../styles/review.css";

async function readJsonFile(file: File): Promise<unknown> {
  const text = await file.text();
  return JSON.parse(text) as unknown;
}

export default function ReviewCombinePage() {
  const { id } = useParams<{ id: string }>();
  const role = id ? getRoleById(id) : undefined;
  const [managerPayload, setManagerPayload] = useState<AnyPrivateResponsePayload | null>(null);
  const [employeePayload, setEmployeePayload] = useState<AnyPrivateResponsePayload | null>(null);
  const [managerError, setManagerError] = useState("");
  const [employeeError, setEmployeeError] = useState("");
  const [sharedNotes, setSharedNotes] = useState("");
  const [analysis, setAnalysis] = useState<AlignmentAnalysis | null>(null);

  if (!role) return <NotFound />;

  async function handleFile(
    audience: ReviewAudience,
    fileList: FileList | null,
  ): Promise<void> {
    const file = fileList?.[0];
    if (!file) return;

    try {
      const parsed = await readJsonFile(file);
      const error = validateResponsePayload(parsed, role!, "360-review", audience);
      if (error) {
        if (audience === "manager") {
          setManagerPayload(null);
          setManagerError(error);
        } else {
          setEmployeePayload(null);
          setEmployeeError(error);
        }
        setAnalysis(null);
        return;
      }

      const payload = parsed as AnyPrivateResponsePayload;
      if (audience === "manager") {
        setManagerPayload(payload);
        setManagerError("");
        if (employeePayload) {
          setAnalysis(buildAlignmentAnalysis(payload, employeePayload));
        }
      } else {
        setEmployeePayload(payload);
        setEmployeeError("");
        if (managerPayload) {
          setAnalysis(buildAlignmentAnalysis(managerPayload, payload));
        }
      }
    } catch {
      const message = "The selected file could not be read as JSON.";
      if (audience === "manager") {
        setManagerPayload(null);
        setManagerError(message);
      } else {
        setEmployeePayload(null);
        setEmployeeError(message);
      }
      setAnalysis(null);
    }
  }

  return (
    <article className="profile-page">
      <PersonContextBar role={role} />
      <div className="profile-card review-card">
        <header className="profile-hero review-hero">
          <div className="profile-hero-main">
            <Link to="/" className="profile-title-block" aria-label="Return to SMARTWork home">
              <img
                className="profile-logo"
                src="/assets/brand/bbs-logo-white-lockup.png"
                alt="Bridge Builder Strategies"
              />
              <p className="profile-kicker">360 Review · Combined Conversation</p>
              <h2>{role.person}</h2>
              <p className="profile-hero-title">{role.standardizedTitle}</p>
            </Link>
          </div>
          <div className="hero-actions review-combine-controls">
            <button
              className="action-button secondary"
              type="button"
              onClick={() => printCombined()}
              disabled={!analysis}
            >
              Print / Save PDF
            </button>
            <Link className="ghost-button" to={`/person/${role.id}/review`}>
              Back to 360 launch
            </Link>
          </div>
        </header>

        <section className="private-workflow-intro">
          <span className="card-label">Import private response files</span>
          <p>
            Import each private JSON response file. SMARTWork validates that both files match
            this person and workflow, then previews responses side by side for discussion.
          </p>
        </section>

        <section className="combine-import-grid">
          <label className="combine-import-card">
            <span>Manager response JSON</span>
            <input
              type="file"
              accept="application/json,.json"
              onChange={(event) => void handleFile("manager", event.target.files)}
            />
            {managerError ? <p className="error-text">{managerError}</p> : null}
            {managerPayload ? (
              <p className="success-text">Loaded manager response for {managerPayload.person}.</p>
            ) : null}
          </label>
          <label className="combine-import-card">
            <span>Employee response JSON</span>
            <input
              type="file"
              accept="application/json,.json"
              onChange={(event) => void handleFile("employee", event.target.files)}
            />
            {employeeError ? <p className="error-text">{employeeError}</p> : null}
            {employeePayload ? (
              <p className="success-text">
                Loaded employee response for {employeePayload.person}.
              </p>
            ) : null}
          </label>
        </section>

        {analysis ? (
          <section className="profile-section combined-report">
            <h3>Alignment Report</h3>
            <p>{analysis.summary}</p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Manager</th>
                    <th>Employee</th>
                    <th>Status</th>
                    <th>Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.comparisons.map((item) => (
                    <tr key={item.key} className={`align-${item.status}`}>
                      <td>
                        <strong>{item.label}</strong>
                        <span className="muted"> {item.group}</span>
                      </td>
                      <td>{item.managerValue}</td>
                      <td>{item.employeeValue}</td>
                      <td>{item.status}</td>
                      <td>{item.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="side-by-side-notes">
              <div>
                <h4>Manager narrative notes</h4>
                <ul>
                  {(managerPayload?.fields || [])
                    .filter((field) => field.value.trim())
                    .map((field) => (
                      <li key={`m-${field.key}`}>
                        <strong>{field.label}:</strong> {field.value}
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <h4>Employee narrative notes</h4>
                <ul>
                  {(employeePayload?.fields || [])
                    .filter((field) => field.value.trim())
                    .map((field) => (
                      <li key={`e-${field.key}`}>
                        <strong>{field.label}:</strong> {field.value}
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <label className="review-field full">
              <span>Shared conversation notes</span>
              <textarea
                id="combinedSharedNotes"
                rows={6}
                value={sharedNotes}
                placeholder="Capture shared takeaways, decisions, clarifications, commitments, or next check-in items."
                onChange={(event) => setSharedNotes(event.target.value)}
              />
            </label>
          </section>
        ) : (
          <p className="muted combine-waiting">
            Waiting for valid manager and employee response files before building the alignment
            report.
          </p>
        )}
      </div>
    </article>
  );
}
