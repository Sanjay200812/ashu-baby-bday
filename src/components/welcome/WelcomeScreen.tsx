import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Play, Sparkles, Gamepad2, Gift } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { useAudio } from '../../utils/useAudio';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playClick } = useAudio();

  // Floating canvas particle system with gold and crimson gaming sparks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      alpha: number;
      color: string;
    }> = [];

    // Crimson and gold gaming sparks
    const colors = ['#ffd700', '#ff2a2a', '#dc2626', '#ffb703', '#ffffff', '#e040fb'];

    for (let i = 0; i < 75; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.4 + 0.6,
        speedY: -(Math.random() * 0.45 + 0.15),
        speedX: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.75 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 9;
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // GSAP Cinematic Entrance
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      badgeRef.current,
      { opacity: 0, y: -20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8 }
    )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 25, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0 },
        '-=0.4'
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.85, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.6)' },
        '-=0.3'
      )
      .fromTo(
        hintRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.3'
      );
  }, []);

  const handlePlay = () => {
    playClick();

    // GSAP Cinematic Exit Transition
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(10px)',
      duration: 0.65,
      ease: 'power2.inOut',
      onComplete: onStart,
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        textAlign: 'center',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div
        className="glass-panel glass-panel-glow"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '580px',
          width: '100%',
          padding: '48px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1px solid rgba(220, 38, 38, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(220, 38, 38, 0.25)',
        }}
      >
        {/* Creator Badge */}
        <div
          ref={badgeRef}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(220, 38, 38, 0.2)',
            border: '1px solid rgba(220, 38, 38, 0.5)',
            borderRadius: '9999px',
            padding: '6px 16px',
            marginBottom: '24px',
          }}
        >
          <Gamepad2 size={16} color="#ef4444" />
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#f87171',
            }}
          >
            Aakash & Sanjay's Special Edition
          </span>
        </div>

        {/* Main Title */}
        <h1
          ref={titleRef}
          className="gold-text-shimmer neon-title"
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: '16px',
            letterSpacing: '-0.01em',
          }}
        >
          {BIRTHDAY_CONFIG.openingTitle}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontSize: 'clamp(1rem, 2.8vw, 1.25rem)',
            color: '#cbd5e1',
            lineHeight: 1.6,
            maxWidth: '460px',
            marginBottom: '36px',
            fontWeight: 400,
          }}
        >
          {BIRTHDAY_CONFIG.openingSubtitle}
        </p>

        {/* Glowing Play Button */}
        <button
          ref={buttonRef}
          onClick={handlePlay}
          className="btn-primary-glow pulse-glow"
          style={{
            padding: '16px 44px',
            fontSize: '1.25rem',
            letterSpacing: '0.04em',
            marginBottom: '28px',
            background: 'linear-gradient(135deg, #ffd700 0%, #dc2626 100%)',
            color: '#ffffff',
            boxShadow: '0 0 30px rgba(220, 38, 38, 0.5), 0 4px 15px rgba(0,0,0,0.5)',
          }}
        >
          <Play size={22} fill="#ffffff" />
          <span>START ADVENTURE</span>
        </button>

        {/* Subtle Hint */}
        <div
          ref={hintRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#94a3b8',
            fontSize: '0.88rem',
            fontStyle: 'italic',
          }}
        >
          <Gift size={16} color="#ffd700" />
          <span>Beat Level 1 Flap to unlock the Birthday Arcade & Quizzes!</span>
        </div>
      </div>
    </div>
  );
};
