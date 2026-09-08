"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Heart } from "lucide-react";
import { siteConfig } from "@/data/config";

export function ReasonsGallery({ onNext }: { onNext: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center z-10 w-full max-w-3xl px-4 py-8"
    >
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-brand-primary text-xs font-bold tracking-widest uppercase mb-2">
          <Heart className="w-3.5 h-3.5 fill-current" /> Endless Reasons
        </span>
        <h2 className="text-3xl md:text-5xl font-serif gradient-text font-bold">
          Why You&apos;re So Special
        </h2>
        <p className="text-sm text-brand-text/70 mt-2">Tap each card to reveal the story ✨</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
        {siteConfig.reasons.map((reason, index) => {
          const isExpanded = expandedId === reason.id;

          return (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExpand(reason.id)}
              className={`cute-card p-5 cursor-pointer transition-all duration-300 select-none ${
                isExpanded
                  ? "border-pink-300 shadow-[0_12px_25px_rgba(255,75,130,0.2)] bg-gradient-to-br from-white via-pink-50/40 to-white"
                  : "cute-shadow hover:border-pink-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      isExpanded
                        ? "bg-brand-primary text-white shadow-md shadow-pink-200"
                        : "bg-pink-100 text-brand-primary"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <h3 className="text-lg md:text-xl font-serif text-brand-text font-bold">
                    {reason.title}
                  </h3>
                </div>

                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-brand-primary/60 p-1"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3.5 mt-2 border-t border-pink-100 text-brand-text/90 leading-relaxed text-sm md:text-base font-medium">
                      {reason.description}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="btn-cute cursor-pointer inline-flex items-center gap-2"
      >
        <span>Continue</span>
        <span>❤️</span>
      </motion.button>
    </motion.div>
  );
}
