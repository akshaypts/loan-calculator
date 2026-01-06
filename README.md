# Loan Calculator

A modern web application for calculating loan amortization, comparing different loan scenarios, and managing extra payments. Built with Next.js and TypeScript.

## Features

- Calculate loan amortization schedules
- Compare multiple loan scenarios side-by-side
- Manage and track extra payments
- Interactive charts and visualizations
- Detailed amortization tables
- Real-time calculations

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [React](https://react.dev) - UI library

## Getting Started

### Prerequisites

- Bun 1.0+

### Installation

1. Clone the repository:
```bash
git clone git@github.com:akshaypts/loan-calculator.git
cd loan-calculator
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── AmortizationTable.tsx
│   ├── ComparisonSummary.tsx
│   ├── ExtraPaymentManager.tsx
│   ├── LoanCalculator.tsx
│   └── LoanCharts.tsx
├── lib/              # Utility functions
│   └── loanCalculations.ts
└── styles/           # Global styles
```

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Build and start production server
- `bun run start` - Start production server
- `bun run typecheck` - Run TypeScript type checking

## Deployment

Deploy to [Vercel](https://vercel.com) with a single click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/akshaypts/loan-calculator)

Or follow the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for other platforms.

## License

MIT
