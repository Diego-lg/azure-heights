import { motion } from "framer-motion";
import { useViewStore } from "../hooks/useView";
import { ROOMS, type ViewId } from "../data/property";

const icons: Record<ViewId, string> = {
  exterior: "◆",
  aerial: "◉",
  floorplan: "▦",
  living: "◫",
  kitchen: "◧",
  bedroom: "◐",
  bathroom: "◑",
  pool: "≈",
};

export function ViewSwitcher() {
  const current = useViewStore((s) => s.current);
  const setView = useViewStore((s) => s.setView);
  return (
    <div className="glass-strong rounded-full px-2 py-2">
      <div className="flex flex-wrap items-center gap-1">
        {ROOMS.map((view) => {
          const active = current === view.id;
          return (
            <button
              key={view.id}
              onClick={() => setView(view.id)}
              className={`group relative flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                active
                  ? "text-ink-950"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="view-pill"
                  className="absolute inset-0 rounded-full gold-gradient"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              )}
              <span className="relative z-10 text-[10px] sm:text-sm">{icons[view.id]}</span>
              <span className="relative z-10 whitespace-nowrap">{view.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
