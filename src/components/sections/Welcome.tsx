"use client";
import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

export function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -25, filter: "blur(12px)" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center z-10 px-4 max-w-xl mx-auto"
    >
      {/* Cute Floating Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/80 backdrop-blur-sm border border-pink-200 text-brand-primary text-xs md:text-sm font-bold tracking-wider uppercase mb-6 shadow-sm"
      >
        <Sparkles className="w-4 h-4 animate-spin-slow" />
        <span>A Little Journey Just For You</span>
        <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
      </motion.div>

      {/* Hero Welcome Header */}
      <div className="relative mb-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-6xl md:text-8xl font-serif tracking-tight gradient-text font-bold drop-shadow-sm"
        >
          Welcome
        </motion.h1>
        {/* Floating star accents */}
        <motion.span
          animate={{ y: [-4, 4, -4], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-3 -right-6 text-2xl md:text-3xl select-none"
        >
          ✨
        </motion.span>
        <motion.span
          animate={{ y: [4, -4, 4], rotate: [0, -12, 12, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-2 -left-6 text-2xl select-none"
        >
          🌸
        </motion.span>
      </div>

      {/* Gentle Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="text-base md:text-lg text-brand-text/80 mb-10 max-w-md font-medium leading-relaxed"
      >
        Every pixel here holds a little piece of love and memories. Take a breath, turn up your volume, and step right in.
      </motion.p>

      {/* Eye-catching Pulsing Button */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing halo behind button */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 blur-md opacity-50 animate-pulse-ring pointer-events-none" />

        <motion.button
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={onNext}
          className="relative btn-cute cursor-pointer flex items-center gap-3 px-10 py-4 text-base tracking-wider font-bold shadow-xl"
        >
          <span>Tap to Start</span>
          <span className="text-lg">✨</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
