'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QuoteCard from '@/components/QuoteCard';
import Loader from '@/components/Loader';
import { QuoteDetails } from '@/types/quotes';

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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      {quoteDetails ? <QuoteCard quoteDetails={quoteDetails} /> : <Loader />}
    </div>
  );
}
