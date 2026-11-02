import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Trophy } from 'lucide-react';
import { soundSystem } from '../../utils/audioSystem';

interface LevelPhotoMomentProps {
  levelTitle: string;
  badgeText: string;
  photoUrl: string;
  tenglishQuote: string;
  nextButtonText: string;
  onProceed: () => void;
  onBack?: () => void;
}

export const LevelPhotoMoment: React.FC<LevelPhotoMomentProps> = ({
  levelTitle,
  badgeText,
  photoUrl,
  tenglishQuote,
  nextButtonText,
  onProceed,
  onBack,
}) => {
  const handleProceed = () => {
    soundSystem.playClick();
    onProceed();
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        zIndex: 10,
        fontFamily: 'var(--font-mono)',
        backgroundColor: 'transparent',
      }}
    >
      <div
        className="terminal-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          border: '1.5px solid #ff2a4b',
          boxShadow: '0 0 50px rgba(255, 42, 75, 0.4)',
          borderRadius: '12px',
          overflow: 'hidden',
          padding: '30px 24px',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease-out',
        }}
      >
        {/* Level Cleared Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 183, 3, 0.12)',
            border: '1px solid #ffb703',
            borderRadius: '20px',
            padding: '6px 18px',
            fontSize: '0.82rem',
            fontWeight: 800,
            color: '#ffb703',
            marginBottom: '16px',
          }}
        >
          <Trophy size={15} color="#ffb703" />
          <span>{badgeText}</span>
        </div>

        <h2
          style={{
            fontSize: '1.4rem',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '20px',
            letterSpacing: '0.04em',
          }}
        >
          {levelTitle}
        </h2>

        {/* Prominent Photo Frame */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxHeight: '340px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '2px solid rgba(255, 42, 75, 0.5)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.85)',
            marginBottom: '20px',
            backgroundColor: '#000',
          }}
        >
          <img
            src={photoUrl}
            alt="Ashuu Photo Moment"
            style={{
              width: '100%',
              height: '340px',
              objectFit: 'contain',
              display: 'block',
              backgroundColor: '#050508',
            }}
          />
        </div>

        {/* Tenglish 1-2 line quote */}
        <div
          style={{
            background: 'rgba(255, 42, 75, 0.08)',
            border: '1px solid rgba(255, 42, 75, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '24px',
            fontSize: '0.94rem',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.5,
            fontStyle: 'italic',
          }}
        >
          "{tenglishQuote}"
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {onBack && (
            <button
              onClick={() => {
                soundSystem.playClick();
                onBack();
              }}
              className="btn-cyber-secondary"
              style={{
                padding: '14px 18px',
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
            onClick={handleProceed}
            className="btn-cyber-primary pulse-cyber"
            style={{
              flex: 1,
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 800,
            }}
          >
            <span>{nextButtonText}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

