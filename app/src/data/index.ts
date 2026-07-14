import { ROLES } from "./roles";
import { ORG_TREE } from "./org";
import { CAPACITY_DATA } from "./capacity";
import { DEVELOPMENT_PLANS } from "./development";
import type { Role } from "../types/role";

export function getRoleById(id: string): Role | undefined {
  return ROLES.find((r) => r.id === id);
}

export function getAllRoles(): Role[] {
  return ROLES;
}

export { ROLES, ORG_TREE, CAPACITY_DATA, DEVELOPMENT_PLANS };
