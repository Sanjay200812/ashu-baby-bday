import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, Clock, Sparkles, CheckCircle } from 'lucide-react';
import { soundSystem } from '../../utils/audioSystem';

interface BalloonPopGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface Balloon {
  id: number;
  x: number;
  y: number;
  speedY: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  wobbleOffset: number;
  color: string;
  isGold: boolean;
  radius: number;
  points: number;
}

interface PopParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

const BALLOON_COLORS = ['#ff4081', '#7c3aed', '#00e5ff', '#ffb703', '#4ade80'];

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({ onComplete, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE'>('IDLE');
  const [bestScore, setBestScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('birthday_balloon_best') || '0', 10);
  });

  const TARGET_SCORE = 120;

  const stateRef = useRef({
    score: 0,
    timeLeft: 30,
    gameState: 'IDLE' as 'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE',
    balloons: [] as Balloon[],
    particles: [] as PopParticle[],
    floatingTexts: [] as FloatingText[],
    nextId: 1,
    spawnCooldown: 0,
    time: 0,
  });

  const startGame = () => {
    soundSystem.playClick();
    stateRef.current.score = 0;
    stateRef.current.timeLeft = 30;
    stateRef.current.balloons = [];
    stateRef.current.particles = [];
    stateRef.current.floatingTexts = [];
    stateRef.current.gameState = 'PLAYING';
    setScore(0);
    setTimeLeft(30);
    setGameState('PLAYING');
  };

  // Timer countdown
  useEffect(() => {
    let timer: number;
    if (gameState === 'PLAYING') {
      timer = window.setInterval(() => {
        stateRef.current.timeLeft -= 1;
        setTimeLeft(stateRef.current.timeLeft);

        if (stateRef.current.timeLeft <= 0) {
          const finalScore = stateRef.current.score;
          if (finalScore >= TARGET_SCORE) {
            stateRef.current.gameState = 'COMPLETE';
            setGameState('COMPLETE');
            soundSystem.playVictory();
            confetti({
              particleCount: 110,
              spread: 75,
              origin: { y: 0.5 },
            });
            onComplete(finalScore);
          } else {
            stateRef.current.gameState = 'GAMEOVER';
            setGameState('GAMEOVER');
            soundSystem.playHit();
          }
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, onComplete]);

  // Main Canvas Render & Physics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 420);
    const height = (canvas.height = 600);
    let animId: number;

    const handlePointerDown = (clientX: number, clientY: number) => {
      const s = stateRef.current;
      if (s.gameState !== 'PLAYING') return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      const clickX = (clientX - rect.left) * scaleX;
      const clickY = (clientY - rect.top) * scaleY;

      // Check hit from top down (last drawn first)
      for (let i = s.balloons.length - 1; i >= 0; i--) {
        const b = s.balloons[i];
        const dx = clickX - b.x;
        const dy = clickY - b.y;
        if (Math.sqrt(dx * dx + dy * dy) <= b.radius + 6) {
          // Popped!
          soundSystem.playPop();
          s.score += b.points;
          setScore(s.score);

          // Update Best
          const currentBest = parseInt(localStorage.getItem('birthday_balloon_best') || '0', 10);
          if (s.score > currentBest) {
            localStorage.setItem('birthday_balloon_best', s.score.toString());
            setBestScore(s.score);
          }

          // Particles
          for (let p = 0; p < 16; p++) {
            s.particles.push({
              x: b.x,
              y: b.y,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              color: b.color,
              life: 22,
            });
          }

          // Floating score text
          s.floatingTexts.push({
            id: s.nextId++,
            x: b.x,
            y: b.y,
            text: `+${b.points}`,
            color: b.isGold ? '#ffd700' : '#ffffff',
            life: 30,
          });

          s.balloons.splice(i, 1);
          break;
        }
      }
    };

    const onMouseDown = (e: MouseEvent) => handlePointerDown(e.clientX, e.clientY);
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      const s = stateRef.current;
      s.time += 0.05;

      if (s.gameState === 'PLAYING') {
        // Spawn balloons
        s.spawnCooldown--;
        if (s.spawnCooldown <= 0) {
          s.spawnCooldown = Math.max(16, 32 - Math.floor(s.score / 40) * 3);

          const isGold = Math.random() < 0.2;
          const radius = isGold ? 26 : Math.random() * 8 + 24;
          const color = isGold ? '#ffd700' : BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];

          s.balloons.push({
            id: s.nextId++,
            x: Math.random() * (width - 80) + 40,
            y: height + 40,
            speedY: Math.random() * 1.6 + 2.2 + (isGold ? 0.8 : 0),
            wobbleSpeed: Math.random() * 0.05 + 0.03,
            wobbleAmp: Math.random() * 18 + 10,
            wobbleOffset: Math.random() * 100,
            color,
            isGold,
            radius,
            points: isGold ? 25 : 10,
          });
        }

        // Update balloons
        for (let i = s.balloons.length - 1; i >= 0; i--) {
          const b = s.balloons[i];
          b.y -= b.speedY;
          b.x += Math.sin(s.time * 2 + b.wobbleOffset) * 0.8;

          if (b.y < -50) {
            s.balloons.splice(i, 1);
          }
        }
      }

      // Draw Balloons
      s.balloons.forEach((b) => {
        ctx.save();
        ctx.translate(b.x, b.y);

        // String
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, b.radius);
        ctx.quadraticCurveTo(Math.sin(s.time * 4) * 8, b.radius + 15, 0, b.radius + 30);
        ctx.stroke();

        // Balloon body
        ctx.fillStyle = b.color;
        if (b.isGold) {
          ctx.shadowColor = '#ffd700';
          ctx.shadowBlur = 16;
        }
        ctx.beginPath();
        ctx.ellipse(0, 0, b.radius * 0.88, b.radius * 1.12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Knot
        ctx.beginPath();
        ctx.moveTo(-4, b.radius);
        ctx.lineTo(4, b.radius);
        ctx.lineTo(0, b.radius + 5);
        ctx.closePath();
        ctx.fill();

        // Shine reflection
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(-b.radius * 0.35, -b.radius * 0.4, b.radius * 0.22, b.radius * 0.35, -0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // Draw Particles
      for (let p = s.particles.length - 1; p >= 0; p--) {
        const pt = s.particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(1, pt.life * 0.16), 0, Math.PI * 2);
        ctx.fill();
        if (pt.life <= 0) s.particles.splice(p, 1);
      }

      // Draw Floating Texts
      for (let t = s.floatingTexts.length - 1; t >= 0; t--) {
        const ft = s.floatingTexts[t];
        ft.y -= 1.2;
        ft.life--;
        ctx.font = 'bold 16px Outfit, sans-serif';
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = Math.max(0, ft.life / 30);
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1;
        if (ft.life <= 0) s.floatingTexts.splice(t, 1);
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('touchstart', onTouchStart);
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 12px',
        zIndex: 10,
      }}
    >
      {/* Top Header */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <button
          onClick={() => {
            soundSystem.playClick();
            onBack();
          }}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>Arcade</span>
        </button>

        {/* Timer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: timeLeft <= 5 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.08)',
            border: `1px solid ${timeLeft <= 5 ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'}`,
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.9rem',
            fontWeight: 800,
            color: timeLeft <= 5 ? '#ef4444' : '#fff',
          }}
        >
          <Clock size={16} />
          <span>{timeLeft}s</span>
        </div>

        {/* Best Score */}
        {bestScore > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#ffd700',
            }}
          >
            <Trophy size={15} />
            <span>{bestScore}</span>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="game-canvas-wrapper" style={{ height: '600px' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        {/* Live HUD */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 20,
            right: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            pointerEvents: 'none',
          }}
        >
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: '0.75rem', color: '#ffd700', fontWeight: 700 }}>GOAL: {TARGET_SCORE} PTS</div>
          </div>
        </div>

        {/* Start Game Modal */}
        {gameState === 'IDLE' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10, 11, 20, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div className="glass-panel" style={{ padding: '32px 24px', maxWidth: '320px', width: '100%' }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎈</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffd700', marginBottom: '8px' }}>
                Balloon Pop Frenzy
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '24px', lineHeight: 1.5 }}>
                Tap the floating balloons before the 30-second timer expires! Golden balloons give +25 points.
              </p>
              <button
                onClick={startGame}
                className="btn-primary-glow pulse-glow"
                style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}
              >
                POP BALLOONS
              </button>
            </div>
          </div>
        )}

        {/* Game Over Modal */}
        {gameState === 'GAMEOVER' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10, 11, 20, 0.9)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div className="glass-panel" style={{ padding: '32px 24px', maxWidth: '320px', width: '100%' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ff4081', marginBottom: '12px' }}>
                Time's Up!
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px' }}>
                You scored <strong style={{ color: '#fff' }}>{score}</strong> (Goal: {TARGET_SCORE})
              </p>
              <button
                onClick={startGame}
                className="btn-primary-glow"
                style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
              >
                <RotateCcw size={18} />
                <span>TRY AGAIN</span>
              </button>
            </div>
          </div>
        )}

        {/* Complete Modal */}
        {gameState === 'COMPLETE' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10, 11, 20, 0.92)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div className="glass-panel" style={{ padding: '36px 24px', maxWidth: '340px', width: '100%' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(255, 215, 0, 0.15)',
                  border: '2px solid #ffd700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckCircle size={32} color="#ffd700" />
              </div>
              <h2 className="gold-text-shimmer" style={{ fontSize: '1.7rem', fontWeight: 900, marginBottom: '8px' }}>
                Balloon Master!
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '24px' }}>
                Fantastic popping skills! Final score: <strong style={{ color: '#ffd700' }}>{score}</strong>.
              </p>
              <button
                onClick={() => {
                  soundSystem.playClick();
                  onBack();
                }}
                className="btn-primary-glow pulse-glow"
                style={{ width: '100%', padding: '14px', fontSize: '1.05rem', marginBottom: '10px' }}
              >
                BACK TO ARCADE
              </button>
              <button
                onClick={startGame}
                className="btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
              >
                <RotateCcw size={16} />
                <span>Play Again</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center' }}>
        Tap balloons fast to build up score before the clock runs out!
      </div>
    </div>
  );
};

