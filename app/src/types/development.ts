export type DevelopmentPair = [string, string];
export type DevelopmentTriple = [string, string, string];
export type DevelopmentQuad = [string, string, string, string];

export interface DevelopmentPlan {
  personId: string;
  planTitle: string;
  period: string;
  startupPeriod: string;
  quarterlyPeriod: string;
  semiannualPeriod: string;
  planBasis: string;
  startupPurpose: string;
  startupAssignments: DevelopmentQuad[];
  startupWeeks: DevelopmentQuad[];
  startupManagerSupport: string[];
  startupReflection: string[];
  focusAreas: DevelopmentPair[];
  quarterlyGoals: DevelopmentTriple[];
  quarterlyPrompts: string[];
  semiannualOutcomes: DevelopmentPair[];
  managerSupport: string[];
  employeeReflection: string[];
}
