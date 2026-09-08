import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { siteConfig } from "@/data/config";

export function FinalReveal({ onNext }: { onNext: () => void }) {
  const [showPhotos, setShowPhotos] = useState(false);

  useEffect(() => {
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff4b82', '#a855f7', '#ffb703', '#4cc9f0', '#ff8fa3']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff4b82', '#a855f7', '#ffb703', '#4cc9f0', '#ff8fa3']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    setTimeout(() => setShowPhotos(true), 2000);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
      className="flex flex-col items-center justify-center z-10 w-full min-h-screen px-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-white/20 pointer-events-none z-0 backdrop-blur-sm" />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
        className="text-center z-20 mb-12 mt-32 md:mt-0 cute-card p-12 cute-shadow"
      >
        <h1 className="text-5xl md:text-8xl font-serif gradient-text tracking-wide leading-tight mb-4 drop-shadow-sm">
          Happy Birthday!
        </h1>
        <h2 className="text-3xl md:text-5xl font-serif text-brand-text">
          To {siteConfig.birthdayPerson} <span className="text-brand-primary">🎂</span>
        </h2>
      </motion.div>

      {showPhotos && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden flex flex-wrap justify-center items-center gap-8 mix-blend-multiply opacity-80">
          {siteConfig.photos.map((photo, index) => {
            const photoLayouts = [
              { x: 22, y: 30, rot: -8 },
              { x: 78, y: 28, rot: 10 },
              { x: 18, y: 72, rot: 7 },
              { x: 82, y: 70, rot: -11 },
              { x: 50, y: 82, rot: 3 },
            ];
            const layout = photoLayouts[index % photoLayouts.length];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.8, rotate: layout.rot - 10 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: layout.rot }}
                transition={{ duration: 1.5, type: "spring", delay: index * 0.2 }}
                className="absolute w-32 h-40 md:w-48 md:h-64 bg-white p-3 pb-12 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] hidden md:block border border-gray-100"
                style={{
                  top: `${layout.y}%`,
                  left: `${layout.x}%`,
                  transform: `translate(-50%, -50%)`,
                }}
              >
                <div 
                  className="w-full h-full bg-cover bg-center rounded-sm bg-pink-50"
                  style={{ backgroundImage: `url(${typeof photo === "string" ? photo : photo.url})` }}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: showPhotos ? 1 : 0 }}
        transition={{ delay: 4, duration: 1 }}
        onClick={onNext}
        className="mt-8 btn-cute z-30 pointer-events-auto cursor-pointer"
      >
        One Last Thing 💌
      </motion.button>
    </motion.div>
  );
}
