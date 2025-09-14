import { z } from 'zod';

export const healthOkResponse = z.object({
  status: z.literal('ok').describe('Service is healthy'),
  db: z.literal('connected').describe('Database connection status'),
  timestamp: z.string().datetime().describe('Server timestamp'),
});

export const healthErrorResponse = z.object({
  status: z.literal('error').describe('Service is unhealthy'),
  db: z.literal('disconnected'),
  error: z.string().describe('Error details'),
});
