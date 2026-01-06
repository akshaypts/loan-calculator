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
          <span className="text-sm text-zinc-400">
            Total: {formatCurrency(totalExtra)}
          </span>
        )}
      </div>

      {/* Add Extra Payment Form */}
      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[120px]">
          <label className="mb-2 block text-sm font-medium text-zinc-400">
            Month
          </label>
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            min={1}
            max={maxMonths}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="mb-2 block text-sm font-medium text-zinc-400">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-8 pr-4 text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              min={0}
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="rounded-lg bg-emerald-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          Add Payment
        </button>
      </div>

      {/* Extra Payments List */}
      {extraPayments.length > 0 && (
        <div className="mt-6 space-y-2">
          <p className="text-sm font-medium text-zinc-400">Scheduled Extra Payments</p>
          <div className="flex flex-wrap gap-2">
            {extraPayments
              .sort((a, b) => a.month - b.month)
              .map((ep) => (
                <div
                  key={ep.id}
                  className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2"
                >
                  <span className="text-sm text-zinc-300">
                    Month {ep.month}: {formatCurrency(ep.amount)}
                  </span>
                  <button
                    onClick={() => onRemove(ep.id)}
                    className="ml-1 text-zinc-500 transition-colors hover:text-red-400"
                    aria-label="Remove payment"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {extraPayments.length === 0 && (
        <p className="mt-4 text-sm text-zinc-500">
          Add extra payments to see how they affect your loan payoff timeline and total interest.
        </p>
      )}
    </div>
  );
}
