/**
 * Ambient Music Box Synthesizer
 * Generates a soft, dreamy music-box chime melody using Web Audio API
 * Used when no ambient.mp3 file is provided or as a sweet fallback.
 */

class AmbientSynth {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;

  // Romantic Pentatonic chime notes (Hz): C4, D4, E4, G4, A4, C5, D5, E5
  private notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
  // Gentle lullaby pattern
  private melodyPattern = [0, 2, 4, 3, 2, 5, 4, 2, 1, 3, 5, 7, 6, 4, 2, 0];
  private step = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.04, this.ctx.currentTime); // very soft & soothing
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  private playTone(freq: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Bell-like chime envelope
    const now = this.ctx.currentTime;
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.25, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    osc.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.7);
  }

  public start() {
    if (this.isRunning) return;
    this.initContext();
    this.isRunning = true;

    const tick = () => {
      if (!this.isRunning) return;

      const noteIdx = this.melodyPattern[this.step % this.melodyPattern.length];
      const freq = this.notes[noteIdx];
      this.playTone(freq);

      // Occasionally add a sweet harmony note
      if (this.step % 4 === 0) {
        const harmonyIdx = (noteIdx + 3) % this.notes.length;
        this.playTone(this.notes[harmonyIdx]);
      }

      this.step++;
      this.timerId = window.setTimeout(tick, 900); // peaceful tempo
    };

    tick();
  }

  public pause() {
    this.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public resume() {
    if (!this.isRunning) {
      this.start();
    }
  }

  public stop() {
    this.pause();
    this.step = 0;
  }
}

export const ambientSynth = typeof window !== "undefined" ? new AmbientSynth() : (null as unknown as AmbientSynth);
