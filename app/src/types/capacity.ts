export interface CapacityAllocation {
  category: string;
  name: string;
  percent: number;
}

export interface CapacityProfile {
  personId: string;
  effectiveDate: string;
  basis: string;
  allocations: CapacityAllocation[];
}
