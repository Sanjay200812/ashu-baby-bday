import React, { useRef, useEffect } from 'react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

export const BackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    soundSystem.registerBgVideo(video);

    // Initial load: silent autoplay so video renders immediately on page load
    video.defaultMuted = true;
    video.muted = true;
    video.play().catch(() => {});

    // On user interaction (click/tap/key), enable audio from the background video!
    const handleFirstInteraction = () => {
      soundSystem.registerUserInteraction();
      if (video) {
        if (video.paused) {
          video.play().catch(() => {});
        }
        if (soundSystem.isMusicPlaying || !soundSystem.getIsMuted()) {
          video.muted = false;
          video.volume = soundSystem.volume;
        }
      }
    };

    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });

    return () => {
      soundSystem.unregisterBgVideo();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: '#000000',
      }}
    >
      <video
        ref={videoRef}
        src={BIRTHDAY_CONFIG.bgVideoUrl}
        autoPlay
        playsInline
        loop
        preload="auto"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'cover',
          opacity: 0.82,
          filter: 'contrast(1.08) brightness(0.88) saturate(1.1)',
        }}
      >
        <source src={BIRTHDAY_CONFIG.bgVideoUrl} type="video/mp4" />
      </video>

      {/* Cyber red/black subtle ambient overlay for readability while keeping video clearly visible */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(5, 5, 8, 0.25) 0%, rgba(5, 5, 8, 0.62) 80%, rgba(5, 5, 8, 0.85) 100%)',
        }}
      />

      {/* Subtle cyber scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255, 42, 75, 0.03) 0px, rgba(255, 42, 75, 0.03) 1px, transparent 1px, transparent 3px)',
          opacity: 0.7,
        }}
      />
    </div>
  );
};

export default BackgroundVideo;
