"use client";

import { type LoanSummary, formatCurrency } from "~/lib/loanCalculations";

interface ComparisonSummaryProps {
  baseSchedule: LoanSummary;
  withExtraSchedule: LoanSummary;
  originalMonths: number;
}

export function ComparisonSummary({
  baseSchedule,
  withExtraSchedule,
  originalMonths,
}: ComparisonSummaryProps) {
  const interestSaved = baseSchedule.totalInterest - withExtraSchedule.totalInterest;
  const monthsSaved = baseSchedule.actualMonths - withExtraSchedule.actualMonths;
  const yearsSaved = Math.floor(monthsSaved / 12);
  const remainingMonths = monthsSaved % 12;

  const timeString = yearsSaved > 0
    ? `${yearsSaved} year${yearsSaved !== 1 ? "s" : ""}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}` : ""}`
    : `${monthsSaved} month${monthsSaved !== 1 ? "s" : ""}`;

  return (
    <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-6">
      <h3 className="text-lg font-semibold text-emerald-400">Impact of Extra Payments</h3>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-400">Interest Saved</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">
            {formatCurrency(interestSaved)}
          </p>
        </div>

        <div className="rounded-lg bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-400">Time Saved</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">
            {timeString}
          </p>
        </div>

        <div className="rounded-lg bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-400">New Payoff Time</p>
          <p className="mt-1 text-2xl font-bold text-zinc-100">
            {Math.ceil(withExtraSchedule.actualMonths / 12)} years
          </p>
          <p className="text-xs text-zinc-500">
            ({withExtraSchedule.actualMonths} months)
          </p>
        </div>

        <div className="rounded-lg bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-400">New Total Payment</p>
          <p className="mt-1 text-2xl font-bold text-zinc-100">
            {formatCurrency(withExtraSchedule.totalPayment)}
          </p>
          <p className="text-xs text-zinc-500">
            vs {formatCurrency(baseSchedule.totalPayment)} original
          </p>
        </div>
      </div>
    </div>
  );
}
