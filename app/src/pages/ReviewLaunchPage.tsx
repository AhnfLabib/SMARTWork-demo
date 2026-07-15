import { Link, useParams } from "react-router-dom";
import NotFound from "../components/NotFound";
import PersonContextBar from "../components/PersonContextBar";
import { getRoleById } from "../data";
import "../styles/profile.css";
import "../styles/review.css";

export default function ReviewLaunchPage() {
  const { id } = useParams<{ id: string }>();
  const role = id ? getRoleById(id) : undefined;

  if (!role) return <NotFound />;

  const base = `/person/${role.id}/review`;

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
              <p className="profile-kicker">360 Performance Review</p>
              <h2>{role.person}</h2>
              <p className="profile-hero-title">{role.standardizedTitle}</p>
            </Link>
          </div>
        </header>

        <section className="review-launch">
          <div>
            <span className="card-label">Private inputs and combined analysis</span>
            <h3>Complete the 360 separately, then combine</h3>
            <p>
              Manager and employee responses stay on this device as JSON files. No server
              upload. Rating baselines appear inside each private form.
            </p>
          </div>
          <dl className="review-meta">
            <div>
              <dt>Person</dt>
              <dd>{role.person}</dd>
            </div>
            <div>
              <dt>Role family</dt>
              <dd>{role.roleFamily}</dd>
            </div>
            <div>
              <dt>Function</dt>
              <dd>{role.function}</dd>
            </div>
          </dl>
        </section>

        <section className="assessment-launch-section">
          <h3>Assessment Responses</h3>
          <div className="assessment-launch-card">
            <p>
              Use these actions to complete the assessment. Manager and employee inputs are
              filled separately, then the combined view imports both files and generates the
              alignment report.
            </p>
            <div className="assessment-action-row">
              <Link className="action-button secondary" to={`${base}/manager`}>
                Manager input
              </Link>
              <Link className="action-button secondary" to={`${base}/employee`}>
                Employee input
              </Link>
              <Link className="action-button" to={`${base}/combine`}>
                Combine responses
              </Link>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
