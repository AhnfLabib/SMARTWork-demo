import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ROLES } from "../data";
import { filterRoles, type RoleFilters } from "../lib/search";
import type { Role } from "../types/role";

type DirectoryPanelProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

const DEFAULT_FILTERS: RoleFilters = {
  query: "",
  function: "All",
  family: "All",
  reportsTo: "All",
};

function uniqueFilterValues(getter: (role: Role) => string): string[] {
  return [
    "All",
    ...Array.from(new Set(ROLES.map(getter).filter(Boolean))).sort(),
  ];
}

function hasActiveFilters(filters: RoleFilters): boolean {
  return (
    filters.query.trim().length > 0 ||
    filters.function !== "All" ||
    filters.family !== "All" ||
    filters.reportsTo !== "All"
  );
}

export default function DirectoryPanel({
  query,
  onQueryChange,
}: DirectoryPanelProps) {
  const [functionFilter, setFunctionFilter] = useState(DEFAULT_FILTERS.function);
  const [familyFilter, setFamilyFilter] = useState(DEFAULT_FILTERS.family);
  const [reportsToFilter, setReportsToFilter] = useState(DEFAULT_FILTERS.reportsTo);

  const functionOptions = useMemo(
    () => uniqueFilterValues((role) => role.function),
    [],
  );
  const familyOptions = useMemo(
    () => uniqueFilterValues((role) => role.roleFamily),
    [],
  );
  const reportsToOptions = useMemo(
    () => uniqueFilterValues((role) => role.reportsTo),
    [],
  );

  const filters: RoleFilters = {
    query,
    function: functionFilter,
    family: familyFilter,
    reportsTo: reportsToFilter,
  };

  const filteredRoles = useMemo(() => filterRoles(ROLES, filters), [filters]);
  const filtersActive = hasActiveFilters(filters);

  function clearFilters() {
    setFunctionFilter(DEFAULT_FILTERS.function);
    setFamilyFilter(DEFAULT_FILTERS.family);
    setReportsToFilter(DEFAULT_FILTERS.reportsTo);
    onQueryChange("");
  }

  return (
    <details className="directory-panel">
      <summary className="directory-panel-summary">Role directory &amp; filters</summary>
      <div className="directory-panel-body">
        <div className="directory-filter-grid">
          <label className="directory-filter">
            <span>Function</span>
            <select
              value={functionFilter}
              onChange={(event) => setFunctionFilter(event.target.value)}
            >
              {functionOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="directory-filter">
            <span>Role family</span>
            <select
              value={familyFilter}
              onChange={(event) => setFamilyFilter(event.target.value)}
            >
              {familyOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="directory-filter">
            <span>Reports to</span>
            <select
              value={reportsToFilter}
              onChange={(event) => setReportsToFilter(event.target.value)}
            >
              {reportsToOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="directory-panel-actions">
          <button
            className="directory-clear"
            type="button"
            disabled={!filtersActive}
            onClick={clearFilters}
          >
            Clear filters
          </button>
        </div>

        <div className="directory-meta">
          <h2>Role directory</h2>
          <span>
            {filteredRoles.length} of {ROLES.length}{" "}
            {ROLES.length === 1 ? "role" : "roles"}
          </span>
        </div>

        <section className="directory-role-list" aria-live="polite">
          {filteredRoles.length === 0 ? (
            <p className="directory-empty">
              No roles match the current search and filters.
            </p>
          ) : (
            <ul className="directory-role-items">
              {filteredRoles.map((role) => (
                <li key={role.id}>
                  <Link className="directory-role-link" to={`/person/${role.id}`}>
                    <span className="directory-role-name">{role.person}</span>
                    <span className="directory-role-title">{role.standardizedTitle}</span>
                    <span className="directory-role-function">{role.function}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </details>
  );
}
