import { Link, useLocation } from "react-router-dom";
import type { Role } from "../types/role";

type PersonContextBarProps = {
  role: Role;
};

type PersonRoute = "profile" | "development" | "review";

function activeRoute(pathname: string): PersonRoute {
  if (pathname.includes("/development")) return "development";
  if (pathname.includes("/review")) return "review";
  return "profile";
}

export default function PersonContextBar({ role }: PersonContextBarProps) {
  const { pathname } = useLocation();
  const active = activeRoute(pathname);
  const base = `/person/${role.id}`;

  const links: { id: PersonRoute; label: string; to: string }[] = [
    { id: "profile", label: "Profile", to: base },
    { id: "development", label: "Development", to: `${base}/development` },
    { id: "review", label: "360", to: `${base}/review` },
  ];

  return (
    <nav className="person-context-bar" aria-label={`${role.person} navigation`}>
      <div className="person-context-identity">
        <strong>{role.person}</strong>
        <span>{role.standardizedTitle}</span>
      </div>
      <div className="person-context-links" role="tablist" aria-label="Person sections">
        {links.map((link) => (
          <Link
            key={link.id}
            to={link.to}
            className={`person-context-link${active === link.id ? " is-active" : ""}`}
            aria-current={active === link.id ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
