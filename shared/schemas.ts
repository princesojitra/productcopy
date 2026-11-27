import { z } from 'zod';
import { LANGUAGE_VALUES, TONE_VALUES } from './types';

export const generateInputSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(2, 'Product name must be at least 2 characters.')
    .max(120, 'Product name must be 120 characters or fewer.'),
  brandOrCategory: z
    .string()
    .trim()
    .max(80, 'Brand or category must be 80 characters or fewer.')
    .optional()
    .or(z.literal('')),
  targetAudience: z
    .string()
    .trim()
    .max(160, 'Target audience must be 160 characters or fewer.')
    .optional()
    .or(z.literal('')),
  details: z
    .string()
    .trim()
    .min(10, 'Provide at least 10 characters of factual product details.')
    .max(3000, 'Product details must be 3000 characters or fewer.'),
  tone: z.enum(TONE_VALUES, {
    errorMap: () => ({ message: 'Select a valid tone.' }),
  }),
  language: z.enum(LANGUAGE_VALUES, {
    errorMap: () => ({ message: 'Select a valid language.' }),
  }),
  variationSeed: z.coerce.number().int().min(0).max(1_000_000_000).optional(),
  previousTitle: z.string().trim().max(200).optional().or(z.literal('')),
});

export const groundingNotesSchema = z.object({
  userFactsUsed: z.array(z.string().trim().min(1)).default([]),
  visualObservations: z.array(z.string().trim().min(1)).default([]),
  caveats: z.array(z.string().trim().min(1)).default([]),
});

export const generatedCopySchema = z.object({
  productTitle: z.string().trim().min(1, 'Product title is required.'),
  shortDescription: z.string().trim().min(1, 'Short description is required.'),
  longDescription: z.string().trim().min(1, 'Long description is required.'),
  seoTitle: z.string().trim().min(1, 'SEO title is required.'),
  seoMetaDescription: z.string().trim().min(1, 'SEO meta description is required.'),
  instagramCaption: z.string().trim().min(1, 'Instagram caption is required.'),
  whatsappMessage: z.string().trim().min(1, 'WhatsApp message is required.'),
  groundingNotes: groundingNotesSchema,
});

export type ValidatedGenerateInput = z.infer<typeof generateInputSchema>;
export type ValidatedGeneratedCopy = z.infer<typeof generatedCopySchema>;
