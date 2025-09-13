'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/utils/calc';
import AdminQuoteSearch from '@/components/AdminQuoteSearch';
import Loader from '@/components/Loader';

interface Quote {
  id: string;
  systemPrice: number;
  riskBand: string;
  systemSizeKw: string;
  createdAt: string;
  user: {
    email: string;
    fullName: string;
  };
}

export default function AdminPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllQuotes = async () => {
      try {
        const res = await fetch('/api/admin/quotes');
        if (!res.ok) throw new Error('Failed to fetch users');
        const { data } = await res.json();
        setQuotes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllQuotes();
  }, []);

  const handleSearch = async (formData: {
    name?: string;
    email?: string;
    band?: string;
  }) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (formData.name) query.append('name', formData.name);
      if (formData.email) query.append('email', formData.email);
      if (formData.band) query.append('band', formData.band);
      const res = await fetch(`/api/admin/quotes?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch quotes');
      const { data } = await res.json();
      setQuotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
        <div className="text-2xl font-bold mb-4">Admin Dashboard</div>

        <div className="p-8">
          <AdminQuoteSearch submitHandler={handleSearch} />

          {loading ? (
            <Loader />
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">
                    Customer Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Customer Email
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    System size
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Price</th>
                  <th className="border border-gray-300 px-4 py-2">Band</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>

                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.length ? (
                  quotes.map((quote) => (
                    <tr key={quote.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {quote.user.fullName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {quote.user.email}
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
                        {quote.createdAt && formatDate(quote.createdAt)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Link
                          href={`/user/quote?id=${quote.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          More Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center p-4" colSpan={7}>
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
