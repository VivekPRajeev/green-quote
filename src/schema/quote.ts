import { z } from 'zod';
import 'zod-openapi';

export const createQuoteSchema = z.object({
  monthlyConsumptionKwh: z.coerce
    .number()
    .positive({ message: 'Monthly consumption must be positive' })
    .meta({
      description: 'Average monthly electricity consumption in kWh',
      example: 350,
    }),
  systemSizeKw: z.coerce
    .number()
    .positive({ message: 'System size must be positive' })
    .meta({
      description: 'Desired solar system size in kW',
      example: 5,
    }),
  downPayment: z.coerce.number().min(0).optional().default(0).meta({
    description: 'Initial down payment amount',
    example: 2000,
  }),
  name: z.string().min(1, 'Name is required').meta({
    description: 'Full name of the user requesting the quote',
    example: 'John Doe',
  }),
  email: z.email({ message: 'Invalid email address' }).meta({
    description: 'Email address of the user',
    example: 'john@doe.com',
  }),
  address: z.string().min(1, 'Address is required').meta({
    description: 'Physical address of the user',
    example: '123 Example St, Example City, Country',
  }),
});

export const monthlyPaymentPlanSchema = z.object({
  termYears: z.number(),
  principalUsed: z.number(),
  apr: z.number(),
  monthlyPayment: z.number(),
});

export const createQuoteResponseSchema = z.object({
  message: z.string().default('Quote Generated Successfully'),
  data: createQuoteSchema.extend({
    name: z.string(),
    email: z.string(),
    address: z.string(),
    monthlyConsumptionKwh: z.number(),
    systemSizeKw: z.number(),
    downPayment: z.number(),
    userId: z.string(),
    riskBand: z.enum(['A', 'B', 'C']),
    systemPrice: z.number(),
    quotes: z.array(monthlyPaymentPlanSchema),
    quoteId: z.string(),
  }),
});

export const quoteItemSchema = z.object({
  id: z.uuid().describe('Unique identifier of the quote'),
  systemPrice: z.number().describe('Total system price'),
  riskBand: z.enum(['A', 'B', 'C']).describe('Risk band of the quote'),
  systemSizeKw: z.number().describe('System size in kW'),
  createdAt: z.string().describe('Timestamp when the quote was created'),
});

const userSchema = z.object({
  email: z.email().describe('User email'),
  fullName: z.string().describe('User full name'),
});

export const userQuotesResponseSchema = z.object({
  user: userSchema,
  quotes: z.array(quoteItemSchema),
});

const offerSchema = z.object({
  apr: z.number().describe('Annual Percentage Rate'),
  termYears: z.number().describe('Term length in years'),
  principalUsed: z.number().describe('Principal amount financed'),
  monthlyPayment: z.number().describe('Calculated monthly payment'),
});

export const quoteResponseSchema = z.object({
  id: z.string().uuid().describe('Unique identifier of the quote'),
  monthlyConsumptionKwh: z
    .number()
    .describe('Monthly electricity consumption in kWh'),
  systemSizeKw: z.number().describe('Solar system size in kW'),
  downPayment: z.number().nullable().describe('Initial down payment amount'),
  principalAmount: z.number().nullable().describe('Principal amount'),
  riskBand: z.string().describe('Risk band'),
  systemPrice: z.number().describe('Total system price'),
  offers: z.array(offerSchema).describe('Available financing offers'),
  fullName: z.string().describe('Full name of the user'),
  email: z.email().describe('User email address'),
  address: z.string().nullable().describe('User address'),
  user: z.object({
    email: z.email(),
    fullName: z.string(),
  }),
  createdAt: z.string().describe('When the quote was created'),
});

export const getQuoteByIdResponseSchema = z.object({
  data: quoteResponseSchema,
  status: z.number().describe('HTTP status code').default(200),
});
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type CreateQuoteResponse = z.infer<typeof createQuoteResponseSchema>;
