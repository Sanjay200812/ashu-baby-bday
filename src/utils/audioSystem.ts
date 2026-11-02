/**
 * Web Audio Sound Effects & Music Manager
 * Zero-dependency procedural sound effects + fallback music-box synthesizer
 * Fully supports custom MP3/WAV audio files with scrubbing, volume, and playback state.
 */

type AudioListener = () => void;

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  // Reference to Background Video element powering website sound
  private bgVideo: HTMLVideoElement | null = null;
  public currentTrack: 'none' | 'bgvideo' = 'none';

  private synthLoopTimer: number | null = null;
  private isSynthPlaying: boolean = false;
  private synthTime: number = 0;
  private synthDuration: number = 48; // Loop duration in seconds for synth melody
  private synthInterval: number | null = null;

  // React state listeners
  private listeners: Set<AudioListener> = new Set();

  public isMusicPlaying: boolean = false;
  public currentTime: number = 0;
  public duration: number = 0;
  public volume: number = 0.8;
  public hasUserInteracted: boolean = false;
  public isUsingSynthFallback: boolean = false;
  public isTemporarilyMuted: boolean = false;

  constructor() {
    // Zero separate audio elements loaded - background video is the sound source
  }

  public registerBgVideo(video: HTMLVideoElement) {
    this.bgVideo = video;
    if (this.isTemporarilyMuted) {
      this.bgVideo.muted = true;
      this.bgVideo.volume = 0;
      return;
    }
    if (this.isMusicPlaying && !this.isMuted) {
      this.bgVideo.muted = false;
      this.bgVideo.volume = this.volume;
      this.bgVideo.play().catch(() => {});
    } else {
      this.bgVideo.muted = true;
    }
  }

  public unregisterBgVideo() {
    this.bgVideo = null;
  }

  private initContext() {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx && this.ctx.state === 'suspended' && this.hasUserInteracted) {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // AudioContext unavailable or autoplay blocked
    }
  }

  public registerUserInteraction() {
    this.hasUserInteracted = true;
    this.initContext();
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // ===================== SOUND EFFECTS =====================

  public playJump() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Ignore
    }
  }

  public playScore() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const notes = [659.25, 880, 1046.5]; // E5, A5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime + idx * 0.05;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.28);
      });
    } catch {
      // Ignore
    }
  }

  public playHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.25);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore
    }
  }

  public playPop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // High quick click + low thump
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Ignore
    }
  }

  public playCardFlip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore
    }
  }

  public playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      // Fanfare: C5 - E5 - G5 - C6
      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime + idx * 0.1;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.6);
      });
    } catch {
      // Ignore
    }
  }

  public playCandleBlow() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      // White noise puff for blowing out candle
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
    } catch {
      // Ignore
    }
  }

  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore
    }
  }

  // ===================== BACKGROUND VIDEO SOUNDTRACK SYSTEM =====================

  public muteBgMusicTemporarily() {
    this.isTemporarilyMuted = true;
    this.isMusicPlaying = false;
    if (this.bgVideo) {
      this.bgVideo.muted = true;
      this.bgVideo.volume = 0;
    }
    this.stopSynthMelody();
    this.notify();
  }

  public unmuteBgMusic() {
    this.isTemporarilyMuted = false;
    this.playSiteMusic();
  }

  public playSiteMusic() {
    if (this.isTemporarilyMuted) {
      if (this.bgVideo) {
        this.bgVideo.muted = true;
        this.bgVideo.volume = 0;
      }
      return;
    }
    this.registerUserInteraction();
    this.currentTrack = 'bgvideo';
    this.isMusicPlaying = true;

    if (this.bgVideo) {
      this.bgVideo.muted = this.isMuted;
      this.bgVideo.volume = this.isMuted ? 0 : this.volume;
      this.bgVideo.play().catch((err) => {
        console.warn('Background video play pending gesture:', err);
      });
    }
    this.notify();
  }

  public playFlapMusic() {
    // User instruction: remove bg-music and keep music of given background video
    this.playSiteMusic();
  }

  public stopFlapMusicAndResumeSite() {
    this.playSiteMusic();
  }

  public playMusic(_songUrl?: string) {
    this.playSiteMusic();
  }

  public pauseMusic() {
    this.isMusicPlaying = false;
    if (this.bgVideo) {
      this.bgVideo.muted = true;
      this.bgVideo.volume = 0;
    }
    this.stopSynthMelody();
    this.notify();
  }

  public resumeMusic() {
    this.playSiteMusic();
  }

  public togglePlay(_songUrl?: string) {
    if (this.isMusicPlaying) {
      this.pauseMusic();
    } else {
      this.playSiteMusic();
    }
  }

  public seek(timeSeconds: number) {
    if (this.bgVideo && this.bgVideo.duration) {
      this.bgVideo.currentTime = Math.max(0, Math.min(timeSeconds, this.bgVideo.duration));
      this.currentTime = this.bgVideo.currentTime;
      this.notify();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.bgVideo) {
      this.bgVideo.volume = this.isMuted ? 0 : this.volume;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.registerUserInteraction();
    this.isMuted = !this.isMuted;
    if (this.bgVideo) {
      this.bgVideo.muted = this.isMuted;
      this.bgVideo.volume = this.isMuted ? 0 : this.volume;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    this.notify();
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // ===================== PROCEDURAL MUSIC BOX =====================
  // Happy Birthday Chime Melody in F Major / C Major (warm music box synth)
  private startSynthMelody() {
    this.isSynthPlaying = true;
    this.isUsingSynthFallback = true;
    this.duration = this.synthDuration;

    if (this.synthInterval) clearInterval(this.synthInterval);
    this.synthInterval = window.setInterval(() => {
      if (this.isSynthPlaying) {
        this.synthTime = (this.synthTime + 0.25) % this.synthDuration;
        this.currentTime = this.synthTime;
        this.notify();
      }
    }, 250);

    const scheduleSequence = () => {
      if (!this.isSynthPlaying) return;

      // Note frequencies (Happy Birthday melody)
      // C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392, A4=440, Bb4=466.16, B4=493.88, C5=523.25
      const notes: [number, number, number][] = [
        // [freq, duration, pause]
        [261.63, 0.35, 0.45], // Hap-
        [261.63, 0.20, 0.25], // py
        [293.66, 0.55, 0.65], // birth-
        [261.63, 0.55, 0.65], // day
        [349.23, 0.55, 0.65], // to
        [329.63, 0.90, 1.10], // you...

        [261.63, 0.35, 0.45], // Hap-
        [261.63, 0.20, 0.25], // py
        [293.66, 0.55, 0.65], // birth-
        [261.63, 0.55, 0.65], // day
        [392.00, 0.55, 0.65], // to
        [349.23, 0.90, 1.10], // you...

        [261.63, 0.35, 0.45], // Hap-
        [261.63, 0.20, 0.25], // py
        [523.25, 0.55, 0.65], // birth-
        [440.00, 0.55, 0.65], // day
        [349.23, 0.55, 0.65], // dear
        [329.63, 0.55, 0.65], // [Name]
        [293.66, 0.80, 0.95],

        [466.16, 0.35, 0.45], // Hap-
        [466.16, 0.20, 0.25], // py
        [440.00, 0.55, 0.65], // birth-
        [349.23, 0.55, 0.65], // day
        [392.00, 0.55, 0.65], // to
        [349.23, 1.20, 1.50], // you!
      ];

      let delay = 0;
      notes.forEach(([freq, dur, gap]) => {
        setTimeout(() => {
          if (!this.isSynthPlaying || this.isMuted) return;
          this.playBellNote(freq, dur);
          // Accompanying soft bass note on downbeats
          if (gap > 0.8) {
            this.playBellNote(freq / 2, dur * 1.5, 0.08);
          }
        }, delay * 1000);
        delay += gap;
      });

      // Loop after all notes finish
      this.synthLoopTimer = window.setTimeout(() => {
        if (this.isSynthPlaying) {
          scheduleSequence();
        }
      }, (delay + 1.2) * 1000);
    };

    scheduleSequence();
  }

  private playBellNote(freq: number, duration: number, gainMul = 0.14) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Bell chime overtone
      const oscOvertone = this.ctx.createOscillator();
      const gainOvertone = this.ctx.createGain();
      oscOvertone.type = 'triangle';
      oscOvertone.frequency.setValueAtTime(freq * 2.01, now);

      const effectiveGain = gainMul * (this.isMuted ? 0 : this.volume);
      gain.gain.setValueAtTime(effectiveGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      gainOvertone.gain.setValueAtTime(effectiveGain * 0.4, now);
      gainOvertone.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      oscOvertone.connect(gainOvertone);
      gainOvertone.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
      oscOvertone.start(now);
      oscOvertone.stop(now + duration);
    } catch {
      // Ignore
    }
  }

  private stopSynthMelody() {
    this.isSynthPlaying = false;
    if (this.synthLoopTimer) {
      clearTimeout(this.synthLoopTimer);
      this.synthLoopTimer = null;
    }
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }
}

export const soundSystem = new SoundSystem();

