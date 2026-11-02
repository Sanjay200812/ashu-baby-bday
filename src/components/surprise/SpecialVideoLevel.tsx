import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Film, ArrowRight, ArrowLeft, Sparkles, CheckCircle2, Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface SpecialVideoLevelProps {
  onComplete: () => void;
  onBack?: () => void;
}

export const SpecialVideoLevel: React.FC<SpecialVideoLevelProps> = ({ onComplete, onBack }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasFinished, setHasFinished] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Pause background site music while video is active, resume on unmount
  useEffect(() => {
    soundSystem.pauseMusic();
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
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch((err) => console.warn('Video play error:', err));
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  const handleEnded = () => {
    setHasFinished(true);
    setIsPlaying(false);
    soundSystem.playVictory();

    confetti({
      particleCount: 160,
      spread: 90,
      colors: ['#ff2a4b', '#ffb703', '#ffffff', '#ff1744'],
    });
  };

  const handleProceed = () => {
    soundSystem.playClick();
    soundSystem.playSiteMusic();
    onComplete();
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '780px',
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
            <span>LEVEL 8 // SPECIAL TRIBUTE REEL</span>
          </div>
        </div>

        <div style={{ fontSize: '0.78rem', color: hasFinished ? '#ffb703' : '#9e646d', fontWeight: 700 }}>
          {hasFinished ? '✓ REEL COMPLETE' : '🎬 SPECIAL REEL'}
        </div>
      </div>

      {/* Main Terminal Frame */}
      <div
        className="terminal-panel"
        style={{
          width: '100%',
          border: '1.5px solid #ff2a4b',
          boxShadow: '0 0 50px rgba(255, 42, 75, 0.45)',
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
          Video start avvagane background song pause avthadi. Full tribute chusi enjoy chey Ashuu!
        </p>

        {/* Video Player Box */}
        <div
          style={{
            position: 'relative',
            borderRadius: '10px',
            overflow: 'hidden',
            background: '#000000',
            border: '2px solid rgba(255, 42, 75, 0.6)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.95)',
            marginBottom: '16px',
          }}
        >
          <video
            ref={videoRef}
            src={BIRTHDAY_CONFIG.specialVideoUrl}
            controls
            playsInline
            preload="metadata"
            onPlay={handlePlay}
            onPause={handlePause}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onError={(e) => {
              console.error('Special video error event:', e);
            }}
            style={{
              width: '100%',
              maxHeight: '460px',
              display: 'block',
              backgroundColor: '#000',
            }}
          >
            <source src={BIRTHDAY_CONFIG.specialVideoUrl} type="video/mp4" />
          </video>

          {/* Big Center Play Overlay Button when Paused */}
          {!isPlaying && (
            <div
              onClick={togglePlayPause}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(5, 5, 8, 0.45)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 5,
              }}
            >
              <div
                className="pulse-cyber"
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  background: 'rgba(255, 42, 75, 0.9)',
                  border: '2px solid #fff',
                  boxShadow: '0 0 35px rgba(255, 42, 75, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  marginBottom: '10px',
                }}
              >
                <Play size={34} style={{ marginLeft: '4px' }} fill="#fff" />
              </div>
              <span
                style={{
                  color: '#fff',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                  letterSpacing: '0.05em',
                }}
              >
                ▶ PLAY SPECIAL REEL
              </span>
            </div>
          )}
        </div>

        {/* Video Info & Progress Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 42, 75, 0.08)',
            border: '1px solid rgba(255, 42, 75, 0.25)',
            borderRadius: '6px',
            padding: '8px 14px',
            marginBottom: '18px',
            fontSize: '0.8rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffb703', fontWeight: 700 }}>
            <span>⏳ {formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={togglePlayPause}
              className="btn-cyber-secondary"
              style={{ padding: '4px 10px', fontSize: '0.74rem' }}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={toggleMute}
              className="btn-cyber-secondary"
              style={{ padding: '4px 8px', fontSize: '0.74rem' }}
            >
              {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
          </div>
        </div>

        {/* Level Proceed & Unlock Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
              <span>[ REEL COMPLETE! PROCEED TO GIFTS VAULT ➔ ]</span>
            </button>
          ) : (
            <button
              onClick={handleProceed}
              className="btn-cyber-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '0.94rem',
                fontWeight: 800,
                letterSpacing: '0.03em',
              }}
            >
              <span>[ CONTINUE TO LEVEL 9: GIFTS VAULT ➔ ]</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialVideoLevel;
