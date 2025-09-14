import { createQuoteResponseSchema, createQuoteSchema } from '@/schema/quote';
import {
  loginRequestSchema,
  loginResponseSchema,
  registerRequestSchema,
  registerResponseSchema,
  userInfoResponseSchema,
} from '@/schema/user';
import { createSchema } from 'zod-openapi';
import { createDocument } from 'zod-openapi';

const { schema: quoteSchema, components } = createSchema(createQuoteSchema, {
  io: 'input',
  openapiVersion: '3.0.0',
});

export const openApiSpec = createDocument({
  openapi: '3.0.0',
  info: {
    title: 'Green Quote API',
    version: '1.0.0',
    description: 'API documentation for the Green Quote application',
  },
  components: {
    schemas: {
      registerRequest: registerRequestSchema,
      registerResponse: registerResponseSchema,
      loginRequest: loginRequestSchema,
      loginResponse: loginResponseSchema,
      userInfoResponse: userInfoResponseSchema,
      createQuote: createQuoteSchema,
      createQuoteResponse: createQuoteResponseSchema,
    },
    securitySchemes: {
      BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    responses: {
      InternalServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'Internal server error' },
              },
              required: ['error'],
            },
          },
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
  paths: {
    '/api/register': {
      post: {
        security: [],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/registerRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'User Registered',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/registerResponse' },
              },
            },
          },
          '400': {
            description: 'Input field error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Invalid email format',
                    },
                  },
                  required: ['error'],
                },
              },
            },
          },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/api/login': {
      post: {
        security: [],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/loginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'User Registered',
            headers: {
              token: {
                schema: { type: 'string' },
                description: 'JWT token as HttpOnly cookie',
              },
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/loginResponse' },
              },
            },
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Email and password are required',
                    },
                  },
                  required: ['error'],
                },
              },
            },
          },
          '401': {
            description: 'Invalid Credentials',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Invalid credentials',
                    },
                  },
                  required: ['error'],
                },
              },
            },
          },
        },
      },
    },
    '/api/user/info': {
      get: {
        responses: {
          '200': {
            description: ' User Info successfully retrieved',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/userInfoResponse' },
              },
            },
          },
        },
      },
    },
    '/api/user/request-quote': {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/createQuote' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Quote created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/createQuoteResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized  Request',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Unauthorized',
                    },
                  },
                  required: ['error'],
                },
              },
            },
          },
          '400': {
            description: 'Invalid input or validation failed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Invalid fields provided',
                    },
                  },
                  required: ['error'],
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Internal server error',
                    },
                  },
                  required: ['error'],
                },
              },
            },
          },
        },
      },
    },
  },
});
