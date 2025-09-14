import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormInput from './FormInput';

describe('FormInput', () => {
  const mockHandleChange = jest.fn();

  const defaultProps = {
    id: 'name',
    label: 'Name',
    name: 'name',
    value: '',
    placeholder: 'Enter your name',
    handleChange: mockHandleChange,
    errorName: '',
    type: 'text',
    required: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label correctly', () => {
    render(<FormInput {...defaultProps} />);
    expect(screen.getByText(/Name/i)).toBeInTheDocument();
  });

  it('renders input with correct attributes', () => {
    render(<FormInput {...defaultProps} />);
    const input = screen.getByPlaceholderText(
      /Enter your name/i
    ) as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input.value).toBe('');
    expect(input.type).toBe('text');
    expect(input.required).toBe(false);
    expect(input.name).toBe('name');
    expect(input.id).toBe('name');
  });

  it('calls handleChange on input change', () => {
    render(<FormInput {...defaultProps} />);
    const input = screen.getByPlaceholderText(/Enter your name/i);

    fireEvent.change(input, { target: { value: 'John Doe' } });
    expect(mockHandleChange).toHaveBeenCalledTimes(1);
  });

  it('renders error text if errorName is provided', () => {
    render(<FormInput {...defaultProps} errorName="Invalid Name" />);
    expect(screen.getByText(/Invalid Name/i)).toBeInTheDocument();
  });

  it('does not render error text if errorName is empty', () => {
    render(<FormInput {...defaultProps} />);
    expect(screen.queryByText(/Invalid name/i)).not.toBeInTheDocument();
  });

  it('supports required attribute', () => {
    render(<FormInput {...defaultProps} required />);
    const input = screen.getByPlaceholderText(
      /Enter your name/i
    ) as HTMLInputElement;
    expect(input.required).toBe(true);
  });

  it('supports different input types', () => {
    render(<FormInput {...defaultProps} type="password" />);
    const input = screen.getByPlaceholderText(
      /Enter your name/i
    ) as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('renders numeric value correctly', () => {
    render(<FormInput {...defaultProps} value={123} type="number" />);
    const input = screen.getByPlaceholderText(
      /Enter your name/i
    ) as HTMLInputElement;
    expect(input.value).toBe('123');
  });
});
