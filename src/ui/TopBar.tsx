import { property } from "../data/property";

export function TopBar() {
  return (
    <div className="pointer-events-auto flex items-center justify-between p-4 sm:p-6">
      <div className="glass flex items-center gap-3 rounded-full px-4 py-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md gold-gradient font-display text-sm text-ink-950">
          A
        </div>
        <div>
          <div className="text-xs font-semibold text-white">Azure Estates</div>
          <div className="text-[10px] text-white/50">Coastal Collection · 2025</div>
        </div>
      </div>
      <div className="hidden items-center gap-2 sm:flex">
        <button className="glass rounded-full px-3 py-1.5 text-xs text-white/70 transition hover:text-white">
          Search
        </button>
        <button className="glass rounded-full px-3 py-1.5 text-xs text-white/70 transition hover:text-white">
          Saved
        </button>
        <button className="glass rounded-full px-3 py-1.5 text-xs text-white/70 transition hover:text-white">
          Agents
        </button>
        <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/80">Live preview</span>
        </div>
      </div>
    </div>
  );
}
