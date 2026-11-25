import { Package, ShoppingBag } from 'lucide-react';
import { CopyInlineButton } from '@/components/CopyInlineButton';

interface StorefrontPreviewCardProps {
  productTitle: string;
  shortDescription: string;
  longDescription: string;
  brandOrCategory?: string;
  imagePreviewUrl?: string | null;
}

export function StorefrontPreviewCard({
  productTitle,
  shortDescription,
  longDescription,
  brandOrCategory,
  imagePreviewUrl,
}: StorefrontPreviewCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/90 shadow-[0_6px_28px_-10px_rgba(15,23,42,0.08)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 bg-white px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
            <ShoppingBag className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="font-display text-xs font-bold text-slate-900">
              Storefront Listing Copy
            </span>
            <span className="ml-2 hidden text-[11px] text-slate-500 sm:inline">
              For your website, Shopify, or marketplace page
            </span>
          </div>
        </div>
        <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-mono text-[10px] font-medium text-indigo-700">
          3 fields
        </span>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        {/* Top Row: Photo + Title + Short Description */}
        <div className="grid gap-3 md:grid-cols-12">
          <div className="min-w-0 md:col-span-4">
            {imagePreviewUrl ? (
              <div className="aspect-square overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <img
                  src={imagePreviewUrl}
                  alt={productTitle}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center">
                <Package className="mb-2 h-7 w-7 text-indigo-400" />
                <span className="text-[11px] font-medium text-slate-500">
                  No product photo attached
                </span>
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-3 md:col-span-8">
            {/* 1. Product Title */}
            <div
              data-testid="output-card-product-title"
              className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
            >
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[13px] font-semibold text-slate-900">
                      Product Title
                    </h3>
                    <span className="font-mono text-[10px] text-slate-400">
                      {productTitle.length} chars
                    </span>
                    {brandOrCategory?.trim() && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                        {brandOrCategory.trim()}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Main headline shown at the top of your product page
                  </p>
                </div>
                <CopyInlineButton
                  id="product-title"
                  label="Product Title"
                  text={productTitle}
                />
              </div>
              <p className="font-display text-base font-bold leading-snug text-slate-950 sm:text-lg">
                {productTitle}
              </p>
            </div>

            {/* 2. Short Description */}
            <div
              data-testid="output-card-short-description"
              className="flex-1 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
            >
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-semibold text-slate-900">
                      Short Description
                    </h3>
                    <span className="font-mono text-[10px] text-slate-400">
                      {shortDescription.length} chars
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Quick pitch shown beside price &amp; Buy button
                  </p>
                </div>
                <CopyInlineButton
                  id="short-description"
                  label="Short Description"
                  text={shortDescription}
                />
              </div>
              <p className="text-sm leading-relaxed text-slate-800">
                {shortDescription}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Long Description */}
        <div
          data-testid="output-card-long-description"
          className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-semibold text-slate-900">
                  Long Description
                </h3>
                <span className="font-mono text-[10px] text-slate-400">
                  {longDescription.length} chars
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Full product story, specs &amp; care details below the fold
              </p>
            </div>
            <CopyInlineButton
              id="long-description"
              label="Long Description"
              text={longDescription}
            />
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
            {longDescription}
          </div>
        </div>
      </div>
    </div>
  );
}
