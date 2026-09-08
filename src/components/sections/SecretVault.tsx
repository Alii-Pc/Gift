"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, KeyRound, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { siteConfig } from "@/data/config";

export function SecretVault({ onNext }: { onNext: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === siteConfig.secretCode) {
      setUnlocked(true);
      setError(false);
      try {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#a855f7", "#ff4b82", "#ffd166"],
        });
      } catch {
        // ignore
      }
    } else {
      setError(true);
      setTimeout(() => setError(false), 900);
      setCode("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center z-10 w-full max-w-md px-4 min-h-[420px]"
    >
      {!unlocked ? (
        <motion.form
          onSubmit={handleSubmit}
          animate={error ? { x: [-12, 12, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="cute-card p-8 md:p-10 text-center cute-shadow w-full flex flex-col items-center relative overflow-hidden"
        >
          {/* Pulsing Lock Icon */}
          <div className="relative mb-5">
            <div className="w-18 h-18 bg-pink-50 rounded-full flex items-center justify-center border-2 border-pink-100 shadow-inner">
              <Lock className="w-9 h-9 text-brand-primary" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-serif mb-2 text-brand-text font-bold">
            Secret Vault
          </h2>
          <p className="text-gray-500 mb-6 text-xs md:text-sm font-medium leading-relaxed">
            There&apos;s a secret message locked inside just for you. Enter the passcode to reveal it.
          </p>

          <div className="relative w-full mb-6">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full bg-pink-50/60 border-2 rounded-2xl px-4 py-3.5 text-center tracking-[0.4em] focus:outline-none focus:bg-white transition-all text-brand-text font-bold text-2xl ${
                error
                  ? "border-red-400 bg-red-50 text-red-600 ring-2 ring-red-200"
                  : "border-pink-100 focus:border-brand-primary"
              }`}
              placeholder="••••"
              maxLength={12}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-xs font-semibold mt-2 animate-pulse">
                Incorrect code, try again! 🔒
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="btn-cute w-full cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Unlock</span>
            <KeyRound className="w-4 h-4" />
          </motion.button>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
          className="text-center cute-card p-8 md:p-12 cute-shadow w-full flex flex-col items-center relative overflow-hidden"
        >
          <div className="w-18 h-18 bg-purple-50 rounded-full flex items-center justify-center mb-5 border-2 border-purple-100 shadow-sm">
            <Unlock className="w-9 h-9 text-brand-secondary" />
          </div>

          <div className="inline-flex items-center gap-1.5 text-brand-secondary text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Unlocked For You
          </div>

          <p className="text-lg md:text-xl font-serif leading-relaxed mb-8 text-brand-text font-medium">
            &ldquo;{siteConfig.secretMessage}&rdquo;
          </p>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="btn-cute cursor-pointer inline-flex items-center gap-2"
          >
            <span>Continue</span>
            <span>💖</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
