"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Heart, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { siteConfig } from "@/data/config";

export function OpenLetter({ onNext }: { onNext: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Heart sparkle confetti burst
    try {
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff4b82", "#ff8fa3", "#a855f7", "#ffd166"],
      });
    } catch {
      // ignore
    }

    setTimeout(() => setShowMessage(true), 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center z-10 w-full max-w-2xl px-4 min-h-[420px]"
    >
      {!showMessage ? (
        <motion.div
          animate={isOpen ? { scale: 0.85, opacity: 0, y: -20 } : { scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="cursor-pointer group flex flex-col items-center select-none"
          onClick={handleOpen}
        >
          {/* Pulsing halo around card */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-pink-400 to-purple-400 blur-xl opacity-40 group-hover:opacity-75 transition-opacity" />

            <motion.div
              whileHover={{ scale: 1.04, rotate: -1 }}
              whileTap={{ scale: 0.96 }}
              className="w-80 h-52 md:w-96 md:h-60 bg-gradient-to-tr from-pink-400 via-rose-400 to-purple-500 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden shadow-[0_20px_40px_rgba(255,75,130,0.35)] border-4 border-white text-center p-6"
            >
              {/* Envelope flap decorative line */}
              <div className="absolute top-0 inset-x-0 h-1/2 border-b-2 border-white/30 [clip-path:polygon(0_0,50%_100%,100%_0)] bg-white/10" />

              {/* Wax seal icon */}
              <div className="w-16 h-16 rounded-full bg-white/90 shadow-md flex items-center justify-center mb-3 z-10 group-hover:scale-110 transition-transform">
                <Gift className="w-8 h-8 text-brand-primary" />
              </div>

              <span className="text-white font-bold tracking-wider text-base z-10 drop-shadow-sm flex items-center gap-1.5">
                <span>Tap to Open Letter</span>
                <Sparkles className="w-4 h-4" />
              </span>
              <p className="text-white/80 text-xs mt-1 font-medium z-10">
                A special handwritten note for you
              </p>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
          className="text-center cute-card p-8 md:p-14 cute-shadow relative overflow-hidden w-full"
        >
          {/* Decorative Corner Flowers */}
          <span className="absolute top-4 left-4 text-xl select-none opacity-60">🌸</span>
          <span className="absolute top-4 right-4 text-xl select-none opacity-60">✨</span>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-50 text-brand-primary mb-4">
            <Heart className="w-6 h-6 fill-pink-400 text-pink-400" />
          </div>

          <h2 className="text-3xl md:text-4xl font-serif gradient-text mb-6 font-bold">
            To {siteConfig.birthdayPerson}
          </h2>

          <p className="text-lg md:text-xl font-sans font-medium text-brand-text leading-relaxed mb-8 max-w-lg mx-auto">
            {siteConfig.letterMessage}
          </p>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="btn-cute cursor-pointer inline-flex items-center gap-2"
          >
            <span>Continue</span>
            <span>🌸</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
