import React from 'react';
import { render, screen } from '@testing-library/react';
import QuoteCard from './QuoteCard';
import { APR_BY_BAND } from '@/constants/quote';
import { formatDate } from '@/utils/calc';

jest.mock('@/utils/calc', () => ({
  formatDate: jest.fn((date: string) => `Formatted-${date}`),
}));

const mockQuoteDetails = {
  id: '1',
  fullName: 'John Doe',
  email: 'john@example.com',
  address: '123 Street, Berlin',
  createdAt: '2025-09-13T00:00:00Z',
  monthlyConsumptionKwh: 350,
  systemSizeKw: 5,
  systemPrice: 12000,
  downPayment: 2000,
  principalAmount: 10000,
  riskBand: 'A' as 'A',
  offers: [
    { termYears: 5, apr: 5, monthlyPayment: 200, principalUsed: 0 },
    { termYears: 10, apr: 4.5, monthlyPayment: 100, principalUsed: 0 },
  ],
};

describe('QuoteCard', () => {
  it('renders user info correctly', () => {
    render(<QuoteCard quoteDetails={mockQuoteDetails} />);
    expect(screen.getByText(/Quote for John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Address:/i)).toBeInTheDocument();
    expect(screen.getByText(/123 Street, Berlin/i)).toBeInTheDocument();
  });

  it('renders formatted date', () => {
    render(<QuoteCard quoteDetails={mockQuoteDetails} />);
    expect(
      screen.getByText(/Date: Formatted-2025-09-13T00:00:00Z/i)
    ).toBeInTheDocument();
  });

  it('renders quote metrics correctly', () => {
    render(<QuoteCard quoteDetails={mockQuoteDetails} />);
    expect(screen.getByText(/350 KWh/i)).toBeInTheDocument();
    expect(screen.getByText(/5 KW/i)).toBeInTheDocument();
    expect(screen.getByText(/12000 EUR/i)).toBeInTheDocument();
    const downPayment = screen.getAllByText(/2000 EUR/i);
    expect(downPayment[0]).toBeInTheDocument();
    expect(screen.getByText(/10000 EUR/i)).toBeInTheDocument();
    expect(screen.getByText(`${APR_BY_BAND['A']}%`)).toBeInTheDocument();
  });

  it('renders table offers correctly', () => {
    render(<QuoteCard quoteDetails={mockQuoteDetails} />);
    expect(screen.getByText(/5 Years/i)).toBeInTheDocument();
    const apr1 = screen.getAllByText(/5 %/i);
    expect(apr1[0]).toBeInTheDocument();
    expect(screen.getByText(/200 EUR/i)).toBeInTheDocument();

    expect(screen.getByText(/10 Years/i)).toBeInTheDocument();
    const apr2 = screen.getAllByText(/4.5 %/i);
    expect(apr2[0]).toBeInTheDocument();
    expect(screen.getByText(/100 EUR/i)).toBeInTheDocument();
  });

  it('renders fallback values when fields are missing', () => {
    const emptyDetails = { offers: [] } as any;
    render(<QuoteCard quoteDetails={emptyDetails} />);
    expect(screen.getByText(/Quote for/i)).toBeInTheDocument();
    expect(screen.getAllByText(/N\/A/i).length).toBeGreaterThan(0);
  });
});
