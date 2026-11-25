import type { GeneratedCopy } from '@shared/types';

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below if clipboard permission is restricted
    }
  }

  if (typeof document === 'undefined') return false;

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

export function formatAllCopySections(copy: GeneratedCopy): string {
  return [
    'PRODUCT TITLE',
    copy.productTitle,
    '',
    'SHORT DESCRIPTION',
    copy.shortDescription,
    '',
    'LONG DESCRIPTION',
    copy.longDescription,
    '',
    'SEO TITLE',
    copy.seoTitle,
    '',
    'SEO META DESCRIPTION',
    copy.seoMetaDescription,
    '',
    'INSTAGRAM CAPTION',
    copy.instagramCaption,
    '',
    'WHATSAPP MARKETING MESSAGE',
    copy.whatsappMessage,
  ].join('\n');
}
