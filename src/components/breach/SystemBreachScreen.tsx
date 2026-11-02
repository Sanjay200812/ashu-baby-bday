import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Terminal, ShieldAlert, Play, Cpu, Zap } from 'lucide-react';
import { soundSystem } from '../../utils/audioSystem';

interface SystemBreachScreenProps {
  onEnter: () => void;
}

export const SystemBreachScreen: React.FC<SystemBreachScreenProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Fast, punchy boot sequence that lets the player start the game themselves
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setIsReady(true);
        soundSystem.playClick();
      }
      setProgress(current);
    }, 70);

    return () => clearInterval(interval);
  }, []);

  const handleStartGame = () => {
    soundSystem.registerUserInteraction();
    soundSystem.playVictory();
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.04,
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
      {/* Main Terminal Frame */}
      <div
        className="terminal-panel"
        style={{
          width: '100%',
          maxWidth: '640px',
          overflow: 'hidden',
          border: '1px solid #00ff66',
          boxShadow: '0 0 40px rgba(0, 255, 102, 0.25)',
          borderRadius: '8px',
        }}
      >
        {/* Terminal Header */}
        <div className="terminal-header-bar">
          <div className="terminal-dots">
            <div className="terminal-dot dot-red" />
            <div className="terminal-dot dot-yellow" />
            <div className="terminal-dot dot-green" />
          </div>
          <div>SOUTH_DEV_OS // SYSTEM_BREACH_v20.05</div>
          <div style={{ color: '#00ff66' }}>SYS:ONLINE</div>
        </div>

        {/* Terminal Body */}
        <div style={{ padding: '32px 28px', textAlign: 'center' }}>
          {/* Target Codename Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 255, 102, 0.1)',
              border: '1px solid #00ff66',
              borderRadius: '4px',
              padding: '6px 16px',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#00ff66',
              marginBottom: '20px',
              letterSpacing: '0.08em',
            }}
          >
            <Cpu size={15} />
            <span>TARGET: ASHU // CODENAME: SOUTH DEV</span>
          </div>

          <h1
            className="text-neon-green glitch-text"
            data-text="UNAUTHORIZED SYSTEM BREACH"
            style={{
              fontSize: 'clamp(1.7rem, 4vw, 2.3rem)',
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: '14px',
            }}
          >
            UNAUTHORIZED SYSTEM BREACH
          </h1>

          <p
            style={{
              color: '#cbd5e1',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              maxWidth: '520px',
              margin: '0 auto 24px',
            }}
          >
            A secret birthday transmission has been injected into your system by <strong style={{ color: '#00ff66' }}>Aakash & Sanjay</strong>.
            <br />
            To decrypt the transmission and unlock your birthday surprise, navigate through <strong style={{ color: '#00e5ff' }}>12 CPU security barriers</strong> in the Flap Protocol!
          </p>

          {/* Quick Buffer Progress Bar */}
          <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto 28px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.74rem',
                color: '#00e5ff',
                marginBottom: '6px',
                fontWeight: 700,
              }}
            >
              <span>SYSTEM BUFFER</span>
              <span style={{ color: '#00ff66' }}>{progress}%</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #00ff66 0%, #00e5ff 100%)',
                  boxShadow: '0 0 10px #00ff66',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
          </div>

          {/* Clean Start Game Action Button */}
          <div>
            <button
              onClick={handleStartGame}
              className="btn-cyber-primary pulse-cyber"
              style={{
                padding: '16px 48px',
                fontSize: '1.15rem',
                letterSpacing: '0.08em',
                boxShadow: '0 0 30px rgba(0, 255, 102, 0.5)',
              }}
            >
              <Play size={18} fill="#00ff66" />
              <span>[ START GAME ]</span>
            </button>

            <div style={{ fontSize: '0.75rem', color: '#5c7866', marginTop: '12px' }}>
              Tap screen, click, or press Space to flap
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
