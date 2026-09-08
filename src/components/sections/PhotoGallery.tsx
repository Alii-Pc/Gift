"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Heart, Sparkles, X, ZoomIn } from "lucide-react";
import { siteConfig, MemoryPhoto } from "@/data/config";

interface PhotoGalleryProps {
  onNext: () => void;
}

const ROTATIONS = [-2.5, 2, -1.8, 2.2, -2, 1.5];

export function PhotoGallery({ onNext }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedPhotos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center z-10 w-full max-w-5xl px-4 py-8 pb-32"
    >
      {/* Chapter Title */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100 text-brand-primary text-xs font-bold tracking-widest uppercase mb-2 border border-pink-200">
          <Camera className="w-3.5 h-3.5" /> Memory Lane
        </span>
        <h2 className="text-3xl md:text-5xl font-serif gradient-text font-bold">
          Captured Moments
        </h2>
        <p className="text-sm text-brand-text/70 mt-2 max-w-md mx-auto">
          A few of my favorite memories with you. Tap any photo to see it up close ✨
        </p>
      </div>

      {/* 6 Polaroid Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full mb-10">
        {siteConfig.photos.slice(0, 6).map((photo, index) => {
          const isLiked = likedPhotos[photo.id];
          const hasError = imageErrors[photo.id];
          const rotation = ROTATIONS[index % ROTATIONS.length];

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20, rotate: rotation - 5 }}
              animate={{ opacity: 1, y: 0, rotate: rotation }}
              transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}
              whileHover={{
                scale: 1.05,
                rotate: 0,
                y: -8,
                zIndex: 20,
                transition: { duration: 0.25 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative bg-white p-3.5 pb-6 rounded-2xl shadow-[0_10px_25px_rgba(255,75,130,0.18)] hover:shadow-[0_20px_35px_rgba(255,75,130,0.28)] transition-shadow duration-300 border-2 border-pink-100/80 cursor-pointer flex flex-col select-none"
            >
              {/* Cute Washi Tape at Top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-pink-200/70 backdrop-blur-xs rounded-sm shadow-xs border border-white/60 rotate-[-1deg] z-10 pointer-events-none" />

              {/* Photo Viewport */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-tr from-pink-50 via-purple-50 to-pink-100 mb-3 border border-pink-50 flex items-center justify-center">
                {!hasError ? (
                  /* Image element */
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    onError={() => handleImageError(photo.id)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  /* Aesthetic Fallback Card if file is not yet placed */
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-white/80 shadow-sm flex items-center justify-center mb-2 text-brand-primary">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="text-xs font-bold text-brand-text/80">{photo.caption}</span>
                    <span className="text-[10px] text-brand-text/50 font-mono mt-1">
                      {photo.url}
                    </span>
                  </div>
                )}

                {/* Hover zoom indicator */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="p-2 rounded-full bg-white/30 backdrop-blur-sm">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>

                {/* Heart / Like reaction button */}
                <button
                  onClick={(e) => toggleLike(e, photo.id)}
                  className="absolute bottom-2.5 right-2.5 p-2 rounded-full bg-white/85 backdrop-blur-md shadow-md text-pink-500 hover:scale-115 transition-transform cursor-pointer"
                  title="Love this photo"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isLiked ? "fill-pink-500 text-pink-500" : "text-pink-400"
                    }`}
                  />
                </button>
              </div>

              {/* Polaroid Caption */}
              <div className="text-center px-1">
                <h3 className="font-serif text-base font-bold text-brand-text truncate">
                  {photo.caption}
                </h3>
                {photo.subtext && (
                  <p className="text-xs text-brand-text/60 mt-0.5 line-clamp-1">
                    {photo.subtext}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Continue Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="btn-cute cursor-pointer inline-flex items-center gap-2 mb-4"
      >
        <span>Next Chapter</span>
        <span>📸</span>
      </motion.button>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-white p-5 pb-7 rounded-3xl shadow-2xl border-4 border-white flex flex-col items-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white text-gray-700 shadow-lg border border-pink-100 flex items-center justify-center hover:bg-pink-50 hover:text-brand-primary transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image Viewport */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-pink-50 mb-4 flex items-center justify-center">
                {!imageErrors[selectedPhoto.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.caption}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8">
                    <Sparkles className="w-12 h-12 text-brand-primary mx-auto mb-3 animate-bounce" />
                    <h4 className="text-lg font-serif font-bold text-brand-text mb-1">
                      {selectedPhoto.caption}
                    </h4>
                    <p className="text-xs text-gray-500 font-mono">
                      Add image to {selectedPhoto.url}
                    </p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="text-center w-full px-2">
                <h3 className="text-2xl font-serif font-bold gradient-text mb-1">
                  {selectedPhoto.caption}
                </h3>
                {selectedPhoto.subtext && (
                  <p className="text-sm text-brand-text/80 font-medium">
                    {selectedPhoto.subtext}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
