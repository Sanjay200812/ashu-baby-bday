import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ShieldCheck, AlertCircle, ShieldAlert, ArrowLeft, RotateCcw } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';
import { LoseClipPlayer } from '../common/LoseClipPlayer';

interface BirthdayLockScreenProps {
  onUnlock: () => void;
  onBack?: () => void;
}

export const BirthdayLockScreen: React.FC<BirthdayLockScreenProps> = ({ onUnlock, onBack }) => {
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isPinPassed, setIsPinPassed] = useState<boolean>(false);

  // Dynamic shuffle for keypad digits (0-9)
  const [digits, setDigits] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);

  // Special Question State
  const [showLoseClip, setShowLoseClip] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const shuffleArray = (arr: string[]) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const handleNumClick = (digit: string) => {
    soundSystem.playClick();
    setErrorMessage('');

    // Dynamically shuffle keypad digits after every press
    setDigits(shuffleArray(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']));

    if (pin.length < 8) {
      const nextPin = pin + digit;
      setPin(nextPin);

      // Auto-validate when 8 digits entered (format: 5002-11-30 -> 50021130)
      if (nextPin.length === 8) {
        if (nextPin === BIRTHDAY_CONFIG.lockPassword) { // "50021130"
          soundSystem.playVictory();
          setIsPinPassed(true);
          setErrorMessage('');
        } else {
          soundSystem.playHit();
          setIsShaking(true);
          setErrorMessage('PASSCODE WRONG BRO! TRY AGAIN');
          setTimeout(() => {
            setIsShaking(false);
            setPin('');
          }, 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    soundSystem.playClick();
    setErrorMessage('');
    setPin((prev) => prev.slice(0, -1));
    setDigits(shuffleArray(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']));
  };

  const handleClear = () => {
    soundSystem.playClick();
    setErrorMessage('');
    setPin('');
    setDigits(shuffleArray(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']));
  };

  // Keyboard support for 8 digits
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPinPassed) return;
      if (e.key >= '0' && e.key <= '9') {
        handleNumClick(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isPinPassed]);

  // Stationary "No" button: selecting No plays lose clip immediately
  const handleNoClick = () => {
    soundSystem.pauseMusic();
    soundSystem.playHit();
    setShowLoseClip(true);
  };

  const handleYesClick = () => {
    soundSystem.playVictory();
    setTimeout(() => {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.05,
        filter: 'blur(8px)',
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: onUnlock,
      });
    }, 600);
  };

  return (
    <div
      ref={containerRef}
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
      {/* Top Header */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onBack && (
            <button
              onClick={() => {
                soundSystem.playClick();
                onBack();
              }}
              className="btn-cyber-secondary"
              style={{ padding: '4px 10px', fontSize: '0.72rem' }}
            >
              <ArrowLeft size={12} />
              <span>BACK</span>
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff2a4b', fontSize: '0.82rem', fontWeight: 800 }}>
            <ShieldCheck size={16} />
            <span>IDENTITY VERIFICATION GATE</span>
          </div>
        </div>
      </div>

      <div
        className={`terminal-panel ${isShaking ? 'shake-animation' : ''}`}
        style={{
          width: '100%',
          maxWidth: '480px',
          border: '1.5px solid #ff2a4b',
          boxShadow: '0 0 50px rgba(255, 42, 75, 0.4)',
          borderRadius: '12px',
          overflow: 'hidden',
          padding: '28px 22px',
          textAlign: 'center',
        }}
      >
        {!isPinPassed ? (
          /* STEP 1: Pin Pad */
          <div>
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
              <ShieldAlert size={14} />
              <span>SECURITY PROTOCOL // ENTER 8-DIGIT PASSCODE</span>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
              REVERSE IDENTITY CHECK
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.82rem', marginBottom: '20px', lineHeight: 1.45 }}>
              Enter the 8-digit reverse birthcode to unlock the final surprise!
            </p>

            {/* Reverse Birthday Format: ____ - __ - __ */}
            <div style={{ marginBottom: '22px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}
              >
                {/* Group 1: YEAR (4 digits) */}
                <div style={{ display: 'flex', gap: '5px' }}>
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '32px',
                        height: '44px',
                        borderRadius: '6px',
                        border: `1.5px solid ${idx < pin.length ? '#ffb703' : 'rgba(255, 42, 75, 0.35)'}`,
                        background: idx < pin.length ? 'rgba(255, 183, 3, 0.15)' : 'rgba(0, 0, 0, 0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: '#ffb703',
                      }}
                    >
                      {idx < pin.length ? pin[idx] : '_'}
                    </div>
                  ))}
                </div>

                <span style={{ color: '#ff2a4b', fontSize: '1.5rem', fontWeight: 900 }}>-</span>

                {/* Group 2: MONTH (2 digits) */}
                <div style={{ display: 'flex', gap: '5px' }}>
                  {[4, 5].map((idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '32px',
                        height: '44px',
                        borderRadius: '6px',
                        border: `1.5px solid ${idx < pin.length ? '#ffb703' : 'rgba(255, 42, 75, 0.35)'}`,
                        background: idx < pin.length ? 'rgba(255, 183, 3, 0.15)' : 'rgba(0, 0, 0, 0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: '#ffb703',
                      }}
                    >
                      {idx < pin.length ? pin[idx] : '_'}
                    </div>
                  ))}
                </div>

                <span style={{ color: '#ff2a4b', fontSize: '1.5rem', fontWeight: 900 }}>-</span>

                {/* Group 3: DAY (2 digits) */}
                <div style={{ display: 'flex', gap: '5px' }}>
                  {[6, 7].map((idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '32px',
                        height: '44px',
                        borderRadius: '6px',
                        border: `1.5px solid ${idx < pin.length ? '#ffb703' : 'rgba(255, 42, 75, 0.35)'}`,
                        background: idx < pin.length ? 'rgba(255, 183, 3, 0.15)' : 'rgba(0, 0, 0, 0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: '#ffb703',
                      }}
                    >
                      {idx < pin.length ? pin[idx] : '_'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Format Guide: YEAR - MONTH - DAY */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '24px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#9e646d',
                  letterSpacing: '0.08em',
                }}
              >
                <span>[ YEAR ]</span>
                <span>[ MONTH ]</span>
                <span>[ DAY ]</span>
              </div>
            </div>

            {errorMessage && (
              <div style={{ color: '#ff2a4b', fontSize: '0.8rem', fontWeight: 800, marginBottom: '14px' }}>
                {errorMessage}
              </div>
            )}

            {/* Dynamic Shuffled Keypad */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                maxWidth: '280px',
                margin: '0 auto',
              }}
            >
              {digits.slice(0, 9).map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleNumClick(digit)}
                  className="btn-cyber-secondary"
                  style={{ height: '48px', fontSize: '1.2rem', fontWeight: 900 }}
                >
                  {digit}
                </button>
              ))}

              <button
                onClick={handleClear}
                className="btn-cyber-secondary"
                style={{ height: '48px', fontSize: '0.85rem', fontWeight: 800, color: '#ff2a4b' }}
              >
                CLR
              </button>

              <button
                onClick={() => handleNumClick(digits[9])}
                className="btn-cyber-secondary"
                style={{ height: '48px', fontSize: '1.2rem', fontWeight: 900 }}
              >
                {digits[9]}
              </button>

              <button
                onClick={handleBackspace}
                className="btn-cyber-secondary"
                style={{ height: '48px', fontSize: '1.1rem', fontWeight: 800, color: '#ffb703' }}
              >
                ⌫
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: Special Question: "Is Ashu Galaxy without lax?" */
          <div>
            {!showLoseClip ? (
              <div>
                <div
                  style={{
                    background: 'rgba(255, 183, 3, 0.1)',
                    border: '1px solid #ffb703',
                    borderRadius: '8px',
                    padding: '14px',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ color: '#ffb703', fontSize: '0.78rem', fontWeight: 800, marginBottom: '6px' }}>
                    FINAL SECURITY CHECK
                  </div>
                  <div style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 900 }}>
                    Is Ashu Galaxy without lax?
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minHeight: '140px', justifyContent: 'center' }}>
                  {/* Option 1: Yes (200% sure) */}
                  <button
                    onClick={handleYesClick}
                    className="btn-cyber-primary pulse-cyber"
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '1.05rem',
                      fontWeight: 900,
                    }}
                  >
                    <span>Yes (200% sure) 🔥</span>
                  </button>

                  {/* Option 2: No (Stationary button: selecting No plays lose clip) */}
                  <button
                    onClick={handleNoClick}
                    className="btn-cyber-secondary"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '0.96rem',
                      fontWeight: 700,
                    }}
                  >
                    <span>No</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Lose Clip on 3rd No click */
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#ff2a4b',
                    fontWeight: 900,
                    fontSize: '0.92rem',
                    marginBottom: '12px',
                  }}
                >
                  <ShieldAlert size={16} />
                  <span>WRONG ANSWER // ASHU IS 100% GALAXY WITHOUT LAX!</span>
                </div>

                {/* Loss Video Clip WITH Audio & Unmute overlay */}
                <LoseClipPlayer
                  maxHeight="210px"
                  onResumeMusic={() => soundSystem.playSiteMusic()}
                />

                <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '16px' }}>
                  Arey Ashuu! "No" enduku click chesav? Ashu is 200% Galaxy without lax anthe! 😂
                </p>

                <button
                  onClick={() => {
                    soundSystem.playClick();
                    soundSystem.playSiteMusic();
                    setShowLoseClip(false);
                  }}
                  className="btn-cyber-primary pulse-cyber"
                  style={{ width: '100%', padding: '13px' }}
                >
                  <RotateCcw size={16} />
                  <span>[ RETRY QUESTION ]</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayLockScreen;
