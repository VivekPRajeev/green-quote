import { AmortizationEntry } from '@/types/quotes';
import { calculatePayments, round2 } from '@/utils/calc';
import React, { useEffect, useState } from 'react';

export interface LoginData {
  email: string;
  password: string;
}
const AmortizationSchedule = ({
  term = 5,
  apr,
  principalAmount,
  monthlyPayment,
}: {
  term: number;
  apr: number;
  principalAmount: number;
  monthlyPayment: number;
}) => {
  const [payments, setPayments] = useState<AmortizationEntry[]>([]);
  useEffect(() => {
    setPayments(calculatePayments(term, apr, principalAmount, monthlyPayment));
  }, [term]);

  return (
    <div className="overflow-x-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Amortization Schedule for {term} Years
      </h3>
      <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              #
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Date
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
              Payment
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
              Interest
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
              Principal
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
              Balance
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {payments.map((row) => (
            <tr key={row.paymentNumber} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-600">
                {row.paymentNumber}
              </td>
              <td className="px-4 py-2 text-sm text-gray-600">
                {new Intl.DateTimeFormat('de-DE').format(row.paymentDate)}
              </td>
              <td className="px-4 py-2 text-sm text-gray-600 text-right">
                {row.payment.toFixed(2)} EUR
              </td>
              <td className="px-4 py-2 text-sm text-gray-600 text-right">
                {row.interest.toFixed(2)} EUR
              </td>
              <td className="px-4 py-2 text-sm text-gray-600 text-right">
                {row.principal.toFixed(2)} EUR
              </td>
              <td className="px-4 py-2 text-sm text-gray-600 text-right">
                {row.remainingBalance.toFixed(2)} EUR
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AmortizationSchedule;
