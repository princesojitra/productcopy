import type { GenerateErrorPayload, GenerateErrorResponse } from '@shared/types';

export class WorkerAppError extends Error {
  public readonly statusCode: number;
  public readonly code: GenerateErrorPayload['code'];
  public readonly retryable: boolean;
  public readonly fieldErrors?: Record<string, string>;

  constructor(params: {
    statusCode: number;
    code: GenerateErrorPayload['code'];
    message: string;
    retryable: boolean;
    fieldErrors?: Record<string, string>;
  }) {
    super(params.message);
    this.name = 'WorkerAppError';
    this.statusCode = params.statusCode;
    this.code = params.code;
    this.retryable = params.retryable;
    this.fieldErrors = params.fieldErrors;
  }
}

export function createErrorResponse(
  error: unknown,
  headers: HeadersInit,
): Response {
  if (error instanceof WorkerAppError) {
    const body: GenerateErrorResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
        retryable: error.retryable,
      },
    };
    return new Response(JSON.stringify(body), {
      status: error.statusCode,
      headers,
    });
  }

  const fallbackBody: GenerateErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred while generating product copy.',
      retryable: true,
    },
  };

  return new Response(JSON.stringify(fallbackBody), {
    status: 500,
    headers,
  });
}
