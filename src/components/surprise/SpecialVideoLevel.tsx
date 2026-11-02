import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Film, ArrowRight, ArrowLeft, Terminal, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface SpecialVideoLevelProps {
  onComplete: () => void;
  onBack?: () => void;
}

export const SpecialVideoLevel: React.FC<SpecialVideoLevelProps> = ({ onComplete, onBack }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasFinished, setHasFinished] = useState<boolean>(false);
  const [maxPlayedTime, setMaxPlayedTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Pause music on mount/play, resume on unmount
  useEffect(() => {
    return () => {
      soundSystem.playSiteMusic();
    };
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
    soundSystem.pauseMusic();
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (!hasFinished) {
      soundSystem.playSiteMusic();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;

    // Prevent fast-forwarding / skipping
    if (current > maxPlayedTime + 1.5) {
      videoRef.current.currentTime = maxPlayedTime;
    } else {
      setMaxPlayedTime(Math.max(maxPlayedTime, current));
    }
  };

  const handleEnded = () => {
    setHasFinished(true);
    setIsPlaying(false);
    soundSystem.playVictory();
    soundSystem.playSiteMusic();

    confetti({
      particleCount: 160,
      spread: 90,
      colors: ['#ff2a4b', '#ffb703', '#ffffff', '#ff1744'],
    });
  };

  const handleProceed = () => {
    if (!hasFinished) return;
    soundSystem.playClick();
    soundSystem.playSiteMusic();
    onComplete();
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '760px',
        margin: '0 auto',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        fontFamily: 'var(--font-mono)',
        backgroundColor: 'transparent',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onBack && (
            <button
              onClick={() => {
                soundSystem.playClick();
                soundSystem.playSiteMusic();
                onBack();
              }}
              className="btn-cyber-secondary"
              style={{ padding: '4px 10px', fontSize: '0.72rem' }}
            >
              <ArrowLeft size={12} />
              <span>BACK</span>
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff2a4b', fontSize: '0.82rem', fontWeight: 800 }}>
            <Film size={15} />
            <span>SPECIAL TRIBUTE REEL // MANDATORY PLAYBACK</span>
          </div>
        </div>

        <div style={{ fontSize: '0.78rem', color: hasFinished ? '#ffb703' : '#9e646d', fontWeight: 700 }}>
          {hasFinished ? '✓ REEL COMPLETE' : '⏳ WATCH TO UNLOCK'}
        </div>
      </div>

      {/* Main Terminal Frame */}
      <div
        className="terminal-panel"
        style={{
          width: '100%',
          border: '1.5px solid #ff2a4b',
          boxShadow: '0 0 50px rgba(255, 42, 75, 0.4)',
          borderRadius: '12px',
          padding: '24px 20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 183, 3, 0.1)',
            border: '1px solid #ffb703',
            borderRadius: '20px',
            padding: '5px 16px',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#ffb703',
            marginBottom: '12px',
          }}
        >
          <Sparkles size={14} />
          <span>ASHUU BIRTHDAY SPECIAL VIDEO</span>
        </div>

        <h2
          style={{
            fontSize: '1.35rem',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '6px',
          }}
        >
          TRIBUTE REEL: MEMORIES & VIBES 🎬
        </h2>

        <p style={{ color: '#cbd5e1', fontSize: '0.84rem', marginBottom: '16px', lineHeight: 1.5 }}>
          Video start avvagane background music pause avthadi. Full video chusaka next level unlock avthadi!
        </p>

        {/* Video Player */}
        <div
          style={{
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#000',
            border: '1.5px solid rgba(255, 42, 75, 0.5)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.95)',
            marginBottom: '20px',
          }}
        >
          <video
            ref={videoRef}
            src={BIRTHDAY_CONFIG.specialVideoUrl}
            controls
            playsInline
            preload="auto"
            poster={BIRTHDAY_CONFIG.photoUrl}
            onPlay={handlePlay}
            onPause={handlePause}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onError={(e) => {
              console.error('Special video error event:', e);
            }}
            style={{
              width: '100%',
              maxHeight: '440px',
              display: 'block',
              backgroundColor: '#000',
            }}
          >
            <source src={BIRTHDAY_CONFIG.specialVideoUrl} type="video/mp4" />
          </video>
        </div>

        {/* Level Unlock Status / Button */}
        <div>
          {hasFinished ? (
            <button
              onClick={handleProceed}
              className="btn-cyber-primary pulse-cyber"
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '1rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
              }}
            >
              <CheckCircle2 size={18} />
              <span>[ VIDEO COMPLETE! PROCEED TO GIFTS VAULT ➔ ]</span>
            </button>
          ) : (
            <div
              style={{
                background: 'rgba(255, 42, 75, 0.08)',
                border: '1px solid rgba(255, 42, 75, 0.3)',
                borderRadius: '8px',
                padding: '14px',
                color: '#9e646d',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 700,
              }}
            >
              <Lock size={16} color="#ff2a4b" />
              <span>Next Level is Locked — Please watch the entire video to proceed!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialVideoLevel;
