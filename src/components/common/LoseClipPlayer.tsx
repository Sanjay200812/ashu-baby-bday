import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    // 1. Pause background game/site music while lose clip plays
    soundSystem.pauseMusic();

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;

    // Play with original sound
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setLoadError(false);
        })
        .catch(() => {
          // If browser policy temporarily blocks unmuted autoplay, mute and play immediately
          video.muted = true;
          video
            .play()
            .then(() => {
              setIsPlaying(true);
              setLoadError(false);
            })
            .catch(() => {
              setIsPlaying(false);
            });
        });
    }

    return () => {
      if (onResumeMusic) {
        onResumeMusic();
      }
    };
  }, [onResumeMusic]);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted) {
      video.muted = false;
    }
  };

  const handleRestartClip = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = false;
    video
      .play()
      .then(() => {
        setIsPlaying(true);
        setLoadError(false);
      })
      .catch(() => {});
  };

  const handleReload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadError(false);
    const video = videoRef.current;
    if (!video) return;
    video.load();
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
        cursor: 'pointer',
      }}
      onClick={handleVideoClick}
    >
      <video
        ref={videoRef}
        playsInline
        loop
        preload="auto"
        controls={false}
        onPlay={() => {
          setIsPlaying(true);
          setLoadError(false);
        }}
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

      {/* Replay Button Only (sound toggle icon removed as requested) */}
      {!loadError && (
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
      )}

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
            zIndex: 10,
          }}
        >
          <AlertTriangle size={24} style={{ marginBottom: '6px' }} />
          <div style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '6px' }}>LOSE CLIP FAILED TO LOAD</div>
          <button
            onClick={handleReload}
            className="btn-cyber-primary"
            style={{ padding: '4px 10px', fontSize: '0.72rem' }}
          >
            RETRY
          </button>
        </div>
      )}
    </div>
  );
};

export default LoseClipPlayer;
