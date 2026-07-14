export interface OrgNode {
  name: string;
  title: string;
  type: string;
  profileId: string;
  children?: OrgNode[];
}
