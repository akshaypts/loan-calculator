"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { type LoanSummary, formatCurrency } from "~/lib/loanCalculations";

interface LoanChartsProps {
  baseSchedule: LoanSummary;
  withExtraSchedule: LoanSummary;
  hasExtraPayments: boolean;
}

const COLORS = {
  principal: "#10b981",
  interest: "#f59e0b",
  balance: "#6366f1",
  balanceWithExtra: "#22d3d3",
  savings: "#10b981",
};

export function LoanCharts({ baseSchedule, withExtraSchedule, hasExtraPayments }: LoanChartsProps) {
  // Balance over time data
  const balanceData = baseSchedule.schedule.map((row, index) => ({
    month: row.month,
    year: Math.ceil(row.month / 12),
    balance: Math.round(row.balance),
    balanceWithExtra: withExtraSchedule.schedule[index]?.balance ?? 0,
  }));

  // Payment breakdown pie chart data
  const principal = baseSchedule.totalPayment - baseSchedule.totalInterest;
  const pieData = [
    { name: "Principal", value: principal, color: COLORS.principal },
    { name: "Interest", value: baseSchedule.totalInterest, color: COLORS.interest },
  ];

  // Comparison bar chart data
  const comparisonData = [
    {
      name: "Without Extra",
      totalPayment: baseSchedule.totalPayment,
      interest: baseSchedule.totalInterest,
      months: baseSchedule.actualMonths,
    },
    {
      name: "With Extra",
      totalPayment: withExtraSchedule.totalPayment,
      interest: withExtraSchedule.totalInterest,
      months: withExtraSchedule.actualMonths,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Balance Over Time */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6" aria-labelledby="balance-chart-heading">
        <h3 id="balance-chart-heading" className="mb-4 text-lg font-semibold text-zinc-100">Balance Over Time</h3>
        <div className="h-80" role="img" aria-label="Line chart showing loan balance decreasing over time in months">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={balanceData}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.balance} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.balance} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="balanceExtraGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.balanceWithExtra} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.balanceWithExtra} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis
                dataKey="month"
                stroke="#71717a"
                tickFormatter={(value) => `Y${Math.ceil(value / 12)}`}
                interval={Math.floor(balanceData.length / 10)}
              />
              <YAxis
                stroke="#71717a"
                tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#a1a1aa" }}
                formatter={(value) => [formatCurrency(value as number), ""]}
                labelFormatter={(label) => `Month ${label} (Year ${Math.ceil(Number(label) / 12)})`}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke={COLORS.balance}
                fill="url(#balanceGradient)"
                name="Base Balance"
              />
              {hasExtraPayments && (
                <Area
                  type="monotone"
                  dataKey="balanceWithExtra"
                  stroke={COLORS.balanceWithExtra}
                  fill="url(#balanceExtraGradient)"
                  name="With Extra Payments"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {hasExtraPayments && (
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS.balance }} aria-hidden="true" />
              <span className="text-zinc-300">Without Extra Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS.balanceWithExtra }} aria-hidden="true" />
              <span className="text-zinc-300">With Extra Payments</span>
            </div>
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Breakdown Pie Chart */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6" aria-labelledby="pie-chart-heading">
          <h3 id="pie-chart-heading" className="mb-4 text-lg font-semibold text-zinc-100">Payment Breakdown</h3>
          <div className="h-64" role="img" aria-label={`Pie chart showing payment breakdown: Principal ${formatCurrency(principal)}, Interest ${formatCurrency(baseSchedule.totalInterest)}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => formatCurrency(value as number)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS.principal }} aria-hidden="true" />
              <span className="text-zinc-300">Principal: {formatCurrency(principal)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS.interest }} aria-hidden="true" />
              <span className="text-zinc-300">Interest: {formatCurrency(baseSchedule.totalInterest)}</span>
            </div>
          </div>
        </section>

        {/* Comparison Bar Chart */}
        {hasExtraPayments && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6" aria-labelledby="comparison-chart-heading">
            <h3 id="comparison-chart-heading" className="mb-4 text-lg font-semibold text-zinc-100">Payment Comparison</h3>
            <div className="h-64" role="img" aria-label="Bar chart comparing total payments and interest with and without extra payments">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                  <XAxis
                    type="number"
                    stroke="#71717a"
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                  />
                  <YAxis type="category" dataKey="name" stroke="#71717a" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: "8px",
                    }}
                    formatter={(value, name) => [
                      formatCurrency(value as number),
                      name === "totalPayment" ? "Total Payment" : "Interest",
                    ]}
                  />
                  <Bar dataKey="totalPayment" fill={COLORS.balance} name="Total Payment" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="interest" fill={COLORS.interest} name="Interest" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
