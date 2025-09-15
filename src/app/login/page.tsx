'use client';
import Link from 'next/link';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { validateEmail } from '@/utils/validators';
import Loader from '@/components/Loader';
import { LoginData, LoginErrors } from '@/types/general';
import FormInput from '@/components/FormInput';

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '', api: '' });
  };

  const handleSubmit = async (e: FormEvent) => {
    console.log('Form submitted');
    e.preventDefault();
    const newErrors: LoginErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';

    if (!formData.password.trim()) newErrors.password = 'Password is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      setLoading(true);
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401)
          setErrors({ ...errors, api: 'Invalid credentials' });
        else
          setErrors({
            ...errors,
            api: data.error || 'Something went wrong, please try again later',
          });

        setLoading(false);
        return;
      }
      if (data.isAdmin) router.push('/admin/quotes');
      else router.push('/quotes');
    } catch (err) {
      setErrors({ ...errors, api: 'Login Failed' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loading && <Loader />}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <FormInput
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            name="email"
            placeholder="Enter your email"
            handleChange={handleChange}
            errorName={errors.email}
            required
          />
          <FormInput
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            name="password"
            placeholder="Enter your password"
            handleChange={handleChange}
            errorName={errors.password}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Login
          </button>
          {errors.api && (
            <p className="text-red-500 text-sm mt-1">{errors.api}</p>
          )}
        </form>
        <div className="mt-6 text-center">
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
