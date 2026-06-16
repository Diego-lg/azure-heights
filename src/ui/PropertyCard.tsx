import { motion } from "framer-motion";
import type { PropertyData, RoomMeta } from "../data/property";

export function PropertyCard({
  property,
  view,
}: {
  property: PropertyData;
  view: RoomMeta;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-strong w-[320px] rounded-2xl p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-accent-gold">
            {property.status} · {property.mls}
          </div>
          <h2 className="mt-1 font-display text-2xl text-white">{property.name}</h2>
        </div>
        <div className="rounded-full border border-accent-gold/40 bg-accent-gold/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-accent-gold">
          {property.type}
        </div>
      </div>

      <p className="mt-2 text-xs text-white/50">{property.address}</p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-3xl gold-text">{property.price}</span>
        <span className="text-xs text-white/50">{property.pricePerSqft}</span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 border-y border-white/5 py-3 text-center">
        <Stat label="Beds" value={property.beds.toString()} />
        <Stat label="Baths" value={property.baths.toString()} />
        <Stat label="Half" value={property.halfBaths.toString()} />
        <Stat label="Sqft" value={property.sqft.toLocaleString()} />
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full gold-gradient font-display text-sm text-ink-950">
          EM
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-white">{property.agent.name}</div>
          <div className="text-[11px] text-white/50">{property.agent.title}</div>
        </div>
        <a
          href={`tel:${property.agent.phone.replace(/\s/g, "")}`}
          className="rounded-full border border-accent-gold/50 bg-accent-gold/10 px-3 py-1 text-[11px] font-medium text-accent-gold transition hover:bg-accent-gold/20"
        >
          Call
        </a>
      </div>

      <div className="mt-3 flex gap-2">
        <button className="flex-1 rounded-xl gold-gradient px-4 py-2.5 text-sm font-semibold text-ink-950 transition hover:brightness-110">
          Schedule a Tour
        </button>
        <button className="rounded-xl border border-white/15 px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/5">
          ♡
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-white/40">
        <span>Built {property.yearBuilt}</span>
        <span>Lot {property.lot}</span>
        <span>Viewing · {view.label}</span>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-lg text-white tabular">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-white/40">{label}</div>
    </div>
  );
}
