import React, { useRef, useEffect, useState } from 'react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';

export const BackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Strictly muted so background song (bg-song.mp3) plays without any interference
    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0;

    const tryPlay = () => {
      if (!video) return;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Background video autoplay deferred:', err);
          });
      }
    };

    tryPlay();

    // In case browser autoplay policy delays playback until user gesture:
    const handleGesture = () => {
      if (video && video.paused) {
        tryPlay();
      }
    };

    window.addEventListener('click', handleGesture, { passive: true });
    window.addEventListener('touchstart', handleGesture, { passive: true });
    window.addEventListener('keydown', handleGesture, { passive: true });

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('keydown', handleGesture);
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
        muted
        preload="auto"
        onPlay={() => setIsPlaying(true)}
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
          // High visibility so the background video is crisp, vibrant, and actively moving
          opacity: 0.82,
          filter: 'contrast(1.08) brightness(0.88) saturate(1.1)',
          transition: 'opacity 0.6s ease-in-out',
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
