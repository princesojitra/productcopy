import { useEffect, useState, type CSSProperties } from 'react';
import {
  AlertCircle,
  Check,
  CopyCheck,
  Instagram,
  Loader2,
  MessageCircle,
  RefreshCw,
  Search,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  LANGUAGE_OPTIONS,
  TONE_OPTIONS,
  type GenerateSuccessResponse,
} from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GroundingCard } from '@/components/GroundingCard';
import { SeoPreviewCard } from '@/components/SeoPreviewCard';
import { SocialChannelCards } from '@/components/SocialChannelCards';
import { StorefrontPreviewCard } from '@/components/StorefrontPreviewCard';
import { copyToClipboard, formatAllCopySections } from '@/lib/clipboard';
import { cn } from '@/lib/utils';

interface ResultsPanelProps {
  result: GenerateSuccessResponse | null;
  variationSeed?: number;
  isGenerating: boolean;
  errorMessage: string | null;
  errorRetryable: boolean;
  brandOrCategory?: string;
  imagePreviewUrl?: string | null;
  onRetry: () => void;
  onRegenerate: () => void;
}

type FilterGroup = 'all' | 'storefront' | 'seo' | 'social';

const FILTER_TABS: Array<{ id: FilterGroup; label: string }> = [
  { id: 'all', label: 'All Channels' },
  { id: 'storefront', label: 'Storefront' },
  { id: 'seo', label: 'Google SEO' },
  { id: 'social', label: 'Social & Chat' },
];

export function ResultsPanel({
  result,
  variationSeed = 0,
  isGenerating,
  errorMessage,
  errorRetryable,
  brandOrCategory,
  imagePreviewUrl,
  onRetry,
  onRegenerate,
}: ResultsPanelProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterGroup>('all');
  const [justGenerated, setJustGenerated] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  const generatedAt = result?.meta.generatedAt;

  useEffect(() => {
    if (!isGenerating) {
      setLoadingStage(0);
      return;
    }
    const t1 = window.setTimeout(() => setLoadingStage(1), 1800);
    const t2 = window.setTimeout(() => setLoadingStage(2), 4200);
    const t3 = window.setTimeout(() => setLoadingStage(3), 7000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [isGenerating]);

  useEffect(() => {
    if (!generatedAt) return;
    setJustGenerated(true);
    const timer = window.setTimeout(() => setJustGenerated(false), 2400);
    return () => window.clearTimeout(timer);
  }, [generatedAt]);

  useEffect(() => {
    if (!copiedAll) return;
    const timer = window.setTimeout(() => setCopiedAll(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copiedAll]);

  const handleCopyAll = async () => {
    if (!result) return;
    const ok = await copyToClipboard(formatAllCopySections(result.data));
    if (ok) {
      setCopiedAll(true);
      toast.success('Copied all 7 product copy sections');
    } else {
      toast.error('Clipboard permission unavailable');
    }
  };

  if (isGenerating) {
    const channelStages = [
      {
        title: 'Storefront Listing',
        subtitle: 'Product Title · Short & Long Copy',
        icon: ShoppingBag,
        iconBg: 'bg-indigo-50 text-indigo-600',
        activeAt: 0,
      },
      {
        title: 'Google Search (SEO)',
        subtitle: 'SEO Title (≤60) · Meta Description (≤155)',
        icon: Search,
        iconBg: 'bg-sky-50 text-sky-600',
        activeAt: 1,
      },
      {
        title: 'Instagram Caption',
        subtitle: 'Engaging post copy + relevant hashtags',
        icon: Instagram,
        iconBg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-violet-600 text-white',
        activeAt: 2,
      },
      {
        title: 'WhatsApp Message',
        subtitle: 'Scannable broadcast for direct chats',
        icon: MessageCircle,
        iconBg: 'bg-[#075E54] text-white',
        activeAt: 3,
      },
    ];

    return (
      <section aria-label="Generating product copy" className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-indigo-200/80 bg-white shadow-[0_6px_28px_-10px_rgba(79,70,229,0.16)]">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-foreground">
                  Writing your product copy…
                </p>
                <p className="text-xs text-muted-foreground">
                  Tailoring verified facts for Storefront, Google, Instagram, and WhatsApp.
                </p>
              </div>
            </div>

            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
              Usually takes 5–12s
            </span>
          </div>

          <div className="h-1 w-full overflow-hidden bg-indigo-100/70">
            <div className="h-full w-2/5 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500" />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/90 p-4 shadow-[0_6px_28px_-10px_rgba(15,23,42,0.08)] sm:p-5">
          {imagePreviewUrl && (
            <div className="mb-4 flex items-center gap-3.5 rounded-xl border border-indigo-200/70 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                <img
                  src={imagePreviewUrl}
                  alt="Analyzing uploaded product"
                  className="h-full w-full object-cover"
                />
                <div className="skeleton-shimmer absolute inset-0 opacity-45" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900">
                  Scanning your product photo for visible style cues
                </p>
                <p className="text-[11px] text-slate-500">
                  Extracting color, finish &amp; silhouette without inventing hidden specs
                </p>
              </div>
              <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 sm:inline-block">
                Photo attached
              </span>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {channelStages.map((stage) => {
              const Icon = stage.icon;
              const isDone = loadingStage > stage.activeAt;
              const isActive = loadingStage === stage.activeAt;

              return (
                <div
                  key={stage.title}
                  className={cn(
                    'rounded-xl border bg-white p-3.5 transition-all duration-300',
                    isActive
                      ? 'border-indigo-300 shadow-[0_4px_16px_-6px_rgba(79,70,229,0.2)]'
                      : 'border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.03)]',
                  )}
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                          stage.iconBg,
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {stage.title}
                        </p>
                        <p className="text-[11px] text-slate-500">{stage.subtitle}</p>
                      </div>
                    </div>

                    {isDone ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        <Check className="h-2.5 w-2.5" />
                        Drafted
                      </span>
                    ) : isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                        <Sparkles className="h-2.5 w-2.5 animate-pulse" />
                        Writing
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                        Queued
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="skeleton-shimmer h-2.5 w-4/5 rounded-full" />
                    <div className="skeleton-shimmer h-2.5 w-full rounded-full" />
                    <div className="skeleton-shimmer h-2.5 w-2/3 rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section aria-label="Generation error">
        <div
          role="alert"
          data-testid="generation-error-alert"
          className="overflow-hidden rounded-2xl border border-rose-200/90 bg-white shadow-[0_4px_24px_-8px_rgba(225,29,72,0.12)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold text-foreground">
                  Couldn&apos;t generate copy right now
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {errorMessage}
                </p>
              </div>
            </div>

            {errorRetryable && (
              <Button
                type="button"
                size="sm"
                onClick={onRetry}
                className="h-8 shrink-0 rounded-lg bg-rose-600 px-3 text-xs font-medium text-white shadow-sm hover:bg-rose-700"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry Generation</span>
              </Button>
            )}
          </div>

          <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-red-400 to-amber-400" />
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <div
        data-testid="results-empty-state"
        className="overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/90 shadow-[0_6px_28px_-10px_rgba(15,23,42,0.1)]"
      >
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-4 py-2.5 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600 font-mono text-[10px] font-bold text-white">
              2
            </span>
            <span className="font-display text-xs font-bold tracking-tight text-slate-900">
              Generated Copy &amp; Previews
            </span>
          </div>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
            7 ready-to-copy outputs
          </span>
        </div>

        <div className="space-y-3.5 p-4 sm:p-5">
          <div className="rounded-xl border border-indigo-100 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <h2 className="font-display text-sm font-semibold text-slate-900">
              Your product copy will appear here
            </h2>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
              Fill in your product details on the left—or click{' '}
              <span className="font-semibold text-indigo-700">Try Sample</span>—to
              generate ready-to-use copy across all 4 channels below.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Storefront Blueprint */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <div className="mb-2.5 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                  <ShoppingBag className="h-3.5 w-3.5" />
                </div>
                <span className="font-display text-xs font-semibold text-slate-900">
                  Storefront Listing
                </span>
              </div>
              <div className="flex gap-2.5">
                <div className="h-12 w-12 shrink-0 rounded-lg border border-dashed border-indigo-200 bg-slate-50/70" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-4/5 rounded bg-slate-200/80" />
                  <div className="h-2 w-full rounded bg-slate-200/60" />
                  <div className="h-2 w-2/3 rounded bg-slate-200/60" />
                </div>
              </div>
            </div>

            {/* Google SERP Blueprint */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <div className="mb-2.5 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-50 text-sky-600">
                  <Search className="h-3.5 w-3.5" />
                </div>
                <span className="font-display text-xs font-semibold text-slate-900">
                  Google Search (SEO)
                </span>
              </div>
              <div className="space-y-1.5 rounded-lg bg-slate-50/80 p-2.5 ring-1 ring-slate-200/60">
                <div className="h-2 w-24 rounded bg-emerald-200/80" />
                <div className="h-2.5 w-4/5 rounded bg-blue-300/70" />
                <div className="h-2 w-full rounded bg-slate-200/70" />
              </div>
            </div>

            {/* Instagram Blueprint */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <div className="mb-2.5 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-violet-600 text-white">
                  <Instagram className="h-3.5 w-3.5" />
                </div>
                <span className="font-display text-xs font-semibold text-slate-900">
                  Instagram Caption
                </span>
              </div>
              <div className="space-y-1.5 rounded-lg bg-slate-50/80 p-2.5 ring-1 ring-slate-200/60">
                <div className="h-2 w-20 rounded bg-slate-200/80" />
                <div className="h-2 w-full rounded bg-slate-200/60" />
                <div className="h-2 w-1/2 rounded bg-indigo-200/80" />
              </div>
            </div>

            {/* WhatsApp Blueprint */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <div className="mb-2.5 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#075E54] text-white">
                  <MessageCircle className="h-3.5 w-3.5" />
                </div>
                <span className="font-display text-xs font-semibold text-slate-900">
                  WhatsApp Message
                </span>
              </div>
              <div className="rounded-lg bg-[#EFEAE2] p-2.5">
                <div className="space-y-1.5 rounded-lg bg-white p-2 shadow-sm">
                  <div className="h-2 w-3/4 rounded bg-slate-200/80" />
                  <div className="h-2 w-1/2 rounded bg-emerald-200/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { data, meta } = result;
  const toneLabel =
    TONE_OPTIONS.find((item) => item.value === meta.tone)?.label ?? meta.tone;
  const languageOption = LANGUAGE_OPTIONS.find(
    (item) => item.value === meta.language,
  );

  const showStorefront = activeFilter === 'all' || activeFilter === 'storefront';
  const showSeo = activeFilter === 'all' || activeFilter === 'seo';
  const showSocial = activeFilter === 'all' || activeFilter === 'social';

  return (
    <section
      key={meta.generatedAt}
      aria-label="Generated product copy results"
      data-testid="results-container"
      className="space-y-4"
    >
      <div
        className="animate-studio-reveal flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/90 bg-white px-3.5 py-2.5 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.06)]"
        style={{ '--reveal-delay': '0ms' } as CSSProperties}
      >
        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
          <div className="flex max-w-full flex-wrap items-center gap-0.5 rounded-xl bg-secondary/90 p-0.5">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  'whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-medium transition-all sm:px-2.5 sm:text-xs',
                  activeFilter === tab.id
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="hidden text-xs font-medium text-muted-foreground xl:inline">
            {toneLabel} · {languageOption?.nativeLabel ?? meta.language}
          </span>
          {justGenerated && (
            <span className="animate-badge-pop inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
              <Sparkles className="h-3 w-3" />
              {variationSeed > 0 ? `Variation #${variationSeed + 1}` : 'Ready'}
            </span>
          )}
          {!justGenerated && variationSeed > 0 && (
            <Badge variant="outline" className="text-[11px] font-normal">
              Variation #{variationSeed + 1}
            </Badge>
          )}
          {meta.imageAnalyzed && (
            <Badge variant="success" className="text-[11px]">
              Image Audited
            </Badge>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            title="Generate a fresh variation with a different angle"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Regenerate</span>
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleCopyAll}
            data-testid="copy-all-btn"
            className={cn(
              'h-8 rounded-lg bg-indigo-600 px-3 text-xs text-white transition-none hover:bg-indigo-700',
              copiedAll &&
                'border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
            )}
          >
            {copiedAll ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied All</span>
              </>
            ) : (
              <>
                <CopyCheck className="h-3.5 w-3.5" />
                <span>Copy All</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {showStorefront && (
        <div
          className="animate-studio-reveal"
          style={{ '--reveal-delay': '70ms' } as CSSProperties}
        >
          <StorefrontPreviewCard
            productTitle={data.productTitle}
            shortDescription={data.shortDescription}
            longDescription={data.longDescription}
            brandOrCategory={brandOrCategory}
            imagePreviewUrl={imagePreviewUrl}
          />
        </div>
      )}

      {showSeo && (
        <div
          className="animate-studio-reveal"
          style={{ '--reveal-delay': '140ms' } as CSSProperties}
        >
          <SeoPreviewCard
            seoTitle={data.seoTitle}
            seoMetaDescription={data.seoMetaDescription}
            brandOrCategory={brandOrCategory}
          />
        </div>
      )}

      {showSocial && (
        <div
          className="animate-studio-reveal"
          style={{ '--reveal-delay': '210ms' } as CSSProperties}
        >
          <SocialChannelCards
            instagramCaption={data.instagramCaption}
            whatsappMessage={data.whatsappMessage}
            brandOrCategory={brandOrCategory}
            imagePreviewUrl={imagePreviewUrl}
          />
        </div>
      )}

      <div
        className="animate-studio-reveal"
        style={{ '--reveal-delay': '280ms' } as CSSProperties}
      >
        <GroundingCard
          notes={data.groundingNotes}
          imageAnalyzed={meta.imageAnalyzed}
        />
      </div>
    </section>
  );
}
