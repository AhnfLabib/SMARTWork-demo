export type Triple = [string, string, string];
export type Pair = [string, string];

export interface WorkStyleCard {
  title: string;
  items: string[];
}

export interface WorkStyleGuide {
  basis: string;
  cards: WorkStyleCard[];
}

export interface Role {
  id: string;
  person: string;
  sourceTitle: string;
  standardizedTitle: string;
  roleFamily: string;
  reportsTo: string;
  function: string;
  primaryUse: string;
  observedWorkProfile: string;
  rolePurpose: string;
  outcomes: Triple[];
  responsibilities: Triple[];
  competencies: Triple[];
  skills: string[];
  tools: string[];
  onet: [string, string, string, string][];
  workStyleGuide?: WorkStyleGuide;
  designNote: string;
  sources: string[];
}
