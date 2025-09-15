import { APR_BY_BAND } from '@/constants/quote';
import { QuoteDetails } from '@/types/quotes';
import { formatDate } from '@/utils/calc';
import React, { FC, useState } from 'react';
import AmortizationSchedule from './AmortizationSchedule';

interface QuoteCardProps {
  quoteDetails: QuoteDetails;
}
interface SelectedOffer {
  apr: number;
  termYears: number;
  monthlyPayment: number;
}

const QuoteCard: FC<QuoteCardProps> = ({ quoteDetails }) => {
  const [selectedOffer, setSelectedOffer] = useState<SelectedOffer | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleDownload = async (quoteId: string, plan: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quotes/${quoteId}/${plan}`);
      if (!res.ok) throw new Error('Failed to download PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${quoteId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quote for {quoteDetails?.fullName}
          </h1>

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
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            Date: {formatDate(quoteDetails?.createdAt)}
          </p>
        </div>
      </div>

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
          <span className="block text-xs text-gray-500 mb-1">System Size</span>
          <span className="text-lg font-semibold text-gray-800">
            {quoteDetails.systemSizeKw ?? 'N/A'} KW
          </span>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <span className="block text-xs text-gray-500 mb-1">System Price</span>
          <span className="text-lg font-semibold text-gray-800">
            {quoteDetails.systemPrice ?? 'N/A'} EUR
          </span>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <span className="block text-xs text-gray-500 mb-1">Down payment</span>

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

      <div className="overflow-x-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Offers</h3>
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
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                Actions
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
                  <td className="px-4 py-2 text-right">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded mr-1"
                      onClick={() => setSelectedOffer(item)}
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        handleDownload(quoteDetails.id, item.termYears)
                      }
                      disabled={loading}
                      className={`px-4 py-1 rounded font-semibold text-white shadow 
                       ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                      {loading ? 'Downloading...' : 'Download PDF'}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {selectedOffer && (
        <AmortizationSchedule
          apr={selectedOffer.apr}
          monthlyPayment={selectedOffer.monthlyPayment}
          term={selectedOffer.termYears}
          principalAmount={quoteDetails.principalAmount}
        />
      )}
    </>
  );
};

export default QuoteCard;
