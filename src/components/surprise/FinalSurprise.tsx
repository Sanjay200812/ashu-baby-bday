import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
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
  Share2,
  Loader2,
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
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  // Map selected gifts safely (only 1 selected gift as requested)
  const safeIds = Array.isArray(selectedGiftIds) ? selectedGiftIds : [];
  const selectedGift =
    (BIRTHDAY_CONFIG.availableGifts || []).find((g) => safeIds.includes(g.id)) ||
    BIRTHDAY_CONFIG.availableGifts[0];

  const messageParagraphs = BIRTHDAY_CONFIG.birthdayLetter.message
    .split('\n\n')
    .filter((p) => p.trim().length > 0);

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

  /**
   * Pure HTML5 2D Canvas Fallback
   * Synthesizes the entire birthday card from scratch if toPng is unavailable or fails:
   * 1. Top bg-card image
   * 2. Happy Birthday heading & subheading
   * 3. Selected birthday gift
   * 4. Complete birthday message
   * 5. Aakash & Sanjay signature
   */
  const downloadSynthesizedCard = async (): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D canvas context');

    const width = 1000;

    // Preload bg-card image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = BIRTHDAY_CONFIG.bgCardUrl;

    await new Promise((resolve) => {
      if (img.complete) resolve(true);
      else {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(true);
      }
    });

    const imgWidth = 920;
    const aspect = img.naturalWidth ? img.naturalHeight / img.naturalWidth : 0.65;
    const imgHeight = Math.min(imgWidth * aspect, 680);

    // Text wrapping helper
    const wrapText = (text: string, maxWidth: number, font: string) => {
      ctx.font = font;
      const words = text.split(' ');
      const lines: string[] = [];
      let cur = words[0] || '';
      for (let i = 1; i < words.length; i++) {
        const w = words[i];
        if (ctx.measureText(cur + ' ' + w).width < maxWidth) {
          cur += ' ' + w;
        } else {
          lines.push(cur);
          cur = w;
        }
      }
      if (cur) lines.push(cur);
      return lines;
    };

    const letterLines: string[][] = messageParagraphs.map((para) =>
      wrapText(para, 880, '20px monospace')
    );

    let textBlockHeight = 0;
    letterLines.forEach((lines) => {
      textBlockHeight += lines.length * 32 + 20;
    });

    const totalHeight =
      40 + // top pad
      imgHeight +
      36 + // image bottom spacing
      120 + // heading & subheading
      (selectedGift ? 120 : 0) + // gift badge
      40 + // letter padding
      textBlockHeight +
      140 + // signature block
      50; // bottom pad

    canvas.width = width;
    canvas.height = totalHeight;

    // Card background
    ctx.fillStyle = '#0a0508';
    ctx.fillRect(0, 0, width, totalHeight);

    // Glowing Neon Red Outer Card Border
    ctx.strokeStyle = '#ff2a4b';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, width - 32, totalHeight - 32);

    let currentY = 40;

    // 1. Top bg-card image
    if (img.complete && img.naturalWidth > 0) {
      const imgX = (width - imgWidth) / 2;
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 42, 75, 0.7)';
      ctx.lineWidth = 2;
      ctx.strokeRect(imgX, currentY, imgWidth, imgHeight);
      ctx.drawImage(img, imgX, currentY, imgWidth, imgHeight);
      ctx.restore();
    }
    currentY += imgHeight + 40;

    // 2. Heading & Subheading
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff2a4b';
    ctx.font = 'bold 36px monospace';
    ctx.shadowColor = '#ff2a4b';
    ctx.shadowBlur = 14;
    ctx.fillText(BIRTHDAY_CONFIG.surpriseHeading, width / 2, currentY);
    ctx.shadowBlur = 0;
    currentY += 40;

    ctx.fillStyle = '#ffb703';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(BIRTHDAY_CONFIG.surpriseSubheading, width / 2, currentY);
    currentY += 50;

    // 3. Claimed Birthday Gift
    if (selectedGift) {
      const giftBoxW = 760;
      const giftBoxH = 84;
      const giftBoxX = (width - giftBoxW) / 2;
      ctx.fillStyle = '#120a0e';
      ctx.strokeStyle = '#ffb703';
      ctx.lineWidth = 2;
      ctx.strokeRect(giftBoxX, currentY, giftBoxW, giftBoxH);
      ctx.fillRect(giftBoxX, currentY, giftBoxW, giftBoxH);

      ctx.fillStyle = '#ffb703';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('🎁 ASHUU’S CLAIMED BIRTHDAY GIFT', width / 2, currentY + 30);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('✓ ' + selectedGift.title, width / 2, currentY + 62);
      currentY += giftBoxH + 45;
    }

    // 4. Personalized Birthday Message
    const letterBoxW = 880;
    const letterBoxX = (width - letterBoxW) / 2;
    ctx.textAlign = 'left';
    ctx.font = '20px monospace';
    ctx.fillStyle = '#ffffff';

    letterLines.forEach((lines) => {
      lines.forEach((line) => {
        ctx.fillText(line, letterBoxX, currentY);
        currentY += 32;
      });
      currentY += 16;
    });

    currentY += 20;

    // 5. Signature
    ctx.strokeStyle = 'rgba(255, 42, 75, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(letterBoxX, currentY);
    ctx.lineTo(letterBoxX + letterBoxW, currentY);
    ctx.stroke();
    currentY += 35;

    ctx.font = 'bold 30px monospace';
    ctx.fillStyle = '#ff2a4b';
    ctx.fillText(BIRTHDAY_CONFIG.birthdayLetter.signature + ' ❤️', letterBoxX, currentY);
    currentY += 28;

    ctx.font = '16px monospace';
    ctx.fillStyle = '#9e646d';
    ctx.fillText('Your forever syndicate brothers & partners-in-crime', letterBoxX, currentY);

    return canvas.toDataURL('image/png', 0.98);
  };

  /**
   * Complete Birthday Card Image Generator
   * Generates a single high-quality PNG containing:
   * - bg-card image at the top
   * - Happy Birthday heading
   * - Claimed prize
   * - Complete message
   * - Aakash & Sanjay signature
   */
  const captureCompleteCardDataUrl = async (): Promise<string> => {
    if (cardRef.current) {
      try {
        // Wait for all images inside cardRef to be fully loaded
        const imgs = cardRef.current.querySelectorAll('img');
        await Promise.all(
          Array.from(imgs).map(
            (img) =>
              new Promise((resolve) => {
                if (img.complete) resolve(true);
                else {
                  img.onload = () => resolve(true);
                  img.onerror = () => resolve(true);
                }
              })
          )
        );

        // Capture with html-to-image
        const dataUrl = await toPng(cardRef.current, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: '#0a0508',
          cacheBust: true,
          filter: (node: HTMLElement) => {
            if (node.classList && node.classList.contains('no-export')) {
              return false;
            }
            return true;
          },
          style: {
            transform: 'none',
            margin: '0',
          },
        });

        if (dataUrl && dataUrl.startsWith('data:image/png')) {
          return dataUrl;
        }
      } catch (err) {
        console.warn('DOM capture toPng failed, using canvas synthesis fallback:', err);
      }
    }

    // Canvas synthesis fallback
    return await downloadSynthesizedCard();
  };

  const handleDownloadCard = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    soundSystem.playVictory();

    try {
      const dataUrl = await captureCompleteCardDataUrl();
      const link = document.createElement('a');
      link.download = 'Ashu_Complete_Birthday_Card.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      // Last resort fallback
      const link = document.createElement('a');
      link.href = BIRTHDAY_CONFIG.bgCardUrl;
      link.download = 'Ashu_Birthday_Card.png';
      link.target = '_blank';
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareWhatsApp = async () => {
    if (isSharing) return;
    setIsSharing(true);
    soundSystem.playClick();

    const deployedUrl = 'https://ashu-baby-bday.vercel.app';
    const prizeText = selectedGift ? `Claimed Prize: ${selectedGift.title}! 🎁` : '';
    const shareMessage = `🎂 Happy Birthday Ashu (SOUTH DEV)! 🔥✨\n\n${BIRTHDAY_CONFIG.birthdayLetter.message}\n\n${prizeText}\n\nCheck out Ashuu's Birthday Website here: ${deployedUrl}`;

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        let file: File | null = null;
        try {
          const dataUrl = await captureCompleteCardDataUrl();
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          file = new File([blob], 'Ashu_Complete_Birthday_Card.png', { type: 'image/png' });
        } catch {
          // If capture failed, fallback to bg-card
          const res = await fetch(BIRTHDAY_CONFIG.bgCardUrl);
          const blob = await res.blob();
          file = new File([blob], 'Ashu_Birthday_Card.png', { type: blob.type || 'image/png' });
        }

        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Happy Birthday Ashu!',
            text: shareMessage,
            files: [file],
          });
          return;
        } else {
          await navigator.share({
            title: 'Happy Birthday Ashu!',
            text: shareMessage,
            url: deployedUrl,
          });
          return;
        }
      }
    } catch (err) {
      console.log('Web Share dismissed or unavailable:', err);
    } finally {
      setIsSharing(false);
    }

    // Direct WhatsApp fallback: opens WhatsApp with prefilled message & link
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

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

      {/* Complete Printable Birthday Card Container */}
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
          position: 'relative',
        }}
      >
        {/* 1. Large Complete bg-card Birthday Card Photo at the Top */}
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
            crossOrigin="anonymous"
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

        {/* 2. Heading & Subheading in Tenglish */}
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
            className="btn-cyber-secondary no-export"
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

        {/* 3. Selected 1 Gift Badge */}
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

        {/* 4. Complete Birthday Letter & 5. Signature in Tenglish */}
        <div
          ref={letterRef}
          style={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
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

          {/* 5. Aakash & Sanjay Signature */}
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
      </div>

      {/* Action & Download Options - Placed OUTSIDE cardRef so they are never in the downloaded card */}
      <div
        style={{
          width: '100%',
          maxWidth: '740px',
          marginTop: '24px',
          display: 'flex',
          gap: '14px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Download Birthday Card Button */}
        <button
          onClick={handleDownloadCard}
          disabled={isDownloading}
          className="btn-cyber-primary pulse-cyber"
          style={{
            padding: '14px 24px',
            fontSize: '0.9rem',
            fontWeight: 900,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: isDownloading ? 'wait' : 'pointer',
          }}
        >
          {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          <span>{isDownloading ? 'GENERATING FULL CARD...' : 'DOWNLOAD BIRTHDAY CARD'}</span>
        </button>

        {/* Share on WhatsApp Button */}
        <button
          onClick={handleShareWhatsApp}
          disabled={isSharing}
          className="btn-cyber-secondary pulse-cyber"
          style={{
            padding: '14px 24px',
            fontSize: '0.9rem',
            fontWeight: 900,
            borderColor: '#25D366',
            color: '#25D366',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 25px rgba(37, 211, 102, 0.3)',
            cursor: isSharing ? 'wait' : 'pointer',
          }}
        >
          <Share2 size={18} />
          <span>SHARE ON WHATSAPP</span>
        </button>

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
  );
};

export default FinalSurprise;