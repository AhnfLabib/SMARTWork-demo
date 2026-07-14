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
