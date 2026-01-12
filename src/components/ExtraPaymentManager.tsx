"use client";

import { useState } from "react";
import { type ExtraPayment, formatCurrency } from "~/lib/loanCalculations";

interface ExtraPaymentManagerProps {
  extraPayments: ExtraPayment[];
  maxMonths: number;
  onAdd: (month: number, amount: number) => void;
  onRemove: (id: string) => void;
}

export function ExtraPaymentManager({
  extraPayments,
  maxMonths,
  onAdd,
  onRemove,
}: ExtraPaymentManagerProps) {
  const [month, setMonth] = useState(12);
  const [amount, setAmount] = useState(5000);

  const handleAdd = () => {
    if (month > 0 && month <= maxMonths && amount > 0) {
      onAdd(month, amount);
    }
  };

  const totalExtra = extraPayments.reduce((sum, ep) => sum + ep.amount, 0);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-100">Extra Payments</h3>
        {extraPayments.length > 0 && (
          <span className="text-sm text-zinc-300" aria-live="polite">
            Total: {formatCurrency(totalExtra)}
          </span>
        )}
      </div>

      {/* Add Extra Payment Form */}
      <fieldset className="mt-4">
        <legend className="sr-only">Add Extra Payment</legend>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[120px]">
            <label htmlFor="extra-month" className="mb-2 block text-sm font-medium text-zinc-300">
              Month
            </label>
            <input
              id="extra-month"
              type="number"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min={1}
              max={maxMonths}
              aria-describedby="extra-month-help"
            />
            <p id="extra-month-help" className="mt-1 text-xs text-zinc-500">Month number (1-{maxMonths})</p>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label htmlFor="extra-amount" className="mb-2 block text-sm font-medium text-zinc-300">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true">₹</span>
              <input
                id="extra-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-8 pr-4 text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min={0}
                aria-describedby="extra-amount-help"
              />
            </div>
            <p id="extra-amount-help" className="mt-1 text-xs text-zinc-500">Payment amount in rupees</p>
          </div>
          <button
            onClick={handleAdd}
            className="rounded-lg bg-emerald-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            aria-label={`Add extra payment of ₹${amount} in month ${month}`}
          >
            Add Payment
          </button>
        </div>
      </fieldset>

      {/* Extra Payments List */}
      {extraPayments.length > 0 && (
        <div className="mt-6 space-y-2">
          <p className="text-sm font-medium text-zinc-300">Scheduled Extra Payments</p>
          <ul className="flex flex-wrap gap-2" role="list">
            {extraPayments
              .sort((a, b) => a.month - b.month)
              .map((ep) => (
                <li key={ep.id} className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2">
                  <span className="text-sm text-zinc-300">
                    Month {ep.month}: {formatCurrency(ep.amount)}
                  </span>
                  <button
                    onClick={() => onRemove(ep.id)}
                    className="ml-1 inline-flex items-center justify-center h-6 w-6 text-zinc-500 transition-colors hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                    aria-label={`Remove extra payment of ${formatCurrency(ep.amount)} from month ${ep.month}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}

      {extraPayments.length === 0 && (
        <p className="mt-4 text-sm text-zinc-400">
          Add extra payments to see how they affect your loan payoff timeline and total interest.
        </p>
      )}
    </div>
  );
}
