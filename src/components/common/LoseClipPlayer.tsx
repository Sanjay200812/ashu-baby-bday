import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, RotateCcw, AlertTriangle } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface LoseClipPlayerProps {
  maxHeight?: string;
  onEnded?: () => void;
  onResumeMusic?: () => void;
}

export const LoseClipPlayer: React.FC<LoseClipPlayerProps> = ({
  maxHeight = '210px',
  onEnded,
  onResumeMusic,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    // 1. Pause background game/site music while lose clip plays
    soundSystem.pauseMusic();

    const video = videoRef.current;
    if (!video) return;

    // Reset video to start
    video.currentTime = 0;

    // Attempt unmuted playback first
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch(() => {
          // Autoplay with sound was blocked by browser policy -> fallback to muted autoplay
          video.muted = true;
          setIsMuted(true);
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Both failed, wait for click
              setIsPlaying(false);
            });
        });
    }

    return () => {
      // Cleanup on unmount (when retry button is clicked or game changes)
      if (onResumeMusic) {
        onResumeMusic();
      }
    };
  }, [onResumeMusic]);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      setIsMuted(false);
      video.play().catch(() => {});
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const handleRestartClip = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#000000',
        border: '1.5px solid rgba(255, 42, 75, 0.7)',
        boxShadow: '0 8px 25px rgba(255, 42, 75, 0.4)',
        marginBottom: '14px',
      }}
    >
      <video
        ref={videoRef}
        src={BIRTHDAY_CONFIG.loseClipUrl}
        playsInline
        loop
        preload="auto"
        controls={false}
        onPlay={() => setIsPlaying(true)}
        onEnded={() => {
          if (onEnded) onEnded();
        }}
        onError={(err) => {
          console.error('Lose clip load error:', err);
          setLoadError(true);
        }}
        style={{
          width: '100%',
          maxHeight: maxHeight,
          display: 'block',
          backgroundColor: '#000',
          objectFit: 'contain',
        }}
      >
        <source src={BIRTHDAY_CONFIG.loseClipUrl} type="video/mp4" />
      </video>

      {/* Unmute / Audio Overlay Pill */}
      {isMuted && isPlaying && (
        <button
          onClick={toggleAudio}
          className="pulse-cyber"
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 42, 75, 0.95)',
            color: '#fff',
            border: '1px solid #fff',
            borderRadius: '20px',
            padding: '5px 12px',
            fontSize: '0.72rem',
            fontWeight: 800,
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 0 15px rgba(255, 42, 75, 0.7)',
          }}
        >
          <VolumeX size={14} />
          <span>TAP FOR AUDIO 🔊</span>
        </button>
      )}

      {/* Controls Overlay: Quick Restart & Sound Toggle */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          display: 'flex',
          gap: '6px',
          zIndex: 10,
        }}
      >
        <button
          onClick={toggleAudio}
          title={isMuted ? 'Unmute' : 'Mute'}
          style={{
            background: 'rgba(5, 5, 8, 0.85)',
            border: '1px solid rgba(255, 42, 75, 0.5)',
            borderRadius: '4px',
            color: isMuted ? '#ff2a4b' : '#ffb703',
            padding: '4px 6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.68rem',
          }}
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>

        <button
          onClick={handleRestartClip}
          title="Replay Clip"
          style={{
            background: 'rgba(5, 5, 8, 0.85)',
            border: '1px solid rgba(255, 42, 75, 0.5)',
            borderRadius: '4px',
            color: '#cbd5e1',
            padding: '4px 6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.68rem',
          }}
        >
          <RotateCcw size={13} />
        </button>
      </div>

      {loadError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(5, 5, 8, 0.95)',
            color: '#ff2a4b',
            padding: '12px',
            textAlign: 'center',
          }}
        >
          <AlertTriangle size={24} style={{ marginBottom: '6px' }} />
          <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>LOSE CLIP FAILED TO LOAD</div>
        </div>
      )}
    </div>
  );
};

export default LoseClipPlayer;
