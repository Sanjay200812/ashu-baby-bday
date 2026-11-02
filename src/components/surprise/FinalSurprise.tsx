import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RotateCcw,
  Flame,
  Wind,
  Download,
  Heart,
  Gift,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface FinalSurpriseProps {
  selectedGiftIds?: string[];
  onReplayAll: () => void;
  onBack?: () => void;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({
  selectedGiftIds = [],
  onReplayAll,
  onBack,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  const [candlesLit, setCandlesLit] = useState<boolean>(true);

  // Map selected gifts safely (only 1 selected gift as requested)
  const safeIds = Array.isArray(selectedGiftIds) ? selectedGiftIds : [];
  const selectedGift = (BIRTHDAY_CONFIG.availableGifts || []).find((g) =>
    safeIds.includes(g.id)
  ) || BIRTHDAY_CONFIG.availableGifts[0];

  useEffect(() => {
    // Keep website background music playing
    soundSystem.playSiteMusic();

    const launchConfetti = () => {
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.35, x: 0.5 },
        colors: ['#ff2a4b', '#ffb703', '#ffffff', '#ff1744'],
      });
    };

    launchConfetti();
    const timer = setTimeout(launchConfetti, 1400);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 1.1 }
    ).fromTo(
      letterRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.5'
    );

    return () => clearTimeout(timer);
  }, []);

  const handleToggleCandles = () => {
    if (candlesLit) {
      soundSystem.playCandleBlow();
      setCandlesLit(false);

      confetti({
        particleCount: 180,
        spread: 110,
        origin: { y: 0.6 },
        colors: ['#ff2a4b', '#ffb703', '#ffffff', '#ff1744'],
      });
    } else {
      soundSystem.playScore();
      setCandlesLit(true);
    }
  };

  const handleConfettiShower = () => {
    soundSystem.playVictory();
    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ff2a4b', '#ffb703', '#ffffff', '#ff1744'],
    });
  };

  const handleDownloadCard = async () => {
    soundSystem.playVictory();
    try {
      const response = await fetch(BIRTHDAY_CONFIG.bgCardUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Ashu_Birthday_Card.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      const link = document.createElement('a');
      link.href = BIRTHDAY_CONFIG.bgCardUrl;
      link.download = 'Ashu_Birthday_Card.png';
      link.target = '_blank';
      link.click();
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
        backgroundColor: 'transparent',
      }}
    >
      {/* Top Header / Actions */}
      <div
        style={{
          width: '100%',
          maxWidth: '740px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        {onBack ? (
          <button
            onClick={() => {
              soundSystem.playClick();
              onBack();
            }}
            className="btn-cyber-secondary"
            style={{ padding: '6px 14px', fontSize: '0.78rem' }}
          >
            <ArrowLeft size={14} />
            <span>BACK</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleConfettiShower}
          className="btn-cyber-primary pulse-cyber"
          style={{ padding: '8px 18px', fontSize: '0.82rem' }}
        >
          <Sparkles size={14} />
          <span>[ CELEBRATE 💥 ]</span>
        </button>
      </div>

      {/* Main Birthday Card */}
      <div
        ref={cardRef}
        className="terminal-panel"
        style={{
          width: '100%',
          maxWidth: '740px',
          padding: '40px 24px',
          textAlign: 'center',
          border: '2px solid #ff2a4b',
          boxShadow: '0 0 60px rgba(255, 42, 75, 0.5)',
          borderRadius: '16px',
          backgroundColor: '#0a0508',
        }}
      >
        {/* Large Original bg-card Birthday Card (Original proportions & high quality) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid rgba(255, 42, 75, 0.7)',
            boxShadow: '0 0 50px rgba(255, 42, 75, 0.45)',
            marginBottom: '32px',
            backgroundColor: '#050508',
          }}
        >
          <img
            src={BIRTHDAY_CONFIG.bgCardUrl}
            alt="South Dev Birthday Card"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '560px',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </div>

        {/* Heading in Tenglish */}
        <h1
          className="text-neon-red glitch-text"
          data-text={BIRTHDAY_CONFIG.surpriseHeading}
          style={{
            fontSize: 'clamp(1.8rem, 4.8vw, 2.7rem)',
            fontWeight: 900,
            lineHeight: 1.2,
            marginBottom: '8px',
          }}
        >
          {BIRTHDAY_CONFIG.surpriseHeading}
        </h1>

        <p
          style={{
            color: '#ffb703',
            fontSize: 'clamp(0.88rem, 2.5vw, 1.05rem)',
            fontWeight: 700,
            marginBottom: '28px',
          }}
        >
          {BIRTHDAY_CONFIG.surpriseSubheading}
        </p>

        {/* Interactive Cyber Cake */}
        <div
          style={{
            margin: '0 auto 30px',
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
            {/* Candles */}
            <div style={{ display: 'flex', gap: '34px', marginBottom: '4px', position: 'relative', zIndex: 3 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {candlesLit ? (
                    <div
                      style={{
                        width: '10px',
                        height: '20px',
                        borderRadius: '50% 50% 30% 30%',
                        background: 'radial-gradient(ellipse at 50% 60%, #ffffff 0%, #ffb703 40%, #ff2a4b 90%)',
                        boxShadow: '0 0 16px #ff2a4b, 0 0 28px #ffb703',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '3px',
                        height: '10px',
                        background: '#9e646d',
                        borderRadius: '2px',
                        opacity: 0.6,
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: '6px',
                      height: '24px',
                      background: 'repeating-linear-gradient(45deg, #ff2a4b, #ff2a4b 3px, #ffb703 3px, #ffb703 6px)',
                      borderRadius: '2px',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Top Tier */}
            <div
              style={{
                width: '140px',
                height: '38px',
                background: 'linear-gradient(180deg, #2a0b14 0%, #16060a 100%)',
                border: '1.5px solid #ff2a4b',
                borderRadius: '6px 6px 0 0',
                boxShadow: '0 0 15px rgba(255, 42, 75, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#ffb703', letterSpacing: '0.12em' }}>
                LEVEL 20+
              </span>
            </div>

            {/* Bottom Tier */}
            <div
              style={{
                width: '190px',
                height: '48px',
                background: 'linear-gradient(180deg, #330d18 0%, #1a060c 100%)',
                border: '2px solid #ff2a4b',
                borderRadius: '8px 8px 0 0',
                boxShadow: '0 0 25px rgba(255, 42, 75, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#fff', letterSpacing: '0.1em' }}>
                SOUTH DEV 🎂
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleCandles}
            className="btn-cyber-secondary"
            style={{
              marginTop: '14px',
              padding: '8px 18px',
              fontSize: '0.82rem',
              color: candlesLit ? '#ff2a4b' : '#ffb703',
              borderColor: candlesLit ? '#ff2a4b' : '#ffb703',
            }}
          >
            {candlesLit ? (
              <>
                <Wind size={15} />
                <span>[ BLOW OUT CANDLES ]</span>
              </>
            ) : (
              <>
                <Flame size={15} />
                <span>[ RELIGHT CANDLES ]</span>
              </>
            )}
          </button>
        </div>

        {/* Selected 1 Gift Badge */}
        {selectedGift && (
          <div
            style={{
              width: '100%',
              maxWidth: '580px',
              margin: '0 auto 28px',
              background: 'rgba(18, 10, 14, 0.95)',
              border: '1.5px solid #ffb703',
              borderRadius: '8px',
              padding: '16px 20px',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ffb703', fontSize: '0.84rem', fontWeight: 800, marginBottom: '8px' }}>
              <Gift size={16} />
              <span>ASHUU’S CLAIMED BIRTHDAY GIFT</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 42, 75, 0.15)',
                border: '1px solid #ff2a4b',
                borderRadius: '24px',
                padding: '8px 20px',
                fontSize: '0.94rem',
                fontWeight: 800,
                color: '#fff',
                marginTop: '4px',
              }}
            >
              <CheckCircle2 size={16} color="#ffb703" />
              <span>{selectedGift.title}</span>
            </div>
          </div>
        )}

        {/* Birthday Letter in Tenglish */}
        <div
          ref={letterRef}
          style={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto 32px',
            background: 'rgba(18, 10, 14, 0.95)',
            border: '1px solid rgba(255, 42, 75, 0.35)',
            borderRadius: '8px',
            padding: '26px 22px',
            textAlign: 'left',
          }}
        >
          {messageParagraphs.map((para, idx) => (
            <p
              key={idx}
              style={{
                fontSize: '0.96rem',
                lineHeight: 1.75,
                color: '#fff',
                marginBottom: '16px',
              }}
            >
              {para}
            </p>
          ))}

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 42, 75, 0.25)' }}>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#ff2a4b',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{BIRTHDAY_CONFIG.birthdayLetter.signature}</span>
              <Heart size={18} fill="#ff2a4b" color="#ff2a4b" />
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9e646d', marginTop: '4px' }}>
              Your forever syndicate brothers & partners-in-crime
            </div>
          </div>
        </div>

        {/* Action & Download Options placed at the end */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* Download Birthday Card / Poster */}
          <button
            onClick={handleDownloadCard}
            className="btn-cyber-primary pulse-cyber"
            style={{ padding: '14px 24px', fontSize: '0.9rem', fontWeight: 900 }}
          >
            <Download size={18} />
            <span>DOWNLOAD BIRTHDAY CARD</span>
          </button>

          {/* Download Special Video */}
          <a
            href={BIRTHDAY_CONFIG.specialVideoUrl}
            download="Ashu_Birthday_Special_Video.mp4"
            className="btn-cyber-secondary"
            style={{ textDecoration: 'none', padding: '14px 24px', fontSize: '0.9rem', borderColor: '#ffb703', color: '#ffb703', fontWeight: 800 }}
          >
            <Download size={18} />
            <span>DOWNLOAD SPECIAL VIDEO</span>
          </a>

          {/* Replay */}
          <button
            onClick={() => {
              soundSystem.playClick();
              onReplayAll();
            }}
            className="btn-cyber-secondary"
            style={{ padding: '14px 24px', fontSize: '0.9rem' }}
          >
            <RotateCcw size={18} />
            <span>[ REPLAY LEVELS ]</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalSurprise;
