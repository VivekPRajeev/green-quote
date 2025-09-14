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
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type CreateQuoteResponse = z.infer<typeof createQuoteResponseSchema>;
