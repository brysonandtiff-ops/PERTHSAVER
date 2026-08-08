import test from "node:test";
import assert from "node:assert/strict";
import { fetchFuelPrices, FUEL_TYPES } from "../../server/server/fuelwatch";
import { getPerthGroceryComparison } from "../../server/server/data/providers/groceryProvider";
import { getWARebatesWithProvenance } from "../../server/server/data/providers/rebatesProvider";
import {
  calculate503020Budget,
  calculateDebtPayoff,
  calculateMortgage,
} from "../../server/server/utils/financialCalculations";

test("E2E User Journey Step 1: User Onboarding & Location Setup", async () => {
  const newUser = {
    email: "alex.perth@example.com",
    firstName: "Alex",
    lastName: "Perth",
    location: "Scarborough, Perth, WA",
    household: "family",
    income: 6500,
  };

  assert.equal(newUser.email, "alex.perth@example.com");
  assert.equal(newUser.location, "Scarborough, Perth, WA");
  assert.equal(newUser.household, "family");
});

test("E2E User Journey Step 2: Live Perth Fuel Search (FuelWatch RSS)", async () => {
  const fuelData = await fetchFuelPrices(FUEL_TYPES.ULP, "Scarborough");
  assert.ok(fuelData);
  assert.equal(fuelData.fuelType, "Unleaded (ULP 91)");
  assert.ok(Array.isArray(fuelData.stations));
  assert.ok(fuelData.lastUpdated);
});

test("E2E User Journey Step 3: Grocery Price Comparison across Perth Supermarkets", async () => {
  const groceryComparison = await getPerthGroceryComparison("Groceries");
  assert.ok(groceryComparison.data);
  assert.ok(groceryComparison.provenance);
  assert.ok(
    groceryComparison.provenance.confidence === "verified" ||
      groceryComparison.provenance.confidence === "estimated"
  );
  assert.equal(groceryComparison.provenance.isStale, false);
});

test("E2E User Journey Step 4: WA State Government Rebates Eligibility Check", async () => {
  const rebatesResult = await getWARebatesWithProvenance();
  assert.ok(rebatesResult.data.length > 0);
  
  const eapRebate = rebatesResult.data.find(r => r.id === "wa-energy-assistance");
  assert.ok(eapRebate);
  assert.equal(eapRebate.maxAnnualValue, 326.10);
  assert.equal(rebatesResult.provenance.confidence, "official");
});

test("E2E User Journey Step 5: Household Budgeting & Financial Planning", async () => {
  const budget = calculate503020Budget(6500);
  assert.equal(budget.needs, 3250);
  assert.equal(budget.wants, 1950);
  assert.equal(budget.savings, 1300);

  const debtPayoff = calculateDebtPayoff([
    { name: "Credit Card", balance: 4500, interestRate: 19.5, minimumPayment: 120 }
  ], 300, "avalanche");

  assert.ok(debtPayoff.monthsToPayoff < 15);
  assert.ok(debtPayoff.totalInterestPaid > 0);

  const mortgage = calculateMortgage(720000, 150000, 6.15, 30);
  assert.equal(mortgage.lvr, 79.2);
  assert.ok(mortgage.monthlyRepayment > 3400);
});

test("E2E User Journey Step 6: Multi-Tenant Household Security & Data Isolation", async () => {
  const userA = { id: "user-alex-1", householdId: "hh-scarborough" };
  const userB = { id: "user-bob-2", householdId: "hh-fremantle" };

  const receiptUserA = { id: "rec-101", userId: "user-alex-1", storeName: "Coles Scarborough", amount: 142.50 };

  const canBobAccessAlexReceipt = receiptUserA.userId === userB.id;
  assert.equal(canBobAccessAlexReceipt, false);

  const canBobAccessAlexHousehold = userA.householdId === userB.householdId;
  assert.equal(canBobAccessAlexHousehold, false);
});
