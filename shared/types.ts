export const TONE_VALUES = ['luxury', 'professional', 'friendly', 'minimal'] as const;
export type Tone = (typeof TONE_VALUES)[number];

export const LANGUAGE_VALUES = ['en', 'hi', 'gu'] as const;
export type Language = (typeof LANGUAGE_VALUES)[number];

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;
export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB

export interface ToneOption {
  value: Tone;
  label: string;
  description: string;
}

export interface LanguageOption {
  value: Language;
  label: string;
  nativeLabel: string;
}

export const TONE_OPTIONS: readonly ToneOption[] = [
  {
    value: 'luxury',
    label: 'Luxury',
    description: 'Refined, sensory, elevated craftsmanship',
  },
  {
    value: 'professional',
    label: 'Professional',
    description: 'Clear, credible, benefit-structured',
  },
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Warm, conversational, relatable',
  },
  {
    value: 'minimal',
    label: 'Minimal',
    description: 'Crisp, pared-back, zero fluff',
  },
] as const;

export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { value: 'en', label: 'English', nativeLabel: 'English' },
  { value: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { value: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
] as const;

export interface GenerateInputFields {
  productName: string;
  brandOrCategory?: string;
  targetAudience?: string;
  details: string;
  tone: Tone;
  language: Language;
  variationSeed?: number;
  previousTitle?: string;
}

export interface GroundingNotes {
  userFactsUsed: string[];
  visualObservations: string[];
  caveats: string[];
}

export interface GeneratedCopy {
  productTitle: string;
  shortDescription: string;
  longDescription: string;
  seoTitle: string;
  seoMetaDescription: string;
  instagramCaption: string;
  whatsappMessage: string;
  groundingNotes: GroundingNotes;
}

export interface GenerateResponseMeta {
  model: string;
  language: Language;
  tone: Tone;
  imageAnalyzed: boolean;
  generatedAt: string;
}

export interface GenerateSuccessResponse {
  success: true;
  data: GeneratedCopy;
  meta: GenerateResponseMeta;
}

export interface GenerateErrorPayload {
  code:
    | 'VALIDATION_ERROR'
    | 'INVALID_IMAGE'
    | 'PAYLOAD_TOO_LARGE'
    | 'RATE_LIMITED'
    | 'UPSTREAM_TIMEOUT'
    | 'UPSTREAM_ERROR'
    | 'CONFIG_ERROR'
    | 'INVALID_AI_OUTPUT'
    | 'INTERNAL_ERROR';
  message: string;
  fieldErrors?: Record<string, string>;
  retryable: boolean;
}

export interface GenerateErrorResponse {
  success: false;
  error: GenerateErrorPayload;
}

export type GenerateApiResponse = GenerateSuccessResponse | GenerateErrorResponse;
