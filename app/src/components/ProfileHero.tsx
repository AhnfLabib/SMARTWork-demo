import { Link } from "react-router-dom";
import type { CapacityProfile } from "../types/capacity";
import type { Role } from "../types/role";
import { downloadTextFile } from "../lib/download";
import { buildProfileSummaryText, profileSummaryFilename } from "../lib/profileExport";
import CapacityStrip from "./CapacityStrip";

type ProfileHeroProps = {
  role: Role;
  capacity: CapacityProfile | null;
};

export default function ProfileHero({ role, capacity }: ProfileHeroProps) {
  const topOutcomes = role.outcomes.slice(0, 5);

  function handleExportSummary() {
    downloadTextFile(
      profileSummaryFilename(role),
      buildProfileSummaryText(role, capacity),
    );
  }

  function handlePrintStub(mode: "summary" | "full") {
    document.body.classList.remove("profile-summary-printing", "profile-full-printing");
    document.body.classList.add(
      mode === "summary" ? "profile-summary-printing" : "profile-full-printing",
    );
    window.print();
    window.addEventListener(
      "afterprint",
      () => {
        document.body.classList.remove("profile-summary-printing", "profile-full-printing");
      },
      { once: true },
    );
  }

  return (
    <header className="profile-hero">
      <div className="profile-hero-main">
        <Link to="/" className="profile-title-block" aria-label="Return to Bridge360 home">
          <img
            className="profile-logo"
            src="/assets/brand/bbs-logo-white-lockup.png"
            alt="Bridge Builder Strategies"
          />
          <p className="profile-kicker">Standardized Role Profile</p>
          <h2>{role.person}</h2>
          <p className="profile-hero-title">{role.standardizedTitle}</p>
        </Link>

        <dl className="profile-hero-meta">
          <div>
            <dt>Reports to</dt>
            <dd>{role.reportsTo}</dd>
          </div>
          <div>
            <dt>Function</dt>
            <dd>{role.function}</dd>
          </div>
        </dl>

        <p className="profile-hero-purpose">{role.rolePurpose}</p>

        {capacity ? <CapacityStrip capacity={capacity} /> : null}

        {topOutcomes.length > 0 ? (
          <div className="profile-outcome-preview">
            <h3>Top role outcomes</h3>
            <ul>
              {topOutcomes.map(([outcome]) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="hero-actions">
        <Link
          className="action-button development-action"
          to={`/person/${role.id}/development`}
        >
          Development plan
        </Link>
        <Link className="action-button review-action" to={`/person/${role.id}/review`}>
          360 review
        </Link>
        <details className="action-menu">
          <summary>Print</summary>
          <div className="action-menu-panel">
            <button
              className="action-button secondary"
              type="button"
              onClick={() => handlePrintStub("summary")}
            >
              Print summary
            </button>
            <button
              className="action-button secondary"
              type="button"
              onClick={() => handlePrintStub("full")}
            >
              Print full profile
            </button>
          </div>
        </details>
        <button className="action-button" type="button" onClick={handleExportSummary}>
          Export summary
        </button>
        <Link className="ghost-button close-profile" to="/">
          Home
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
  );
}
