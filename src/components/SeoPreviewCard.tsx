import { useEffect, useState } from 'react';
import { Globe, Search } from 'lucide-react';
import { CopyInlineButton } from '@/components/CopyInlineButton';
import { cn } from '@/lib/utils';

interface SeoPreviewCardProps {
  seoTitle: string;
  seoMetaDescription: string;
  brandOrCategory?: string;
}

export function SeoPreviewCard({
  seoTitle,
  seoMetaDescription,
  brandOrCategory,
}: SeoPreviewCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, [seoTitle, seoMetaDescription]);

  const titleRatio = Math.min(100, Math.round((seoTitle.length / 60) * 100));
  const metaRatio = Math.min(
    100,
    Math.round((seoMetaDescription.length / 155) * 100),
  );
  const titleOver = seoTitle.length > 60;
  const metaOver = seoMetaDescription.length > 155;
  const slug =
    (brandOrCategory || 'store')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 18) || 'store';

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/90 shadow-[0_6px_28px_-10px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 bg-white px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-50 text-sky-600">
            <Search className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="font-display text-xs font-bold text-slate-900">
              Google Search (SEO)
            </span>
            <span className="ml-2 hidden text-[11px] text-slate-500 sm:inline">
              For search engines &amp; shared link previews
            </span>
          </div>
        </div>
        <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-medium text-sky-700">
          2 fields
        </span>
      </div>

      <div className="grid gap-3 p-4 sm:p-5 lg:grid-cols-12">
        {/* Live SERP Visual Preview */}
        <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] lg:col-span-5">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Live Google Preview
          </p>
          <div className="rounded-lg border border-slate-200/70 bg-slate-50/70 p-3">
            <div className="mb-2 flex min-w-0 items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200">
                <Globe className="h-3 w-3" />
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-xs font-medium text-slate-800">
                  {brandOrCategory?.trim() || 'Your Store'}
                </p>
                <p className="truncate text-[11px] text-emerald-700">
                  https://{slug}.com › products › featured
                </p>
              </div>
            </div>
            <p className="line-clamp-2 break-words text-[15px] font-medium leading-snug text-[#1A0DAB]">
              {seoTitle}
            </p>
            <p className="mt-1 line-clamp-3 break-words text-xs leading-relaxed text-[#4D5156]">
              {seoMetaDescription}
            </p>
          </div>
        </div>

        {/* Copyable SEO Title & Meta Description Rows */}
        <div className="min-w-0 space-y-3 lg:col-span-7">
          <div
            data-testid="output-card-seo-title"
            className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
          >
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] font-semibold text-slate-900">
                    SEO Title
                  </h3>
                  <span
                    className={cn(
                      'rounded px-1.5 py-0.5 font-mono text-[10px] font-medium',
                      titleOver
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700',
                    )}
                  >
                    {seoTitle.length}/60 chars
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Clickable blue headline shown in Google search results
                </p>
              </div>
              <CopyInlineButton id="seo-title" label="SEO Title" text={seoTitle} />
            </div>
            <p className="text-sm font-medium text-slate-900">{seoTitle}</p>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700 ease-out',
                  titleOver ? 'bg-amber-500' : 'bg-emerald-500',
                )}
                style={{ width: mounted ? `${titleRatio}%` : '0%' }}
              />
            </div>
          </div>

          <div
            data-testid="output-card-seo-meta-description"
            className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
          >
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] font-semibold text-slate-900">
                    SEO Meta Description
                  </h3>
                  <span
                    className={cn(
                      'rounded px-1.5 py-0.5 font-mono text-[10px] font-medium',
                      metaOver
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700',
                    )}
                  >
                    {seoMetaDescription.length}/155 chars
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Short summary displayed beneath your link on Google
                </p>
              </div>
              <CopyInlineButton
                id="seo-meta-description"
                label="SEO Meta Description"
                text={seoMetaDescription}
              />
            </div>
            <p className="text-sm leading-relaxed text-slate-800">
              {seoMetaDescription}
            </p>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700 ease-out',
                  metaOver ? 'bg-amber-500' : 'bg-emerald-500',
                )}
                style={{ width: mounted ? `${metaRatio}%` : '0%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
