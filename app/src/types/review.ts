export type ReviewKind = "360-review" | "development-plan";
export type ReviewAudience = "manager" | "employee";

export interface ResponseField {
  key: string;
  group: string;
  label: string;
  value: string;
}

export interface PrivateResponsePayload {
  schema: "bbs-role-tool-response-v1";
  schemaVersion: 1;
  product: "bridge360";
  kind: ReviewKind;
  audience: ReviewAudience;
  personId: string;
  person: string;
  roleTitle: string;
  roleFamily: string;
  exportedAt: string;
  selections: ResponseField[];
  fields: ResponseField[];
}

/** Legacy exports may omit schemaVersion and product. */
export type LegacyPrivateResponsePayload = Omit<
  PrivateResponsePayload,
  "schemaVersion" | "product"
> &
  Partial<Pick<PrivateResponsePayload, "schemaVersion" | "product">>;

export type AnyPrivateResponsePayload =
  | PrivateResponsePayload
  | LegacyPrivateResponsePayload;
