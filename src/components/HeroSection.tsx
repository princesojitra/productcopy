export function HeroSection() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-2 px-4 pb-3 pt-4 sm:px-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <h1 className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
          Product Copy Workspace
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Turn verified product specs & photos into live storefront, SEO, Instagram, and WhatsApp previews.
        </p>
      </div>
      <div className="hidden items-center gap-1.5 text-[11px] font-medium text-muted-foreground md:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span>Grounded · EN / HI / GU</span>
      </div>
    </div>
  );
}
