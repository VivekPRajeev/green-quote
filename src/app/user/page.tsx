'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/quotes');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRequestQuote = () => {
    alert('Request Quote clicked!');
    // You can replace this with your API call later
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Card */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
        <div className="text-2xl font-bold mb-4">User Dashboard</div>
        <div className="p-8">
          <div className="flex justify-end mb-4">
            <Link
              href="/user/request-quote"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center justify-center cursor-pointer"
            >
              Request Quote
            </Link>
          </div>

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
              <tr>
                <td className="border border-gray-300 px-4 py-2">Row1 Col1</td>
                <td className="border border-gray-300 px-4 py-2">Row1 Col2</td>
                <td className="border border-gray-300 px-4 py-2">Row1 Col3</td>
                <td className="border border-gray-300 px-4 py-2">Row1 Col4</td>
                <td className="border border-gray-300 px-4 py-2">Row1 Col5</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Row2 Col1</td>
                <td className="border border-gray-300 px-4 py-2">Row2 Col2</td>
                <td className="border border-gray-300 px-4 py-2">Row2 Col3</td>
                <td className="border border-gray-300 px-4 py-2">Row2 Col4</td>
                <td className="border border-gray-300 px-4 py-2">Row2 Col5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
