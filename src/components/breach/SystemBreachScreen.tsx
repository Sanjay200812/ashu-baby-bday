import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Terminal, ShieldAlert, FastForward, Play } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface SystemBreachScreenProps {
  onEnter: () => void;
}

export const SystemBreachScreen: React.FC<SystemBreachScreenProps> = ({ onEnter }) => {
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [isBootComplete, setIsBootComplete] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const logs = BIRTHDAY_CONFIG.bootLogs;

  useEffect(() => {
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < logs.length) {
        const nextLog = logs[logIndex];
        if (nextLog) {
          setDisplayedLogs((prev) => [...prev, nextLog]);
        }
        setProgress(Math.round(((logIndex + 1) / logs.length) * 100));
        soundSystem.playClick();
        logIndex++;
      } else {
        clearInterval(logInterval);
        setIsBootComplete(true);
        soundSystem.playScore();
      }
    }, 450);

    return () => clearInterval(logInterval);
  }, []);

  const handleSkip = () => {
    soundSystem.playClick();
    setDisplayedLogs(logs.filter(Boolean));
    setProgress(100);
    setIsBootComplete(true);
  };

  const handleProceed = () => {
    soundSystem.playVictory();
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(10px)',
      duration: 0.6,
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
      {/* Top Controls */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          right: 20,
          display: 'flex',
          gap: '12px',
          zIndex: 20,
        }}
      >
        {!isBootComplete && (
          <button
            onClick={handleSkip}
            className="btn-cyber-secondary"
            style={{ padding: '6px 14px', fontSize: '0.78rem' }}
          >
            <FastForward size={14} />
            <span>[ SKIP BOOT_ ]</span>
          </button>
        )}
      </div>

      {/* Main Terminal Frame */}
      <div
        className="terminal-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          overflow: 'hidden',
          border: '1px solid rgba(0, 255, 102, 0.4)',
          boxShadow: '0 0 35px rgba(0, 255, 102, 0.15)',
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
        <div style={{ padding: '28px 24px', minHeight: '340px' }}>
          {/* Boot Log Stream */}
          <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {displayedLogs.map((log, idx) => {
              if (!log) return null;
              const isWarning = typeof log === 'string' && log.includes('WARNING');
              const isHighlight =
                typeof log === 'string' && (log.includes('TARGET') || log.includes('CODENAME'));
              return (
                <div
                  key={idx}
                  style={{
                    fontSize: '0.92rem',
                    color: isWarning ? '#ff3344' : isHighlight ? '#00e5ff' : '#00ff66',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ color: 'rgba(0, 255, 102, 0.5)' }}>&gt;</span>
                  <span>{log}</span>
                </div>
              );
            })}

            {!isBootComplete && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'rgba(0, 255, 102, 0.5)' }}>&gt;</span>
                <span className="terminal-cursor" />
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
              <span style={{ color: '#00e5ff' }}>BUFFER STATUS</span>
              <span style={{ color: '#00ff66' }}>{progress}%</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #00ff66 0%, #00e5ff 100%)',
                  boxShadow: '0 0 10px #00ff66',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Post-Boot Security Alert & Mystery Message */}
          {isBootComplete && (
            <div
              style={{
                background: 'rgba(255, 51, 68, 0.08)',
                border: '1px solid rgba(255, 51, 68, 0.4)',
                borderRadius: '6px',
                padding: '20px',
                textAlign: 'center',
                animation: 'cyberPulse 2s infinite',
                marginBottom: '28px',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#ff3344',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  letterSpacing: '0.08em',
                  marginBottom: '10px',
                }}
              >
                <ShieldAlert size={22} />
                <span>{BIRTHDAY_CONFIG.breachWarning}</span>
              </div>

              <p
                style={{
                  color: '#e2fce8',
                  fontSize: '1.05rem',
                  letterSpacing: '0.04em',
                  margin: '0 auto',
                  maxWidth: '480px',
                  fontStyle: 'italic',
                }}
              >
                "{BIRTHDAY_CONFIG.breachMessage}"
              </p>
            </div>
          )}

          {/* Action Button */}
          {isBootComplete && (
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleProceed}
                className="btn-cyber-primary pulse-cyber"
                style={{
                  padding: '16px 42px',
                  fontSize: '1.15rem',
                  width: '100%',
                  maxWidth: '380px',
                }}
              >
                <Play size={18} fill="#00ff66" />
                <span>[ ENTER THE SYSTEM ]</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

