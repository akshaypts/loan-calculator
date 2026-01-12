"use client";

import { useState, useMemo } from "react";
import {
  calculateLoanSchedule,
  formatCurrency,
  formatCurrencyPrecise,
  type ExtraPayment
} from "~/lib/loanCalculations";
import { LoanCharts } from "./LoanCharts";
import { ExtraPaymentManager } from "./ExtraPaymentManager";
import { ComparisonSummary } from "./ComparisonSummary";
import { AmortizationTable } from "./AmortizationTable";

export function LoanCalculator() {
  const [principal, setPrincipal] = useState(300000);
  const [annualRate, setAnnualRate] = useState(14.66295);
  const [years, setYears] = useState(2);
  const [extraPayments, setExtraPayments] = useState<ExtraPayment[]>([]);

  const months = years * 12;

  const baseSchedule = useMemo(
    () => calculateLoanSchedule(principal, annualRate, months, []),
    [principal, annualRate, months]
  );

  const withExtraSchedule = useMemo(
    () => calculateLoanSchedule(principal, annualRate, months, extraPayments),
    [principal, annualRate, months, extraPayments]
  );

  const handleAddExtraPayment = (month: number, amount: number) => {
    setExtraPayments(prev => [
      ...prev,
      { id: crypto.randomUUID(), month, amount }
    ]);
  };

  const handleRemoveExtraPayment = (id: string) => {
    setExtraPayments(prev => prev.filter(ep => ep.id !== id));
  };

  return (
    <main className="min-h-screen p-4 md:p-8" id="main-content">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-100">Loan Calculator</h1>
          <p className="mt-1 text-zinc-300">Calculate EMI, compare payments, and see the impact of extra payments</p>
        </header>

        {/* Input Section */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6" aria-labelledby="input-section-heading">
          <h2 id="input-section-heading" className="sr-only">Loan Parameters</h2>
          <form className="grid gap-6 md:grid-cols-3" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="loan-amount" className="mb-2 block text-sm font-medium text-zinc-300">
                Loan Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true">₹</span>
                <input
                  id="loan-amount"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-3 pl-8 pr-4 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  min={0}
                  aria-describedby="loan-amount-help"
                />
              </div>
              <p id="loan-amount-help" className="mt-1 text-xs text-zinc-500">Enter the total loan amount in rupees</p>
            </div>

            <div>
              <label htmlFor="interest-rate" className="mb-2 block text-sm font-medium text-zinc-300">
                Interest Rate (% per year)
              </label>
              <div className="relative">
                <input
                  id="interest-rate"
                  type="number"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  step={0.1}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-3 pl-4 pr-8 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  min={0}
                  aria-describedby="interest-rate-help"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true">%</span>
              </div>
              <p id="interest-rate-help" className="mt-1 text-xs text-zinc-500">Annual interest rate as a percentage</p>
            </div>

            <div>
              <label htmlFor="loan-term" className="mb-2 block text-sm font-medium text-zinc-300">
                Loan Term (years)
              </label>
              <input
                id="loan-term"
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min={1}
                max={50}
                aria-describedby="loan-term-help"
              />
              <p id="loan-term-help" className="mt-1 text-xs text-zinc-500">Loan duration in years (1-50)</p>
            </div>
          </form>

          {/* EMI Display */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 rounded-lg bg-zinc-800/50 p-4">
            <div className="text-center">
              <p className="text-sm text-zinc-400">Monthly EMI</p>
              <p className="text-2xl font-bold text-zinc-100" aria-label={`Monthly EMI: ${formatCurrencyPrecise(baseSchedule.emi)}`}>
                {formatCurrencyPrecise(baseSchedule.emi)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-zinc-400">Total Interest</p>
              <p className="text-2xl font-bold text-zinc-100" aria-label={`Total Interest: ${formatCurrency(baseSchedule.totalInterest)}`}>
                {formatCurrency(baseSchedule.totalInterest)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-zinc-400">Total Payment</p>
              <p className="text-2xl font-bold text-zinc-100" aria-label={`Total Payment: ${formatCurrency(baseSchedule.totalPayment)}`}>
                {formatCurrency(baseSchedule.totalPayment)}
              </p>
            </div>
          </div>
        </section>

        {/* Extra Payments Section */}
        <section aria-labelledby="extra-payments-heading">
          <h2 id="extra-payments-heading" className="sr-only">Extra Payments</h2>
          <ExtraPaymentManager
            extraPayments={extraPayments}
            maxMonths={months}
            onAdd={handleAddExtraPayment}
            onRemove={handleRemoveExtraPayment}
          />
        </section>

        {/* Comparison Summary */}
        {extraPayments.length > 0 && (
          <section aria-labelledby="comparison-heading">
            <h2 id="comparison-heading" className="sr-only">Comparison Summary</h2>
            <ComparisonSummary
              baseSchedule={baseSchedule}
              withExtraSchedule={withExtraSchedule}
              originalMonths={months}
            />
          </section>
        )}

        {/* Charts */}
        <section aria-labelledby="charts-heading">
          <h2 id="charts-heading" className="sr-only">Loan Analysis Charts</h2>
          <LoanCharts
            baseSchedule={baseSchedule}
            withExtraSchedule={withExtraSchedule}
            hasExtraPayments={extraPayments.length > 0}
          />
        </section>

        {/* Amortization Table */}
        <section aria-labelledby="amortization-heading">
          <h2 id="amortization-heading" className="sr-only">Amortization Schedule</h2>
          <AmortizationTable
            schedule={extraPayments.length > 0 ? withExtraSchedule.schedule : baseSchedule.schedule}
            hasExtraPayments={extraPayments.length > 0}
          />
        </section>
      </div>
    </main>
  );
}
