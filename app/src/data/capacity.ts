import type { CapacityProfile } from "../types/capacity";

export const CAPACITY_DATA: CapacityProfile[] = [
  {
    personId: "ahnaf-labib",
    effectiveDate: "2026-07-06",
    basis: "Planned working capacity allocation for onboarding and assignment clarity.",
    allocations: [
      {
        category: "Project",
        name: "Noble",
        percent: 15
      },
      {
        category: "Project",
        name: "MLK",
        percent: 15
      },
      {
        category: "Project",
        name: "Westfield",
        percent: 30
      },
      {
        category: "Project",
        name: "Shepherd",
        percent: 20
      },
      {
        category: "Product",
        name: "WINS / SMARTWork",
        percent: 10
      },
      {
        category: "Product",
        name: "WFInsights / GWC",
        percent: 5
      },
      {
        category: "Internal",
        name: "Data & IT Work Group",
        percent: 5
      }
    ]
  }
];
