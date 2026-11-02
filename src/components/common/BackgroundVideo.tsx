import React, { useRef, useEffect } from 'react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';

export const BackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      // Strictly remove all audio from background video
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Background video autoplay pending interaction:', err);
        });
      }
    }
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
        backgroundColor: '#050508',
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
          opacity: 0.42,
          filter: 'contrast(1.1) brightness(0.85)',
        }}
      >
        <source src={BIRTHDAY_CONFIG.bgVideoUrl} type="video/mp4" />
      </video>

      {/* Cyber ambient overlay: ensures hacker red/black theme & sharp card readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 20%, rgba(5, 5, 8, 0.45) 0%, rgba(5, 5, 8, 0.8) 75%, #050508 100%)',
        }}
      />
    </div>
  );
};

export default BackgroundVideo;
