import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, ArrowLeft, Flame, Wind, Heart } from 'lucide-react';
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

  // GSAP Cinematic Entrance Sequence
  useEffect(() => {
    const launchConfetti = () => {
      confetti({
        particleCount: 85,
        spread: 90,
        origin: { y: 0.35, x: 0.5 },
        colors: ['#ffd700', '#dc2626', '#00e5ff', '#e040fb', '#ffffff'],
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
        colors: ['#ffd700', '#ffb703', '#ffffff', '#e040fb', '#dc2626'],
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
    });
  };

  // Split letter message into readable paragraphs
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
      }}
    >
      {/* Top Bar Navigation */}
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => {
            soundSystem.playClick();
            onBackToArcade();
          }}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.88rem' }}
        >
          <ArrowLeft size={16} />
          <span>Arcade Menu</span>
        </button>

        <button
          onClick={handleConfettiShower}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.88rem', borderColor: 'rgba(255, 215, 0, 0.4)' }}
        >
          <Sparkles size={16} color="#ffd700" />
          <span>Shower Confetti</span>
        </button>
      </div>

      {/* Main Luxury Birthday Card */}
      <div
        ref={cardRef}
        className="glass-panel glass-panel-glow"
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: 'clamp(28px, 6vw, 54px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          border: '1px solid rgba(255, 215, 0, 0.45)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.2)',
          position: 'relative',
        }}
      >
        {/* Ornate Photo Frame */}
        <div
          ref={photoRef}
          style={{
            position: 'relative',
            width: '170px',
            height: '170px',
            margin: '0 auto 28px',
          }}
        >
          {/* Animated Gold Ring Glow */}
          <div
            style={{
              position: 'absolute',
              inset: -8,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, #ffd700, #dc2626, #00e5ff, #ffd700)',
              filter: 'blur(12px)',
              opacity: 0.65,
              animation: 'spin 12s linear infinite',
            }}
          />

          {/* Photo Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '4px solid #ffd700',
              boxShadow: '0 0 25px rgba(255, 215, 0, 0.5), inset 0 0 15px rgba(0,0,0,0.5)',
              background: '#121422',
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

          {/* Crown */}
          <div
            style={{
              position: 'absolute',
              top: -24,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '2rem',
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
            }}
          >
            👑
          </div>
        </div>

        {/* Heading */}
        <h1
          className="gold-text-shimmer neon-title"
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(2.1rem, 5.5vw, 3.2rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: '10px',
          }}
        >
          {BIRTHDAY_CONFIG.surpriseHeading}
        </h1>

        <p
          style={{
            color: '#ffd700',
            fontSize: 'clamp(0.95rem, 2.6vw, 1.15rem)',
            fontWeight: 500,
            marginBottom: '32px',
            maxWidth: '520px',
          }}
        >
          {BIRTHDAY_CONFIG.surpriseSubheading}
        </p>

        {/* Interactive Birthday Cake */}
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
              height: '140px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {/* Candles */}
            <div style={{ display: 'flex', gap: '32px', marginBottom: '4px', position: 'relative', zIndex: 3 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {candlesLit ? (
                    <div
                      style={{
                        width: '12px',
                        height: '18px',
                        borderRadius: '50% 50% 35% 35%',
                        background: 'radial-gradient(ellipse at 50% 60%, #ffffff 0%, #ffeb3b 40%, #ff5722 90%)',
                        boxShadow: '0 0 16px #ff9800, 0 0 30px #ffeb3b',
                        animation: `flicker ${0.6 + i * 0.15}s infinite alternate ease-in-out`,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '3px',
                        height: '10px',
                        background: '#64748b',
                        borderRadius: '2px',
                        opacity: 0.6,
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: '8px',
                      height: '24px',
                      background: 'repeating-linear-gradient(45deg, #ffd700, #ffd700 4px, #dc2626 4px, #dc2626 8px)',
                      borderRadius: '3px 3px 0 0',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Cake Top Tier */}
            <div
              style={{
                width: '140px',
                height: '38px',
                background: 'linear-gradient(180deg, #fce7f3 0%, #f472b6 100%)',
                borderRadius: '16px 16px 4px 4px',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '12px',
                  background: '#ffffff',
                  borderRadius: '14px 14px 8px 8px',
                  opacity: 0.9,
                }}
              />
            </div>

            {/* Cake Bottom Tier */}
            <div
              style={{
                width: '190px',
                height: '52px',
                background: 'linear-gradient(180deg, #7c3aed 0%, #4c1d95 100%)',
                borderRadius: '16px 16px 6px 6px',
                border: '2px solid rgba(255, 215, 0, 0.35)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                position: 'relative',
                zIndex: 1,
                marginTop: '-2px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: '12px 14px 0',
                }}
              >
                {[...Array(7)].map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#ffd700',
                      boxShadow: '0 0 6px rgba(255, 215, 0, 0.8)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleCandles}
            className="btn-secondary"
            style={{
              marginTop: '16px',
              padding: '8px 20px',
              fontSize: '0.88rem',
              color: candlesLit ? '#ffd700' : '#4ade80',
              borderColor: candlesLit ? 'rgba(255, 215, 0, 0.4)' : '#4ade80',
            }}
          >
            {candlesLit ? (
              <>
                <Wind size={16} />
                <span>Make a Wish & Blow Out Candles</span>
              </>
            ) : (
              <>
                <Flame size={16} />
                <span>Relight Candles</span>
              </>
            )}
          </button>
        </div>

        {/* Personalized Message Signed by Aakash & Sanjay */}
        <div
          ref={letterRef}
          style={{
            width: '100%',
            maxWidth: '560px',
            background: 'rgba(15, 17, 30, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '20px',
            padding: '28px 24px',
            textAlign: 'left',
            marginBottom: '36px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 30px rgba(0,0,0,0.4)',
          }}
        >
          {messageParagraphs.map((para, idx) => (
            <p
              key={idx}
              style={{
                fontSize: '1rem',
                lineHeight: 1.75,
                color: '#e2e8f0',
                marginBottom: '16px',
              }}
            >
              {para}
            </p>
          ))}

          {/* Signature by Aakash & Sanjay */}
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid rgba(255, 215, 0, 0.2)' }}>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                color: '#ffd700',
                fontFamily: 'Cinzel, serif',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{BIRTHDAY_CONFIG.birthdayLetter.signature}</span>
              <Heart size={20} fill="#dc2626" color="#dc2626" />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '4px' }}>
              Your forever brothers & partners-in-crime
            </div>
          </div>
        </div>

        {/* Reusable Audio Player Component */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <AudioPlayer />
        </div>

        {/* Action Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => {
              soundSystem.playClick();
              onBackToArcade();
            }}
            className="btn-secondary"
            style={{ padding: '12px 24px' }}
          >
            <ArrowLeft size={16} />
            <span>Return to Arcade</span>
          </button>

          <button
            onClick={() => {
              soundSystem.playClick();
              onReplayAll();
            }}
            className="btn-primary-glow"
            style={{ padding: '12px 28px' }}
          >
            <RotateCcw size={16} />
            <span>Replay Entire Journey</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes flicker {
          0% { transform: scale(1) rotate(-1deg); }
          50% { transform: scale(1.08) rotate(2deg); }
          100% { transform: scale(0.95) rotate(-2deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
