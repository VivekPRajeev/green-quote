export interface QuoteDetails {
  id: string;
  fullName: string;
  createdAt: string;
  email: string;
  address: string;
  monthlyConsumptionKwh: number;
  principalAmount: number;
  systemSizeKw: number;
  downPayment: number | null;
  riskBand: 'A' | 'B' | 'C';
  systemPrice: number;
  offers: {
    termYears: number;
    apr: number;
    principalUsed: number;
    monthlyPayment: number;
  }[];
}

export interface RequestQuoteData {
  name: string;
  email: string;
  address: string;
  monthlyConsumptionKwh: number;
  systemSizeKw: number;
  downPayment: number;
}

export interface RequestQuoteErrors {
  name?: string;
  email?: string;
  address?: string;
  monthlyConsumptionKwh?: string;
  systemSizeKw?: string;
  downPayment?: string;
  api?: string;
}

export interface Quote {
  id: string;
  systemPrice: number;
  riskBand: string;
  systemSizeKw: string;
  createdAt: string;
}
export interface UserQuotes {
  user: {
    email: string;
    fullName: string;
  };
  quotes: Quote[];
}

export interface AmortizationEntry {
  paymentNumber: number;
  paymentDate: Date;
  payment: number;
  interest: number;
  principal: number;
  remainingBalance: number;
}
