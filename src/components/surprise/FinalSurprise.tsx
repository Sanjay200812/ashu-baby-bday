import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RotateCcw,
  ArrowLeft,
  Flame,
  Wind,
  Terminal,
  Share2,
  Check,
  Cpu,
  Heart,
  Video,
  Film,
} from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';
import { AudioPlayer } from './AudioPlayer';

interface FinalSurpriseProps {
  onReplayAll: () => void;
  onBackToArcade: () => void;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({ onReplayAll, onBackToArcade }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  const [candlesLit, setCandlesLit] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Cyber digital confetti
    const launchConfetti = () => {
      confetti({
        particleCount: 90,
        spread: 90,
        origin: { y: 0.35, x: 0.5 },
        colors: ['#00ff66', '#00e5ff', '#ff3344', '#ffffff', '#ffd700'],
      });
    };

    launchConfetti();
    const timer = setTimeout(launchConfetti, 1400);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2 }
    )
      .fromTo(
        photoRef.current,
        { opacity: 0, scale: 0.8, rotate: -4 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1, ease: 'back.out(1.5)' },
        '-=0.7'
      )
      .fromTo(
        letterRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9 },
        '-=0.5'
      );

    return () => clearTimeout(timer);
  }, []);

  const handleToggleCandles = () => {
    if (candlesLit) {
      soundSystem.playCandleBlow();
      setCandlesLit(false);

      confetti({
        particleCount: 160,
        spread: 110,
        origin: { y: 0.6 },
        colors: ['#00ff66', '#00e5ff', '#ffffff', '#ffd700'],
      });
    } else {
      soundSystem.playScore();
      setCandlesLit(true);
    }
  };

  const handleConfettiShower = () => {
    soundSystem.playVictory();
    confetti({
      particleCount: 110,
      spread: 85,
      origin: { y: 0.5 },
      colors: ['#00ff66', '#00e5ff', '#ff3344', '#ffd700'],
    });
  };

  const handleShareCard = () => {
    soundSystem.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Happy Birthday South Dev! 🎉 Check out your personalized cyber intrusion surprise created by Aakash & Sanjay: ${window.location.origin}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const messageParagraphs = BIRTHDAY_CONFIG.birthdayLetter.message
    .split('\n\n')
    .filter((p) => p.trim().length > 0);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        padding: '36px 16px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Top Navigation */}
      <div
        style={{
          width: '100%',
          maxWidth: '700px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <button
          onClick={() => {
            soundSystem.playClick();
            onBackToArcade();
          }}
          className="btn-cyber-secondary"
          style={{ padding: '8px 16px', fontSize: '0.82rem' }}
        >
          <ArrowLeft size={15} />
          <span>[ ARCADE_HUB ]</span>
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleShareCard}
            className="btn-cyber-secondary"
            style={{ padding: '8px 14px', fontSize: '0.82rem', borderColor: '#00e5ff', color: '#00e5ff' }}
          >
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            <span>{copied ? '[ LINK COPIED ]' : '[ SHARE CARD ]'}</span>
          </button>

          <button
            onClick={handleConfettiShower}
            className="btn-cyber-secondary"
            style={{ padding: '8px 14px', fontSize: '0.82rem', borderColor: '#00ff66', color: '#00ff66' }}
          >
            <Sparkles size={14} />
            <span>[ CYBER SPARKS ]</span>
          </button>
        </div>
      </div>

      {/* Main Cyber Birthday Card Terminal */}
      <div
        ref={cardRef}
        className="terminal-panel"
        style={{
          width: '100%',
          maxWidth: '700px',
          padding: 'clamp(28px, 6vw, 48px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          border: '1px solid #00ff66',
          boxShadow: '0 0 50px rgba(0, 255, 102, 0.25)',
          position: 'relative',
        }}
      >
        {/* Terminal Card Tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 255, 102, 0.08)',
            border: '1px solid #00ff66',
            borderRadius: '4px',
            padding: '4px 14px',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#00ff66',
            marginBottom: '24px',
          }}
        >
          <Cpu size={14} />
          <span>SECURITY OVERRIDE COMPLETE // BIRTHDAY CARD DECRYPTED</span>
        </div>

        {/* Ashu's Photo in Cyber Frame */}
        <div
          ref={photoRef}
          style={{
            position: 'relative',
            width: '170px',
            height: '170px',
            margin: '0 auto 28px',
          }}
        >
          {/* Animated Neon Green Rotating Ring */}
          <div
            style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, #00ff66, #00e5ff, #ff3344, #00ff66)',
              filter: 'blur(10px)',
              opacity: 0.7,
              animation: 'spin 10s linear infinite',
            }}
          />

          {/* Photo Frame */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #00ff66',
              boxShadow: '0 0 25px rgba(0, 255, 102, 0.6)',
              background: '#05070a',
            }}
          >
            <img
              src={BIRTHDAY_CONFIG.photoUrl}
              alt={BIRTHDAY_CONFIG.personName}
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
              top: -24,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '2rem',
              filter: 'drop-shadow(0 0 10px #00ff66)',
            }}
          >
            👑
          </div>
        </div>

        {/* Cyber Title */}
        <h1
          className="text-neon-green glitch-text"
          data-text={BIRTHDAY_CONFIG.surpriseHeading}
          style={{
            fontSize: 'clamp(1.8rem, 4.8vw, 2.7rem)',
            fontWeight: 900,
            lineHeight: 1.2,
            marginBottom: '10px',
          }}
        >
          {BIRTHDAY_CONFIG.surpriseHeading}
        </h1>

        <p
          style={{
            color: '#00e5ff',
            fontSize: 'clamp(0.88rem, 2.5vw, 1.05rem)',
            fontWeight: 600,
            marginBottom: '32px',
            maxWidth: '540px',
          }}
        >
          {BIRTHDAY_CONFIG.surpriseSubheading}
        </p>

        {/* Cyber-Themed Birthday Cake */}
        <div
          style={{
            margin: '0 auto 36px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '200px',
              height: '130px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {/* Cyber Laser Candles */}
            <div style={{ display: 'flex', gap: '34px', marginBottom: '4px', position: 'relative', zIndex: 3 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {candlesLit ? (
                    <div
                      style={{
                        width: '10px',
                        height: '20px',
                        borderRadius: '50% 50% 30% 30%',
                        background: 'radial-gradient(ellipse at 50% 60%, #ffffff 0%, #00ff66 40%, #00e5ff 90%)',
                        boxShadow: '0 0 16px #00ff66, 0 0 30px #00e5ff',
                        animation: `cyberFlame ${0.5 + i * 0.15}s infinite alternate ease-in-out`,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '3px',
                        height: '10px',
                        background: '#5c7866',
                        borderRadius: '2px',
                        opacity: 0.6,
                      }}
                    />
                  )}
                  {/* Neon Candle Node */}
                  <div
                    style={{
                      width: '6px',
                      height: '24px',
                      background: 'repeating-linear-gradient(45deg, #00ff66, #00ff66 3px, #00e5ff 3px, #00e5ff 6px)',
                      borderRadius: '2px 2px 0 0',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Cake Top Tier */}
            <div
              style={{
                width: '140px',
                height: '36px',
                background: '#0a141b',
                borderRadius: '4px',
                border: '1.5px solid #00ff66',
                boxShadow: '0 0 14px rgba(0, 255, 102, 0.4)',
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                color: '#00ff66',
                fontWeight: 800,
              }}
            >
              LEVEL_21 // UNLOCKED
            </div>

            {/* Cake Bottom Tier */}
            <div
              style={{
                width: '190px',
                height: '48px',
                background: '#060a0f',
                borderRadius: '4px',
                border: '1.5px solid #00e5ff',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
                position: 'relative',
                zIndex: 1,
                marginTop: '-2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '0 16px',
              }}
            >
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#00ff66',
                    boxShadow: '0 0 8px #00ff66',
                  }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleToggleCandles}
            className="btn-cyber-secondary"
            style={{
              marginTop: '16px',
              padding: '8px 18px',
              fontSize: '0.82rem',
              color: candlesLit ? '#00ff66' : '#00e5ff',
              borderColor: candlesLit ? '#00ff66' : '#00e5ff',
            }}
          >
            {candlesLit ? (
              <>
                <Wind size={15} />
                <span>[ EXTINGUISH CYBER CANDLES ]</span>
              </>
            ) : (
              <>
                <Flame size={15} />
                <span>[ RELIGHT CANDLES ]</span>
              </>
            )}
          </button>
        </div>

        {/* Message Dossier */}
        <div
          ref={letterRef}
          style={{
            width: '100%',
            maxWidth: '580px',
            background: 'rgba(8, 14, 20, 0.85)',
            border: '1px solid rgba(0, 255, 102, 0.35)',
            borderRadius: '6px',
            padding: '28px 24px',
            textAlign: 'left',
            marginBottom: '36px',
            boxShadow: 'inset 0 1px 0 rgba(0, 255, 102, 0.1)',
          }}
        >
          {messageParagraphs.map((para, idx) => (
            <p
              key={idx}
              style={{
                fontSize: '0.96rem',
                lineHeight: 1.75,
                color: '#e2fce8',
                marginBottom: '16px',
              }}
            >
              {para}
            </p>
          ))}

          {/* Signature */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(0, 255, 102, 0.25)' }}>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#00ff66',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{BIRTHDAY_CONFIG.birthdayLetter.signature}</span>
              <Heart size={18} fill="#ff3344" color="#ff3344" />
            </div>
            <div style={{ fontSize: '0.8rem', color: '#5c7866', marginTop: '4px' }}>
              Your forever syndicate brothers & partners-in-crime
            </div>
          </div>
        </div>

        {/* Special Birthday Video Reel Archive */}
        {BIRTHDAY_CONFIG.specialVideoUrl && (
          <div
            style={{
              width: '100%',
              maxWidth: '580px',
              background: 'rgba(8, 14, 20, 0.92)',
              border: '1px solid #00e5ff',
              boxShadow: '0 0 30px rgba(0, 229, 255, 0.2)',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '36px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#00e5ff',
                fontSize: '0.88rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                marginBottom: '14px',
              }}
            >
              <Film size={18} />
              <span>TOP_SECRET // ASHU_BIRTHDAY_REEL.MP4</span>
            </div>

            <div
              style={{
                position: 'relative',
                borderRadius: '6px',
                overflow: 'hidden',
                background: '#000',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8)',
              }}
            >
              <video
                src={BIRTHDAY_CONFIG.specialVideoUrl}
                controls
                playsInline
                preload="metadata"
                poster={BIRTHDAY_CONFIG.photoUrl}
                style={{
                  width: '100%',
                  maxHeight: '440px',
                  display: 'block',
                  backgroundColor: '#000',
                }}
              />
            </div>

            <div style={{ fontSize: '0.76rem', color: '#5c7866', marginTop: '10px' }}>
              Recorded & assembled by Aakash & Sanjay // Press play to watch the tribute
            </div>
          </div>
        )}

        {/* Reusable Audio Player */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <AudioPlayer />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onBackToArcade} className="btn-cyber-secondary" style={{ padding: '12px 24px' }}>
            <ArrowLeft size={16} />
            <span>[ RETURN TO ARCADE ]</span>
          </button>

          <button onClick={onReplayAll} className="btn-cyber-primary" style={{ padding: '12px 26px' }}>
            <RotateCcw size={16} />
            <span>[ REBOOT SYSTEM INTRUSION ]</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes cyberFlame {
          0% { transform: scale(1) translateY(0); filter: drop-shadow(0 0 6px #00ff66); }
          50% { transform: scale(1.1) translateY(-2px); filter: drop-shadow(0 0 14px #00e5ff); }
          100% { transform: scale(0.95) translateY(1px); filter: drop-shadow(0 0 8px #00ff66); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
