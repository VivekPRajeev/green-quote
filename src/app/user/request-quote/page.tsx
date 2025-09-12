'use client';
import { validateEmail } from '@/utils/validators';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
interface FormData {
  name: string;
  email: string;
  address: string;
  monthlyConsumptionKwh: number;
  systemSizeKw: number;
  downPayment?: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
  monthlyConsumptionKwh?: number;
  systemSizeKw?: number;
  downPayment?: number;
  api?: string;
}

const RequestQuote: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    address: '',
    monthlyConsumptionKwh: 0,
    systemSizeKw: 0,
    downPayment: 0,
  });
  const [systemPrice, setSystemPrice] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    const error = validateField(e.target.name, e.target.value);
    setErrors({ ...errors, [e.target.name]: error });
    if (e.target.name === 'systemSizeKw') {
      const price = Number(e.target.value.trim()) * 1200;
      if (!isNaN(price)) setSystemPrice(price.toString());
    }
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!validateEmail(value)) return 'Invalid email address';
        return '';
      case 'address':
        if (!value.trim()) return 'Address is required';
        return '';
      case 'monthlyConsumptionKwh':
        if (!value.trim()) return 'Monthly Consumption in  Kwh is required';
        return '';
      case 'systemSizeKw':
        if (!value.trim()) return 'System size is required';
        return '';
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/user/request-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/user/view-quote/?id=' + data.quoteId);
      } else alert(data.error || 'Error');
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Request Quote
        </h1>

        <form className="space-y-9" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 text-gray-700 font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="address" className="mb-1 text-gray-700 font-medium">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter your address"
              value={form.address}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-gray-700 font-medium">
              Monthly Consumption in Kwh
            </label>
            <input
              type="number"
              id="monthlyConsumptionKwh"
              name="monthlyConsumptionKwh"
              placeholder="Enter your Monthly Consumption in Kwh"
              value={form.monthlyConsumptionKwh}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
            />
            {errors.monthlyConsumptionKwh && (
              <p className="text-red-500 text-sm mt-1">
                {errors.monthlyConsumptionKwh}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="systemSizeKw"
              className="mb-1 text-gray-700 font-medium"
            >
              System Size (Kw)
            </label>
            <input
              type="number"
              id="systemSizeKw"
              name="systemSizeKw"
              placeholder="Enter your system size"
              value={form.systemSizeKw}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
              inputMode="decimal"
              pattern="[0-9]*"
            />
            {errors.systemSizeKw && (
              <p className="text-red-500 text-sm mt-1">{errors.systemSizeKw}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="downPayment"
              className="mb-1 text-gray-700 font-medium"
            >
              Down Payment (Optional)
            </label>
            <input
              type="number"
              id="downPayment"
              name="downPayment"
              placeholder="Enter your downPayment"
              value={form.downPayment}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            {systemPrice && (
              <p className="text-gray-500 text-sm mt-1">
                Estimated System Price: ${systemPrice} EUR
              </p>
            )}
            {errors.downPayment && (
              <p className="text-red-500 text-sm mt-1">{errors.downPayment}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Request Quote
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestQuote;
