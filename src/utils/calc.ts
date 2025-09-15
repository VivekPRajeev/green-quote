import { AmortizationEntry } from '@/types/quotes';

export interface MonthlyPaymentPlan {
  termYears: number;
  apr: number;
  principalUsed: number;
  monthlyPayment: number;
}

type MonthlyPaymentPlans = MonthlyPaymentPlan[];

export const calculateMonthlyPaymentPlans = (
  principalAmount: number,
  apr: number
): MonthlyPaymentPlans => {
  const plans: MonthlyPaymentPlans = [
    { ...calculateMonthlyPaymentPlan(principalAmount, apr, 5) },
    { ...calculateMonthlyPaymentPlan(principalAmount, apr, 10) },
    { ...calculateMonthlyPaymentPlan(principalAmount, apr, 15) },
  ];

  return plans;
};

export const calculateMonthlyPaymentPlan = (
  principal: number,
  apr: number,
  termYears: number
): MonthlyPaymentPlan => {
  const monthlyRate = apr / 100 / 12;
  const numberOfPayments = termYears * 12;
  const monthlyPayment =
    (principal * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
  return {
    termYears,
    apr,
    principalUsed: principal,
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
  };
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const round2 = (val: number) =>
  Math.round((val + Number.EPSILON) * 100) / 100; // avoid floating-point quirks like 2.675 → 2.67

export const calculatePayments = (
  term: number,
  apr: number,
  principalAmount: number,
  monthlyPayment: number
) => {
  const entries: AmortizationEntry[] = [];
  const installments = term * 12;
  const monthlyInterest = apr / 1200; // apr/100/12
  let payment = monthlyPayment;
  let balance = principalAmount;
  let totalInterest = 0;
  let totalAmountPaid = 0;
  const start = new Date();
  const firstPaymentDate = new Date(
    start.getFullYear(),
    start.getMonth() + 1,
    start.getDate()
  ); // assuming payment begings after next month
  for (let i = 1; i <= installments; i++) {
    // loop through every installment
    const interest = round2(balance * monthlyInterest);
    let principalPaid = round2(payment - interest);
    if (i === installments) {
      // last day of payment. adjust to eliminate rounding remainder
      principalPaid = round2(balance);
      payment = round2(interest + principalPaid);
    }
    balance = round2(balance - principalPaid);
    const payDate = new Date(
      firstPaymentDate.getFullYear(),
      firstPaymentDate.getMonth() + (i - 1),
      firstPaymentDate.getDate()
    );
    entries.push({
      paymentNumber: i,
      paymentDate: payDate,
      payment: payment,
      interest,
      principal: principalPaid,
      remainingBalance: balance,
    });
    totalInterest = round2(totalInterest + interest);
    totalAmountPaid = round2(totalAmountPaid + payment);
  }
  return entries;
};
