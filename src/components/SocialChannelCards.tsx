import {
  Bookmark,
  CheckCheck,
  Heart,
  Instagram,
  MessageCircle,
  Send,
} from 'lucide-react';
import { CopyInlineButton } from '@/components/CopyInlineButton';

interface SocialChannelCardsProps {
  instagramCaption: string;
  whatsappMessage: string;
  brandOrCategory?: string;
  imagePreviewUrl?: string | null;
}

function renderFormattedCaption(caption: string) {
  return caption.split(/(#[^\s#]+)/g).map((part, idx) =>
    part.startsWith('#') ? (
      <span key={idx} className="font-medium text-indigo-600">
        {part}
      </span>
    ) : (
      <span key={idx}>{part}</span>
    ),
  );
}

export function SocialChannelCards({
  instagramCaption,
  whatsappMessage,
  brandOrCategory,
  imagePreviewUrl,
}: SocialChannelCardsProps) {
  const handle =
    (brandOrCategory || 'productcopy')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 18) || 'yourbrand';

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* 6. Instagram Caption */}
      <div
        data-testid="output-card-instagram-caption"
        className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/90 shadow-[0_6px_28px_-10px_rgba(15,23,42,0.08)]"
      >
        <div className="flex items-start justify-between gap-2 border-b border-slate-200/80 bg-white px-4 py-2.5">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-violet-600 text-white">
              <Instagram className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-semibold text-slate-900">
                  Instagram Caption
                </h3>
                <span className="font-mono text-[10px] text-slate-400">
                  {instagramCaption.length} chars
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Post or Reel caption with ready-to-use hashtags
              </p>
            </div>
          </div>
          <CopyInlineButton
            id="instagram-caption"
            label="Instagram Caption"
            text={instagramCaption}
          />
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-1 flex-col rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[2px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-900">
                  {handle.slice(0, 2).toUpperCase()}
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-900">@{handle}</span>
            </div>

            {imagePreviewUrl && (
              <div className="mb-3 aspect-[16/10] overflow-hidden rounded-lg border border-slate-200/70 bg-slate-50">
                <img
                  src={imagePreviewUrl}
                  alt="Instagram post visual"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="mb-2.5 flex items-center justify-between text-slate-700">
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4" />
                <MessageCircle className="h-4 w-4" />
                <Send className="h-4 w-4" />
              </div>
              <Bookmark className="h-4 w-4" />
            </div>

            <div className="flex-1 whitespace-pre-wrap break-words text-[13px] leading-relaxed text-slate-800">
              <span className="mr-1.5 font-semibold text-slate-950">@{handle}</span>
              {renderFormattedCaption(instagramCaption)}
            </div>
          </div>
        </div>
      </div>

      {/* 7. WhatsApp Marketing Message */}
      <div
        data-testid="output-card-whatsapp-message"
        className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/90 shadow-[0_6px_28px_-10px_rgba(15,23,42,0.08)]"
      >
        <div className="flex items-start justify-between gap-2 border-b border-slate-200/80 bg-white px-4 py-2.5">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#075E54] text-white">
              <MessageCircle className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-semibold text-slate-900">
                  WhatsApp Marketing Message
                </h3>
                <span className="font-mono text-[10px] text-slate-400">
                  {whatsappMessage.length} chars
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Formatted for customer broadcasts &amp; direct chats
              </p>
            </div>
          </div>
          <CopyInlineButton
            id="whatsapp-message"
            label="WhatsApp Marketing Message"
            text={whatsappMessage}
          />
        </div>

        <div className="flex flex-1 flex-col bg-[#EFEAE2] p-4">
          <div className="flex-1 rounded-2xl rounded-tl-sm bg-white p-3.5 shadow-sm ring-1 ring-black/5">
            {imagePreviewUrl && (
              <div className="mb-2.5 aspect-[16/9] overflow-hidden rounded-lg border border-black/5">
                <img
                  src={imagePreviewUrl}
                  alt="WhatsApp product attachment"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-slate-900">
              {whatsappMessage}
            </div>
            <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-slate-400">
              <span>11:20 AM</span>
              <CheckCheck className="h-3.5 w-3.5 text-sky-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
