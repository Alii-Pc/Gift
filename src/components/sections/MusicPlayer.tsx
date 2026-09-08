"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Music,
  Volume2,
  VolumeX,
  Disc,
  SkipBack,
  SkipForward,
  ListMusic,
} from "lucide-react";
import { siteConfig, SongConfig } from "@/data/config";

interface MusicPlayerProps {
  onNext: () => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
  currentSongIndex?: number;
  onSelectSong?: (index: number) => void;
}

export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export function MusicPlayer({
  onNext,
  isPlaying: externalIsPlaying,
  onTogglePlay: externalTogglePlay,
  audioRef: externalAudioRef,
  currentSongIndex: externalSongIndex,
  onSelectSong: externalSelectSong,
}: MusicPlayerProps) {
  // 3 Songs list
  const songs: SongConfig[] = siteConfig.songs && siteConfig.songs.length > 0
    ? siteConfig.songs
    : [siteConfig.song];

  const [internalSongIndex, setInternalSongIndex] = useState(0);
  const activeIndex = externalSongIndex !== undefined ? externalSongIndex : internalSongIndex;
  const currentSong = songs[activeIndex] || songs[0];

  // Playback state
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const internalAudioRef = useRef<HTMLAudioElement>(null);
  const audioRef = externalAudioRef || internalAudioRef;
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const youtubeId = currentSong.youtubeUrl ? getYouTubeId(currentSong.youtubeUrl) : null;

  const handleSelectSong = (index: number) => {
    if (externalSelectSong) {
      externalSelectSong(index);
    } else {
      setInternalSongIndex(index);
    }
    setHasError(false);
  };

  const handlePrevSong = () => {
    const nextIdx = (activeIndex - 1 + songs.length) % songs.length;
    handleSelectSong(nextIdx);
  };

  const handleNextSong = () => {
    const nextIdx = (activeIndex + 1) % songs.length;
    handleSelectSong(nextIdx);
  };

  const handleTogglePlay = () => {
    if (externalTogglePlay) {
      externalTogglePlay();
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setInternalIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => {
            setInternalIsPlaying(true);
            setHasError(false);
          })
          .catch((err) => {
            console.log("Audio play error:", err);
            setHasError(true);
          });
      }
    }
  };

  // Sync time and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      const nextIdx = (activeIndex + 1) % songs.length;
      if (externalSelectSong) {
        externalSelectSong(nextIdx);
      } else {
        setInternalSongIndex(nextIdx);
      }
    };
    const handleError = () => setHasError(true);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [audioRef, activeIndex, songs.length, externalSelectSong]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="flex flex-col items-center justify-center z-10 px-4 w-full max-w-lg mx-auto py-6 pb-32 select-none"
    >
      {/* Chapter header */}
      <div className="text-center mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-brand-primary text-xs font-bold tracking-widest uppercase mb-1.5 border border-pink-200">
          <Music className="w-3.5 h-3.5" /> 3 Special Songs
        </span>
        <h2 className="text-3xl md:text-4xl font-serif gradient-text font-bold">
          Our Soundtrack
        </h2>
      </div>

      {/* Playlist Selector Tabs (3 Songs) */}
      <div className="w-full flex items-center justify-center gap-2 mb-5 p-1 bg-white/70 backdrop-blur-md rounded-2xl border border-pink-200/80 shadow-xs max-w-md">
        {songs.map((s, idx) => (
          <button
            key={s.id || idx}
            onClick={() => handleSelectSong(idx)}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer truncate flex items-center justify-center gap-1.5 ${
              activeIndex === idx
                ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-sm scale-102"
                : "text-brand-text/70 hover:text-brand-primary hover:bg-pink-50"
            }`}
            title={s.title}
          >
            <span className="opacity-80">#{idx + 1}</span>
            <span className="truncate">{s.title}</span>
          </button>
        ))}
      </div>

      {youtubeId ? (
        /* YouTube Embed Player */
        <div className="w-full cute-card p-5 cute-shadow mb-6 overflow-hidden flex flex-col items-center">
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md border-2 border-pink-100 mb-3 bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&enablejsapi=1`}
              title="YouTube song player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <div className="text-center mb-3">
            <h3 className="text-lg font-serif text-brand-text font-bold">{currentSong.title}</h3>
            <p className="text-xs text-brand-secondary font-bold tracking-wider uppercase mt-0.5">
              {currentSong.artist}
            </p>
          </div>

          {/* Playlist navigation buttons for YouTube */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevSong}
              className="p-2.5 rounded-full hover:bg-pink-100 text-brand-text cursor-pointer transition-colors"
              title="Previous song"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-brand-text/60">
              Track {activeIndex + 1} of {songs.length}
            </span>
            <button
              onClick={handleNextSong}
              className="p-2.5 rounded-full hover:bg-pink-100 text-brand-text cursor-pointer transition-colors"
              title="Next song"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Cute Spinning Vinyl Player for MP3 */
        <div className="w-full cute-card p-5 md:p-6 cute-shadow mb-6 relative flex flex-col items-center border-2 border-pink-100/80 backdrop-blur-sm">
          {/* Floating musical notes while playing */}
          {isPlaying && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {["♪", "♫", "♬", "♩"].map((note, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 80, x: (idx - 1.5) * 45 }}
                  animate={{
                    opacity: [0, 0.9, 0],
                    y: -100,
                    x: (idx - 1.5) * 60 + Math.sin(idx) * 20,
                  }}
                  transition={{
                    duration: 3 + idx * 0.5,
                    repeat: Infinity,
                    delay: idx * 0.7,
                    ease: "easeOut",
                  }}
                  className="absolute bottom-20 left-1/2 text-2xl font-serif text-pink-400 select-none"
                >
                  {note}
                </motion.span>
              ))}
            </div>
          )}

          {/* Vinyl Record Container */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 mb-4 flex items-center justify-center">
            {/* Tone Arm Needle */}
            <motion.div
              initial={false}
              animate={{ rotate: isPlaying ? 28 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ transformOrigin: "top right" }}
              className="absolute -top-3 right-5 z-20 w-16 h-24 pointer-events-none drop-shadow-md hidden sm:block"
            >
              <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-neutral-300 border-2 border-neutral-400 shadow" />
              <div className="absolute top-2.5 right-1.5 w-1.5 h-18 bg-neutral-400 origin-top rotate-[-12deg]" />
              <div className="absolute bottom-3 left-2 w-3.5 h-5 rounded-sm bg-neutral-700 rotate-[20deg]" />
            </motion.div>

            {/* Vinyl Record */}
            <div
              className={`w-full h-full rounded-full shadow-2xl relative flex items-center justify-center border-4 border-neutral-800 vinyl-grooves ${
                isPlaying ? "animate-spin-slow" : "animate-spin-slow paused"
              }`}
            >
              {/* Vinyl Sheen Overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 via-transparent to-white/15 pointer-events-none" />

              {/* Center Record Label */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 p-1.5 shadow-inner flex items-center justify-center relative overflow-hidden border-2 border-pink-200">
                {currentSong.coverArt && currentSong.coverArt !== "/assets/cover.jpg" ? (
                  <div
                    className="w-full h-full rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${currentSong.coverArt})` }}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-pink-100 flex flex-col items-center justify-center text-center p-1.5">
                    <Disc className="w-7 h-7 text-brand-primary animate-pulse" />
                    <span className="text-[9px] font-bold text-brand-text truncate max-w-[60px] mt-0.5">
                      {currentSong.title}
                    </span>
                  </div>
                )}
                {/* Center Spindle Hole */}
                <div className="w-3.5 h-3.5 rounded-full bg-neutral-900 absolute border border-neutral-700" />
              </div>
            </div>
          </div>

          {/* Song Metadata */}
          <div className="text-center mb-3 z-10">
            <span className="text-[11px] font-bold text-brand-primary/80 uppercase tracking-wider block">
              Track {activeIndex + 1} of {songs.length}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-brand-text font-bold tracking-tight mt-0.5">
              {currentSong.title}
            </h3>
            <p className="text-xs text-brand-secondary font-bold tracking-widest uppercase mt-0.5">
              {currentSong.artist}
            </p>
          </div>

          {/* Animated Dancing Equalizer Bars */}
          <div className="flex items-end justify-center gap-1.5 h-7 mb-4">
            {[40, 75, 55, 95, 60, 85, 45, 90, 65, 80, 50, 70].map((height, i) => (
              <motion.div
                key={i}
                animate={
                  isPlaying
                    ? {
                        height: [`${Math.max(20, height * 0.3)}%`, `${height}%`, `${Math.max(15, height * 0.4)}%`],
                      }
                    : { height: "15%" }
                }
                transition={
                  isPlaying
                    ? {
                        duration: 0.6 + (i % 3) * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: (i % 4) * 0.1,
                      }
                    : { duration: 0.3 }
                }
                className="w-1 bg-gradient-to-t from-pink-400 to-purple-400 rounded-full"
                style={{ minHeight: "4px" }}
              />
            ))}
          </div>

          {/* Time Scrubber */}
          <div className="w-full flex flex-col gap-1 mb-4 z-10 px-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
            />
            <div className="flex justify-between text-[11px] text-brand-text/60 font-semibold px-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback & Track Controls (⏮️, ▶️/⏸️, ⏭️) */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 z-10">
            {/* Mute Toggle */}
            <button
              onClick={toggleMute}
              className="p-2.5 rounded-full hover:bg-pink-50 text-brand-text/70 hover:text-brand-primary transition-colors cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Previous Track Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevSong}
              className="p-3 rounded-full bg-pink-50 hover:bg-pink-100 text-brand-primary shadow-xs transition-colors cursor-pointer"
              title="Previous Track"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </motion.button>

            {/* Play/Pause Button */}
            <div className="relative">
              {isPlaying && (
                <div className="absolute inset-0 rounded-full bg-pink-400 blur-md opacity-40 animate-pulse-ring" />
              )}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleTogglePlay}
                className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-white" />
                ) : (
                  <Play className="w-7 h-7 fill-white ml-0.5" />
                )}
              </motion.button>
            </div>

            {/* Next Track Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNextSong}
              className="p-3 rounded-full bg-pink-50 hover:bg-pink-100 text-brand-primary shadow-xs transition-colors cursor-pointer"
              title="Next Track"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </motion.button>

            {/* Playlist Pill Indicator */}
            <div
              className="p-2.5 rounded-full text-brand-text/50"
              title={`Playing track ${activeIndex + 1} of ${songs.length}`}
            >
              <ListMusic className="w-4 h-4" />
            </div>
          </div>

          {/* Friendly Note if audio file is not yet placed */}
          {hasError && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3.5 p-2.5 rounded-xl bg-pink-50/90 border border-pink-200 text-xs text-brand-text/80 text-center max-w-xs"
            >
              💡 <strong>Tip:</strong> Place{" "}
              <code className="bg-white px-1 py-0.5 rounded text-pink-600 font-mono text-[11px]">
                {currentSong.audioSrc || "song.mp3"}
              </code>{" "}
              in <code className="text-purple-600">public/assets/</code> or set a YouTube link!
            </motion.div>
          )}

          {/* Local Audio Element if not passed from parent */}
          {!externalAudioRef && (
            <audio
              ref={internalAudioRef}
              src={currentSong.audioSrc}
              loop
              preload="metadata"
            />
          )}
        </div>
      )}

      {/* Next Chapter Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="btn-cute cursor-pointer flex items-center gap-2 mb-4"
      >
        <span>Next Chapter</span>
        <span>🎵</span>
      </motion.button>
    </motion.div>
  );
}
