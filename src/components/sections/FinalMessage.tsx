import { motion } from "framer-motion";
import { siteConfig } from "@/data/config";

export function FinalMessage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center z-10 w-full max-w-2xl px-4 min-h-screen text-center"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="cute-card p-12 md:p-16 cute-shadow w-full whitespace-pre-wrap font-sans font-semibold text-lg md:text-2xl leading-relaxed text-brand-text"
      >
        <span className="text-brand-primary text-4xl mb-4 block">✨</span>
        {siteConfig.finalMessage.replace("[Name]", siteConfig.birthdayPerson)}
        <span className="text-brand-primary text-4xl mt-4 block">💖</span>
      </motion.div>
    </motion.div>
  );
}
