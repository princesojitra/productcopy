import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/clipboard';
import { cn } from '@/lib/utils';

interface CopyInlineButtonProps {
  id: string;
  label: string;
  text: string;
  className?: string;
}

export function CopyInlineButton({
  id,
  label,
  text,
  className,
}: CopyInlineButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      toast.success(`Copied ${label}`);
    } else {
      toast.error('Clipboard permission unavailable');
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      data-testid={`copy-btn-${id}`}
      aria-label={`Copy ${label}`}
      className={cn(
        'h-7 shrink-0 rounded-md px-2 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground',
        copied && 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700',
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          <span>Copy</span>
        </>
      )}
    </Button>
  );
}
