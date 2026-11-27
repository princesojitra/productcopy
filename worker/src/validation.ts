import { generateInputSchema } from '@shared/schemas';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
  type AllowedImageMimeType,
  type GenerateInputFields,
} from '@shared/types';
import { WorkerAppError } from './errors';

const MAX_MULTIPART_CONTENT_LENGTH = 5 * 1024 * 1024; // 5 MB overall body cap

export interface ValidatedImagePayload {
  base64Data: string;
  mimeType: AllowedImageMimeType;
  byteLength: number;
}

export interface ParsedGenerateRequest {
  fields: GenerateInputFields;
  image?: ValidatedImagePayload;
}

export function detectImageSignature(
  bytes: Uint8Array,
): AllowedImageMimeType | null {
  if (bytes.length < 12) {
    return null;
  }

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'image/png';
  }

  // WebP: "RIFF" .... "WEBP"
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp';
  }

  return null;
}

export function uint8ArrayToBase64(bytes: Uint8Array): string {
  const chunkSize = 0x8000; // 32 KB chunks avoid call-stack limits
  const chunks: string[] = [];
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = bytes.subarray(i, i + chunkSize);
    chunks.push(String.fromCharCode(...slice));
  }
  return btoa(chunks.join(''));
}

interface UploadedFileLike {
  size: number;
  type: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

function isUploadedFile(value: unknown): value is UploadedFileLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    'size' in value &&
    typeof (value as UploadedFileLike).size === 'number' &&
    'type' in value &&
    typeof (value as UploadedFileLike).type === 'string' &&
    'arrayBuffer' in value &&
    typeof (value as UploadedFileLike).arrayBuffer === 'function'
  );
}

function getFormText(formData: FormData, key: string): string {
  const value = formData.get(key) as unknown;
  return typeof value === 'string' ? value : '';
}

export async function parseAndValidateGenerateRequest(
  request: Request,
): Promise<ParsedGenerateRequest> {
  const contentLengthHeader = request.headers.get('content-length');
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (!Number.isNaN(contentLength) && contentLength > MAX_MULTIPART_CONTENT_LENGTH) {
      throw new WorkerAppError({
        statusCode: 413,
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request payload is too large. Keep uploaded images under 4 MB.',
        retryable: false,
      });
    }
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('multipart/form-data')) {
    throw new WorkerAppError({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Requests to /api/generate must use multipart/form-data.',
      retryable: false,
    });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    throw new WorkerAppError({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Unable to parse multipart form data.',
      retryable: false,
    });
  }

  const rawVariation = getFormText(formData, 'variationSeed');
  const rawFields = {
    productName: getFormText(formData, 'productName'),
    brandOrCategory: getFormText(formData, 'brandOrCategory'),
    targetAudience: getFormText(formData, 'targetAudience'),
    details: getFormText(formData, 'details'),
    tone: getFormText(formData, 'tone'),
    language: getFormText(formData, 'language'),
    ...(rawVariation ? { variationSeed: Number(rawVariation) } : {}),
    previousTitle: getFormText(formData, 'previousTitle'),
  };

  const parsedFields = generateInputSchema.safeParse(rawFields);
  if (!parsedFields.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsedFields.error.issues) {
      const pathKey = issue.path[0];
      if (typeof pathKey === 'string' && !fieldErrors[pathKey]) {
        fieldErrors[pathKey] = issue.message;
      }
    }
    throw new WorkerAppError({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Please fix the highlighted product input fields.',
      fieldErrors,
      retryable: false,
    });
  }

  const maybeImage = formData.get('image') as unknown;
  let validatedImage: ValidatedImagePayload | undefined;

  if (isUploadedFile(maybeImage) && maybeImage.size > 0) {
    if (maybeImage.size > MAX_IMAGE_BYTES) {
      throw new WorkerAppError({
        statusCode: 413,
        code: 'INVALID_IMAGE',
        message: 'Uploaded image exceeds the 4 MB maximum size limit.',
        fieldErrors: { image: 'Image must be 4 MB or smaller.' },
        retryable: false,
      });
    }

    const declaredMime = maybeImage.type as AllowedImageMimeType;
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(declaredMime)) {
      throw new WorkerAppError({
        statusCode: 400,
        code: 'INVALID_IMAGE',
        message: 'Unsupported image format. Upload a JPEG, PNG, or WebP image.',
        fieldErrors: { image: 'Only JPEG, PNG, and WebP images are supported.' },
        retryable: false,
      });
    }

    const bytes = new Uint8Array(await maybeImage.arrayBuffer());
    const detectedMime = detectImageSignature(bytes);
    if (!detectedMime) {
      throw new WorkerAppError({
        statusCode: 400,
        code: 'INVALID_IMAGE',
        message: 'The uploaded file is not a valid JPEG, PNG, or WebP image.',
        fieldErrors: { image: 'Invalid or corrupted image file.' },
        retryable: false,
      });
    }

    validatedImage = {
      base64Data: uint8ArrayToBase64(bytes),
      mimeType: detectedMime,
      byteLength: bytes.byteLength,
    };
  }

  return {
    fields: parsedFields.data,
    image: validatedImage,
  };
}
