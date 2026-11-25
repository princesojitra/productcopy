import type { GenerateSuccessResponse } from '@shared/types';
import { createErrorResponse, WorkerAppError } from './errors';
import { generateCopyWithGemini } from './gemini';
import { parseAndValidateGenerateRequest } from './validation';

export interface Env {
  ASSETS?: Fetcher;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  ALLOWED_ORIGIN?: string;
}

function buildSecurityHeaders(request: Request, env: Env): Headers {
  const headers = new Headers();
  const allowedOrigin = (env.ALLOWED_ORIGIN || '*').trim();
  const requestOrigin = request.headers.get('Origin');

  if (allowedOrigin === '*') {
    headers.set('Access-Control-Allow-Origin', '*');
  } else if (
    requestOrigin &&
    allowedOrigin
      .split(',')
      .map((o) => o.trim())
      .includes(requestOrigin)
  ) {
    headers.set('Access-Control-Allow-Origin', requestOrigin);
    headers.set('Vary', 'Origin');
  } else {
    headers.set('Access-Control-Allow-Origin', allowedOrigin.split(',')[0].trim());
  }

  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Cache-Control', 'no-store');
  headers.set('Content-Type', 'application/json; charset=utf-8');
  return headers;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (!url.pathname.startsWith('/api/') && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    const headers = buildSecurityHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (url.pathname === '/api/health' && request.method === 'GET') {
      return new Response(
        JSON.stringify({
          ok: true,
          service: 'productcopy-worker',
          configured: Boolean(env.GEMINI_API_KEY?.trim()),
        }),
        { status: 200, headers },
      );
    }

    if (url.pathname === '/api/generate') {
      if (request.method !== 'POST') {
        return createErrorResponse(
          new WorkerAppError({
            statusCode: 405,
            code: 'VALIDATION_ERROR',
            message: 'Method not allowed. Use POST /api/generate.',
            retryable: false,
          }),
          headers,
        );
      }

      try {
        const parsed = await parseAndValidateGenerateRequest(request);
        const { data, model } = await generateCopyWithGemini({
          apiKey: env.GEMINI_API_KEY ?? '',
          model: env.GEMINI_MODEL,
          fields: parsed.fields,
          image: parsed.image,
        });

        const payload: GenerateSuccessResponse = {
          success: true,
          data,
          meta: {
            model,
            language: parsed.fields.language,
            tone: parsed.fields.tone,
            imageAnalyzed: Boolean(parsed.image),
            generatedAt: new Date().toISOString(),
          },
        };

        return new Response(JSON.stringify(payload), { status: 200, headers });
      } catch (err) {
        return createErrorResponse(err, headers);
      }
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Route not found.',
          retryable: false,
        },
      }),
      { status: 404, headers },
    );
  },
};
