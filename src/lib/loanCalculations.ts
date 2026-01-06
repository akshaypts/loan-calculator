export interface ExtraPayment {
    id: string;
    month: number;
    amount: number;
}

export interface AmortizationRow {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    extraPayment: number;
    balance: number;
    totalPaid: number;
}

export interface LoanSummary {
    emi: number;
    totalPayment: number;
    totalInterest: number;
    schedule: AmortizationRow[];
    actualMonths: number;
}

export function calculateEMI(principal: number, annualRate: number, months: number): number {
    if (principal <= 0 || months <= 0) return 0;
    if (annualRate <= 0) return principal / months;

    const monthlyRate = annualRate / 100 / 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    return emi;
}

export function calculateLoanSchedule(
    principal: number,
    annualRate: number,
    months: number,
    extraPayments: ExtraPayment[] = []
): LoanSummary {
    if (principal <= 0 || months <= 0) {
        return { emi: 0, totalPayment: 0, totalInterest: 0, schedule: [], actualMonths: 0 };
    }

    const emi = calculateEMI(principal, annualRate, months);
    const monthlyRate = annualRate / 100 / 12;
    const schedule: AmortizationRow[] = [];

    let balance = principal;
    let totalPaid = 0;
    let month = 1;

    const extraPaymentMap = new Map<number, number>();
    extraPayments.forEach(ep => {
        const existing = extraPaymentMap.get(ep.month) || 0;
        extraPaymentMap.set(ep.month, existing + ep.amount);
    });

    while (balance > 0.01 && month <= months * 2) {
        const interest = balance * monthlyRate;
        let principalPart = emi - interest;
        const extra = extraPaymentMap.get(month) || 0;

        // Handle final payment
        if (principalPart + extra >= balance) {
            principalPart = balance;
            const finalPayment = principalPart + interest;
            totalPaid += finalPayment + extra;

            schedule.push({
                month,
                payment: finalPayment,
                principal: principalPart,
                interest,
                extraPayment: Math.min(extra, balance - principalPart > 0 ? balance - principalPart : 0),
                balance: 0,
                totalPaid,
            });
            balance = 0;
        } else {
            balance -= (principalPart + extra);
            totalPaid += emi + extra;

            schedule.push({
                month,
                payment: emi,
                principal: principalPart,
                interest,
                extraPayment: extra,
                balance: Math.max(0, balance),
                totalPaid,
            });
        }
        month++;
    }

    return {
        emi,
        totalPayment: totalPaid,
        totalInterest: totalPaid - principal,
        schedule,
        actualMonths: schedule.length,
    };
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatCurrencyPrecise(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}
