import React, { useRef } from 'react';
import gsap from 'gsap';
import { Headphones, Sparkles, ArrowRight } from 'lucide-react';
import { soundSystem } from '../../utils/audioSystem';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';

interface HeadphonesIntroScreenProps {
  onEnter: () => void;
}

export const HeadphonesIntroScreen: React.FC<HeadphonesIntroScreenProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    soundSystem.registerUserInteraction();
    soundSystem.playVictory();
    // Start background music (bg-song.mp3) immediately from beginning of site
    soundSystem.playSiteMusic();

    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(8px)',
      duration: 0.45,
      ease: 'power2.inOut',
      onComplete: onEnter,
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        zIndex: 10,
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        className="terminal-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          border: '1px solid #ff2a4b',
          boxShadow: '0 0 50px rgba(255, 42, 75, 0.4)',
          borderRadius: '12px',
          overflow: 'hidden',
          textAlign: 'center',
          padding: '36px 24px',
        }}
      >
        {/* Animated Glowing Headphones Icon */}
        <div
          style={{
            position: 'relative',
            width: '100px',
            height: '100px',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'rgba(255, 42, 75, 0.12)',
            border: '2px solid #ff2a4b',
            boxShadow: '0 0 35px rgba(255, 42, 75, 0.5)',
          }}
        >
          <Headphones size={50} color="#ff2a4b" />
        </div>

        {/* Short 1-2 line Tenglish Title & Subtitle */}
        <div
          style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#ffb703',
            letterSpacing: '0.12em',
            marginBottom: '8px',
          }}
        >
          AUDIO RECOMMENDATION // AUDIO: HIGH
        </div>

        <h1
          className="text-neon-red glitch-text"
          data-text="USE HEADPHONES"
          style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.1rem)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            marginBottom: '12px',
          }}
        >
          USE HEADPHONES 🎧
        </h1>

        <p
          style={{
            color: '#fff',
            fontSize: '0.96rem',
            lineHeight: 1.5,
            marginBottom: '28px',
            maxWidth: '380px',
            margin: '0 auto 28px',
          }}
        >
          Best experience kosam headphones pettuko bro, sound and vibe vere level untadi!
        </p>

        {/* Enter Button */}
        <button
          onClick={handleStart}
          className="btn-cyber-primary pulse-cyber"
          style={{
            width: '100%',
            maxWidth: '320px',
            padding: '16px 28px',
            fontSize: '1rem',
            fontWeight: 800,
          }}
        >
          <span>[ ENTER HACKER MODE ]</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

