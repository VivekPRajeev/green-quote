import React, { useState, ChangeEvent, FormEvent } from 'react';

interface AdminSearchForm {
  name?: string;
  email?: string;
  band?: string;
}
interface FormErrors {
  email?: string;
  name?: string;
}

interface AdminQuoteSearchProps {
  submitHandler: (formData: AdminSearchForm) => void;
}

const AdminQuoteSearch: React.FC<AdminQuoteSearchProps> = ({
  submitHandler,
}) => {
  const [formData, setFormData] = useState<AdminSearchForm>({});
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = (data: AdminSearchForm) => {
    const newErrors: FormErrors = {};
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (data.name && data.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    // Add any form validation logic here if needed
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    setErrors(validateForm(formData));
    if (Object.keys(newErrors).length > 0) return;
    submitHandler(formData);
  };

  return (
    <form className="flex items-center gap-4 mb-6" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        onChange={handleChange}
        placeholder="Name"
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
      />
      <select
        name="band"
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
        defaultValue=""
        onChange={(e) => setFormData({ ...formData, band: e.target.value })}
      >
        <option value="" disabled>
          Band
        </option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
};

export default AdminQuoteSearch;
