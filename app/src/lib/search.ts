import type { OrgNode } from "../types/org";
import type { Role } from "../types/role";

export interface RoleFilters {
  query: string;
  function: string;
  family: string;
  reportsTo: string;
}

function roleSearchText(role: Role): string {
  return [
    role.person,
    role.sourceTitle,
    role.standardizedTitle,
    role.function,
    role.rolePurpose,
    role.skills.join(" "),
    role.tools.join(" "),
    role.responsibilities.flat().join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export function roleMatchesQuery(role: Role, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return roleSearchText(role).includes(normalized);
}

function roleMatchesFilters(role: Role, filters: RoleFilters): boolean {
  const functionMatch =
    filters.function === "All" || role.function === filters.function;
  const familyMatch =
    filters.family === "All" || role.roleFamily === filters.family;
  const reportsMatch =
    filters.reportsTo === "All" || role.reportsTo === filters.reportsTo;

  return functionMatch && familyMatch && reportsMatch;
}

export function filterRoles(roles: Role[], filters: RoleFilters): Role[] {
  return roles.filter(
    (role) => roleMatchesQuery(role, filters.query) && roleMatchesFilters(role, filters),
  );
}

export function flattenOrgTree(node: OrgNode): OrgNode[] {
  return [node, ...(node.children ?? []).flatMap(flattenOrgTree)];
}

function orgNodeSearchText(node: OrgNode, role?: Role): string {
  return [
    node.name,
    node.title,
    node.type,
    role ? roleSearchText(role) : "",
  ]
    .join(" ")
    .toLowerCase();
}

export function orgNodeMatchesQuery(
  node: OrgNode,
  query: string,
  role?: Role,
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  if (role && roleMatchesQuery(role, query)) return true;
  return orgNodeSearchText(node, role).includes(normalized);
}

export function orgSubtreeHasMatch(
  node: OrgNode,
  query: string,
  getRole: (id: string) => Role | undefined,
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  const role = getRole(node.profileId);
  if (orgNodeMatchesQuery(node, query, role)) return true;
  return (node.children ?? []).some((child) =>
    orgSubtreeHasMatch(child, query, getRole),
  );
}

export function countOrgMatches(
  node: OrgNode,
  query: string,
  getRole: (id: string) => Role | undefined,
): number {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return flattenOrgTree(node).length;

  const role = getRole(node.profileId);
  let count = orgNodeMatchesQuery(node, query, role) ? 1 : 0;
  for (const child of node.children ?? []) {
    count += countOrgMatches(child, query, getRole);
  }
  return count;
}
