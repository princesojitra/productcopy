import { Layers, RotateCcw, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onLoadSample: () => void;
  onReset: () => void;
  hasContent: boolean;
  isGenerating: boolean;
}

export function Header({
  onLoadSample,
  onReset,
  hasContent,
  isGenerating,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/25"
            aria-hidden="true"
          >
            <Layers className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-base font-bold tracking-tight text-foreground">
              ProductCopy
            </span>
            <span className="hidden rounded-full bg-indigo-50 px-2 py-0.5 font-mono text-[10px] font-medium text-indigo-700 sm:inline-block">
              AI Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onLoadSample}
            disabled={isGenerating}
            className="h-8 rounded-lg border-border/90 bg-white px-3 text-xs font-medium shadow-none hover:bg-secondary/70"
          >
            <Wand2 className="h-3.5 w-3.5 text-indigo-600" />
            <span>Try Sample</span>
          </Button>
          {hasContent && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              disabled={isGenerating}
              aria-label="Clear form and results"
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
