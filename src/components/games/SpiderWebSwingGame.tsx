import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, CheckCircle2, Terminal, ShieldAlert } from 'lucide-react';
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
    try {
      return parseInt(localStorage.getItem('birthday_spiderman_best') || '0', 10);
    } catch {
      return 0;
    }
  });

  const FINISH_DISTANCE = 180; // 180 meters to clear

  const stateRef = useRef({
    x: 80,
    y: 230,
    vx: 4.2,
    vy: 1.0,
    webAttached: true,
    anchorX: 140,
    anchorY: 40,
    webLength: 200,
    cameraX: 0,
    distance: 0,
    score: 0,
    stars: [] as StarItem[],
    drones: [] as ObstacleDrone[],
    nextId: 1,
    gameState: 'IDLE' as 'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE',
    faceImage: null as HTMLImageElement | null,
  });

  // Pause music on game over so lose video sound plays clearly
  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      soundSystem.pauseMusic();
    } else if (gameState === 'PLAYING') {
      soundSystem.playSiteMusic();
    }
  }, [gameState]);

  const startGame = () => {
    soundSystem.playClick();
    soundSystem.playSiteMusic();
    const s = stateRef.current;
    s.x = 80;
    s.y = 230;
    s.vx = 4.2;
    s.vy = 1.0;
    s.anchorX = 140;
    s.anchorY = 40; // All webs at same height throughout game
    s.webLength = Math.hypot(s.x - s.anchorX, s.y - s.anchorY);
    s.webAttached = true; // Start ALREADY swinging from web
    s.cameraX = 0;
    s.distance = 0;
    s.score = 0;
    s.gameState = 'PLAYING';

    s.stars = [];
    s.drones = [];
    for (let x = 200; x < FINISH_DISTANCE * 25; x += 120) {
      if (Math.random() < 0.7) {
        s.stars.push({
          id: s.nextId++,
          x,
          y: Math.random() * 150 + 200,
          type: Math.random() < 0.35 ? 'gift' : 'star',
        });
      }
      if (x > 380 && Math.random() < 0.25) {
        s.drones.push({
          id: s.nextId++,
          x,
          y: Math.random() * 140 + 220,
          vy: Math.random() < 0.5 ? 1.0 : -1.0,
        });
      }
    }

    setScore(0);
    setDistance(0);
    setGameState('PLAYING');
  };

  // On clicking or tapping, swing forward to next web at same fixed height
  const swingToNextWeb = () => {
    const s = stateRef.current;
    if (s.gameState !== 'PLAYING') return;

    // Fixed web anchor height: 40px throughout the game
    const nextAnchorX = Math.max(s.x + 95, s.anchorX + 115);
    s.anchorX = nextAnchorX;
    s.anchorY = 40; // Same height throughout game
    const dx = s.x - s.anchorX;
    const dy = s.y - s.anchorY;
    s.webLength = Math.max(160, Math.min(260, Math.sqrt(dx * dx + dy * dy)));
    s.webAttached = true;

    // Swing impulse forward and up into the new arc
    s.vx = Math.max(s.vx + 1.2, 4.4);
    s.vy = Math.min(s.vy, -2.4);
    soundSystem.playJump();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        swingToNextWeb();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Main Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 420);
    const height = (canvas.height = 620);

    const face = new Image();
    face.src = BIRTHDAY_CONFIG.characterFaceUrl;
    face.onload = () => {
      stateRef.current.faceImage = face;
    };

    let animId: number;

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const s = stateRef.current;

      // Dark cyber city background
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);

      // Red and Gold skyline silhouettes
      ctx.fillStyle = 'rgba(255, 42, 75, 0.08)';
      ctx.fillRect(0, height - 180, width, 180);

      // Web anchor ceiling rail
      ctx.strokeStyle = '#ff2a4b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(width, 40);
      ctx.stroke();

      if (s.gameState !== 'PLAYING') {
        drawHero(ctx, s.x, s.y, s);
        return;
      }

      // Physics
      if (s.webAttached) {
        const dx = s.x - s.anchorX;
        const dy = s.y - s.anchorY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > s.webLength) {
          const nx = dx / dist;
          const ny = dy / dist;
          const dot = s.vx * nx + s.vy * ny;
          s.vx -= dot * nx;
          s.vy -= dot * ny;
          s.x = s.anchorX + nx * s.webLength;
          s.y = s.anchorY + ny * s.webLength;
        }

        s.vy += 0.35; // Pendulum gravity
      } else {
        s.vy += 0.42; // Free fall gravity
        s.vx = Math.max(2.5, s.vx * 0.995);
      }

      s.x += s.vx;
      s.y += s.vy;
      s.distance = Math.floor(s.x / 25);
      setDistance(s.distance);

      s.cameraX = s.x - 120;

      // Draw Web Line
      if (s.webAttached) {
        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(s.anchorX - s.cameraX, s.anchorY);
        ctx.lineTo(s.x - s.cameraX, s.y);
        ctx.stroke();
      }

      // Ground or Floor collision
      if (s.y > height - 40) {
        soundSystem.playHit();
        s.gameState = 'GAMEOVER';
        setGameState('GAMEOVER');
        return;
      }

      // Ceiling bounce
      if (s.y < 55) {
        s.y = 55;
        s.vy = 1;
      }

      // Draw Stars and Collectibles
      for (let i = s.stars.length - 1; i >= 0; i--) {
        const star = s.stars[i];
        const screenX = star.x - s.cameraX;

        if (screenX > -30 && screenX < width + 30) {
          ctx.fillStyle = star.type === 'gift' ? '#ff2a4b' : '#ffb703';
          ctx.beginPath();
          ctx.arc(screenX, star.y, star.type === 'gift' ? 12 : 9, 0, Math.PI * 2);
          ctx.fill();

          // Collectible hit check
          const distToHero = Math.hypot(star.x - s.x, star.y - s.y);
          if (distToHero < 28) {
            soundSystem.playScore();
            s.score += star.type === 'gift' ? 25 : 10;
            setScore(s.score);
            s.stars.splice(i, 1);
          }
        }
      }

      // Draw Drones / Obstacles
      for (let i = s.drones.length - 1; i >= 0; i--) {
        const drone = s.drones[i];
        drone.y += drone.vy;
        if (drone.y < 120 || drone.y > 440) drone.vy *= -1;

        const screenX = drone.x - s.cameraX;
        if (screenX > -30 && screenX < width + 30) {
          ctx.fillStyle = '#ff2a4b';
          ctx.fillRect(screenX - 14, drone.y - 14, 28, 28);
          ctx.strokeStyle = '#ffb703';
          ctx.lineWidth = 2;
          ctx.strokeRect(screenX - 14, drone.y - 14, 28, 28);

          // Drone collision
          const distToHero = Math.hypot(drone.x - s.x, drone.y - s.y);
          if (distToHero < 30) {
            soundSystem.playHit();
            s.gameState = 'GAMEOVER';
            setGameState('GAMEOVER');
            return;
          }
        }
      }

      // Check Finish Line
      if (s.distance >= FINISH_DISTANCE) {
        s.gameState = 'COMPLETE';
        setGameState('COMPLETE');
        soundSystem.playVictory();
        confetti({
          particleCount: 160,
          spread: 90,
          colors: ['#ff2a4b', '#ffb703', '#ffffff', '#ff1744'],
        });
      }

      // Draw Hero
      drawHero(ctx, s.x - s.cameraX, s.y, s);
    };

    const drawHero = (c: CanvasRenderingContext2D, px: number, py: number, s: any) => {
      c.save();
      // Hero Cyber Cape / Aura
      c.fillStyle = 'rgba(255, 42, 75, 0.25)';
      c.beginPath();
      c.arc(px, py, 20, 0, Math.PI * 2);
      c.fill();

      // Ashu Character Face
      const faceImg = s.faceImage;
      if (faceImg && faceImg.complete) {
        c.beginPath();
        c.arc(px, py, 16, 0, Math.PI * 2);
        c.closePath();
        c.clip();
        c.drawImage(faceImg, px - 16, py - 16, 32, 32);
      } else {
        c.fillStyle = '#ff2a4b';
        c.beginPath();
        c.arc(px, py, 14, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();

      // Cyber Glowing Ring
      c.strokeStyle = '#ffb703';
      c.lineWidth = 2;
      c.beginPath();
      c.arc(px, py, 17, 0, Math.PI * 2);
      c.stroke();
    };

    animId = requestAnimationFrame(loop);
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
        fontFamily: 'var(--font-mono)',
        backgroundColor: '#050508',
      }}
    >
      {/* Header */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
          padding: '0 4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              soundSystem.playClick();
              onBack();
            }}
            className="btn-cyber-secondary"
            style={{ padding: '4px 10px', fontSize: '0.72rem' }}
          >
            <ArrowLeft size={12} />
            <span>BACK</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff2a4b', fontSize: '0.82rem', fontWeight: 800 }}>
            <Terminal size={15} />
            <span>LEVEL 4 // SPIDER WEB SWING</span>
          </div>
        </div>

        <div style={{ color: '#ffb703', fontSize: '0.8rem', fontWeight: 800 }}>
          GOAL: {FINISH_DISTANCE}m
        </div>
      </div>

      {/* Canvas Wrapper */}
      <div
        className="game-canvas-wrapper"
        onClick={swingToNextWeb}
        onTouchStart={(e) => {
          e.preventDefault();
          swingToNextWeb();
        }}
        style={{
          position: 'relative',
          maxWidth: '420px',
          height: '620px',
          border: '2px solid #ff2a4b',
          boxShadow: '0 0 35px rgba(255, 42, 75, 0.4)',
          cursor: 'pointer',
        }}
      >
        {/* HUD Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        >
          <div style={{ background: 'rgba(5, 5, 8, 0.9)', border: '1px solid #ff2a4b', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, color: '#ffb703' }}>
            DISTANCE: {distance}m / {FINISH_DISTANCE}m
          </div>
          <div style={{ background: 'rgba(5, 5, 8, 0.9)', border: '1px solid #ffb703', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>
            POINTS: {score}
          </div>
        </div>

        <canvas
          ref={canvasRef}
          onClick={swingToNextWeb}
          onTouchStart={(e) => {
            e.preventDefault();
            swingToNextWeb();
          }}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer' }}
        />

        {/* In-game swing tap overlay for touchscreen & ease of use */}
        {gameState === 'PLAYING' && (
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '12px',
              right: '12px',
              display: 'flex',
              justifyContent: 'center',
              zIndex: 25,
            }}
          >
            <button
              onClick={swingToNextWeb}
              className="btn-cyber-primary pulse-cyber"
              style={{
                padding: '12px 24px',
                fontSize: '0.9rem',
                fontWeight: 900,
                boxShadow: '0 0 20px rgba(255, 42, 75, 0.5)',
                width: '100%',
                maxWidth: '320px',
              }}
            >
              <span>[ TAP TO SWING TO NEXT WEB 🕸️ ]</span>
            </button>
          </div>
        )}

        {/* Start Overlay */}
        {gameState === 'IDLE' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(5, 5, 8, 0.94)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
              zIndex: 30,
            }}
          >
            <div className="terminal-panel" style={{ padding: '28px 20px', maxWidth: '320px', width: '100%' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🕷️⚡</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ff2a4b', marginBottom: '8px' }}>
                SPIDER WEB SWING
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.84rem', marginBottom: '20px', lineHeight: 1.5 }}>
                Ashuu starts swinging immediately from the web! Tap anywhere or click to swing forward to the next web. Reach {FINISH_DISTANCE}m to clear!
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="btn-cyber-primary pulse-cyber"
                style={{ width: '100%', padding: '14px' }}
              >
                <span>[ START SWINGING ➔ ]</span>
              </button>
            </div>
          </div>
        )}

        {/* Game Over with lose-clip.mp4 */}
        {gameState === 'GAMEOVER' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(5, 5, 8, 0.94)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 35,
              textAlign: 'center',
            }}
          >
            <div
              className="terminal-panel"
              style={{
                padding: '22px 18px',
                border: '1.5px solid #ff2a4b',
                boxShadow: '0 0 40px rgba(255, 42, 75, 0.5)',
                maxWidth: '340px',
                width: '100%',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#ff2a4b', fontWeight: 900, fontSize: '0.9rem', marginBottom: '10px' }}>
                <ShieldAlert size={16} />
                <span>WEB SNAPPED // LEVEL FAILED!</span>
              </div>

              {/* Contained Video Clip WITH AUDIO */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: '#000',
                  border: '1px solid rgba(255, 42, 75, 0.6)',
                  marginBottom: '12px',
                }}
              >
                <video
                  src={BIRTHDAY_CONFIG.loseClipUrl}
                  autoPlay
                  playsInline
                  loop
                  style={{
                    width: '100%',
                    maxHeight: '180px',
                    display: 'block',
                    backgroundColor: '#000',
                    objectFit: 'contain',
                  }}
                />
              </div>

              <p style={{ color: '#cbd5e1', fontSize: '0.84rem', marginBottom: '14px' }}>
                Reached {distance}m • Ground or drone collision! 😂 Ready to retry?
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="btn-cyber-primary pulse-cyber"
                style={{ width: '100%', padding: '12px', fontSize: '0.88rem' }}
              >
                <RotateCcw size={16} />
                <span>[ RETRY WEB SWING ]</span>
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
              backgroundColor: 'rgba(5, 5, 8, 0.94)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              zIndex: 35,
              textAlign: 'center',
            }}
          >
            <div className="terminal-panel" style={{ padding: '28px 20px', maxWidth: '340px', width: '100%', border: '1.5px solid #ffb703' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>🕷️🏆</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffb703', marginBottom: '6px' }}>
                FINISH LINE REACHED!
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.86rem', marginBottom: '20px' }}>
                Ashuu swung through the skyline like a true cyber hero! Distance: {distance}m • Points: {score}.
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundSystem.playClick();
                  onComplete(score);
                }}
                className="btn-cyber-primary"
                style={{ width: '100%', padding: '14px' }}
              >
                <span>[ PROCEED TO NEXT LEVEL ➔ ]</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '12px', color: '#9e646d', fontSize: '0.78rem', textAlign: 'center' }}>
        Tap screen, click, or press Space to swing forward to the next web!
      </div>
    </div>
  );
};

export default SpiderWebSwingGame;
