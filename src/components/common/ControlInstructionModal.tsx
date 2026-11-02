import React, { useState, useEffect } from 'react';
import { Gamepad2, Play, Smartphone, Monitor, AlertCircle, Sparkles } from 'lucide-react';
import { soundSystem } from '../../utils/audioSystem';

interface ControlInstructionModalProps {
  levelNumber: number;
  levelTitle: string;
  objective: string;
  desktopControls: string;
  mobileControls: string;
  tip?: string;
  badgeIcon?: string;
  onStartGame: () => void;
}

export const ControlInstructionModal: React.FC<ControlInstructionModalProps> = ({
  levelNumber,
  levelTitle,
  objective,
  desktopControls,
  mobileControls,
  tip,
  badgeIcon = '🎮',
  onStartGame,
}) => {
  const [countdown, setCountdown] = useState<number>(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    soundSystem.playClick();
    onStartGame();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.94)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        zIndex: 9999,
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        className="terminal-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          border: '1px solid #ff2a4b',
          boxShadow: '0 0 45px rgba(255, 42, 75, 0.35)',
          borderRadius: '10px',
          overflow: 'hidden',
          animation: 'fadeIn 0.3s ease-out',
        }}
      >
        {/* Terminal Header */}
        <div className="terminal-header-bar" style={{ background: 'rgba(255, 42, 75, 0.12)' }}>
          <div className="terminal-dots">
            <div className="terminal-dot dot-red" />
            <div className="terminal-dot dot-yellow" />
            <div className="terminal-dot dot-green" />
          </div>
          <div>MISSION BRIEFING // LEVEL {levelNumber}</div>
          <div style={{ color: '#ffb703', fontSize: '0.74rem' }}>READY</div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 20px', textAlign: 'center' }}>
          {/* Level Badge */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(255, 42, 75, 0.12)',
              border: '2px solid #ff2a4b',
              boxShadow: '0 0 20px rgba(255, 42, 75, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              margin: '0 auto 16px',
            }}
          >
            {badgeIcon}
          </div>

          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#ffb703',
              letterSpacing: '0.12em',
              marginBottom: '4px',
              textTransform: 'uppercase',
            }}
          >
            LEVEL {levelNumber} INSTRUCTIONS
          </div>

          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: 900,
              color: '#fff',
              marginBottom: '16px',
              letterSpacing: '0.04em',
            }}
          >
            {levelTitle}
          </h2>

          {/* Objective Box */}
          <div
            style={{
              background: 'rgba(255, 42, 75, 0.08)',
              border: '1px solid rgba(255, 42, 75, 0.3)',
              borderRadius: '6px',
              padding: '12px 14px',
              marginBottom: '18px',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff2a4b', fontSize: '0.75rem', fontWeight: 800, marginBottom: '4px' }}>
              <AlertCircle size={14} />
              <span>PRIMARY OBJECTIVE</span>
            </div>
            <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.4 }}>
              {objective}
            </div>
          </div>

          {/* Controls Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '20px',
              textAlign: 'left',
            }}
          >
            {/* Desktop */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '12px 10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '0.74rem', fontWeight: 700, marginBottom: '6px' }}>
                <Monitor size={14} color="#ffb703" />
                <span>DESKTOP</span>
              </div>
              <div style={{ color: '#fff', fontSize: '0.78rem', lineHeight: 1.4 }}>
                {desktopControls}
              </div>
            </div>

            {/* Mobile */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '12px 10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '0.74rem', fontWeight: 700, marginBottom: '6px' }}>
                <Smartphone size={14} color="#ff2a4b" />
                <span>MOBILE / TOUCH</span>
              </div>
              <div style={{ color: '#fff', fontSize: '0.78rem', lineHeight: 1.4 }}>
                {mobileControls}
              </div>
            </div>
          </div>

          {tip && (
            <div style={{ fontSize: '0.76rem', color: '#9e646d', marginBottom: '20px', fontStyle: 'italic' }}>
              💡 Pro Tip: {tip}
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="btn-cyber-primary pulse-cyber"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 800,
            }}
          >
            <Play size={18} fill="#fff" />
            <span>START GAME {countdown > 0 ? `(${countdown}s)` : 'NOW!'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

