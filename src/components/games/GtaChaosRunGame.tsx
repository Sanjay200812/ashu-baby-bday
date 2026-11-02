import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowRight, ArrowLeft as LeftIcon, CheckCircle2 } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface GtaChaosRunGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface RoadObstacle {
  id: number;
  lane: number; // 0: left, 1: center, 2: right
  y: number;
  type: 'car' | 'barrier' | 'sign' | 'cash' | 'gift';
  size: number;
}

export const GtaChaosRunGame: React.FC<GtaChaosRunGameProps> = ({ onComplete, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState<number>(0);
  const [cashCollected, setCashCollected] = useState<number>(0);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE'>('IDLE');
  const [bestScore, setBestScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('birthday_gta_best') || '0', 10);
  });

  const TARGET_SCORE = 150;

  const stateRef = useRef({
    lane: 1, // 0, 1, 2
    isJumping: false,
    jumpY: 0,
    jumpVelocity: 0,
    isSliding: false,
    slideTimer: 0,
    score: 0,
    cash: 0,
    speed: 5.5,
    obstacles: [] as RoadObstacle[],
    nextId: 1,
    spawnTimer: 0,
    gameState: 'IDLE' as 'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE',
    faceImage: null as HTMLImageElement | null,
  });

  const startGame = () => {
    soundSystem.playClick();
    stateRef.current.lane = 1;
    stateRef.current.isJumping = false;
    stateRef.current.jumpY = 0;
    stateRef.current.isSliding = false;
    stateRef.current.score = 0;
    stateRef.current.cash = 0;
    stateRef.current.speed = 5.5;
    stateRef.current.obstacles = [];
    stateRef.current.gameState = 'PLAYING';
    setScore(0);
    setCashCollected(0);
    setGameState('PLAYING');
  };

  const jump = () => {
    const s = stateRef.current;
    if (s.gameState === 'PLAYING' && !s.isJumping && !s.isSliding) {
      s.isJumping = true;
      s.jumpVelocity = -12;
      soundSystem.playJump();
    }
  };

  const slide = () => {
    const s = stateRef.current;
    if (s.gameState === 'PLAYING' && !s.isJumping && !s.isSliding) {
      s.isSliding = true;
      s.slideTimer = 35;
      soundSystem.playCardFlip();
    }
  };

  const moveLeft = () => {
    const s = stateRef.current;
    if (s.gameState === 'PLAYING' && s.lane > 0) {
      s.lane--;
      soundSystem.playClick();
    }
  };

  const moveRight = () => {
    const s = stateRef.current;
    if (s.gameState === 'PLAYING' && s.lane < 2) {
      s.lane++;
      soundSystem.playClick();
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') moveLeft();
      else if (e.key === 'ArrowRight' || e.key === 'd') moveRight();
      else if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w') jump();
      else if (e.key === 'ArrowDown' || e.key === 's') slide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 420);
    const height = (canvas.height = 620);
    const laneX = [width * 0.22, width * 0.5, width * 0.78];

    // Load head image
    const faceImg = new Image();
    faceImg.src = BIRTHDAY_CONFIG.characterFaceUrl;
    faceImg.onload = () => {
      stateRef.current.faceImage = faceImg;
    };

    let animId: number;

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      const s = stateRef.current;

      // 1. Draw City Skyline & Sunset Background
      ctx.fillStyle = '#0f111f';
      ctx.fillRect(0, 0, width, height);

      // Distant neon skyscrapers
      ctx.fillStyle = '#1e1a38';
      ctx.fillRect(30, 80, 50, 160);
      ctx.fillRect(110, 50, 60, 190);
      ctx.fillRect(200, 70, 70, 170);
      ctx.fillRect(300, 40, 55, 200);

      // Window neon lights
      ctx.fillStyle = '#ffd700';
      ctx.globalAlpha = 0.4;
      for (let y = 100; y < 220; y += 22) {
        ctx.fillRect(125, y, 6, 8);
        ctx.fillRect(220, y, 6, 8);
        ctx.fillRect(320, y, 6, 8);
      }
      ctx.globalAlpha = 1.0;

      // 2. Road with perspective
      const roadTop = 220;
      ctx.fillStyle = '#1c1d29';
      ctx.beginPath();
      ctx.moveTo(width * 0.3, roadTop);
      ctx.lineTo(width * 0.7, roadTop);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Road dividing lines
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.setLineDash([20, 15]);
      ctx.beginPath();
      ctx.moveTo(width * 0.43, roadTop);
      ctx.lineTo(width * 0.36, height);
      ctx.moveTo(width * 0.57, roadTop);
      ctx.lineTo(width * 0.64, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Logic update when playing
      if (s.gameState === 'PLAYING') {
        s.score += 0.2;
        setScore(Math.floor(s.score));

        // Gradual speed up
        s.speed = 5.5 + Math.min(6, s.score * 0.03);

        // Jump physics
        if (s.isJumping) {
          s.jumpY += s.jumpVelocity;
          s.jumpVelocity += 0.8;
          if (s.jumpY >= 0) {
            s.jumpY = 0;
            s.isJumping = false;
          }
        }

        // Slide timer
        if (s.isSliding) {
          s.slideTimer--;
          if (s.slideTimer <= 0) s.isSliding = false;
        }

        // Spawn obstacles & collectibles
        s.spawnTimer--;
        if (s.spawnTimer <= 0) {
          s.spawnTimer = Math.max(28, 55 - Math.floor(s.score * 0.2));
          const lane = Math.floor(Math.random() * 3);
          const rand = Math.random();

          let type: RoadObstacle['type'] = 'car';
          if (rand < 0.45) type = 'car';
          else if (rand < 0.65) type = 'barrier';
          else if (rand < 0.8) type = 'sign';
          else if (rand < 0.92) type = 'cash';
          else type = 'gift';

          s.obstacles.push({
            id: s.nextId++,
            lane,
            y: roadTop,
            type,
            size: type === 'car' ? 44 : 32,
          });
        }

        // Update obstacles & Check Collisions
        const playerY = height - 120;
        const playerLaneX = laneX[s.lane];

        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const obs = s.obstacles[i];
          obs.y += s.speed;

          // Check interaction with player
          if (obs.y >= playerY - 30 && obs.y <= playerY + 40 && obs.lane === s.lane) {
            if (obs.type === 'cash' || obs.type === 'gift') {
              // Collected!
              soundSystem.playScore();
              const bonus = obs.type === 'gift' ? 30 : 15;
              s.cash += bonus;
              s.score += bonus;
              setCashCollected(s.cash);
              setScore(Math.floor(s.score));

              if (s.score >= TARGET_SCORE && s.gameState !== 'COMPLETE') {
                s.gameState = 'COMPLETE';
                setGameState('COMPLETE');
                soundSystem.playVictory();
                confetti({ particleCount: 100, spread: 70 });
                onComplete(Math.floor(s.score));
              }
              s.obstacles.splice(i, 1);
              continue;
            } else {
              // Obstacle!
              let evaded = false;
              if (obs.type === 'barrier' && s.isJumping) evaded = true;
              if (obs.type === 'sign' && s.isSliding) evaded = true;

              if (!evaded) {
                // Crash!
                soundSystem.playHit();
                s.gameState = 'GAMEOVER';
                setGameState('GAMEOVER');

                const currentBest = parseInt(localStorage.getItem('birthday_gta_best') || '0', 10);
                if (Math.floor(s.score) > currentBest) {
                  localStorage.setItem('birthday_gta_best', Math.floor(s.score).toString());
                  setBestScore(Math.floor(s.score));
                }
              }
            }
          }

          // Offscreen
          if (obs.y > height + 60) {
            s.obstacles.splice(i, 1);
          }
        }
      }

      // 4. Draw Obstacles & Collectibles
      s.obstacles.forEach((obs) => {
        const x = laneX[obs.lane];
        ctx.save();
        ctx.translate(x, obs.y);

        if (obs.type === 'car') {
          // Sports car
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(-22, -35, 44, 70);
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(-18, -12, 36, 24);
          // Headlights
          ctx.fillStyle = '#ffd700';
          ctx.fillRect(-18, -38, 10, 4);
          ctx.fillRect(8, -38, 10, 4);
        } else if (obs.type === 'barrier') {
          // Roadblock barrier (Jump over!)
          ctx.fillStyle = '#ea580c';
          ctx.fillRect(-24, -12, 48, 24);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-18, -8, 12, 16);
          ctx.fillRect(6, -8, 12, 16);
          ctx.font = '10px sans-serif';
          ctx.fillText('JUMP', -14, 24);
        } else if (obs.type === 'sign') {
          // Overhead beam (Slide under!)
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(-26, -28, 52, 16);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText('SLIDE', -14, -16);
        } else if (obs.type === 'cash') {
          ctx.font = '28px serif';
          ctx.textAlign = 'center';
          ctx.fillText('💵', 0, 0);
        } else if (obs.type === 'gift') {
          ctx.font = '28px serif';
          ctx.textAlign = 'center';
          ctx.fillText('🎁', 0, 0);
        }

        ctx.restore();
      });

      // 5. Draw Player Character
      const px = laneX[s.lane];
      const py = height - 120 + s.jumpY;

      ctx.save();
      ctx.translate(px, py);

      if (s.isSliding) {
        // Ducking / sliding body
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-20, 10, 40, 20);
        if (s.faceImage) {
          ctx.drawImage(s.faceImage, -16, 0, 32, 32);
        }
      } else {
        // Runner body
        ctx.fillStyle = '#dc2626'; // Red jacket
        ctx.fillRect(-14, 0, 28, 36);

        // Legs
        const legOffset = Math.sin(Date.now() * 0.02) * 8;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-12, 36, 8, 22 + (s.isJumping ? 0 : legOffset));
        ctx.fillRect(4, 36, 8, 22 - (s.isJumping ? 0 : legOffset));

        // Face / Head
        if (s.faceImage) {
          ctx.drawImage(s.faceImage, -20, -36, 40, 40);
        } else {
          ctx.fillStyle = '#ffd700';
          ctx.beginPath();
          ctx.arc(0, -18, 18, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animId);
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

        <div style={{ color: '#ffd700', fontWeight: 800, fontSize: '0.9rem' }}>
          💵 CASH: ${cashCollected}
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
      <div className="game-canvas-wrapper" style={{ height: '620px' }}>
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
          <div style={{ fontSize: '0.75rem', color: '#ffd700', fontWeight: 700 }}>GOAL: {TARGET_SCORE} PTS</div>
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
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🚗</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#dc2626', marginBottom: '8px' }}>
                GTA Chaos Run
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '24px', lineHeight: 1.5 }}>
                Dodge sports cars, jump over orange barriers, slide under blue signs, and snatch cash!
              </p>
              <button
                onClick={startGame}
                className="btn-primary-glow pulse-glow"
                style={{ width: '100%', padding: '14px', fontSize: '1.1rem', background: '#dc2626' }}
              >
                HIT THE GAS
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
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#dc2626', marginBottom: '12px' }}>
                BUSTED / CRASHED!
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px' }}>
                Final Score: <strong style={{ color: '#fff' }}>{score}</strong>
              </p>
              <button
                onClick={startGame}
                className="btn-primary-glow"
                style={{ width: '100%', padding: '14px', fontSize: '1.05rem', background: '#dc2626' }}
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
                  background: 'rgba(220, 38, 38, 0.2)',
                  border: '2px solid #dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckCircle2 size={32} color="#dc2626" />
              </div>
              <h2 className="gold-text-shimmer" style={{ fontSize: '1.7rem', fontWeight: 900, marginBottom: '8px' }}>
                City Legend!
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '24px' }}>
                Escaped the heat and earned the birthday bag! Score:{' '}
                <strong style={{ color: '#ffd700' }}>{score}</strong>.
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

      {/* On-Screen Mobile Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginTop: '14px',
          width: '100%',
          maxWidth: '420px',
          justifyContent: 'center',
        }}
      >
        <button onClick={moveLeft} className="btn-secondary" style={{ padding: '12px 18px' }}>
          <LeftIcon size={18} />
        </button>
        <button onClick={jump} className="btn-secondary" style={{ padding: '12px 22px', color: '#ffd700' }}>
          <ArrowUp size={18} />
          <span>JUMP</span>
        </button>
        <button onClick={slide} className="btn-secondary" style={{ padding: '12px 22px', color: '#38bdf8' }}>
          <ArrowDown size={18} />
          <span>SLIDE</span>
        </button>
        <button onClick={moveRight} className="btn-secondary" style={{ padding: '12px 18px' }}>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

