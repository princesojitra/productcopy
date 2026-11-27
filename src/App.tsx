import { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { generateInputSchema } from '@shared/schemas';
import type { GenerateInputFields, GenerateSuccessResponse } from '@shared/types';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ProductInputForm } from '@/components/ProductInputForm';
import { ResultsPanel } from '@/components/ResultsPanel';
import { ApiRequestError, generateProductCopy } from '@/lib/api';
import { SAMPLE_PRODUCT } from '@/lib/samples';

const FIELD_ORDER = [
  'productName',
  'brandOrCategory',
  'targetAudience',
  'details',
] as const;

function focusFirstInvalidField(errors: Record<string, string>) {
  const firstKey = FIELD_ORDER.find((key) => Boolean(errors[key]));
  if (!firstKey) return;

  window.requestAnimationFrame(() => {
    const el = document.querySelector<HTMLElement>(
      `[name="${firstKey}"]`,
    );
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.focus({ preventScroll: true });
  });
}

function createRandomSeed(): number {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return (buf[0] % 999_999) + 1;
  }
  return Math.floor(Math.random() * 999_999) + 1;
}

const INITIAL_FIELDS: GenerateInputFields = {
  productName: '',
  brandOrCategory: '',
  targetAudience: '',
  details: '',
  tone: 'professional',
  language: 'en',
};

export function App() {
  const [fields, setFields] = useState<GenerateInputFields>(INITIAL_FIELDS);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerateSuccessResponse | null>(null);
  const [variationSeed, setVariationSeed] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorRetryable, setErrorRetryable] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      abortRef.current?.abort();
    };
  }, [imagePreviewUrl]);

  const handleFieldChange = <K extends keyof GenerateInputFields>(
    key: K,
    value: GenerateInputFields[K],
  ) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setVariationSeed(0);
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSelectImage = (file: File | null, validationError?: string) => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }

    if (validationError) {
      setImageFile(null);
      setFieldErrors((prev) => ({ ...prev, image: validationError }));
      return;
    }

    setFieldErrors((prev) => {
      if (!prev.image) return prev;
      const next = { ...prev };
      delete next.image;
      return next;
    });

    setImageFile(file);
    setVariationSeed(0);
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleLoadSample = () => {
    setFields(SAMPLE_PRODUCT);
    setVariationSeed(0);
    setFieldErrors({});
    setErrorMessage(null);
    toast.info('Sample product loaded');
  };

  const handleReset = () => {
    abortRef.current?.abort();
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setFields(INITIAL_FIELDS);
    setImageFile(null);
    setImagePreviewUrl(null);
    setFieldErrors({});
    setResult(null);
    setVariationSeed(0);
    setErrorMessage(null);
  };

  const runGeneration = async (isRegenerate = false) => {
    const nextVariationCount = isRegenerate ? variationSeed + 1 : 0;
    const requestSeed = createRandomSeed();
    const validation = generateInputSchema.safeParse({
      ...fields,
      variationSeed: requestSeed,
      previousTitle: isRegenerate ? result?.data.productTitle ?? '' : '',
    });
    if (!validation.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string' && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      focusFirstInvalidField(nextErrors);
      toast.error('Please review the highlighted form fields.');
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setFieldErrors({});
    setErrorMessage(null);
    setIsGenerating(true);

    try {
      const response = await generateProductCopy(
        validation.data,
        imageFile,
        controller.signal,
      );
      setResult(response);
      setVariationSeed(nextVariationCount);
      toast.success(
        isRegenerate ? 'Fresh variation generated' : 'Product copy generated',
      );
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      if (err instanceof ApiRequestError) {
        if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors);
          focusFirstInvalidField(err.fieldErrors);
        }
        setErrorMessage(err.message);
        setErrorRetryable(err.retryable);
        toast.error(err.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please retry.');
        setErrorRetryable(true);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const hasContent = Boolean(
    fields.productName ||
      fields.brandOrCategory ||
      fields.targetAudience ||
      fields.details ||
      imageFile ||
      result,
  );

  return (
    <div className="flex min-h-screen flex-col text-foreground">
      <Toaster position="bottom-right" richColors />

      <Header
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        hasContent={hasContent}
        isGenerating={isGenerating}
      />

      <HeroSection />

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-12 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          <div className="lg:col-span-5 xl:col-span-4">
            <ProductInputForm
              fields={fields}
              imageFile={imageFile}
              imagePreviewUrl={imagePreviewUrl}
              fieldErrors={fieldErrors}
              isGenerating={isGenerating}
              onFieldChange={handleFieldChange}
              onSelectImage={handleSelectImage}
              onSubmit={() => runGeneration(false)}
            />
          </div>

          <div className="lg:col-span-7 xl:col-span-8">
            <ResultsPanel
              result={result}
              variationSeed={variationSeed}
              isGenerating={isGenerating}
              errorMessage={errorMessage}
              errorRetryable={errorRetryable}
              brandOrCategory={fields.brandOrCategory}
              imagePreviewUrl={imagePreviewUrl}
              onRetry={() => runGeneration(Boolean(result))}
              onRegenerate={() => runGeneration(true)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
