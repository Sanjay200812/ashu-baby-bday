import { useState, useEffect } from 'react';
import { soundSystem } from './audioSystem';

export function useAudio() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = soundSystem.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  return {
    isPlaying: soundSystem.isMusicPlaying,
    currentTime: soundSystem.currentTime,
    duration: soundSystem.duration,
    volume: soundSystem.volume,
    isMuted: soundSystem.getIsMuted(),
    isUsingSynth: soundSystem.isUsingSynthFallback,
    togglePlay: (url?: string) => soundSystem.togglePlay(url),
    play: (url?: string) => soundSystem.playMusic(url),
    pause: () => soundSystem.pauseMusic(),
    seek: (t: number) => soundSystem.seek(t),
    setVolume: (v: number) => soundSystem.setVolume(v),
    toggleMute: () => soundSystem.toggleMute(),
    playJump: () => soundSystem.playJump(),
    playScore: () => soundSystem.playScore(),
    playHit: () => soundSystem.playHit(),
    playVictory: () => soundSystem.playVictory(),
    playPop: () => soundSystem.playPop(),
    playCardFlip: () => soundSystem.playCardFlip(),
    playCandleBlow: () => soundSystem.playCandleBlow(),
    playClick: () => soundSystem.playClick(),
  };
}

