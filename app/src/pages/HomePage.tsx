import { useMemo, useState } from "react";
import DirectoryPanel from "../components/DirectoryPanel";
import OrgChart from "../components/OrgChart";
import OrgSearch from "../components/OrgSearch";
import { ORG_TREE, getRoleById } from "../data";
import { countOrgMatches, flattenOrgTree } from "../lib/search";
import "../styles/pages.css";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const totalPeople = useMemo(() => flattenOrgTree(ORG_TREE).length, []);
  const matchCount = useMemo(
    () => countOrgMatches(ORG_TREE, query, getRoleById),
    [query],
  );

  return (
    <div className="home-page">
      <OrgSearch
        query={query}
        totalPeople={totalPeople}
        matchCount={matchCount}
        onQueryChange={setQuery}
      />
      <OrgChart tree={ORG_TREE} query={query} />
      <DirectoryPanel query={query} onQueryChange={setQuery} />
    </div>
  );
}
