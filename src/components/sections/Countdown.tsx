import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Countdown({ onNext }: { onNext: () => void }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1200);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => onNext(), 800);
      return () => clearTimeout(timer);
    }
  }, [count, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
      transition={{ duration: 1 }}
      className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50"
    >
      <AnimatePresence mode="wait">
        {count > 0 ? (
          <motion.div
            key={count}
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 2, filter: "blur(10px)" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="text-[15rem] md:text-[25rem] font-serif gradient-text leading-none text-glow-cute"
          >
            {count}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
