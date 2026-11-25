import { AlertCircle, CheckCircle2, Eye, ShieldCheck } from 'lucide-react';
import type { GroundingNotes } from '@shared/types';
import { Badge } from '@/components/ui/badge';

interface GroundingCardProps {
  notes: GroundingNotes;
  imageAnalyzed: boolean;
}

export function GroundingCard({ notes, imageAnalyzed }: GroundingCardProps) {
  const hasFacts = notes.userFactsUsed.length > 0;
  const hasVisuals = notes.visualObservations.length > 0;
  const hasCaveats = notes.caveats.length > 0;

  if (!hasFacts && !hasVisuals && !hasCaveats) return null;

  return (
    <div
      data-testid="grounding-notes-card"
      className="overflow-hidden rounded-2xl border border-border/90 bg-white shadow-[0_4px_24px_-8px_rgba(15,23,42,0.05)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 bg-secondary/40 px-4 py-3">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="font-display text-xs font-semibold text-foreground">
              Fact-Check Summary
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Only your confirmed details were used—no specs or prices were invented.
            </p>
          </div>
        </div>
        <Badge variant={imageAnalyzed ? 'success' : 'secondary'} className="text-[11px]">
          {imageAnalyzed ? 'Brief + Photo Verified' : 'Brief Verified'}
        </Badge>
      </div>

      <div className="grid gap-3 p-4 text-xs md:grid-cols-2">
        {hasFacts && (
          <div
            className={
              !hasVisuals && !hasCaveats
                ? 'rounded-xl border border-emerald-200/70 bg-emerald-50/35 p-3.5 md:col-span-2'
                : 'rounded-xl border border-emerald-200/70 bg-emerald-50/35 p-3.5'
            }
          >
            <p className="mb-2 flex items-center gap-1.5 font-semibold text-emerald-900">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Used from your brief
            </p>
            <div className="flex flex-wrap gap-1.5">
              {notes.userFactsUsed.map((fact, idx) => (
                <span
                  key={`${idx}-${fact.slice(0, 20)}`}
                  className="inline-flex rounded-md border border-emerald-200/80 bg-white px-2 py-1 text-[11px] leading-snug text-emerald-950/90"
                >
                  {fact}
                </span>
              ))}
            </div>
          </div>
        )}

        {hasVisuals && (
          <div className="rounded-xl border border-indigo-200/70 bg-indigo-50/35 p-3.5">
            <p className="mb-1 flex items-center gap-1.5 font-semibold text-indigo-950">
              <Eye className="h-3.5 w-3.5 text-indigo-600" />
              Spotted in your photo
            </p>
            <p className="mb-2 text-[11px] text-indigo-900/70">
              Visual look only—no hidden specs guessed.
            </p>
            <ul className="space-y-1 text-indigo-950/85">
              {notes.visualObservations.map((obs, idx) => (
                <li key={`${idx}-${obs.slice(0, 20)}`} className="leading-snug">
                  · {obs}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasCaveats && (
          <div
            className={
              hasFacts && hasVisuals
                ? 'rounded-xl border border-amber-200/80 bg-amber-50/50 p-3.5 md:col-span-2'
                : 'rounded-xl border border-amber-200/80 bg-amber-50/50 p-3.5'
            }
          >
            <p className="mb-1 flex items-center gap-1.5 font-semibold text-amber-950">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
              Missing info (left out, not guessed)
            </p>
            <p className="mb-2 text-[11px] text-amber-900/75">
              Add any of these to your Product Facts and click Regenerate if you want them included:
            </p>
            <ul className="space-y-1 text-amber-950/85">
              {notes.caveats.map((caveat, idx) => (
                <li key={`${idx}-${caveat.slice(0, 20)}`} className="leading-snug">
                  · {caveat}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
