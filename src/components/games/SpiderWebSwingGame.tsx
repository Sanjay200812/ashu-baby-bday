import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, CheckCircle2 } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface SpiderWebSwingGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface StarItem {
  id: number;
  x: number;
  y: number;
  type: 'star' | 'gift';
}

interface ObstacleDrone {
  id: number;
  x: number;
  y: number;
  vy: number;
}

export const SpiderWebSwingGame: React.FC<SpiderWebSwingGameProps> = ({ onComplete, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE'>('IDLE');
  const [bestScore, setBestScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('birthday_spiderman_best') || '0', 10);
  });

  const FINISH_DISTANCE = 300; // Finish line in meters

  const stateRef = useRef({
    x: 80,
    y: 280,
    vx: 3,
    vy: 0,
    webAttached: false,
    anchorX: 0,
    anchorY: 0,
    webLength: 0,
    cameraX: 0,
    distance: 0,
    score: 0,
    stars: [] as StarItem[],
    drones: [] as ObstacleDrone[],
    nextId: 1,
    gameState: 'IDLE' as 'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE',
    faceImage: null as HTMLImageElement | null,
  });

  const startGame = () => {
    soundSystem.playClick();
    const s = stateRef.current;
    s.x = 80;
    s.y = 280;
    s.vx = 4;
    s.vy = 0;
    s.webAttached = false;
    s.cameraX = 0;
    s.distance = 0;
    s.score = 0;
    s.gameState = 'PLAYING';

    // Populate stars & obstacles along track
    s.stars = [];
    s.drones = [];
    for (let x = 200; x < FINISH_DISTANCE * 25; x += 120) {
      if (Math.random() < 0.7) {
        s.stars.push({
          id: s.nextId++,
          x,
          y: Math.random() * 200 + 180,
          type: Math.random() < 0.4 ? 'gift' : 'star',
        });
      }
      if (x > 400 && Math.random() < 0.35) {
        s.drones.push({
          id: s.nextId++,
          x,
          y: Math.random() * 180 + 200,
          vy: Math.random() < 0.5 ? 1.5 : -1.5,
        });
      }
    }

    setScore(0);
    setDistance(0);
    setGameState('PLAYING');
  };

  const attachWeb = () => {
    const s = stateRef.current;
    if (s.gameState !== 'PLAYING') return;
    if (!s.webAttached) {
      // Find anchor above and slightly ahead of player
      s.anchorX = s.x + 60;
      s.anchorY = 50;
      const dx = s.x - s.anchorX;
      const dy = s.y - s.anchorY;
      s.webLength = Math.sqrt(dx * dx + dy * dy);
      s.webAttached = true;
      soundSystem.playJump();
    }
  };

  const releaseWeb = () => {
    const s = stateRef.current;
    if (s.webAttached) {
      s.webAttached = false;
      // Give a slight forward boost on release
      s.vx += 1.5;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 420);
    const height = (canvas.height = 600);

    const faceImg = new Image();
    faceImg.src = BIRTHDAY_CONFIG.characterFaceUrl;
    faceImg.onload = () => {
      stateRef.current.faceImage = faceImg;
    };

    let animId: number;

    const onPointerDown = () => attachWeb();
    const onPointerUp = () => releaseWeb();

    canvas.addEventListener('mousedown', onPointerDown);
    canvas.addEventListener('mouseup', onPointerUp);
    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    canvas.addEventListener('touchend', onPointerUp);

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      const s = stateRef.current;

      // Draw Gradient Twilight Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#090a14');
      skyGrad.addColorStop(0.6, '#1e1438');
      skyGrad.addColorStop(1, '#3b0764');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Camera offset
      const cx = s.x - 100;

      // Background Skyscraper silhouettes with parallax
      ctx.fillStyle = '#110d24';
      for (let bx = -200; bx < width + 1000; bx += 90) {
        const buildingX = bx - (cx * 0.3) % 400;
        ctx.fillRect(buildingX, 180, 75, 420);
      }

      ctx.fillStyle = '#1c1538';
      for (let bx = -100; bx < width + 1000; bx += 140) {
        const buildingX = bx - (cx * 0.6) % 500;
        ctx.fillRect(buildingX, 240, 110, 360);
      }

      // Logic update if playing
      if (s.gameState === 'PLAYING') {
        const gravity = 0.38;

        if (s.webAttached) {
          // Pendulum constraint
          const dx = s.x - s.anchorX;
          const dy = s.y - s.anchorY;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > s.webLength) {
            const nx = dx / dist;
            const ny = dy / dist;
            // Dampen along normal and apply tension
            const dot = s.vx * nx + s.vy * ny;
            s.vx -= dot * nx;
            s.vy -= dot * ny;

            // Restrict position
            s.x = s.anchorX + nx * s.webLength;
            s.y = s.anchorY + ny * s.webLength;
          }

          s.vy += gravity * 0.7;
        } else {
          // Free fall
          s.vy += gravity;
          s.vx = Math.max(2.5, s.vx * 0.995); // Natural friction
        }

        s.x += s.vx;
        s.y += s.vy;

        // Update distance
        s.distance = Math.floor(s.x / 25);
        setDistance(s.distance);

        // Check Ground or Fall off
        if (s.y > height - 60 || s.y < -80) {
          s.gameState = 'GAMEOVER';
          setGameState('GAMEOVER');
          soundSystem.playHit();

          const currentBest = parseInt(localStorage.getItem('birthday_spiderman_best') || '0', 10);
          if (s.score > currentBest) {
            localStorage.setItem('birthday_spiderman_best', s.score.toString());
            setBestScore(s.score);
          }
        }

        // Check Finish Line
        if (s.distance >= FINISH_DISTANCE) {
          s.gameState = 'COMPLETE';
          setGameState('COMPLETE');
          soundSystem.playVictory();
          confetti({ particleCount: 110, spread: 80 });
          onComplete(s.score + 100);
        }

        // Star / Gift Collections
        for (let i = s.stars.length - 1; i >= 0; i--) {
          const item = s.stars[i];
          const dist = Math.sqrt((s.x - item.x) ** 2 + (s.y - item.y) ** 2);
          if (dist < 40) {
            soundSystem.playScore();
            s.score += item.type === 'gift' ? 30 : 15;
            setScore(s.score);
            s.stars.splice(i, 1);
          }
        }

        // Drone Hazard Collision
        for (let d of s.drones) {
          d.y += d.vy;
          if (d.y < 160 || d.y > 420) d.vy *= -1;

          const dist = Math.sqrt((s.x - d.x) ** 2 + (s.y - d.y) ** 2);
          if (dist < 32) {
            // Hit drone!
            soundSystem.playHit();
            s.gameState = 'GAMEOVER';
            setGameState('GAMEOVER');
            break;
          }
        }
      }

      // Draw Stars & Gifts
      s.stars.forEach((item) => {
        const drawX = item.x - cx;
        if (drawX > -40 && drawX < width + 40) {
          ctx.font = '24px serif';
          ctx.textAlign = 'center';
          ctx.fillText(item.type === 'gift' ? '🎁' : '⭐', drawX, item.y);
        }
      });

      // Draw Drones
      s.drones.forEach((d) => {
        const drawX = d.x - cx;
        if (drawX > -40 && drawX < width + 40) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(drawX, d.y, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('⚡', drawX, d.y + 4);
        }
      });

      // Draw Web Line
      if (s.webAttached) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(s.anchorX - cx, s.anchorY);
        ctx.lineTo(s.x - cx, s.y);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Web anchor point
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(s.anchorX - cx, s.anchorY, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Superhero Hero
      const drawPx = s.x - cx;
      ctx.save();
      ctx.translate(drawPx, s.y);

      // Hero body (Red & Blue web suit)
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-12, 0, 24, 28);
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(-10, 28, 8, 16);
      ctx.fillRect(2, 28, 8, 16);

      // Hero Head with Birthday Person's Face
      if (s.faceImage) {
        ctx.drawImage(s.faceImage, -18, -28, 36, 36);
      } else {
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(0, -14, 16, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onPointerDown);
      canvas.removeEventListener('mouseup', onPointerUp);
      canvas.removeEventListener('touchstart', onPointerDown);
      canvas.removeEventListener('touchend', onPointerUp);
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

        <div style={{ color: '#00e5ff', fontWeight: 800, fontSize: '0.9rem' }}>
          DISTANCE: {distance}m / {FINISH_DISTANCE}m
        </div>

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
            <span>BEST: {bestScore}</span>
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
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: '0.75rem', color: '#00e5ff', fontWeight: 700 }}>POINTS</div>
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
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🕷️</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#00e5ff', marginBottom: '8px' }}>
                Web Slinging Hero
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '24px', lineHeight: 1.5 }}>
                Hold tap or mouse down to shoot and swing webs! Release to launch through the air. Reach {FINISH_DISTANCE}m to win!
              </p>
              <button
                onClick={startGame}
                className="btn-primary-glow pulse-glow"
                style={{ width: '100%', padding: '14px', fontSize: '1.1rem', background: '#00e5ff', color: '#090a14' }}
              >
                SWING INTO ACTION
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
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ef4444', marginBottom: '12px' }}>
                Web Snapped!
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px' }}>
                Reached {distance}m • Score: <strong style={{ color: '#fff' }}>{score}</strong>
              </p>
              <button
                onClick={startGame}
                className="btn-primary-glow"
                style={{ width: '100%', padding: '14px', fontSize: '1.05rem', background: '#00e5ff', color: '#090a14' }}
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
                  background: 'rgba(0, 229, 255, 0.2)',
                  border: '2px solid #00e5ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckCircle2 size={32} color="#00e5ff" />
              </div>
              <h2 className="gold-text-shimmer" style={{ fontSize: '1.7rem', fontWeight: 900, marginBottom: '8px' }}>
                Finish Line Reached!
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '24px' }}>
                You swung across the city and saved the birthday celebration! Final Score: <strong style={{ color: '#ffd700' }}>{score + 100}</strong>.
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
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center' }}>
        Press & Hold anywhere to latch a web; release to fly through the sky!
      </div>
    </div>
  );
};
