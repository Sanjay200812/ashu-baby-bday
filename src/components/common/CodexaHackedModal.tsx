import React, { useState, useEffect } from 'react';
import { ShieldAlert, Terminal, CheckCircle2 } from 'lucide-react';
import { soundSystem } from '../../utils/audioSystem';

interface CodexaHackedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodexaHackedModal: React.FC<CodexaHackedModalProps> = ({ isOpen, onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(10);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(10);
      return;
    }

    soundSystem.playHit();
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          soundSystem.playVictory();
          onClose();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
        zIndex: 99999,
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        className="terminal-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          border: '2px solid #ff2a4b',
          boxShadow: '0 0 50px rgba(255, 42, 75, 0.5)',
          borderRadius: '10px',
          padding: '28px 22px',
          textAlign: 'center',
          animation: 'fadeIn 0.25s ease-out',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 42, 75, 0.15)',
            border: '1px solid #ff2a4b',
            borderRadius: '20px',
            padding: '6px 16px',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#ff2a4b',
            marginBottom: '16px',
          }}
        >
          <ShieldAlert size={16} />
          <span>CODEXA AGENCY // INTRUSION</span>
        </div>

        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.4,
            marginBottom: '14px',
          }}
        >
          Your system is hacked by Codexa Agency.
        </h3>

        <p
          style={{
            color: '#ffb703',
            fontSize: '0.94rem',
            fontWeight: 700,
            lineHeight: 1.5,
            marginBottom: '20px',
          }}
        >
          Please wait 10 seconds—Sanju is working on it.
        </p>

        {/* 10s Countdown Circle */}
        <div
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            background: 'rgba(255, 42, 75, 0.1)',
            border: '2px solid #ff2a4b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '1.8rem',
            fontWeight: 900,
            color: '#ff2a4b',
            boxShadow: '0 0 20px rgba(255, 42, 75, 0.4)',
          }}
        >
          {secondsLeft}s
        </div>

        <div style={{ fontSize: '0.78rem', color: '#ffb703', letterSpacing: '0.05em' }}>
          Auto-restoring in {secondsLeft} seconds... Relax bro!
        </div>
      </div>
    </div>
  );
};

