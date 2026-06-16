import { motion } from "framer-motion";
import type { RoomMeta } from "../data/property";

export function RoomInfo({ view }: { view: RoomMeta }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-accent-gold">
        <span className="inline-block h-px w-6 bg-accent-gold/60" />
        {view.subtitle}
      </div>
      <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl">
        {view.label === "Exterior" ? "Azure Heights" : view.label}
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
        {view.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {view.features.map((f) => (
          <span
            key={f.label}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/80"
          >
            <span className="text-accent-gold">{f.icon}</span>
            {f.label}
          </span>
        ))}
      </div>
      <div className="mt-3 text-[10px] uppercase tracking-wider text-white/40">
        {view.area}
      </div>
    </div>
  );
}
