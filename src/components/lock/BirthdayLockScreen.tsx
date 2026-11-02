import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Lock, Unlock, Sparkles, KeyRound, AlertCircle, Calendar, ShieldCheck } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface BirthdayLockScreenProps {
  onUnlock: () => void;
}

export const BirthdayLockScreen: React.FC<BirthdayLockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [now, setNow] = useState<Date>(new Date());

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Update clock every second for dynamic countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate dynamic age from DOB (Nov 3, 2005)
  const calculateAge = () => {
    const dob = new Date(BIRTHDAY_CONFIG.dob);
    let age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate live countdown to next November 3
  const getCountdown = () => {
    const dob = new Date(BIRTHDAY_CONFIG.dob);
    let target = new Date(now.getFullYear(), dob.getMonth(), dob.getDate(), 0, 0, 0);

    // If birthday has already passed this year, countdown to next year
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

  // Handle number click on virtual keypad
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

  // Handle Unlock check
  const handleUnlock = () => {
    soundSystem.playClick();
    if (pin === BIRTHDAY_CONFIG.lockPassword) {
      // Correct!
      soundSystem.playVictory();
      setErrorMessage('');

      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.05,
        filter: 'blur(10px)',
        duration: 0.7,
        ease: 'power2.inOut',
        onComplete: onUnlock,
      });
    } else {
      // Incorrect code
      soundSystem.playHit();
      setErrorMessage('Incorrect passcode! Enter your date of birth (DDMMYYYY)');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPin('');
    }
  };

  // Listen for physical keyboard input
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
      }}
    >
      <div
        ref={cardRef}
        className={`glass-panel glass-panel-glow ${isShaking ? 'shake-animation' : ''}`}
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          border: '1px solid rgba(255, 215, 0, 0.4)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(220, 38, 38, 0.2)',
          borderRadius: '24px',
        }}
      >
        {/* Lock Icon Badge */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.25) 0%, rgba(255, 215, 0, 0.2) 100%)',
            border: '2px solid rgba(255, 215, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 0 25px rgba(255, 215, 0, 0.35)',
          }}
        >
          <Lock size={32} color="#ffd700" />
        </div>

        <h1
          className="gold-text-shimmer"
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '1.9rem',
            fontWeight: 800,
            marginBottom: '6px',
          }}
        >
          Birthday Vault
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '22px' }}>
          Restricted access for Aakash & Sanjay's birthday VIP
        </p>

        {/* Live Dynamic Birthday Counter & Age */}
        <div
          style={{
            width: '100%',
            background: 'rgba(15, 17, 30, 0.85)',
            border: '1px solid rgba(255, 215, 0, 0.25)',
            borderRadius: '16px',
            padding: '16px 12px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: '#ffd700',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            <Calendar size={14} />
            <span>Born: November 3, 2005 • Age: {age} Years</span>
          </div>

          {/* Countdown timer numbers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
            }}
          >
            {[
              { label: 'DAYS', val: days },
              { label: 'HOURS', val: hours },
              { label: 'MINUTES', val: minutes },
              { label: 'SECONDS', val: seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  padding: '8px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    fontFamily: 'monospace',
                    color: '#fff',
                    lineHeight: 1,
                  }}
                >
                  {unit.val < 10 ? `0${unit.val}` : unit.val}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700, marginTop: '4px' }}>
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PIN Input Slots */}
        <div style={{ marginBottom: '18px', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
              const char = pin[idx];
              return (
                <div
                  key={idx}
                  style={{
                    width: '38px',
                    height: '46px',
                    borderRadius: '8px',
                    background: char ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: char ? '2px solid #ffd700' : '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#ffd700',
                    boxShadow: char ? '0 0 10px rgba(255, 215, 0, 0.4)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {char || '•'}
                </div>
              );
            })}
          </div>

          {/* Error Message Display */}
          {errorMessage ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: '#ef4444',
                fontSize: '0.8rem',
                marginTop: '8px',
              }}
            >
              <AlertCircle size={14} />
              <span>{errorMessage}</span>
            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
              Hint: Enter your 8-digit birth date in <strong>DDMMYYYY</strong> format
            </div>
          )}
        </div>

        {/* Numeric On-Screen Keypad */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            width: '100%',
            maxWidth: '280px',
            marginBottom: '20px',
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
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: item === 'CLR' ? '#ef4444' : item === '⌫' ? '#ffd700' : '#fff',
                fontSize: '1.15rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)';
                e.currentTarget.style.borderColor = '#ffd700';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Unlock Button */}
        <button
          onClick={handleUnlock}
          className="btn-primary-glow pulse-glow"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '1.05rem',
          }}
        >
          <Unlock size={18} />
          <span>UNLOCK SURPRISE</span>
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
        .shake-animation {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};
