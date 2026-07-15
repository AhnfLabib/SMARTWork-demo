import { describe, it, expect } from "vitest";
import { ROLES, getRoleById } from "./index";

describe("roles data", () => {
  it("includes 18 people including Ahnaf and Jack", () => {
    expect(ROLES).toHaveLength(18);
    expect(getRoleById("ahnaf-labib")?.person).toBe("Ahnaf Labib");
    expect(getRoleById("jack-dougher")?.person).toBe("Jack Dougher");
  });
});
