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
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-100">Loan Calculator</h1>
          <p className="mt-1 text-zinc-400">Calculate EMI, compare payments, and see the impact of extra payments</p>
        </header>

        {/* Input Section */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-400">
                Loan Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-3 pl-8 pr-4 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  min={0}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-400">
                Interest Rate (% per year)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  step={0.1}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-3 pl-4 pr-8 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  min={0}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">%</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-400">
                Loan Term (years)
              </label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                min={1}
                max={50}
              />
            </div>
          </div>

          {/* EMI Display */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 rounded-lg bg-zinc-800/50 p-4">
            <div className="text-center">
              <p className="text-sm text-zinc-400">Monthly EMI</p>
              <p className="text-2xl font-bold text-emerald-400">
                {formatCurrencyPrecise(baseSchedule.emi)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-zinc-400">Total Interest</p>
              <p className="text-2xl font-bold text-amber-400">
                {formatCurrency(baseSchedule.totalInterest)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-zinc-400">Total Payment</p>
              <p className="text-2xl font-bold text-zinc-100">
                {formatCurrency(baseSchedule.totalPayment)}
              </p>
            </div>
          </div>
        </div>

        {/* Extra Payments Section */}
        <ExtraPaymentManager
          extraPayments={extraPayments}
          maxMonths={months}
          onAdd={handleAddExtraPayment}
          onRemove={handleRemoveExtraPayment}
        />

        {/* Comparison Summary */}
        {extraPayments.length > 0 && (
          <ComparisonSummary
            baseSchedule={baseSchedule}
            withExtraSchedule={withExtraSchedule}
            originalMonths={months}
          />
        )}

        {/* Charts */}
        <LoanCharts
          baseSchedule={baseSchedule}
          withExtraSchedule={withExtraSchedule}
          hasExtraPayments={extraPayments.length > 0}
        />

        {/* Amortization Table */}
        <AmortizationTable
          schedule={extraPayments.length > 0 ? withExtraSchedule.schedule : baseSchedule.schedule}
          hasExtraPayments={extraPayments.length > 0}
        />
      </div>
    </div>
  );
}
