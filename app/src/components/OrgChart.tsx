import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { getRoleById } from "../data";
import type { OrgNode } from "../types/org";
import {
  countOrgMatches,
  flattenOrgTree,
  orgNodeMatchesQuery,
  orgSubtreeHasMatch,
} from "../lib/search";

type OrgChartProps = {
  tree: OrgNode;
  query: string;
};

type OrgNodeRowProps = {
  node: OrgNode;
  query: string;
  depth: number;
  collapsedIds: Set<string>;
  onToggle: (profileId: string) => void;
  onOpenProfile: (profileId: string) => void;
};

function OrgNodeRow({
  node,
  query,
  depth,
  collapsedIds,
  onToggle,
  onOpenProfile,
}: OrgNodeRowProps) {
  const role = getRoleById(node.profileId);
  const hasChildren = Boolean(node.children?.length);
  const queryActive = query.trim().length > 0;
  const isMatch = orgNodeMatchesQuery(node, query, role);
  const isCollapsed = collapsedIds.has(node.profileId);
  const showChildren = hasChildren && !isCollapsed;

  if (queryActive && !orgSubtreeHasMatch(node, query, getRoleById)) {
    return null;
  }

  return (
    <li
      className={[
        "org-tree-node",
        `org-tree-node--${node.type}`,
        queryActive && !isMatch ? "org-tree-node--dimmed" : "",
        depth === 0 ? "org-tree-node--root" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ "--depth": depth } as CSSProperties}
    >
      <div className="org-tree-row">
        {hasChildren ? (
          <button
            type="button"
            className="org-tree-toggle"
            aria-expanded={!isCollapsed}
            aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${node.name}'s team`}
            onClick={() => onToggle(node.profileId)}
          >
            {isCollapsed ? "+" : "−"}
          </button>
        ) : (
          <span className="org-tree-toggle org-tree-toggle--spacer" aria-hidden="true" />
        )}
        <button
          type="button"
          className="org-tree-person"
          onClick={() => onOpenProfile(node.profileId)}
          aria-label={`Open profile for ${node.name}`}
        >
          <span className="org-tree-name">{node.name}</span>
          <span className="org-tree-title">{node.title}</span>
        </button>
      </div>
      {showChildren ? (
        <ul className="org-tree-children">
          {node.children!.map((child) => (
            <OrgNodeRow
              key={child.profileId}
              node={child}
              query={query}
              depth={depth + 1}
              collapsedIds={collapsedIds}
              onToggle={onToggle}
              onOpenProfile={onOpenProfile}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function OrgChart({ tree, query }: OrgChartProps) {
  const navigate = useNavigate();
  const totalPeople = useMemo(() => flattenOrgTree(tree).length, [tree]);
  const matchCount = useMemo(
    () => countOrgMatches(tree, query, getRoleById),
    [tree, query],
  );
  const queryActive = query.trim().length > 0;

  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const person of flattenOrgTree(tree)) {
      if (person.children?.length && person.profileId !== tree.profileId) {
        initial.add(person.profileId);
      }
    }
    return initial;
  });

  useEffect(() => {
    if (!queryActive) return;

    setCollapsedIds((current) => {
      const next = new Set(current);
      for (const person of flattenOrgTree(tree)) {
        if (
          person.children?.length &&
          orgSubtreeHasMatch(person, query, getRoleById)
        ) {
          next.delete(person.profileId);
        }
      }
      return next;
    });
  }, [query, tree, queryActive]);

  function toggleCollapse(profileId: string) {
    setCollapsedIds((current) => {
      const next = new Set(current);
      if (next.has(profileId)) {
        next.delete(profileId);
      } else {
        next.add(profileId);
      }
      return next;
    });
  }

  function openProfile(profileId: string) {
    navigate(`/person/${profileId}`);
  }

  if (queryActive && matchCount === 0) {
    return (
      <section className="org-chart org-chart--empty" aria-label="Organization map">
        <p className="org-chart-empty">No people match the current search.</p>
      </section>
    );
  }

  return (
    <section className="org-chart" aria-label="Organization map">
      <header className="org-chart-header">
        <h2>Organization map</h2>
        <p>
          {queryActive
            ? `Showing ${matchCount} of ${totalPeople} people`
            : `${totalPeople} people across Bridge Builder Strategies`}
        </p>
      </header>
      <div className="org-chart-stage">
        <ul className="org-tree">
          <OrgNodeRow
            node={tree}
            query={query}
            depth={0}
            collapsedIds={collapsedIds}
            onToggle={toggleCollapse}
            onOpenProfile={openProfile}
          />
        </ul>
      </div>
    </section>
  );
}
