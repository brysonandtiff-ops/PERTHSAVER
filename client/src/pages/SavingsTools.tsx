import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp, Home, Percent, Target, Download } from "lucide-react";

export default function SavingsTools() {
  // Mortgage Calculator State
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanYears, setLoanYears] = useState("");
  const [mortgageResult, setMortgageResult] = useState<{ monthly: number; total: number; interest: number } | null>(null);

  // Savings Calculator State
  const [initialSavings, setInitialSavings] = useState("");
  const [monthlyDeposit, setMonthlyDeposit] = useState("");
  const [savingsRate, setSavingsRate] = useState("");
  const [savingsYears, setSavingsYears] = useState("");
  const [savingsResult, setSavingsResult] = useState<{ total: number; deposits: number; interest: number } | null>(null);

  // Compound Interest Calculator State
  const [principal, setPrincipal] = useState("");
  const [compoundRate, setCompoundRate] = useState("");
  const [compoundYears, setCompoundYears] = useState("");
  const [compoundFrequency, setCompoundFrequency] = useState("12");
  const [compoundResult, setCompoundResult] = useState<{ total: number; interest: number } | null>(null);

  // ROI Calculator State
  const [initialInvestment, setInitialInvestment] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [roiResult, setRoiResult] = useState<{ roi: number; gain: number } | null>(null);

  // Debt Payoff Calculator State
  const [debtAmount, setDebtAmount] = useState("");
  const [debtRate, setDebtRate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [debtResult, setDebtResult] = useState<{ months: number; totalPaid: number; totalInterest: number } | null>(null);

  const calculateMortgage = () => {
    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const monthlyRate = annualRate / 12;
    const n = parseFloat(loanYears) * 12;

    if (P && annualRate && n) {
      const monthly = (P * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
      const total = monthly * n;
      const interest = total - P;
      setMortgageResult({ monthly, total, interest });
    }
  };

  const calculateSavings = () => {
    const P = parseFloat(initialSavings) || 0;
    const PMT = parseFloat(monthlyDeposit) || 0;
    const r = (parseFloat(savingsRate) / 100) / 12;
    const n = parseFloat(savingsYears) * 12;

    if (savingsYears) {
      const futureValue = P * Math.pow(1 + r, n) + PMT * ((Math.pow(1 + r, n) - 1) / r);
      const deposits = P + (PMT * n);
      const interest = futureValue - deposits;
      setSavingsResult({ total: futureValue, deposits, interest });
    }
  };

  const calculateCompound = () => {
    const P = parseFloat(principal);
    const r = parseFloat(compoundRate) / 100;
    const t = parseFloat(compoundYears);
    const n = parseFloat(compoundFrequency);

    if (P && r && t && n) {
      const total = P * Math.pow(1 + r / n, n * t);
      const interest = total - P;
      setCompoundResult({ total, interest });
    }
  };

  const calculateROI = () => {
    const initial = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);

    if (initial && final) {
      const gain = final - initial;
      const roi = (gain / initial) * 100;
      setRoiResult({ roi, gain });
    }
  };

  const calculateDebt = () => {
    const debt = parseFloat(debtAmount);
    const rate = parseFloat(debtRate) / 100 / 12;
    const payment = parseFloat(monthlyPayment);

    if (debt && payment && rate) {
      const months = Math.log(payment / (payment - debt * rate)) / Math.log(1 + rate);
      const totalPaid = payment * months;
      const totalInterest = totalPaid - debt;
      setDebtResult({ months, totalPaid, totalInterest });
    }
  };

  const exportResults = () => {
    const results = {
      mortgage: mortgageResult,
      savings: savingsResult,
      compound: compoundResult,
      roi: roiResult,
      debt: debtResult,
    };
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'savings-calculator-results.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">

      <div className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl">
        <div className="flex flex-col sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white" data-testid="text-page-title">
              Savings Tools
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/60 mt-1 sm:mt-2" data-testid="text-page-subtitle">
              Financial calculators to help you plan and save smarter
            </p>
          </div>
          <Button 
            className="bg-accent hover:bg-accent/90 text-background w-full sm:w-auto"
            onClick={exportResults}
            data-testid="button-export-results"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Mortgage Calculator */}
          <Card className="glass border-white/8" data-testid="card-mortgage-calculator">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Mortgage Calculator
              </CardTitle>
              <CardDescription className="text-white/60">Calculate your monthly mortgage payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loan-amount" className="text-white">Loan Amount (AUD)</Label>
                <Input
                  id="loan-amount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => {
                    setLoanAmount(e.target.value);
                    setTimeout(calculateMortgage, 300);
                  }}
                  placeholder="500000"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  data-testid="input-loan-amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interest-rate" className="text-white">Annual Interest Rate (%)</Label>
                <Input
                  id="interest-rate"
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => {
                    setInterestRate(e.target.value);
                    setTimeout(calculateMortgage, 300);
                  }}
                  placeholder="5.5"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  data-testid="input-interest-rate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loan-years" className="text-white">Loan Term (years)</Label>
                <Input
                  id="loan-years"
                  type="number"
                  value={loanYears}
                  onChange={(e) => {
                    setLoanYears(e.target.value);
                    setTimeout(calculateMortgage, 300);
                  }}
                  placeholder="30"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  data-testid="input-loan-years"
                />
              </div>
              {mortgageResult && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 space-y-2" data-testid="result-mortgage">
                  <div className="flex justify-between">
                    <span className="text-white/70">Monthly Payment:</span>
                    <span className="text-white font-bold" data-testid="text-monthly-payment">
                      ${mortgageResult.monthly.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Total Amount:</span>
                    <span className="text-white" data-testid="text-total-payment">
                      ${mortgageResult.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Total Interest:</span>
                    <span className="text-accent" data-testid="text-total-interest">
                      ${mortgageResult.interest.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Savings Calculator */}
          <Card className="glass border-white/8" data-testid="card-savings-calculator">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Savings Calculator
              </CardTitle>
              <CardDescription className="text-white/60">Plan your savings growth over time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="initial-savings" className="text-white">Initial Amount (AUD)</Label>
                <Input
                  id="initial-savings"
                  type="number"
                  value={initialSavings}
                  onChange={(e) => {
                    setInitialSavings(e.target.value);
                    setTimeout(calculateSavings, 300);
                  }}
                  placeholder="1000"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  data-testid="input-initial-savings"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-deposit" className="text-white">Monthly Deposit (AUD)</Label>
                <Input
                  id="monthly-deposit"
                  type="number"
                  value={monthlyDeposit}
                  onChange={(e) => {
                    setMonthlyDeposit(e.target.value);
                    setTimeout(calculateSavings, 300);
                  }}
                  placeholder="200"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  data-testid="input-monthly-deposit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="savings-rate" className="text-white">Annual Interest Rate (%)</Label>
                <Input
                  id="savings-rate"
                  type="number"
                  step="0.01"
                  value={savingsRate}
                  onChange={(e) => {
                    setSavingsRate(e.target.value);
                    setTimeout(calculateSavings, 300);
                  }}
                  placeholder="3.5"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  data-testid="input-savings-rate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="savings-years" className="text-white">Time Period (years)</Label>
                <Input
                  id="savings-years"
                  type="number"
                  value={savingsYears}
                  onChange={(e) => {
                    setSavingsYears(e.target.value);
                    setTimeout(calculateSavings, 300);
                  }}
                  placeholder="10"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  data-testid="input-savings-years"
                />
              </div>
              {savingsResult && (
                <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20 space-y-2" data-testid="result-savings">
                  <div className="flex justify-between">
                    <span className="text-white/70">Future Value:</span>
                    <span className="text-white font-bold" data-testid="text-future-value">
                      ${savingsResult.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Total Deposits:</span>
                    <span className="text-white" data-testid="text-total-deposits">
                      ${savingsResult.deposits.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Interest Earned:</span>
                    <span className="text-primary" data-testid="text-interest-earned">
                      ${savingsResult.interest.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compound Interest Calculator */}
          <Card className="glass border-white/8" data-testid="card-compound-calculator">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Compound Interest
              </CardTitle>
              <CardDescription className="text-white/60">See the power of compound interest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="principal" className="text-white">Principal Amount (AUD)</Label>
                <Input
                  id="principal"
                  type="number"
                  value={principal}
                  onChange={(e) => {
                    setPrincipal(e.target.value);
                    setTimeout(calculateCompound, 300);
                  }}
                  placeholder="10000"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  data-testid="input-principal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compound-rate" className="text-white">Annual Interest Rate (%)</Label>
                <Input
                  id="compound-rate"
                  type="number"
                  step="0.01"
                  value={compoundRate}
                  onChange={(e) => {
                    setCompoundRate(e.target.value);
                    setTimeout(calculateCompound, 300);
                  }}
                  placeholder="4.5"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  data-testid="input-compound-rate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compound-years" className="text-white">Time Period (years)</Label>
                <Input
                  id="compound-years"
                  type="number"
                  value={compoundYears}
                  onChange={(e) => {
                    setCompoundYears(e.target.value);
                    setTimeout(calculateCompound, 300);
                  }}
                  placeholder="20"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  data-testid="input-compound-years"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compound-frequency" className="text-white">Compounding Frequency</Label>
                <select
                  id="compound-frequency"
                  value={compoundFrequency}
                  onChange={(e) => {
                    setCompoundFrequency(e.target.value);
                    setTimeout(calculateCompound, 300);
                  }}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white"
                  data-testid="select-compound-frequency"
                >
                  <option value="1">Annually</option>
                  <option value="4">Quarterly</option>
                  <option value="12">Monthly</option>
                  <option value="365">Daily</option>
                </select>
              </div>
              {compoundResult && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 space-y-2" data-testid="result-compound">
                  <div className="flex justify-between">
                    <span className="text-white/70">Future Value:</span>
                    <span className="text-white font-bold" data-testid="text-compound-total">
                      ${compoundResult.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Interest Earned:</span>
                    <span className="text-primary" data-testid="text-compound-interest">
                      ${compoundResult.interest.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ROI Calculator */}
          <Card className="glass border-white/8" data-testid="card-roi-calculator">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Percent className="h-5 w-5 text-accent" />
                ROI Calculator
              </CardTitle>
              <CardDescription className="text-white/60">Calculate return on investment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="initial-investment" className="text-white">Initial Investment (AUD)</Label>
                <Input
                  id="initial-investment"
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => {
                    setInitialInvestment(e.target.value);
                    setTimeout(calculateROI, 300);
                  }}
                  placeholder="5000"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  data-testid="input-initial-investment"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="final-value" className="text-white">Final Value (AUD)</Label>
                <Input
                  id="final-value"
                  type="number"
                  value={finalValue}
                  onChange={(e) => {
                    setFinalValue(e.target.value);
                    setTimeout(calculateROI, 300);
                  }}
                  placeholder="7500"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  data-testid="input-final-value"
                />
              </div>
              {roiResult && (
                <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20 space-y-2" data-testid="result-roi">
                  <div className="flex justify-between">
                    <span className="text-white/70">ROI:</span>
                    <span className={`font-bold ${roiResult.roi >= 0 ? 'text-primary' : 'text-red-400'}`} data-testid="text-roi-percentage">
                      {roiResult.roi.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Gain/Loss:</span>
                    <span className={roiResult.gain >= 0 ? 'text-primary' : 'text-red-400'} data-testid="text-roi-gain">
                      ${roiResult.gain.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Debt Payoff Calculator */}
          <Card className="glass border-white/8 lg:col-span-2" data-testid="card-debt-calculator">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Debt Payoff Calculator
              </CardTitle>
              <CardDescription className="text-white/60">Calculate how long to pay off your debt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="debt-amount" className="text-white">Total Debt (AUD)</Label>
                  <Input
                    id="debt-amount"
                    type="number"
                    value={debtAmount}
                    onChange={(e) => {
                      setDebtAmount(e.target.value);
                      setTimeout(calculateDebt, 300);
                    }}
                    placeholder="15000"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    data-testid="input-debt-amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="debt-rate" className="text-white">Annual Interest Rate (%)</Label>
                  <Input
                    id="debt-rate"
                    type="number"
                    step="0.01"
                    value={debtRate}
                    onChange={(e) => {
                      setDebtRate(e.target.value);
                      setTimeout(calculateDebt, 300);
                    }}
                    placeholder="18.5"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    data-testid="input-debt-rate"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly-payment" className="text-white">Monthly Payment (AUD)</Label>
                  <Input
                    id="monthly-payment"
                    type="number"
                    value={monthlyPayment}
                    onChange={(e) => {
                      setMonthlyPayment(e.target.value);
                      setTimeout(calculateDebt, 300);
                    }}
                    placeholder="500"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    data-testid="input-monthly-payment"
                  />
                </div>
              </div>
              {debtResult && (
                <div className="flex items-center">
                  <div className="w-full p-6 rounded-lg bg-primary/10 border border-primary/20 space-y-3" data-testid="result-debt">
                    <div className="flex justify-between">
                      <span className="text-white/70">Time to Pay Off:</span>
                      <span className="text-white font-bold" data-testid="text-payoff-time">
                        {Math.ceil(debtResult.months)} months ({(debtResult.months / 12).toFixed(1)} years)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Total Amount Paid:</span>
                      <span className="text-white" data-testid="text-total-paid">
                        ${debtResult.totalPaid.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Total Interest:</span>
                      <span className="text-red-400" data-testid="text-debt-interest">
                        ${debtResult.totalInterest.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
