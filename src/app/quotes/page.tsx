'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/utils/calc';
import { Quote, UserQuotes } from '@/types/quotes';
import Loader from '@/components/Loader';

export default function UserPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/quotes');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data: UserQuotes = await res.json();
        setQuotes(data.quotes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
        <div className="text-2xl font-bold mb-4">User Dashboard</div>
        <div className="p-8">
          <div className="flex justify-end mb-4">
            <Link
              href="/quotes/request-quote"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center justify-center cursor-pointer"
            >
              Request Quote
            </Link>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">
                    System size
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Price</th>
                  <th className="border border-gray-300 px-4 py-2">Band</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes &&
                  quotes.map((quote) => (
                    <tr key={quote.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {formatDate(quote.createdAt)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {quote.systemSizeKw} KW
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {quote.systemPrice} EUR
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {quote.riskBand}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Link
                          href={`/quotes/${quote.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          More Details
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
