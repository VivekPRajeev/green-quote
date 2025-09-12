'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatDate } from '@/utils/calc';
import { APR_BY_BAND } from '@/constants/quote';

interface QuoteDetails {
  id: string;
  fullName: string;
  createdAt: string;
  email: string;
  address: string;
  monthlyConsumptionKwh: number;
  principalAmount: number;
  systemSizeKw: number;
  downPayment: number | null;
  riskBand: 'A' | 'B' | 'C';
  systemPrice: number;
  monthlyPayment: number;
  status: string;
  offers: {
    termYears: number;
    apr: number;
    principalUsed: number;
    monthlyPayment: number;
  }[];
}
export default function QuotesPage() {
  const searchParams = useSearchParams();
  const [quoteDetails, setQuoteDetails] = useState<QuoteDetails | null>(null);
  useEffect(() => {
    const id = searchParams.get('id');
    const fetchQuote = async () => {
      if (!id) return;
      const response = await fetch(`/api/user/quote?id=${id}`);
      const data = await response.json();
      setQuoteDetails(data.data);
    };
    fetchQuote();
  }, [searchParams]);

  const RenderQuote = ({ quoteDetails }: { quoteDetails: QuoteDetails }) => (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quote for {quoteDetails?.fullName}
          </h1>
          {quoteDetails && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span>{' '}
                {quoteDetails.email ?? 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Address:</span>{' '}
                {quoteDetails.address ?? 'N/A'}
              </p>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            Date: {formatDate(quoteDetails?.createdAt)}
          </p>
        </div>
      </div>
      {/* Quote Details Section */}
      {quoteDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded">
            <span className="block text-xs text-gray-500 mb-1">
              Monthly Consumption
            </span>
            <span className="text-lg font-semibold text-gray-800">
              {quoteDetails.monthlyConsumptionKwh ?? 'N/A'} KWh
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <span className="block text-xs text-gray-500 mb-1">
              System Size
            </span>
            <span className="text-lg font-semibold text-gray-800">
              {quoteDetails.systemSizeKw ?? 'N/A'} KW
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <span className="block text-xs text-gray-500 mb-1">
              System Price
            </span>
            <span className="text-lg font-semibold text-gray-800">
              {quoteDetails.systemPrice ?? 'N/A'} EUR
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <span className="block text-xs text-gray-500 mb-1">
              Down payment
            </span>

            <span className="text-lg font-semibold text-gray-800">
              {quoteDetails.downPayment ?? 'N/A'} EUR
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <span className="block text-xs text-gray-500 mb-1">
              Principal Amount
            </span>
            <span className="text-lg font-semibold text-gray-800">
              {quoteDetails.principalAmount ?? 'N/A'} EUR
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <span className="block text-xs text-gray-500 mb-1">APR</span>
            <span className="text-lg font-semibold text-gray-800">
              {quoteDetails.riskBand
                ? `${APR_BY_BAND[quoteDetails.riskBand]}%`
                : 'N/A'}
            </span>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      {quoteDetails ? (
        <RenderQuote quoteDetails={quoteDetails} />
      ) : (
        <p>Loading...</p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Term
              </th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                APR
              </th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                Monthly Payment
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quoteDetails &&
              quoteDetails?.offers?.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-gray-700">
                    {item.termYears} Years
                  </td>
                  <td className="px-4 py-2 text-right">{item.apr} %</td>
                  <td className="px-4 py-2 text-right">
                    {item.monthlyPayment} EUR
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
