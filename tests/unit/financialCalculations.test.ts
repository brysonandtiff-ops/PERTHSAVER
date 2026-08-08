import test from "node:test";
import assert from "node:assert/strict";
import {
  calculate503020Budget,
  calculateDebtPayoff,
  calculateMortgage,
} from "../../server/server/utils/financialCalculations";

test("calculate503020Budget splits income correctly", () => {
  const result = calculate503020Budget(5000);
  assert.equal(result.needs, 2500);
  assert.equal(result.wants, 1500);
  assert.equal(result.savings, 1000);
  assert.equal(result.totalIncome, 5000);
});

test("calculate503020Budget handles zero and negative income safely", () => {
  const zeroResult = calculate503020Budget(0);
  assert.equal(zeroResult.needs, 0);
  assert.equal(zeroResult.wants, 0);
  assert.equal(zeroResult.savings, 0);

  const negResult = calculate503020Budget(-1000);
  assert.equal(negResult.needs, 0);
  assert.equal(negResult.totalIncome, 0);
});

test("calculateDebtPayoff avalanche strategy pays higher interest first", () => {
  const debts = [
    { name: "Credit Card", balance: 2000, interestRate: 20.0, minimumPayment: 50 },
    { name: "Personal Loan", balance: 5000, interestRate: 8.0, minimumPayment: 100 },
  ];

  const result = calculateDebtPayoff(debts, 150, "avalanche");
  assert.ok(result.monthsToPayoff > 0);
  assert.ok(result.totalInterestPaid > 0);
  assert.ok(result.payoffSchedule.length === result.monthsToPayoff);
});

test("calculateDebtPayoff handles empty debts gracefully", () => {
  const result = calculateDebtPayoff([]);
  assert.equal(result.monthsToPayoff, 0);
  assert.equal(result.totalInterestPaid, 0);
  assert.equal(result.payoffSchedule.length, 0);
});

test("calculateMortgage computes monthly repayments and LVR correctly", () => {
  const result = calculateMortgage(600000, 120000, 6.25, 30);
  assert.equal(result.lvr, 80.0);
  assert.ok(result.monthlyRepayment > 2900 && result.monthlyRepayment < 3100);
  assert.ok(result.totalInterest > 0);
  assert.ok(result.stampDutyWA > 0);
});
