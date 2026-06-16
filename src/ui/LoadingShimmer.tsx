export function LoadingShimmer() {
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="h-1 w-24 animate-pulse rounded-full bg-accent-gold/60" />
      <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
        Transitioning
      </div>
    </div>
  );
}
