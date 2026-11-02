import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Film, ArrowLeft, Maximize, Minimize, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface SpecialVideoLevelProps {
  onComplete: () => void;
  onBack?: () => void;
}

export const SpecialVideoLevel: React.FC<SpecialVideoLevelProps> = ({ onComplete, onBack }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const maxWatchedTimeRef = useRef<number>(0);

  const [hasFinished, setHasFinished] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Pause background site music while video level is active; resume on unmount
  useEffect(() => {
    soundSystem.pauseMusic();

    // Attempt autoplay with sound
    const startVideo = () => {
      if (videoRef.current) {
        videoRef.current
          .play()
          .then(() => {
            setHasStarted(true);
            soundSystem.pauseMusic();
          })
          .catch(() => {
            // Autoplay with audio may require initial user gesture
            setHasStarted(false);
          });
      }
    };

    const timer = setTimeout(startVideo, 300);

    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      soundSystem.playSiteMusic();
    };
  }, []);

  const toggleFullscreen = () => {
    soundSystem.playClick();
    const elem = containerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }

    // Also ensure video starts playing if it was waiting for gesture
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setHasStarted(true);
    }
  };

  // Strictly disallow skipping/forwarding past watched time
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const current = video.currentTime;
    if (current > maxWatchedTimeRef.current + 1.2) {
      video.currentTime = maxWatchedTimeRef.current;
    } else {
      maxWatchedTimeRef.current = Math.max(maxWatchedTimeRef.current, current);
    }
  };

  const handleSeeking = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.currentTime > maxWatchedTimeRef.current + 0.5) {
      video.currentTime = maxWatchedTimeRef.current;
    }
  };

  const handleEnded = () => {
    setHasFinished(true);
    soundSystem.playVictory();

    // If currently in fullscreen mode, exit fullscreen so user can see next level button
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }

    confetti({
      particleCount: 180,
      spread: 95,
      colors: ['#ff2a4b', '#ffb703', '#ffffff', '#ff1744'],
    });
  };

  const handleProceed = () => {
    if (!hasFinished) return;
    soundSystem.playClick();
    soundSystem.playSiteMusic();
    onComplete();
  };

  const handleContainerTap = () => {
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setHasStarted(true);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto',
        padding: isFullscreen ? '0' : '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        fontFamily: 'var(--font-mono)',
        backgroundColor: 'transparent',
      }}
    >
      {/* Top Header - hidden in native fullscreen */}
      {!isFullscreen && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
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
            {hasFinished ? '✓ REEL COMPLETE' : '🔒 FULL PLAY REQUIRED'}
          </div>
        </div>
      )}

      {/* Main Container / Video Screen with only Fullscreen button */}
      <div
        ref={containerRef}
        onClick={handleContainerTap}
        className={isFullscreen ? '' : 'terminal-panel'}
        style={{
          position: 'relative',
          width: '100%',
          border: isFullscreen ? 'none' : '2px solid #ff2a4b',
          boxShadow: isFullscreen ? 'none' : '0 0 60px rgba(255, 42, 75, 0.45)',
          borderRadius: isFullscreen ? '0' : '14px',
          padding: isFullscreen ? '0' : '18px',
          backgroundColor: '#000000',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Fullscreen Video Player: only Fullscreen button allowed, all other controls removed */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: isFullscreen ? '100vh' : 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            overflow: 'hidden',
            borderRadius: isFullscreen ? '0' : '10px',
          }}
        >
          <video
            ref={videoRef}
            src={BIRTHDAY_CONFIG.specialVideoUrl}
            controls={false}
            playsInline
            autoPlay
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            onPlay={() => {
              setHasStarted(true);
              soundSystem.pauseMusic();
            }}
            onTimeUpdate={handleTimeUpdate}
            onSeeking={handleSeeking}
            onEnded={handleEnded}
            onError={(e) => {
              console.error('Special video error:', e);
              setLoadError(true);
            }}
            style={{
              width: '100%',
              height: isFullscreen ? '100vh' : 'auto',
              maxHeight: isFullscreen ? '100vh' : '65vh',
              objectFit: 'contain',
              display: 'block',
              backgroundColor: '#000',
            }}
          />

          {/* Dedicated Fullscreen Toggle Button - The ONLY allowed control */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="btn-cyber-primary pulse-cyber"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 30,
              padding: '8px 16px',
              fontSize: '0.8rem',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(5, 5, 8, 0.85)',
              border: '1.5px solid #ff2a4b',
              boxShadow: '0 0 20px rgba(255, 42, 75, 0.6)',
              backdropFilter: 'blur(6px)',
              cursor: 'pointer',
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            <span>{isFullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN'}</span>
          </button>

          {/* Tap to start hint if browser blocked autoplay */}
          {!hasStarted && !loadError && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(5, 5, 8, 0.65)',
                zIndex: 20,
                cursor: 'pointer',
              }}
            >
              <div
                className="pulse-cyber"
                style={{
                  padding: '14px 24px',
                  borderRadius: '30px',
                  border: '2px solid #ffb703',
                  backgroundColor: 'rgba(18, 10, 14, 0.95)',
                  color: '#ffb703',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  letterSpacing: '0.04em',
                  boxShadow: '0 0 30px rgba(255, 183, 3, 0.6)',
                }}
              >
                ▶ TAP ANYWHERE TO START SPECIAL VIDEO
              </div>
            </div>
          )}

          {/* Load error fallback */}
          {loadError && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(5, 5, 8, 0.95)',
                color: '#ff2a4b',
                padding: '16px',
                zIndex: 25,
                textAlign: 'center',
              }}
            >
              <AlertTriangle size={34} style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '6px' }}>
                SPECIAL VIDEO FAILED TO LOAD
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLoadError(false);
                  if (videoRef.current) {
                    videoRef.current.load();
                    videoRef.current.play().catch(() => {});
                  }
                }}
                className="btn-cyber-primary"
                style={{ padding: '8px 18px', fontSize: '0.8rem', marginTop: '10px' }}
              >
                RELOAD VIDEO
              </button>
            </div>
          )}
        </div>

        {/* Level Progression Lock / Proceed (Visible outside fullscreen) */}
        {!isFullscreen && (
          <div style={{ width: '100%', marginTop: '18px' }}>
            {hasFinished ? (
              <button
                onClick={handleProceed}
                className="btn-cyber-primary pulse-cyber"
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '0.98rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                }}
              >
                <CheckCircle2 size={18} />
                <span>[ REEL COMPLETE! PROCEED TO LEVEL 9: GIFTS VAULT ➔ ]</span>
              </button>
            ) : (
              <div
                style={{
                  background: 'rgba(255, 42, 75, 0.08)',
                  border: '1px solid rgba(255, 42, 75, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#9e646d',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                <Lock size={15} color="#ff2a4b" />
                <span>Next level locked — Watch the entire video to unlock Level 9!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialVideoLevel;