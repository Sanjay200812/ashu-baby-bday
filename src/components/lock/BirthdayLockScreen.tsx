import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Lock, Unlock, ShieldCheck, AlertCircle, Calendar, Terminal } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface BirthdayLockScreenProps {
  onUnlock: () => void;
}

export const BirthdayLockScreen: React.FC<BirthdayLockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isAccessGranted, setIsAccessGranted] = useState<boolean>(false);
  const [now, setNow] = useState<Date>(new Date());

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateAge = () => {
    const dob = new Date(BIRTHDAY_CONFIG.dob);
    let age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const getCountdown = () => {
    const dob = new Date(BIRTHDAY_CONFIG.dob);
    let target = new Date(now.getFullYear(), dob.getMonth(), dob.getDate(), 0, 0, 0);

    if (now.getTime() > target.getTime()) {
      target = new Date(now.getFullYear() + 1, dob.getMonth(), dob.getDate(), 0, 0, 0);
    }

    const diff = Math.max(0, target.getTime() - now.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const age = calculateAge();
  const { days, hours, minutes, seconds } = getCountdown();

  const handleNumClick = (digit: string) => {
    soundSystem.playClick();
    setErrorMessage('');
    if (pin.length < 8) {
      setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    soundSystem.playClick();
    setErrorMessage('');
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    soundSystem.playClick();
    setErrorMessage('');
    setPin('');
  };

  const handleUnlock = () => {
    soundSystem.playClick();
    if (pin === BIRTHDAY_CONFIG.lockPassword) {
      soundSystem.playVictory();
      setErrorMessage('');
      setIsAccessGranted(true);

      setTimeout(() => {
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 1.05,
          filter: 'blur(10px)',
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: onUnlock,
        });
      }, 1200);
    } else {
      soundSystem.playHit();
      setErrorMessage('ERR_AUTH_FAILED: PASSCODE MISMATCH. ENTER DDMMYYYY.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPin('');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        if (pin.length < 8) {
          soundSystem.playClick();
          setErrorMessage('');
          setPin((prev) => prev + e.key);
        }
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        handleUnlock();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin]);

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
      }}
    >
      <div
        ref={cardRef}
        className="terminal-panel"
        style={{
          width: '100%',
          maxWidth: '500px',
          overflow: 'hidden',
          border: isAccessGranted
            ? '1px solid #00ff66'
            : isShaking
            ? '1px solid #ff3344'
            : '1px solid rgba(0, 255, 102, 0.4)',
        }}
      >
        {/* Terminal Header */}
        <div className="terminal-header-bar">
          <div className="terminal-dots">
            <div className="terminal-dot dot-red" />
            <div className="terminal-dot dot-yellow" />
            <div className="terminal-dot dot-green" />
          </div>
          <div>SECURE_AUTH // SOUTH_DEV_FIREWALL</div>
          <div style={{ color: '#00e5ff' }}>PORT:2005</div>
        </div>

        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          {/* Target Identity Terminal Header */}
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.85rem', color: '#00ff66', fontWeight: 800, marginBottom: '4px' }}>
              &gt; IDENTITY VERIFICATION REQUIRED
            </div>
            <div style={{ fontSize: '0.85rem', color: '#00e5ff', fontWeight: 700, marginBottom: '2px' }}>
              &gt; USER: {BIRTHDAY_CONFIG.personName.toUpperCase()}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#ffd700', fontWeight: 700 }}>
              &gt; CODENAME: {BIRTHDAY_CONFIG.codename}
            </div>
          </div>

          {/* Dynamic Birthday Counter Matrix */}
          <div
            style={{
              background: 'rgba(0, 255, 102, 0.05)',
              border: '1px solid rgba(0, 255, 102, 0.25)',
              borderRadius: '6px',
              padding: '14px 10px',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: '#00ff66',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                marginBottom: '10px',
              }}
            >
              <Calendar size={14} />
              <span>DOB: 03-NOV-2005 • AGE: {age} CYCLES</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { label: 'DAYS', val: days },
                { label: 'HOURS', val: hours },
                { label: 'MINUTES', val: minutes },
                { label: 'SECONDS', val: seconds },
              ].map((unit, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(0, 255, 102, 0.2)',
                    borderRadius: '4px',
                    padding: '8px 4px',
                  }}
                >
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#00ff66', lineHeight: 1 }}>
                    {unit.val < 10 ? `0${unit.val}` : unit.val}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#5c7866', fontWeight: 700, marginTop: '4px' }}>
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PIN Slots */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
                const char = pin[idx];
                return (
                  <div
                    key={idx}
                    style={{
                      width: '38px',
                      height: '46px',
                      borderRadius: '4px',
                      background: char ? 'rgba(0, 255, 102, 0.15)' : 'rgba(0, 0, 0, 0.4)',
                      border: char ? '1px solid #00ff66' : '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#00ff66',
                      boxShadow: char ? '0 0 10px rgba(0, 255, 102, 0.4)' : 'none',
                    }}
                  >
                    {char || '_'}
                  </div>
                );
              })}
            </div>

            {errorMessage ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  color: '#ff3344',
                  fontSize: '0.8rem',
                  marginTop: '8px',
                }}
              >
                <AlertCircle size={14} />
                <span>{errorMessage}</span>
              </div>
            ) : isAccessGranted ? (
              <div style={{ color: '#00ff66', fontSize: '0.9rem', fontWeight: 800, marginTop: '8px' }}>
                ACCESS GRANTED // WELCOME BACK, SOUTH DEV
              </div>
            ) : (
              <div style={{ fontSize: '0.74rem', color: '#5c7866', marginTop: '6px' }}>
                Enter verification key: 8-digit birth date (DDMMYYYY)
              </div>
            )}
          </div>

          {/* Keypad */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              width: '100%',
              maxWidth: '280px',
              margin: '0 auto 20px',
            }}
          >
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', '⌫'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  if (item === 'CLR') handleClear();
                  else if (item === '⌫') handleBackspace();
                  else handleNumClick(item);
                }}
                style={{
                  height: '44px',
                  borderRadius: '4px',
                  background: 'rgba(0, 255, 102, 0.06)',
                  border: '1px solid rgba(0, 255, 102, 0.25)',
                  color: item === 'CLR' ? '#ff3344' : item === '⌫' ? '#00e5ff' : '#00ff66',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 255, 102, 0.25)';
                  e.currentTarget.style.borderColor = '#00ff66';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 255, 102, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.25)';
                }}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Unlock Button */}
          <button
            onClick={handleUnlock}
            className="btn-cyber-primary pulse-cyber"
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
          >
            <Unlock size={18} />
            <span>[ AUTHENTICATE_ ]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
