import { describe, expect, it } from 'vitest';
import { generateInputSchema } from '../shared/schemas';
import { formatAllCopySections } from '../src/lib/clipboard';
import { extractAndValidateGeminiCopy } from '../worker/src/gemini';
import {
  detectImageSignature,
  parseAndValidateGenerateRequest,
  uint8ArrayToBase64,
} from '../worker/src/validation';
import { WorkerAppError } from '../worker/src/errors';

describe('ProductCopy validation & utilities', () => {
  it('validates valid product input across tones and languages', () => {
    const parsed = generateInputSchema.safeParse({
      productName: 'Handwoven Cotton Throw',
      brandOrCategory: 'Loom & Clay',
      targetAudience: 'Home decor shoppers',
      details: '100% organic cotton throw blanket, 130x180 cm, hand-knotted tassels.',
      tone: 'minimal',
      language: 'gu',
    });

    expect(parsed.success).toBe(true);
  });

  it('rejects too-short product names and details', () => {
    const parsed = generateInputSchema.safeParse({
      productName: 'A',
      details: 'short',
      tone: 'luxury',
      language: 'en',
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('detects PNG, JPEG, and WebP magic bytes and rejects spoofed files', () => {
    const pngBytes = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13,
    ]);
    const jpegBytes = new Uint8Array([
      0xff, 0xd8, 0xff, 0xe0, 0, 16, 0x4a, 0x46, 0x49, 0x46, 0, 1,
    ]);
    const webpBytes = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0, 0, 0, 0x57, 0x45, 0x42, 0x50,
    ]);
    const textBytes = new TextEncoder().encode('<svg>not-an-image</svg>');

    expect(detectImageSignature(pngBytes)).toBe('image/png');
    expect(detectImageSignature(jpegBytes)).toBe('image/jpeg');
    expect(detectImageSignature(webpBytes)).toBe('image/webp');
    expect(detectImageSignature(textBytes)).toBeNull();
  });

  it('encodes Uint8Array to base64 accurately', () => {
    const bytes = new TextEncoder().encode('ProductCopy');
    expect(uint8ArrayToBase64(bytes)).toBe('UHJvZHVjdENvcHk=');
  });

  it('rejects spoofed image upload in multipart request', async () => {
    const form = new FormData();
    form.append('productName', 'Ceramic Mug');
    form.append('details', 'Matte ceramic coffee mug, 320 ml capacity, dishwasher safe.');
    form.append('tone', 'friendly');
    form.append('language', 'hi');
    form.append(
      'image',
      new File(['not actually a png'], 'fake.png', { type: 'image/png' }),
    );

    const req = new Request('http://localhost/api/generate', {
      method: 'POST',
      body: form,
    });

    await expect(parseAndValidateGenerateRequest(req)).rejects.toBeInstanceOf(
      WorkerAppError,
    );
  });

  it('validates structured Gemini JSON output and formats Copy All cleanly', () => {
    const raw = JSON.stringify({
      productTitle: 'Studio Ceramic Mug',
      shortDescription: '320 ml matte ceramic mug built for daily coffee.',
      longDescription: 'Crafted with a clean silhouette and 320 ml capacity.',
      seoTitle: 'Studio Ceramic Mug 320 ml | Matte Coffee Cup',
      seoMetaDescription:
        'Shop the 320 ml Studio Ceramic Mug with matte glaze finish for daily espresso or pour-over coffee.',
      instagramCaption: 'Morning coffee, pared back.\\n\\n#CeramicMug #CoffeeDaily',
      whatsappMessage: 'Studio Ceramic Mug (320 ml)\\n— reply here to order.',
      groundingNotes: {
        userFactsUsed: ['320 ml capacity', 'Matte ceramic'],
        visualObservations: [],
        caveats: ['Price not specified'],
      },
    });

    const parsed = extractAndValidateGeminiCopy(raw);
    expect(parsed.productTitle).toBe('Studio Ceramic Mug');
    expect(parsed.instagramCaption).not.toContain('\\n');
    expect(parsed.instagramCaption).toContain('\n\n#CeramicMug');

    const formatted = formatAllCopySections(parsed);
    expect(formatted).toContain('PRODUCT TITLE');
    expect(formatted).toContain('WHATSAPP MARKETING MESSAGE');
    expect(formatted).toContain('Studio Ceramic Mug (320 ml)');
  });
});
