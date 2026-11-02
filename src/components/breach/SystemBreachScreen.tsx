import React, { useRef } from 'react';
import gsap from 'gsap';
import { Play, ShieldAlert, Sparkles, AlertTriangle, ArrowLeft } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface SystemBreachScreenProps {
  onEnter: () => void;
  onBack?: () => void;
}

export const SystemBreachScreen: React.FC<SystemBreachScreenProps> = ({ onEnter, onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStartGame = () => {
    soundSystem.registerUserInteraction();
    soundSystem.playVictory();
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(8px)',
      duration: 0.5,
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
        backgroundColor: '#050508',
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
          maxWidth: '540px',
          overflow: 'hidden',
          border: '1px solid #ff2a4b',
          boxShadow: '0 0 50px rgba(255, 42, 75, 0.4)',
          borderRadius: '12px',
        }}
      >
        {/* Terminal Header Bar */}
        <div className="terminal-header-bar" style={{ background: 'rgba(255, 42, 75, 0.12)' }}>
          <div className="terminal-dots">
            <div className="terminal-dot dot-red" />
            <div className="terminal-dot dot-yellow" />
            <div className="terminal-dot dot-green" />
          </div>
          <div>WARNING 69 // SYSTEM_BREACH_v20.05</div>
          <div style={{ color: '#ff2a4b' }}>STATUS: HACKED</div>
        </div>

        {/* Terminal Body */}
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          {/* Warning 69 Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 42, 75, 0.15)',
              border: '1.5px solid #ff2a4b',
              borderRadius: '20px',
              padding: '6px 18px',
              fontSize: '0.85rem',
              fontWeight: 900,
              color: '#ff2a4b',
              marginBottom: '20px',
              letterSpacing: '0.04em',
            }}
          >
            <ShieldAlert size={16} />
            <span>WARNING 69 // SYSTEM INTRUSION DETECTED</span>
          </div>

          {/* Ashuu's Photo Frame */}
          <div
            style={{
              position: 'relative',
              width: '135px',
              height: '135px',
              margin: '0 auto 20px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: -6,
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #ff2a4b, #ffb703, #ff1744, #ff2a4b)',
                filter: 'blur(10px)',
                opacity: 0.8,
              }}
            />

            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #ff2a4b',
                boxShadow: '0 0 25px rgba(255, 42, 75, 0.6)',
                backgroundColor: '#050508',
              }}
            >
              <img
                src={BIRTHDAY_CONFIG.photoUrl}
                alt="Ashu"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            <div
              style={{
                position: 'absolute',
                top: -20,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '2rem',
                filter: 'drop-shadow(0 0 10px #ffb703)',
              }}
            >
              👑
            </div>
          </div>

          {/* Short Tenglish Heading */}
          <h1
            className="text-neon-red glitch-text"
            data-text="SOUTH DEV SYSTEM HACKED!"
            style={{
              fontSize: 'clamp(1.6rem, 4.2vw, 2.2rem)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              marginBottom: '10px',
            }}
          >
            SOUTH DEV SYSTEM HACKED!
          </h1>

          <p
            style={{
              color: '#fff',
              fontSize: '0.94rem',
              lineHeight: 1.5,
              marginBottom: '26px',
              maxWidth: '400px',
              margin: '0 auto 26px',
            }}
          >
            Aakash & Sanjay nee system ni hack chesi birthday arcade pettaaru! All levels complete chesi surprise unlock chey!
          </p>

          {/* Start Game & Back Button */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', width: '100%', maxWidth: '360px', margin: '0 auto' }}>
            {onBack && (
              <button
                onClick={() => {
                  soundSystem.playClick();
                  onBack();
                }}
                className="btn-cyber-secondary"
                style={{
                  padding: '16px 20px',
                  fontSize: '0.9rem',
                  borderColor: 'rgba(255, 42, 75, 0.4)',
                  color: '#ffb703',
                }}
              >
                <ArrowLeft size={16} />
                <span>BACK</span>
              </button>
            )}

            <button
              onClick={handleStartGame}
              className="btn-cyber-primary pulse-cyber"
              style={{
                flex: 1,
                padding: '16px 24px',
                fontSize: '1.05rem',
                fontWeight: 800,
              }}
            >
              <Play size={18} fill="#fff" />
              <span>[ START GAME ]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
