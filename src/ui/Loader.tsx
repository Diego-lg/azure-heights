import { motion } from "framer-motion";

export function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-ink-950"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="font-display text-3xl gold-text"
        >
          Azure Heights
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="mx-auto mt-4 h-px gold-gradient"
        />
        <div className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/40">
          Loading the residence
        </div>
      </div>
    </motion.div>
  );
}
