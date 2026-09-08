"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Play,
  Pause,
  Disc,
  Volume2,
  VolumeX,
  ChevronLeft,
} from "lucide-react";
import { Particles } from "./ui/Particles";
import { CursorTrail } from "./ui/CursorTrail";
import { Welcome } from "./sections/Welcome";
import { OpenLetter } from "./sections/OpenLetter";
import { MusicPlayer } from "./sections/MusicPlayer";
import { ReasonsGallery } from "./sections/ReasonsGallery";
import { PhotoGallery } from "./sections/PhotoGallery";
import { TriviaGame } from "./sections/TriviaGame";
import { SecretVault } from "./sections/SecretVault";
import { Countdown } from "./sections/Countdown";
import { FinalReveal } from "./sections/FinalReveal";
import { FinalMessage } from "./sections/FinalMessage";
import { siteConfig } from "@/data/config";
import { ambientSynth } from "@/utils/ambientSynth";

const TOTAL_STAGES = 10;

export function ExperienceManager() {
  const [stage, setStage] = useState(0);

  // 3 Songs management
  const songs =
    siteConfig.songs && siteConfig.songs.length > 0
      ? siteConfig.songs
      : [siteConfig.song];
  const [activeSongIndex, setActiveSongIndex] = useState(0);
  const activeSong = songs[activeSongIndex] || songs[0];

  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [hasInteractedSong, setHasInteractedSong] = useState(false);
  const songAudioRef = useRef<HTMLAudioElement | null>(null);

  // Ambient background tune management
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [isAmbientMuted, setIsAmbientMuted] = useState(false);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  // Helper to start ambient tune
  const startAmbient = useCallback(() => {
    if (isAmbientMuted || isSongPlaying) return;

    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = 0.3; // soft background level
      ambientAudioRef.current
        .play()
        .then(() => {
          setIsAmbientPlaying(true);
        })
        .catch(() => {
          // If local mp3 not found or blocked, use sweet Web Audio music box chime
          if (ambientSynth) {
            ambientSynth.start();
            setIsAmbientPlaying(true);
          }
        });
    } else if (ambientSynth) {
      ambientSynth.start();
      setIsAmbientPlaying(true);
    }
  }, [isAmbientMuted, isSongPlaying]);

  // Helper to pause ambient tune
  const pauseAmbient = useCallback(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
    }
    if (ambientSynth) {
      ambientSynth.pause();
    }
    setIsAmbientPlaying(false);
  }, []);

  // Toggle ambient tune on/off
  const toggleAmbient = () => {
    if (isAmbientPlaying) {
      pauseAmbient();
      setIsAmbientMuted(true);
    } else {
      setIsAmbientMuted(false);
      if (!isSongPlaying) {
        startAmbient();
      }
    }
  };

  // Toggle featured song play/pause with automatic ambient tune pause/resume
  const toggleSongPlay = () => {
    if (!songAudioRef.current) return;

    if (isSongPlaying) {
      songAudioRef.current.pause();
      setIsSongPlaying(false);
      // Resume ambient tune when song is paused!
      if (!isAmbientMuted) {
        startAmbient();
      }
    } else {
      // STOP ambient tune immediately when song starts!
      pauseAmbient();
      songAudioRef.current
        .play()
        .then(() => {
          setIsSongPlaying(true);
          setHasInteractedSong(true);
        })
        .catch((e) => {
          console.log("Song play note:", e);
        });
    }
  };

  // Switch between the 3 songs
  const selectSong = (index: number) => {
    const wasPlaying = isSongPlaying;
    setActiveSongIndex(index);
    if (songAudioRef.current) {
      songAudioRef.current.pause();
    }

    if (wasPlaying) {
      pauseAmbient();
      setTimeout(() => {
        if (songAudioRef.current) {
          songAudioRef.current
            .play()
            .then(() => setIsSongPlaying(true))
            .catch(() => setIsSongPlaying(false));
        }
      }, 60);
    }
  };

  // Stage navigation
  const nextStage = () => {
    // Start ambient tune upon first step into experience
    if (stage === 0 && !isAmbientPlaying && !isAmbientMuted) {
      startAmbient();
    }
    setStage((prev) => Math.min(prev + 1, TOTAL_STAGES - 1));
  };

  const prevStage = () => setStage((prev) => Math.max(prev - 1, 0));
  const goToStage = (target: number) => {
    if (stage === 0 && !isAmbientPlaying && !isAmbientMuted) {
      startAmbient();
    }
    setStage(target);
  };

  // When song naturally finishes
  const handleSongEnded = () => {
    setIsSongPlaying(false);
    // Resume ambient tune once song ends
    if (!isAmbientMuted) {
      startAmbient();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (ambientSynth) {
        ambientSynth.stop();
      }
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center select-none">
      {/* Dreamy Ambient Particles */}
      <Particles />

      {/* Interactive Cursor Trail */}
      <CursorTrail />

      {/* Persistent Audio Elements */}
      {siteConfig.ambientTune?.audioSrc && (
        <audio
          ref={ambientAudioRef}
          src={siteConfig.ambientTune.audioSrc}
          loop
          preload="auto"
        />
      )}

      {activeSong.audioSrc && (
        <audio
          ref={songAudioRef}
          src={activeSong.audioSrc}
          loop={false}
          preload="auto"
          onEnded={handleSongEnded}
        />
      )}

      {/* Floating Ambient Tune Toggle (Top-Left) */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={toggleAmbient}
        className="fixed top-4 left-4 z-40 flex items-center gap-2 bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-200/80 shadow-md text-xs font-bold text-brand-text hover:text-brand-primary hover:bg-pink-50 transition-all cursor-pointer"
        title={isAmbientPlaying ? "Pause background melody" : "Play background melody"}
      >
        {isAmbientPlaying ? (
          <Volume2 className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-gray-400" />
        )}
        <span className="hidden sm:inline">
          {isAmbientPlaying ? "Ambient Tune: On" : "Ambient Tune: Off"}
        </span>
      </motion.button>

      {/* Floating Mini Song Player (Top-Right, active when song was started and user is on another page) */}
      <AnimatePresence>
        {stage !== 2 && (hasInteractedSong || isSongPlaying) && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 right-4 z-40 flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-200/80 shadow-[0_4px_20px_rgba(255,75,130,0.15)]"
          >
            <div className="flex items-center gap-1.5">
              <Disc
                className={`w-3.5 h-3.5 text-brand-primary ${
                  isSongPlaying ? "animate-spin-slow" : ""
                }`}
              />
              <span className="text-xs font-semibold text-brand-text max-w-[90px] truncate hidden sm:inline">
                {activeSong.title}
              </span>
            </div>

            {/* Mini Equalizer */}
            {isSongPlaying && (
              <div className="flex items-end gap-0.5 h-3">
                {[12, 8, 14, 6].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ["3px", `${h}px`, "4px"] }}
                    transition={{
                      duration: 0.5 + i * 0.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-0.5 bg-pink-500 rounded-full"
                  />
                ))}
              </div>
            )}

            <button
              onClick={toggleSongPlay}
              className="w-6 h-6 rounded-full bg-pink-100 hover:bg-pink-200 text-brand-primary flex items-center justify-center transition-colors cursor-pointer"
              title={isSongPlaying ? "Pause song" : "Play song"}
            >
              {isSongPlaying ? (
                <Pause className="w-3 h-3 fill-current" />
              ) : (
                <Play className="w-3 h-3 fill-current ml-0.5" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Experience Stages */}
      <AnimatePresence mode="wait">
        {stage === 0 && <Welcome key="welcome" onNext={nextStage} />}
        {stage === 1 && <OpenLetter key="letter" onNext={nextStage} />}
        {stage === 2 && (
          <MusicPlayer
            key="music"
            onNext={nextStage}
            isPlaying={isSongPlaying}
            onTogglePlay={toggleSongPlay}
            audioRef={songAudioRef}
            currentSongIndex={activeSongIndex}
            onSelectSong={selectSong}
          />
        )}
        {stage === 3 && <ReasonsGallery key="reasons" onNext={nextStage} />}
        {stage === 4 && <PhotoGallery key="photos" onNext={nextStage} />}
        {stage === 5 && <TriviaGame key="game" onNext={nextStage} />}
        {stage === 6 && <SecretVault key="secret" onNext={nextStage} />}
        {stage === 7 && <Countdown key="countdown" onNext={nextStage} />}
        {stage === 8 && <FinalReveal key="reveal" onNext={nextStage} />}
        {stage === 9 && <FinalMessage key="message" />}
      </AnimatePresence>

      {/* Universal Floating Navigation Dock */}
      <nav
        aria-label="Chapter navigation"
        className="fixed bottom-4 z-40 flex items-center gap-2 sm:gap-3 px-3.5 py-2 rounded-full bg-white/85 backdrop-blur-md border border-pink-200/80 shadow-[0_8px_30px_rgba(255,75,130,0.2)]"
      >
        {/* Back Button */}
        <button
          onClick={prevStage}
          disabled={stage === 0}
          className={`flex items-center gap-1 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full transition-all duration-200 ${
            stage === 0
              ? "opacity-30 cursor-not-allowed text-gray-400"
              : "text-brand-text hover:text-brand-primary hover:bg-pink-50 cursor-pointer active:scale-95"
          }`}
          title="Previous Chapter"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Clickable Chapter Progress Dots */}
        <div className="flex items-center gap-1 sm:gap-1.5 px-1">
          {Array.from({ length: TOTAL_STAGES }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToStage(idx)}
              className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
              title={`Go to chapter ${idx + 1}`}
            >
              <span
                className={`block transition-all duration-300 rounded-full ${
                  idx === stage
                    ? "w-4 sm:w-5 h-2 bg-gradient-to-r from-pink-500 to-purple-500 shadow-xs"
                    : idx < stage
                    ? "w-2 h-2 bg-pink-300 hover:bg-pink-400"
                    : "w-2 h-2 bg-pink-100 hover:bg-pink-200"
                }`}
              />
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}
