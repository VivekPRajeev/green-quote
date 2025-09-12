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

const calculateMonthlyPaymentPlan = (
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
