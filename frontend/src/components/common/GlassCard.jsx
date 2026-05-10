import { motion } from "framer-motion";
import { GLASS } from "../../utils/constants";

export function GlassCard({ title, subtitle, children, className = "" }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`${GLASS} p-4 md:p-5 ${className}`}
    >
      {(title || subtitle) && (
        <header className="mb-4">
          {title ? <h3 className="text-lg font-semibold text-white">{title}</h3> : null}
          {subtitle ? <p className="text-sm text-slate-300">{subtitle}</p> : null}
        </header>
      )}
      {children}
    </motion.section>
  );
}
