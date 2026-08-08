import test from "node:test";
import assert from "node:assert/strict";
import { createProvenance, isDataStale } from "../../server/server/data/provenance";

test("isDataStale correctly identifies fresh vs stale timestamps", () => {
  const freshTime = new Date().toISOString();
  assert.equal(isDataStale(freshTime, 60000), false);

  const staleTime = new Date(Date.now() - 120000).toISOString();
  assert.equal(isDataStale(staleTime, 60000), true);
});

test("createProvenance generates standardized metadata", () => {
  const prov = createProvenance("WA FuelWatch", "official", {
    sourceUrl: "https://www.fuelwatch.wa.gov.au",
    maxAgeMs: 300000,
  });

  assert.equal(prov.sourceName, "WA FuelWatch");
  assert.equal(prov.confidence, "official");
  assert.equal(prov.isStale, false);
  assert.equal(prov.sourceUrl, "https://www.fuelwatch.wa.gov.au");
});
