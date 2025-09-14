import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  email: z.email().optional(),
  fullName: z.string().optional(),
  isAdmin: z.boolean().optional(),
});

export const userInfoResponseSchema = z.object({
  id: z.string().meta({
    description: 'Current Users ID',
    example: 'abcsd-dgbtasd-casj-97das-asd',
  }),
  email: z.email().meta({
    description: 'Current Users email',
    example: 'john.doe@gmail.com',
  }),
  fullName: z.string().meta({
    description: 'Current Users full name',
    example: 'John Doe',
  }),
  isAdmin: z.boolean().meta({
    description: 'Flag showing whether current user is an admin or not',
    example: false,
  }),
});

export const registerRequestSchema = z.object({
  email: z.email({ message: 'Invalid email format' }).meta({
    description: 'Users Email address',
    example: 'john.doe@gmail.com',
  }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .meta({
      description: 'Users Password',
      example: 'password@123',
    }),
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .meta({
      description: 'Users full name',
      example: 'John Doe',
    }),
});

export const registerResponseSchema = z.object({
  user: z.object({
    id: z.string().meta({
      description: 'User  ID of registered user',
      example: '123asdw-1233sad-231ohze',
    }),
    email: z.email().meta({
      description: 'Users Email',
      example: 'john.doe@gmail.com',
    }),
    name: z.string().meta({
      description: 'Registered Users Full Name',
      example: 'John Doe',
    }),
  }),
});

export const loginRequestSchema = z.object({
  email: z.email({ message: 'Invalid email format' }).meta({
    description: 'Users Email address',
    example: 'john.doe@gmail.com',
  }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .meta({
      description: 'Users Password',
      example: 'password@123',
    }),
});

export const loginResponseSchema = z.object({
  message: z.string().meta({
    description: ' Server message from login  request',
    example: 'Login successful',
  }),
  isAdmin: z.boolean().meta({
    description: 'Flag to distingusing if user has admin role',
    example: true,
  }),
});

export type UserPayload = z.infer<typeof userSchema>;
export type UserInfoResponse = z.infer<typeof userInfoResponseSchema>;
