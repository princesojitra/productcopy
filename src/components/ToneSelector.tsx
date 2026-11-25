import { TONE_OPTIONS, type Tone } from '@shared/types';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ToneSelectorProps {
  value: Tone;
  onChange: (tone: Tone) => void;
  disabled?: boolean;
}

export function ToneSelector({ value, onChange, disabled = false }: ToneSelectorProps) {
  const activeOption = TONE_OPTIONS.find((item) => item.value === value);

  return (
    <fieldset className="space-y-1.5" disabled={disabled}>
      <div className="flex items-center justify-between gap-2">
        <Label asChild className="text-[13px] font-semibold text-slate-900">
          <legend>Brand Tone</legend>
        </Label>
        {activeOption && (
          <span className="text-[11px] font-medium text-indigo-600">
            {activeOption.description}
          </span>
        )}
      </div>
      <div
        className="grid grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1"
        role="radiogroup"
        aria-label="Brand Tone"
      >
        {TONE_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                'rounded-lg px-2 py-1.5 text-center text-xs transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                selected
                  ? 'bg-white font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-200/80'
                  : 'font-medium text-slate-600 hover:text-slate-900',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
