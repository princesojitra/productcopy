import type {
  GenerateApiResponse,
  GenerateErrorPayload,
  GenerateInputFields,
  GenerateSuccessResponse,
} from '@shared/types';

export class ApiRequestError extends Error {
  public readonly code: GenerateErrorPayload['code'];
  public readonly retryable: boolean;
  public readonly fieldErrors?: Record<string, string>;

  constructor(payload: GenerateErrorPayload) {
    super(payload.message);
    this.name = 'ApiRequestError';
    this.code = payload.code;
    this.retryable = payload.retryable;
    this.fieldErrors = payload.fieldErrors;
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function generateProductCopy(
  fields: GenerateInputFields,
  imageFile?: File | null,
  signal?: AbortSignal,
): Promise<GenerateSuccessResponse> {
  const formData = new FormData();
  formData.append('productName', fields.productName.trim());
  formData.append('brandOrCategory', (fields.brandOrCategory ?? '').trim());
  formData.append('targetAudience', (fields.targetAudience ?? '').trim());
  formData.append('details', fields.details.trim());
  formData.append('tone', fields.tone);
  formData.append('language', fields.language);

  if (typeof fields.variationSeed === 'number' && fields.variationSeed > 0) {
    formData.append('variationSeed', String(fields.variationSeed));
  }
  if (fields.previousTitle?.trim()) {
    formData.append('previousTitle', fields.previousTitle.trim().slice(0, 200));
  }

  if (imageFile) {
    formData.append('image', imageFile);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      body: formData,
      signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    throw new ApiRequestError({
      code: 'UPSTREAM_ERROR',
      message:
        'Network error: could not reach the ProductCopy Worker API. Ensure the backend is running and retry.',
      retryable: true,
    });
  }

  let json: GenerateApiResponse;
  try {
    json = (await response.json()) as GenerateApiResponse;
  } catch {
    throw new ApiRequestError({
      code: 'INTERNAL_ERROR',
      message: `Unexpected server response (HTTP ${response.status}). Please retry.`,
      retryable: true,
    });
  }

  if (!response.ok || !json.success) {
    if (!json.success && json.error) {
      throw new ApiRequestError(json.error);
    }
    throw new ApiRequestError({
      code: 'INTERNAL_ERROR',
      message: `Generation failed with status ${response.status}.`,
      retryable: response.status >= 500,
    });
  }

  return json;
}
