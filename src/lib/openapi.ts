import { healthErrorResponse, healthOkResponse } from '@/schema/health';
import {
  createQuoteResponseSchema,
  createQuoteSchema,
  getQuoteByIdResponseSchema,
  userQuotesResponseSchema,
} from '@/schema/quote';
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
      heatlhResponse: healthOkResponse,
      healthErrorResponse: healthErrorResponse,
      registerRequest: registerRequestSchema,
      registerResponse: registerResponseSchema,
      loginRequest: loginRequestSchema,
      loginResponse: loginResponseSchema,
      userInfoResponse: userInfoResponseSchema,
      createQuote: createQuoteSchema,
      createQuoteResponse: createQuoteResponseSchema,
      userQuotesResponse: userQuotesResponseSchema,
      userQuoteByIdResponse: getQuoteByIdResponseSchema,
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
    '/api/health': {
      get: {
        security: [],
        responses: {
          '200': {
            description: 'Health check endpoint',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/heatlhResponse' },
              },
            },
          },
          '500': {
            description: 'Health check failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/healthErrorResponse' },
              },
            },
          },
        },
      },
    },
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
          '500': { $ref: '#/components/responses/InternalServerError' },
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
          '404': {
            description: 'Entry not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'User not found',
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
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/api/quotes': {
      get: {
        responses: {
          '200': {
            description: ' User quotes successfully retrieved',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/userQuotesResponse' },
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
          '404': {
            description: 'Entry not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'User not found',
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
    '/api/quotes/{id}': {
      get: {
        responses: {
          '200': {
            description: 'User quote by ID successfully retrieved',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/userQuoteByIdResponse' },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Missing  Quote ID',
                    },
                  },
                  required: ['error'],
                },
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
          '403': {
            description: 'User does  not have  permission to  view quote',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Forbidden',
                    },
                  },
                  required: ['error'],
                },
              },
            },
          },
          '404': {
            description: 'Entry not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Quote not found',
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
  },
});
