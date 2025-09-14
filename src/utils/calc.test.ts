import { calculateMonthlyPaymentPlan, formatDate } from './calc';

describe('formatDate', () => {
  it('formats a valid date string correctly', () => {
    const input = '2025-09-13T00:00:00Z';
    const result = formatDate(input);
    expect(result).toBe('13. September 2025');
  });

  it('formats another date correctly', () => {
    const input = '2023-01-05';
    const result = formatDate(input);
    expect(result).toBe('05. Januar 2023');
  });
});

describe('calculateMonthlyPaymentPlan', () => {
  it('calculates monthly payment correctly for typical input', () => {
    const principal = 100000;
    const apr = 5;
    const termYears = 10;

    const result = calculateMonthlyPaymentPlan(principal, apr, termYears);

    expect(result.termYears).toBe(termYears);
    expect(result.apr).toBe(apr);
    expect(result.principalUsed).toBe(principal);
    // Monthly payment calculation check
    expect(result.monthlyPayment).toBeCloseTo(1060.66, 2);
  });

  it('handles one-year term correctly', () => {
    const principal = 5000;
    const apr = 12;
    const termYears = 1;

    const result = calculateMonthlyPaymentPlan(principal, apr, termYears);

    expect(result.monthlyPayment).toBeCloseTo(444.24);
  });
});
it('handles invalid date strings gracefully', () => {
  const input = 'invalid-date';
  const result = formatDate(input);
  expect(result).toBe('Invalid Date');
});
