import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, Heart, Shield, CheckCircle2 } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface FreeFireSurvivalGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface SupplyDrop {
  id: number;
  x: number;
  y: number;
  type: 'health' | 'airdrop' | 'armor';
  points: number;
}

interface RedZone {
  id: number;
  x: number;
  y: number;
  radius: number;
  timer: number;
  isExploding: boolean;
}

export const FreeFireSurvivalGame: React.FC<FreeFireSurvivalGameProps> = ({ onComplete, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState<number>(0);
  const [hp, setHp] = useState<number>(100);
  const [survivalSecs, setSurvivalSecs] = useState<number>(0);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE'>('IDLE');
  const [bestScore, setBestScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('birthday_freefire_best') || '0', 10);
  });

  const TARGET_SURVIVAL = 40; // Survive 40 seconds to Booyah!

  const stateRef = useRef({
    px: 210,
    py: 300,
    vx: 0,
    vy: 0,
    hp: 100,
    score: 0,
    survivalSecs: 0,
    supplies: [] as SupplyDrop[],
    redZones: [] as RedZone[],
    nextId: 1,
    spawnTimer: 0,
    redZoneTimer: 0,
    gameState: 'IDLE' as 'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE',
    faceImage: null as HTMLImageElement | null,
  });

  const startGame = () => {
    soundSystem.playClick();
    const s = stateRef.current;
    s.px = 210;
    s.py = 300;
    s.vx = 0;
    s.vy = 0;
    s.hp = 100;
    s.score = 0;
    s.survivalSecs = 0;
    s.supplies = [];
    s.redZones = [];
    s.gameState = 'PLAYING';

    setScore(0);
    setHp(100);
    setSurvivalSecs(0);
    setGameState('PLAYING');
  };

  // Keyboard controls
  useEffect(() => {
    const keysDown: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keysDown[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown[e.key.toLowerCase()] = false;
    };

    const updateMovement = () => {
      const s = stateRef.current;
      if (s.gameState !== 'PLAYING') return;

      const speed = 4.2;
      s.vx = 0;
      s.vy = 0;

      if (keysDown['arrowleft'] || keysDown['a']) s.vx -= speed;
      if (keysDown['arrowright'] || keysDown['d']) s.vx += speed;
      if (keysDown['arrowup'] || keysDown['w']) s.vy -= speed;
      if (keysDown['arrowdown'] || keysDown['s']) s.vy += speed;
    };

    const interval = setInterval(updateMovement, 20);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Timer
  useEffect(() => {
    let timer: number;
    if (gameState === 'PLAYING') {
      timer = window.setInterval(() => {
        stateRef.current.survivalSecs += 1;
        setSurvivalSecs(stateRef.current.survivalSecs);

        stateRef.current.score += 5;
        setScore(stateRef.current.score);

        // Check Booyah victory!
        if (stateRef.current.survivalSecs >= TARGET_SURVIVAL && stateRef.current.gameState !== 'COMPLETE') {
          stateRef.current.gameState = 'COMPLETE';
          setGameState('COMPLETE');
          soundSystem.playVictory();
          confetti({ particleCount: 120, spread: 80 });

          const finalScore = stateRef.current.score + 100;
          const currentBest = parseInt(localStorage.getItem('birthday_freefire_best') || '0', 10);
          if (finalScore > currentBest) {
            localStorage.setItem('birthday_freefire_best', finalScore.toString());
            setBestScore(finalScore);
          }
          onComplete(finalScore);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, onComplete]);

  // Main Canvas Loop
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

    // Mobile touch drag to move
    const handleTouch = (clientX: number, clientY: number) => {
      const s = stateRef.current;
      if (s.gameState !== 'PLAYING') return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      const tx = (clientX - rect.left) * scaleX;
      const ty = (clientY - rect.top) * scaleY;

      const dx = tx - s.px;
      const dy = ty - s.py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 10) {
        s.vx = (dx / dist) * 4.2;
        s.vy = (dy / dist) * 4.2;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleTouch(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    canvas.addEventListener('touchmove', onTouchMove, { passive: true });

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      const s = stateRef.current;

      // 1. Draw Combat Arena Ground (Desert / Jungle War Zone Grid)
      ctx.fillStyle = '#1c1b18';
      ctx.fillRect(0, 0, width, height);

      // Arena grid lines
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Safe Zone boundary (Shrinking circle)
      const safeRadius = Math.max(140, 260 - s.survivalSecs * 2.2);
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, safeRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 2. Logic Update
      if (s.gameState === 'PLAYING') {
        s.px = Math.max(20, Math.min(width - 20, s.px + s.vx));
        s.py = Math.max(20, Math.min(height - 20, s.py + s.vy));

        // Damage if outside safe zone
        const distFromCenter = Math.sqrt((s.px - width / 2) ** 2 + (s.py - height / 2) ** 2);
        if (distFromCenter > safeRadius) {
          s.hp -= 0.35;
          setHp(Math.max(0, Math.floor(s.hp)));
          if (s.hp <= 0) {
            s.gameState = 'GAMEOVER';
            setGameState('GAMEOVER');
            soundSystem.playHit();
          }
        }

        // Spawn supplies
        s.spawnTimer--;
        if (s.spawnTimer <= 0) {
          s.spawnTimer = 90;
          const types: SupplyDrop['type'][] = ['airdrop', 'health', 'armor'];
          const type = types[Math.floor(Math.random() * types.length)];
          s.supplies.push({
            id: s.nextId++,
            x: Math.random() * (width - 100) + 50,
            y: Math.random() * (height - 100) + 50,
            type,
            points: type === 'airdrop' ? 30 : 15,
          });
        }

        // Spawn Red Bomb Airstrike Zones
        s.redZoneTimer--;
        if (s.redZoneTimer <= 0) {
          s.redZoneTimer = 110;
          s.redZones.push({
            id: s.nextId++,
            x: Math.random() * (width - 120) + 60,
            y: Math.random() * (height - 120) + 60,
            radius: 50,
            timer: 80,
            isExploding: false,
          });
        }

        // Check Supply Collections
        for (let i = s.supplies.length - 1; i >= 0; i--) {
          const item = s.supplies[i];
          const dist = Math.sqrt((s.px - item.x) ** 2 + (s.py - item.y) ** 2);
          if (dist < 32) {
            soundSystem.playScore();
            if (item.type === 'health') {
              s.hp = Math.min(100, s.hp + 25);
              setHp(Math.floor(s.hp));
            }
            s.score += item.points;
            setScore(s.score);
            s.supplies.splice(i, 1);
          }
        }

        // Update Red Zones
        for (let i = s.redZones.length - 1; i >= 0; i--) {
          const rz = s.redZones[i];
          rz.timer--;

          if (rz.timer <= 20) {
            rz.isExploding = true;
            // Check if player inside explosion
            const dist = Math.sqrt((s.px - rz.x) ** 2 + (s.py - rz.y) ** 2);
            if (dist < rz.radius && rz.timer === 19) {
              s.hp -= 40;
              setHp(Math.max(0, Math.floor(s.hp)));
              soundSystem.playHit();
              if (s.hp <= 0) {
                s.gameState = 'GAMEOVER';
                setGameState('GAMEOVER');
              }
            }
          }

          if (rz.timer <= 0) {
            s.redZones.splice(i, 1);
          }
        }
      }

      // Draw Red Zones
      s.redZones.forEach((rz) => {
        ctx.fillStyle = rz.isExploding ? 'rgba(239, 68, 68, 0.55)' : 'rgba(239, 68, 68, 0.2)';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rz.x, rz.y, rz.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(rz.isExploding ? '💥 BOOM!' : '⚠️ AIR STRIKE', rz.x, rz.y);
      });

      // Draw Supplies
      s.supplies.forEach((item) => {
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        const icon = item.type === 'airdrop' ? '📦' : item.type === 'health' ? '💊' : '🛡️';
        ctx.fillText(icon, item.x, item.y);
      });

      // Draw Player Survivor
      ctx.save();
      ctx.translate(s.px, s.py);

      // Military aura
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();

      // Gun forward
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(8, -4, 16, 6);

      // Player Head with Birthday Person's Face
      if (s.faceImage) {
        ctx.drawImage(s.faceImage, -16, -16, 32, 32);
      } else {
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('touchmove', onTouchMove);
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

        {/* HP Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart size={18} color="#ef4444" fill="#ef4444" />
          <div
            style={{
              width: '100px',
              height: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${hp}%`,
                height: '100%',
                background: hp > 30 ? '#22c55e' : '#ef4444',
                transition: 'width 0.2s',
              }}
            />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>{hp}</span>
        </div>

        {/* Survival Timer */}
        <div style={{ color: '#ffd700', fontWeight: 800, fontSize: '0.88rem' }}>
          ⏱️ {survivalSecs}s / {TARGET_SURVIVAL}s
        </div>
      </div>

      {/* Canvas */}
      <div className="game-canvas-wrapper" style={{ height: '600px' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

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
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🪂</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ea580c', marginBottom: '8px' }}>
                Battle Royale Survival
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '24px', lineHeight: 1.5 }}>
                Move with WASD / Arrow keys or Touch Drag. Stay inside the Blue Zone, grab airdrops, and survive {TARGET_SURVIVAL}s for Booyah!
              </p>
              <button
                onClick={startGame}
                className="btn-primary-glow pulse-glow"
                style={{ width: '100%', padding: '14px', fontSize: '1.1rem', background: '#ea580c' }}
              >
                DROP INTO ARENA
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
                ELIMINATED!
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px' }}>
                Survive {survivalSecs}s • Score: <strong style={{ color: '#fff' }}>{score}</strong>
              </p>
              <button
                onClick={startGame}
                className="btn-primary-glow"
                style={{ width: '100%', padding: '14px', fontSize: '1.05rem', background: '#ea580c' }}
              >
                <RotateCcw size={18} />
                <span>DROP AGAIN</span>
              </button>
            </div>
          </div>
        )}

        {/* Booyah Victory Modal */}
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
                  fontSize: '3.5rem',
                  marginBottom: '10px',
                  animation: 'bounce 1s infinite',
                }}
              >
                🏆
              </div>
              <h2 className="gold-text-shimmer" style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '6px' }}>
                BOOYAH!
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '24px' }}>
                Grandmaster Birthday Champion! You survived the zone and conquered the battlefield.
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
        Move with Keyboard (WASD / Arrows) or Drag with your finger!
      </div>
    </div>
  );
};

