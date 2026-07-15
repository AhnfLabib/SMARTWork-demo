type OrgSearchProps = {
  query: string;
  totalPeople: number;
  matchCount: number;
  onQueryChange: (query: string) => void;
};

export default function OrgSearch({
  query,
  totalPeople,
  matchCount,
  onQueryChange,
}: OrgSearchProps) {
  const queryActive = query.trim().length > 0;
  const metaText = queryActive
    ? `${matchCount} ${matchCount === 1 ? "match" : "matches"}`
    : `Showing all ${totalPeople} people in the organization map.`;

  return (
    <section className="org-search" aria-label="Search the organization map">
      <label className="org-search-label" htmlFor="org-search-input">
        Find a person or role
      </label>
      <div className="org-search-row">
        <input
          id="org-search-input"
          className="org-search-input"
          type="search"
          placeholder="Name, role, function, or skill"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <button
          className="org-search-clear"
          type="button"
          disabled={!queryActive}
          onClick={() => onQueryChange("")}
        >
          Clear
        </button>
      </div>
      <p className="org-search-meta" aria-live="polite">
        {metaText}
      </p>
    </section>
  );
}
