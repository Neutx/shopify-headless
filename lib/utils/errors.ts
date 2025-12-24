// Custom Error Classes

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ShopifyError extends APIError {
  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message, statusCode, code);
    this.name = 'ShopifyError';
  }
}

export class FirebaseError extends APIError {
  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message, statusCode, code);
    this.name = 'FirebaseError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string, public errors?: any) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

// Error Response Formatter
export interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    statusCode: number;
    details?: any;
  };
}

export function formatErrorResponse(error: unknown): ErrorResponse {
  if (error instanceof APIError) {
    return {
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      },
    };
  }

  if (error instanceof ValidationError) {
    return {
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.errors,
      },
    };
  }

  if (error instanceof Error) {
    return {
      error: {
        message: error.message,
        statusCode: 500,
      },
    };
  }

  return {
    error: {
      message: 'An unexpected error occurred',
      statusCode: 500,
    },
  };
}

// Error Logger
export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString();
  const contextStr = context ? `[${context}] ` : '';
  
  console.error(`${timestamp} ${contextStr}Error:`, error);
  
  if (error instanceof Error) {
    console.error('Stack trace:', error.stack);
  }
}

// Check if error is retryable
export function isRetryableError(error: unknown): boolean {
  if (error instanceof APIError) {
    // Retry on server errors and rate limits
    return error.statusCode >= 500 || error.statusCode === 429;
  }
  
  if (error instanceof Error) {
    // Retry on network errors
    return (
      error.message.includes('network') ||
      error.message.includes('timeout') ||
      error.message.includes('ECONNREFUSED')
    );
  }
  
  return false;
}

