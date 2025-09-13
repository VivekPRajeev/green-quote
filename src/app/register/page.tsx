'use client';
import { validateEmail } from '@/utils/validators';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RegistrationData, RegistrationErrors } from '@/types/general';
import Loader from '@/components/Loader';
import FormInput from '@/components/FormInput';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState<RegistrationData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    const error = validateField(e.target.name, e.target.value);
    setErrors({ ...errors, [e.target.name]: error });
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 3) return 'Name must be at least 3 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!validateEmail(value)) return 'Invalid email address';
        return '';
      case 'password':
        if (!value.trim()) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'confirmPassword':
        if (!value.trim()) return 'Please confirm your password';
        if (value !== form.password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Registered successfully!');
        router.push('/login');
      } else alert(data.error || 'Error');
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {loading && <Loader />}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Register</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormInput
            name="name"
            label="Name"
            id="name"
            type="text"
            placeholder="Enter your name"
            value={form.name}
            handleChange={handleChange}
            errorName={errors.name}
            required
          />
          <FormInput
            name="email"
            label="Email"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            handleChange={handleChange}
            errorName={errors.email}
            required
          />
          <FormInput
            name="password"
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            handleChange={handleChange}
            errorName={errors.password}
            required
          />
          <FormInput
            name="confirmPassword"
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            placeholder="Enter your password"
            value={form.confirmPassword}
            handleChange={handleChange}
            errorName={errors.confirmPassword}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
          <div className="mt-6 text-center">
            <Link href="/login" className="text-blue-600 hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
