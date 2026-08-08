/**
 * Perth Financial Calculation Utilities
 * Pure deterministic functions for household financial planning, debt payoff, mortgage modeling, and budget allocation.
 */

export interface BudgetAllocation {
  needs: number;
  wants: number;
  savings: number;
  totalIncome: number;
  unallocated: number;
}

export interface DebtPayoffItem {
  name: string;
  balance: number;
  interestRate: number; // e.g. 18.5 for 18.5%
  minimumPayment: number;
}

export interface DebtPayoffResult {
  monthsToPayoff: number;
  totalInterestPaid: number;
  payoffSchedule: Array<{
    month: number;
    remainingBalance: number;
    interestPaid: number;
  }>;
}

export interface MortgageEstimate {
  monthlyRepayment: number;
  totalRepayment: number;
  totalInterest: number;
  stampDutyWA: number;
  lvr: number; // Loan to value ratio %
}

/**
 * Calculates 50/30/20 Budget Allocation from Net Monthly Income
 */
export function calculate503020Budget(netMonthlyIncome: number): BudgetAllocation {
  const safeIncome = Math.max(0, isNaN(netMonthlyIncome) ? 0 : netMonthlyIncome);
  const needs = safeIncome * 0.5;
  const wants = safeIncome * 0.3;
  const savings = safeIncome * 0.2;

  return {
    needs: parseFloat(needs.toFixed(2)),
    wants: parseFloat(wants.toFixed(2)),
    savings: parseFloat(savings.toFixed(2)),
    totalIncome: safeIncome,
    unallocated: 0,
  };
}

/**
 * Calculates Debt Payoff Strategy (Snowball vs Avalanche)
 */
export function calculateDebtPayoff(
  debts: DebtPayoffItem[],
  extraMonthlyPayment: number = 0,
  strategy: "avalanche" | "snowball" = "avalanche"
): DebtPayoffResult {
  if (!debts || debts.length === 0) {
    return { monthsToPayoff: 0, totalInterestPaid: 0, payoffSchedule: [] };
  }

  // Deep clone debts to mutate balance locally
  let currentDebts = debts.map((d) => ({
    name: d.name,
    balance: Math.max(0, d.balance),
    rate: Math.max(0, d.interestRate) / 100 / 12,
    minPayment: Math.max(0, d.minimumPayment),
  }));

  // Sort debts based on strategy
  if (strategy === "avalanche") {
    currentDebts.sort((a, b) => b.rate - a.rate); // Highest interest rate first
  } else {
    currentDebts.sort((a, b) => a.balance - b.balance); // Lowest balance first
  }

  let totalInterestPaid = 0;
  let month = 0;
  const maxMonths = 360; // 30 years safety cap
  const payoffSchedule: Array<{ month: number; remainingBalance: number; interestPaid: number }> = [];

  while (currentDebts.some((d) => d.balance > 0) && month < maxMonths) {
    month++;
    let extraAvailable = Math.max(0, extraMonthlyPayment);
    let monthInterest = 0;

    for (const debt of currentDebts) {
      if (debt.balance <= 0) continue;

      const interest = debt.balance * debt.rate;
      monthInterest += interest;
      totalInterestPaid += interest;
      debt.balance += interest;

      let payment = Math.min(debt.balance, debt.minPayment);
      debt.balance -= payment;
    }

    // Apply extra payment to top target debt
    for (const debt of currentDebts) {
      if (debt.balance > 0 && extraAvailable > 0) {
        const extraPayment = Math.min(debt.balance, extraAvailable);
        debt.balance -= extraPayment;
        extraAvailable -= extraPayment;
      }
    }

    const totalRemaining = currentDebts.reduce((sum, d) => sum + d.balance, 0);
    payoffSchedule.push({
      month,
      remainingBalance: parseFloat(totalRemaining.toFixed(2)),
      interestPaid: parseFloat(monthInterest.toFixed(2)),
    });

    if (totalRemaining <= 0) break;
  }

  return {
    monthsToPayoff: month,
    totalInterestPaid: parseFloat(totalInterestPaid.toFixed(2)),
    payoffSchedule,
  };
}

/**
 * Calculates WA Mortgage Repayments and Estimated Concession/Stamp Duty
 */
export function calculateMortgage(
  propertyValue: number,
  depositAmount: number,
  annualInterestRate: number,
  loanTermYears: number = 30
): MortgageEstimate {
  const safeProp = Math.max(0, propertyValue || 0);
  const safeDep = Math.max(0, depositAmount || 0);
  const loanPrincipal = Math.max(0, safeProp - safeDep);
  const lvr = safeProp > 0 ? (loanPrincipal / safeProp) * 100 : 0;

  const monthlyRate = Math.max(0, annualInterestRate || 0) / 100 / 12;
  const totalMonths = Math.max(1, loanTermYears * 12);

  let monthlyRepayment = 0;
  if (monthlyRate > 0) {
    monthlyRepayment =
      (loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  } else {
    monthlyRepayment = loanPrincipal / totalMonths;
  }

  const totalRepayment = monthlyRepayment * totalMonths;
  const totalInterest = totalRepayment - loanPrincipal;

  // Simple WA Stamp Duty Estimate (First Home Owner rate threshold up to $450k exempt, general rate above)
  let stampDutyWA = 0;
  if (safeProp > 450000) {
    stampDutyWA = Math.max(0, (safeProp - 450000) * 0.038);
  }

  return {
    monthlyRepayment: parseFloat(monthlyRepayment.toFixed(2)),
    totalRepayment: parseFloat(totalRepayment.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    stampDutyWA: parseFloat(stampDutyWA.toFixed(2)),
    lvr: parseFloat(lvr.toFixed(1)),
  };
}
