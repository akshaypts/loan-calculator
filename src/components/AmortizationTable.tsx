"use client";

import { useState } from "react";
import { type AmortizationRow, formatCurrencyPrecise } from "~/lib/loanCalculations";

interface AmortizationTableProps {
  schedule: AmortizationRow[];
  hasExtraPayments: boolean;
}

export function AmortizationTable({ schedule, hasExtraPayments }: AmortizationTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayRows = isExpanded ? schedule : schedule.slice(0, 12);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-100">Amortization Schedule</h3>
        <span className="text-sm text-zinc-400" aria-label={`Total duration: ${schedule.length} months`}>{schedule.length} months</span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <caption className="sr-only">
            Loan amortization schedule showing monthly payment breakdown including principal, interest, and remaining balance
          </caption>
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-300">
              <th scope="col" className="pb-3 pr-4 font-medium">Month</th>
              <th scope="col" className="pb-3 pr-4 font-medium">Payment</th>
              <th scope="col" className="pb-3 pr-4 font-medium">Principal</th>
              <th scope="col" className="pb-3 pr-4 font-medium">Interest</th>
              {hasExtraPayments && (
                <th scope="col" className="pb-3 pr-4 font-medium">Extra</th>
              )}
              <th scope="col" className="pb-3 pr-4 font-medium">Balance</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row) => (
              <tr
                key={row.month}
                className="border-b border-zinc-800/50 text-zinc-300"
              >
                <td className="py-3 pr-4">
                  <span className="text-zinc-100">{row.month}</span>
                  <span className="ml-1 text-xs text-zinc-500">
                    (Y{Math.ceil(row.month / 12)})
                  </span>
                </td>
                <td className="py-3 pr-4">{formatCurrencyPrecise(row.payment)}</td>
                <td className="py-3 pr-4 text-zinc-100">
                  {formatCurrencyPrecise(row.principal)}
                  <span className="ml-1 text-xs text-zinc-500">(Principal)</span>
                </td>
                <td className="py-3 pr-4 text-zinc-100">
                  {formatCurrencyPrecise(row.interest)}
                  <span className="ml-1 text-xs text-zinc-500">(Interest)</span>
                </td>
                {hasExtraPayments && (
                  <td className="py-3 pr-4 text-zinc-100">
                    {row.extraPayment > 0 ? formatCurrencyPrecise(row.extraPayment) : "—"}
                    <span className="ml-1 text-xs text-zinc-500">(Extra)</span>
                  </td>
                )}
                <td className="py-3 pr-4">{formatCurrencyPrecise(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {schedule.length > 12 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full rounded-lg border border-zinc-700 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-expanded={isExpanded}
          aria-controls="amortization-table"
        >
          {isExpanded ? "Show Less" : `Show All ${schedule.length} Months`}
        </button>
      )}
    </div>
  );
}
