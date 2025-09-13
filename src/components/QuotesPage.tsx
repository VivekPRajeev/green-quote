'use client';
import { useEffect, useState, FC } from 'react';
import QuoteCard from '@/components/QuoteCard';
import Loader from '@/components/Loader';
import { QuoteDetails } from '@/types/quotes';

interface QuotesPageProps {
  id: string;
}

const QuotesPage: FC<QuotesPageProps> = ({ id }) => {
  const [quoteDetails, setQuoteDetails] = useState<QuoteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const fetchQuote = async () => {
      if (!id) return;
      const response = await fetch(`/api/quotes/${id}`);
      const data = await response.json();
      setQuoteDetails(data.data);
      setLoading(false);
    };
    fetchQuote();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      {loading ? (
        <Loader />
      ) : (
        quoteDetails && <QuoteCard quoteDetails={quoteDetails} />
      )}
    </div>
  );
};
export default QuotesPage;
