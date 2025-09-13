'use client';
import { validateEmail } from '@/utils/validators';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RequestQuoteData, RequestQuoteErrors } from '@/types/quotes';
import FormInput from '@/components/FormInput';

const RequestQuote: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState<RequestQuoteData>({
    name: '',
    email: '',
    address: '',
    monthlyConsumptionKwh: 0,
    systemSizeKw: 0,
    downPayment: 0,
  });
  const [systemPrice, setSystemPrice] = useState('');
  const [errors, setErrors] = useState<RequestQuoteErrors>({});

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
        router.push('/user/quote/?id=' + data?.data?.quoteId);
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
          <FormInput
            id="name"
            label="Name"
            type="text"
            value={form.name}
            name="name"
            placeholder="Enter your name"
            handleChange={handleChange}
            errorName={errors.name}
            required
          />
          <FormInput
            id="email"
            label="Email"
            type="email"
            value={form.email}
            name="email"
            placeholder="Enter your email"
            handleChange={handleChange}
            errorName={errors.email}
            required
          />
          <FormInput
            id="address"
            label="Address"
            type="text"
            value={form.address}
            name="address"
            placeholder="Enter your address"
            handleChange={handleChange}
            errorName={errors.address}
            required
          />
          <FormInput
            id="monthlyConsumptionKwh"
            label="Monthly Consumption in Kwh"
            type="number"
            value={form.monthlyConsumptionKwh}
            name="monthlyConsumptionKwh"
            placeholder="Enter your Monthly Consumption in Kwh"
            handleChange={handleChange}
            errorName={errors.monthlyConsumptionKwh}
            required
          />
          <FormInput
            id="systemSizeKw"
            label="System Size (Kw)"
            type="number"
            value={form.systemSizeKw}
            name="systemSizeKw"
            placeholder="Enter your system size"
            handleChange={handleChange}
            errorName={errors.systemSizeKw}
            required
          />
          <FormInput
            id="downPayment"
            label="Down Payment (Optional)"
            type="number"
            value={form.downPayment}
            name="downPayment"
            placeholder="Enter your downPayment"
            handleChange={handleChange}
            errorName={errors.downPayment}
          />

          {systemPrice && (
            <p className="text-gray-500 text-sm mt-1">
              Estimated System Price: ${systemPrice} EUR
            </p>
          )}
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
