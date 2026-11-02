import React from 'react';
import { ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { soundSystem } from '../../utils/audioSystem';

interface FullScreenGalaxyWarningProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export const FullScreenGalaxyWarning: React.FC<FullScreenGalaxyWarningProps> = ({
  isOpen,
  onDismiss,
}) => {
  if (!isOpen) return null;

  const handleContinue = () => {
    soundSystem.playClick();
    onDismiss();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.98)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        zIndex: 9999999,
        fontFamily: 'var(--font-mono)',
        textAlign: 'center',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      {/* Red Cyber Glowing Border Box */}
      <div
        className="terminal-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '40px 28px',
          border: '2px solid #ff2a4b',
          boxShadow: '0 0 60px rgba(255, 42, 75, 0.6), inset 0 0 30px rgba(255, 42, 75, 0.2)',
          borderRadius: '14px',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 42, 75, 0.2)',
            border: '1.5px solid #ff2a4b',
            borderRadius: '20px',
            padding: '6px 18px',
            fontSize: '0.85rem',
            fontWeight: 900,
            color: '#ff2a4b',
            marginBottom: '20px',
            letterSpacing: '0.06em',
          }}
        >
          <ShieldAlert size={18} />
          <span>WARNING 69 // TAB SWITCH DETECTED</span>
        </div>

        {/* Big Prominent Text */}
        <h1
          className="text-neon-red glitch-text"
          data-text="GALAXY WITHOUT LAX!"
          style={{
            fontSize: 'clamp(2rem, 6vw, 3.2rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: '16px',
            letterSpacing: '0.04em',
          }}
        >
          GALAXY WITHOUT LAX!
        </h1>

        <p
          style={{
            color: '#fff',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            marginBottom: '28px',
            maxWidth: '440px',
            margin: '0 auto 28px',
          }}
        >
          Arey Ashuu! Website vadilesi inko tab ki enduku vellav bro? Ventane dorikipoyav! 😂
        </p>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="btn-cyber-primary pulse-cyber"
          style={{
            width: '100%',
            maxWidth: '340px',
            padding: '16px',
            fontSize: '1rem',
            fontWeight: 900,
          }}
        >
          <span>[ CONTINUE BIRTHDAY SURPRISE ]</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

