import { describe, expect, test } from "bun:test";
import { DATA, filterResearch, filtersSchema, researchContext } from "./research-data";
const all = { province: "", diagnosis: "", gender: "", ageGroup: "", year: "" } as const;
describe("Research answer scope", () => {
  test("uses only filtered displayed results", () => {
    const f = { ...all, province: "بغداد", year: "2024" as const };
    const expected = DATA.filter(r => r.province === "بغداد" && r.year === 2024);
    expect(expected.length).toBeGreaterThan(0);
    expect(filterResearch(f)).toEqual(expected);
    expect(researchContext(f).total).toBe(expected.length);
    expect(Object.keys(researchContext(f).province)).toEqual(["بغداد"]);
  });
  test("sends no identifiers to the model", () => {
    const c = JSON.stringify(researchContext(all));
    for (const key of ["name", "nationalId", "phone", "address", "code", "ANON-"]) expect(c).not.toContain(key);
    expect(filtersSchema.safeParse({ ...all, name: "patient" }).success).toBe(false);
  });
  test("empty cohort has zero not invented percentages", () => {
    const c = researchContext({ province: "بغداد", diagnosis: "ربو", gender: "ذكر", ageGroup: "60+", year: "2022" });
    expect(c.total).toBe(0);
    expect(c.percentVaccinated).toBe(0);
  });
});