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

export function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function capacityCategoryClass(category: string): string {
  return (category || "Other").toLowerCase().replace(/\s+/g, "-");
}

export const CAPACITY_CATEGORY_ORDER = ["Project", "Product", "Internal"] as const;
