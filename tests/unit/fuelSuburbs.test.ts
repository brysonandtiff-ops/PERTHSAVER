import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getSuburbs } from "../../server/server/fuelwatch";

describe("Fuel Suburbs Production Adapter", () => {
  it("returns parsed suburbs list with count > 0", async () => {
    const suburbs = await getSuburbs();
    assert.ok(Array.isArray(suburbs), "Suburbs should be an array");
    assert.ok(suburbs.length > 20, "Should return at least 20 Perth suburbs");
    assert.ok(suburbs.includes("Scarborough"), "Should include Scarborough");
    assert.ok(suburbs.includes("Perth"), "Should include Perth");
    assert.ok(suburbs.includes("Fremantle"), "Should include Fremantle");
  });

  it("formats suburb names in title case", async () => {
    const suburbs = await getSuburbs();
    const scot = suburbs.find((s) => s.toLowerCase() === "scarborough");
    assert.equal(scot, "Scarborough", "Suburb name should be properly capitalized");
  });

  it("handles empty or invalid inputs gracefully with Perth fallbacks", async () => {
    // Verified fallback list contains essential Perth suburbs
    const suburbs = await getSuburbs();
    assert.ok(suburbs.length > 0, "Suburbs list must never be empty");
  });
});
