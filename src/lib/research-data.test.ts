import { describe, it as test } from "node:test";
import assert from "node:assert/strict";
import { DATA, filterResearch, filtersSchema, researchContext } from "./research-data";
const all = { province: "", diagnosis: "", gender: "", ageGroup: "", year: "" } as const;
describe("Research answer scope", () => {
  test("uses only filtered displayed results", () => {
    const f = { ...all, province: "بغداد", year: "2024" as const };
    const expected = DATA.filter(r => r.province === "بغداد" && r.year === 2024);
    assert.ok(expected.length > 0);
    assert.deepEqual(filterResearch(f), expected);
    assert.equal(researchContext(f).total, expected.length);
    assert.deepEqual(Object.keys(researchContext(f).province), ["بغداد"]);
  });
  test("sends no identifiers to the model", () => {
    const c = JSON.stringify(researchContext(all));
    for (const key of ["name", "nationalId", "phone", "address", "code", "ANON-"]) assert.ok(!c.includes(key));
    assert.equal(filtersSchema.safeParse({ ...all, name: "patient" }).success, false);
  });
  test("empty cohort has zero not invented percentages", () => {
    const c = researchContext({ province: "بغداد", diagnosis: "ربو", gender: "ذكر", ageGroup: "60+", year: "2022" });
    assert.equal(c.total, 0);
    assert.equal(c.percentVaccinated, 0);
  });
});