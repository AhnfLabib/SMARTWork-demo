import { CAPACITY_DATA } from "../data";
import type { CapacityAllocation, CapacityProfile } from "../types/capacity";

export interface CapacityTotals {
  total: number;
  [category: string]: number;
}

export type GroupedAllocations = Record<string, CapacityAllocation[]>;

export function getCapacityProfile(personId: string): CapacityProfile | null {
  return CAPACITY_DATA.find((item) => item.personId === personId) ?? null;
}

export function capacityTotals(capacity: CapacityProfile): CapacityTotals {
  return capacity.allocations.reduce<CapacityTotals>(
    (totals, item) => {
      totals[item.category] = (totals[item.category] || 0) + item.percent;
      totals.total += item.percent;
      return totals;
    },
    { total: 0 },
  );
}

export function groupedAllocations(capacity: CapacityProfile): GroupedAllocations {
  return capacity.allocations.reduce<GroupedAllocations>((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {});
}
