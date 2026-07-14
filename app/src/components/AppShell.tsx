import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <>
      <header className="app-header">
        <Link to="/" className="brand-lockup" aria-label="Return to Bridge360 home">
          <img
            className="brand-logo"
            src="/assets/brand/bbs-logo-color-lockup.png"
            alt="Bridge Builder Strategies"
          />
          <div>
            <p className="eyebrow">Bridge Builder Strategies</p>
            <h1>Bridge360</h1>
          </div>
        </Link>
        <p className="header-note">
          Current-state documentation — no gap analysis, scoring, or compensation
          guidance.
        </p>
        <div className="brand-rail" aria-hidden="true">
          <span className="rail-navy" />
          <span className="rail-green" />
          <span className="rail-blue" />
          <span className="rail-orange" />
          <span className="rail-red" />
        </div>
      </header>
      <main className="app-shell">{children}</main>
    </>
  );
}
