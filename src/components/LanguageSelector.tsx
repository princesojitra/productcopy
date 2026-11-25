import { LANGUAGE_OPTIONS, type Language } from '@shared/types';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
  disabled?: boolean;
}

export function LanguageSelector({
  value,
  onChange,
  disabled = false,
}: LanguageSelectorProps) {
  return (
    <fieldset className="space-y-1.5" disabled={disabled}>
      <Label asChild className="text-[13px] font-semibold text-slate-900">
        <legend>Output Language</legend>
      </Label>
      <div
        className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1"
        role="radiogroup"
        aria-label="Output Language"
      >
        {LANGUAGE_OPTIONS.map((option) => {
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
                'flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                selected
                  ? 'bg-white font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-200/80'
                  : 'font-medium text-slate-600 hover:text-slate-900',
              )}
            >
              <span>{option.nativeLabel}</span>
              {option.label !== option.nativeLabel && (
                <span className="hidden text-[10px] opacity-70 sm:inline">
                  {option.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
