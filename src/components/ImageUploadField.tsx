import { useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { ImagePlus, Upload, X } from 'lucide-react';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
  type AllowedImageMimeType,
} from '@shared/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ImageUploadFieldProps {
  imageFile: File | null;
  previewUrl: string | null;
  error?: string;
  disabled?: boolean;
  onSelectImage: (file: File | null, validationError?: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ImageUploadField({
  imageFile,
  previewUrl,
  error,
  disabled = false,
  onSelectImage,
}: ImageUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndEmit = (file: File | undefined) => {
    if (!file) return;

    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as AllowedImageMimeType)) {
      onSelectImage(null, 'Unsupported file type. Use JPEG, PNG, or WebP.');
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      onSelectImage(null, 'Image exceeds the 4 MB size limit.');
      return;
    }

    onSelectImage(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    validateAndEmit(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    validateAndEmit(event.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    onSelectImage(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={inputId} className="text-[13px] font-semibold text-slate-900">
          Product Photo <span className="text-xs font-normal text-slate-500">(optional)</span>
        </Label>
        <span className="shrink-0 whitespace-nowrap font-mono text-[10px] text-slate-400">
          JPG, PNG, WebP ≤ 4 MB
        </span>
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ALLOWED_IMAGE_MIME_TYPES.join(',')}
        onChange={handleFileChange}
        disabled={disabled}
        className="sr-only"
      />

      {imageFile && previewUrl ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-2">
          <img
            src={previewUrl}
            alt={`Preview of ${imageFile.name}`}
            className="h-11 w-11 shrink-0 rounded-md border border-border object-cover bg-card"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">{imageFile.name}</p>
            <p className="font-mono text-[11px] text-muted-foreground">
              {formatBytes(imageFile.size)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={disabled}
            aria-label="Remove uploaded image"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Upload optional product image"
          aria-disabled={disabled}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(event) => {
            if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            isDragging
              ? 'border-foreground bg-secondary'
              : 'border-input bg-secondary/30 hover:border-foreground/30 hover:bg-secondary/60',
            error && 'border-destructive/70 bg-red-50/40',
            disabled && 'pointer-events-none opacity-60',
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
            {isDragging ? <Upload className="h-3.5 w-3.5 text-foreground" /> : <ImagePlus className="h-3.5 w-3.5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-foreground">
              Drop image or <span className="underline underline-offset-2">browse</span>
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              Visual cues only—never invents specs
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
