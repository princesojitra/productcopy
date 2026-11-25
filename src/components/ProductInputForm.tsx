import { useId, type FormEvent } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import type { GenerateInputFields, Language, Tone } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploadField } from '@/components/ImageUploadField';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ToneSelector } from '@/components/ToneSelector';

interface ProductInputFormProps {
  fields: GenerateInputFields;
  imageFile: File | null;
  imagePreviewUrl: string | null;
  fieldErrors: Record<string, string>;
  isGenerating: boolean;
  onFieldChange: <K extends keyof GenerateInputFields>(
    key: K,
    value: GenerateInputFields[K],
  ) => void;
  onSelectImage: (file: File | null, validationError?: string) => void;
  onSubmit: () => void;
}

export function ProductInputForm({
  fields,
  imageFile,
  imagePreviewUrl,
  fieldErrors,
  isGenerating,
  onFieldChange,
  onSelectImage,
  onSubmit,
}: ProductInputFormProps) {
  const productNameId = useId();
  const brandId = useId();
  const audienceId = useId();
  const detailsId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/90 shadow-[0_6px_28px_-10px_rgba(15,23,42,0.1)] lg:sticky lg:top-[4.25rem] lg:max-h-[calc(100vh-7.5rem)]">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600 font-mono text-[10px] font-bold text-white">
            1
          </span>
          <span className="font-display text-xs font-bold tracking-tight text-slate-900">
            Product Brief
          </span>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
          Facts stay strict
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex-1 space-y-3.5 overflow-y-auto p-4 sm:p-5">
          {/* Core Identity Section */}
          <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label
                  htmlFor={productNameId}
                  className="text-[13px] font-semibold text-slate-900"
                >
                  Product Name <span className="text-rose-600">*</span>
                </Label>
                <span className="font-mono text-[10px] text-slate-400">
                  {fields.productName.length}/120
                </span>
              </div>
              <Input
                id={productNameId}
                name="productName"
                value={fields.productName}
                onChange={(e) => onFieldChange('productName', e.target.value)}
                placeholder="e.g., Hand-Hammered Kansa Espresso Cup Set"
                maxLength={120}
                disabled={isGenerating}
                className="h-9 rounded-lg border-slate-200 bg-slate-50/60 text-sm text-slate-900 shadow-none focus-visible:border-indigo-500 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-indigo-500/30 aria-[invalid=true]:border-rose-400 aria-[invalid=true]:focus-visible:border-rose-500 aria-[invalid=true]:focus-visible:ring-1 aria-[invalid=true]:focus-visible:ring-rose-500/35"
                aria-invalid={Boolean(fieldErrors.productName)}
                aria-describedby={
                  fieldErrors.productName ? `${productNameId}-error` : undefined
                }
              />
              {fieldErrors.productName && (
                <p
                  id={`${productNameId}-error`}
                  className="text-xs font-medium text-destructive"
                  role="alert"
                >
                  {fieldErrors.productName}
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor={brandId}
                  className="text-[13px] font-semibold text-slate-900"
                >
                  Brand / Category
                </Label>
                <Input
                  id={brandId}
                  name="brandOrCategory"
                  value={fields.brandOrCategory ?? ''}
                  onChange={(e) => onFieldChange('brandOrCategory', e.target.value)}
                  placeholder="e.g., Aarav Craft"
                  maxLength={80}
                  disabled={isGenerating}
                  className="h-9 rounded-lg border-slate-200 bg-slate-50/60 text-sm text-slate-900 shadow-none focus-visible:border-indigo-500 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-indigo-500/30 aria-[invalid=true]:border-rose-400 aria-[invalid=true]:focus-visible:border-rose-500 aria-[invalid=true]:focus-visible:ring-1 aria-[invalid=true]:focus-visible:ring-rose-500/35"
                  aria-invalid={Boolean(fieldErrors.brandOrCategory)}
                />
                {fieldErrors.brandOrCategory && (
                  <p className="text-xs font-medium text-destructive" role="alert">
                    {fieldErrors.brandOrCategory}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor={audienceId}
                  className="text-[13px] font-semibold text-slate-900"
                >
                  Target Audience
                </Label>
                <Input
                  id={audienceId}
                  name="targetAudience"
                  value={fields.targetAudience ?? ''}
                  onChange={(e) => onFieldChange('targetAudience', e.target.value)}
                  placeholder="e.g., Home baristas"
                  maxLength={160}
                  disabled={isGenerating}
                  className="h-9 rounded-lg border-slate-200 bg-slate-50/60 text-sm text-slate-900 shadow-none focus-visible:border-indigo-500 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-indigo-500/30 aria-[invalid=true]:border-rose-400 aria-[invalid=true]:focus-visible:border-rose-500 aria-[invalid=true]:focus-visible:ring-1 aria-[invalid=true]:focus-visible:ring-rose-500/35"
                  aria-invalid={Boolean(fieldErrors.targetAudience)}
                />
                {fieldErrors.targetAudience && (
                  <p className="text-xs font-medium text-destructive" role="alert">
                    {fieldErrors.targetAudience}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label
                  htmlFor={detailsId}
                  className="text-[13px] font-semibold text-slate-900"
                >
                  Verified Product Facts <span className="text-rose-600">*</span>
                </Label>
                <span className="font-mono text-[10px] text-slate-400">
                  {fields.details.length}/3000
                </span>
              </div>
              <Textarea
                id={detailsId}
                name="details"
                value={fields.details}
                onChange={(e) => onFieldChange('details', e.target.value)}
                placeholder="Materials, capacity, dimensions, included items, care instructions, pricing..."
                maxLength={3000}
                rows={3}
                disabled={isGenerating}
                className="min-h-[84px] rounded-lg border-slate-200 bg-slate-50/60 text-sm text-slate-900 shadow-none focus-visible:border-indigo-500 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-indigo-500/30 aria-[invalid=true]:border-rose-400 aria-[invalid=true]:focus-visible:border-rose-500 aria-[invalid=true]:focus-visible:ring-1 aria-[invalid=true]:focus-visible:ring-rose-500/35"
                aria-invalid={Boolean(fieldErrors.details)}
                aria-describedby={fieldErrors.details ? `${detailsId}-error` : undefined}
              />
              {fieldErrors.details && (
                <p
                  id={`${detailsId}-error`}
                  className="text-xs font-medium text-destructive"
                  role="alert"
                >
                  {fieldErrors.details}
                </p>
              )}
            </div>
          </div>

          {/* Photo Section */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <ImageUploadField
              imageFile={imageFile}
              previewUrl={imagePreviewUrl}
              error={fieldErrors.image}
              disabled={isGenerating}
              onSelectImage={onSelectImage}
            />
          </div>

          {/* Tone & Language Section */}
          <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <ToneSelector
              value={fields.tone}
              onChange={(tone: Tone) => onFieldChange('tone', tone)}
              disabled={isGenerating}
            />

            <LanguageSelector
              value={fields.language}
              onChange={(language: Language) => onFieldChange('language', language)}
              disabled={isGenerating}
            />
          </div>
        </div>

        {/* Pinned CTA Footer */}
        <div className="shrink-0 border-t border-slate-200/80 bg-white px-4 py-3 sm:px-5">
          <Button
            type="submit"
            className="h-10 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold text-white shadow-sm shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Writing copy…</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Content</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
