import React, { FC } from 'react';

interface FormInputProps {
  label: string;
  name: string;
  value: string | number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorName?: string;
  id: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}

const FormInput: FC<FormInputProps> = ({
  id,
  label,
  name,
  value,
  placeholder,
  errorName = '',
  type = 'text',
  required = false,
  handleChange,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 text-gray-700 font-medium">
        {label}
      </label>
      <input
        type={type || 'text'}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        required={required}
      />
      {errorName && <p className="text-red-500 text-sm mt-1">{errorName}</p>}
    </div>
  );
};

export default FormInput;
