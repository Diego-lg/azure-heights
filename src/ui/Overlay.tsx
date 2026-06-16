import { motion, AnimatePresence } from "framer-motion";
import { useViewStore } from "../hooks/useView";
import { property, ROOMS, viewById } from "../data/property";
import { ViewSwitcher } from "./ViewSwitcher";
import { PropertyCard } from "./PropertyCard";
import { RoomInfo } from "./RoomInfo";
import { TopBar } from "./TopBar";
import { LoadingShimmer } from "./LoadingShimmer";

export function Overlay() {
  const current = useViewStore((s) => s.current);
  const view = viewById(current);
  const isTransitioning = useViewStore((s) => s.isTransitioning);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      <TopBar />

      <div className="flex flex-1">
        {/* Left — room info / floor plan callout */}
        <div className="pointer-events-auto flex flex-1 flex-col justify-end p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="max-w-md"
            >
              <RoomInfo view={view} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right — property card */}
        <div className="pointer-events-auto hidden flex-col items-end justify-end gap-3 p-4 sm:flex sm:p-6">
          <PropertyCard property={property} view={view} />
        </div>
      </div>

      {/* Bottom — view switcher */}
      <div className="pointer-events-auto flex justify-center p-4 sm:p-6">
        <ViewSwitcher />
      </div>

      {/* Transitioning indicator */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2"
          >
            <LoadingShimmer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
