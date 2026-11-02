import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowRight, ArrowLeft as LeftIcon, Terminal, ShieldAlert } from 'lucide-react';
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
  const [gameState, setGameState] = useState<'IDLE' | 'STARTING' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE'>('IDLE');
  const [countdown, setCountdown] = useState<number>(2);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('birthday_gta_best') || '0', 10);
    } catch {
      return 0;
    }
  });

  const TARGET_SCORE = 120; // 120 points to complete level

  const stateRef = useRef({
    lane: 1, // 0, 1, 2
    isJumping: false,
    jumpY: 0,
    jumpVelocity: 0,
    isSliding: false,
    slideTimer: 0,
    score: 0,
    cash: 0,
    speed: 5.2,
    obstacles: [] as RoadObstacle[],
    nextId: 1,
    spawnTimer: 0,
    gameState: 'IDLE' as 'IDLE' | 'STARTING' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE',
    faceImage: null as HTMLImageElement | null,
  });

  // Pause music on game over so lose video sound plays clearly
  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      soundSystem.pauseMusic();
    } else if (gameState === 'PLAYING' || gameState === 'STARTING') {
      soundSystem.playSiteMusic();
    }
  }, [gameState]);

  const startGame = () => {
    soundSystem.playClick();
    soundSystem.playSiteMusic();
    stateRef.current.lane = 1;
    stateRef.current.isJumping = false;
    stateRef.current.jumpY = 0;
    stateRef.current.isSliding = false;
    stateRef.current.score = 0;
    stateRef.current.cash = 0;
    stateRef.current.speed = 5.2;
    stateRef.current.obstacles = [];
    stateRef.current.gameState = 'STARTING';
    setScore(0);
    setCashCollected(0);
    setGameState('STARTING');
    setCountdown(2);

    // Wait a short moment before the car begins moving
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          stateRef.current.gameState = 'PLAYING';
          setGameState('PLAYING');
          soundSystem.playVictory();
          return 0;
        }
        soundSystem.playClick();
        return c - 1;
      });
    }, 900);
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

    // Preload Ashu character face
    const img = new Image();
    img.src = BIRTHDAY_CONFIG.characterFaceUrl;
    img.onload = () => {
      stateRef.current.faceImage = img;
    };

    let animId: number;
    let roadStripeOffset = 0;

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const s = stateRef.current;

      // Draw highway road (cyber red & black)
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);

      // Cyber Road Bed
      ctx.fillStyle = '#0d080c';
      ctx.fillRect(width * 0.08, 0, width * 0.84, height);

      // Side Guard Rails
      ctx.strokeStyle = '#ff2a4b';
      ctx.lineWidth = 3;
      ctx.strokeRect(width * 0.08, 0, width * 0.84, height);

      // Road Stripes
      roadStripeOffset = (roadStripeOffset + (s.gameState === 'PLAYING' ? s.speed : 1.5)) % 40;
      ctx.strokeStyle = 'rgba(255, 183, 3, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -roadStripeOffset;

      // Lane dividers
      ctx.beginPath();
      ctx.moveTo(width * 0.36, 0);
      ctx.lineTo(width * 0.36, height);
      ctx.moveTo(width * 0.64, 0);
      ctx.lineTo(width * 0.64, height);
      ctx.stroke();
      ctx.setLineDash([]);

      if (s.gameState !== 'PLAYING') {
        drawCar(ctx, laneX[s.lane], height - 120, s);
        return;
      }

      // Physics update
      s.score += 0.25;
      const curScore = Math.floor(s.score);
      setScore(curScore);

      // Jump physics
      if (s.isJumping) {
        s.jumpY += s.jumpVelocity;
        s.jumpVelocity += 0.75;
        if (s.jumpY >= 0) {
          s.jumpY = 0;
          s.isJumping = false;
        }
      }

      // Slide physics
      if (s.isSliding) {
        s.slideTimer--;
        if (s.slideTimer <= 0) s.isSliding = false;
      }

      // Obstacle Spawning
      s.spawnTimer++;
      if (s.spawnTimer > 45) {
        s.spawnTimer = 0;
        const lane = Math.floor(Math.random() * 3);
        const rand = Math.random();
        let type: RoadObstacle['type'] = 'car';
        if (rand < 0.35) type = 'cash';
        else if (rand < 0.5) type = 'gift';
        else if (rand < 0.8) type = 'barrier';
        else type = 'car';

        s.obstacles.push({
          id: s.nextId++,
          lane,
          y: -40,
          type,
          size: type === 'car' ? 50 : 36,
        });
      }

      // Obstacles update & collision
      const playerY = height - 120 + s.jumpY;
      const playerLane = s.lane;

      for (let i = s.obstacles.length - 1; i >= 0; i--) {
        const obs = s.obstacles[i];
        obs.y += s.speed;

        const x = laneX[obs.lane];
        const y = obs.y;

        // Draw obstacle
        if (obs.type === 'car') {
          ctx.fillStyle = '#ff2a4b';
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(x - 20, y - 25, 40, 50, 6);
          ctx.fill();
          ctx.stroke();
          // Headlights
          ctx.fillStyle = '#ffb703';
          ctx.fillRect(x - 16, y + 18, 8, 6);
          ctx.fillRect(x + 8, y + 18, 8, 6);
        } else if (obs.type === 'barrier') {
          ctx.fillStyle = '#ffb703';
          ctx.fillRect(x - 24, y - 10, 48, 20);
          ctx.strokeStyle = '#000';
          ctx.strokeRect(x - 24, y - 10, 48, 20);
        } else if (obs.type === 'cash') {
          ctx.fillStyle = '#ffb703';
          ctx.beginPath();
          ctx.arc(x, y, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.font = '12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('$', x, y + 4);
        } else if (obs.type === 'gift') {
          ctx.fillStyle = '#ff2a4b';
          ctx.fillRect(x - 14, y - 14, 28, 28);
          ctx.fillStyle = '#ffb703';
          ctx.fillRect(x - 3, y - 14, 6, 28);
          ctx.fillRect(x - 14, y - 3, 28, 6);
        }

        // Collision Check
        const inPlayerLane = obs.lane === playerLane;
        const inVerticalRange = Math.abs(y - playerY) < 36;

        if (inPlayerLane && inVerticalRange) {
          if (obs.type === 'cash' || obs.type === 'gift') {
            soundSystem.playScore();
            s.cash += obs.type === 'gift' ? 25 : 10;
            s.score += obs.type === 'gift' ? 20 : 10;
            setCashCollected(s.cash);
            s.obstacles.splice(i, 1);
            continue;
          }

          // Barrier jump avoidance
          if (obs.type === 'barrier' && s.jumpY < -24) {
            // Jumped over successfully!
            continue;
          }

          // CRASH!
          soundSystem.playHit();
          s.gameState = 'GAMEOVER';
          setGameState('GAMEOVER');
          return;
        }

        // Remove off-screen
        if (obs.y > height + 50) {
          s.obstacles.splice(i, 1);
        }
      }

      // Check win target
      if (curScore >= TARGET_SCORE) {
        s.gameState = 'COMPLETE';
        setGameState('COMPLETE');
        soundSystem.playVictory();
        confetti({
          particleCount: 160,
          spread: 90,
          colors: ['#ff2a4b', '#ffb703', '#ffffff', '#ff1744'],
        });
      }

      // Draw player car
      drawCar(ctx, laneX[s.lane], playerY, s);
    };

    const drawCar = (c: CanvasRenderingContext2D, x: number, y: number, s: any) => {
      c.save();
      // Car chassis
      c.fillStyle = s.isSliding ? 'rgba(255, 42, 75, 0.4)' : '#16080d';
      c.strokeStyle = '#ff2a4b';
      c.lineWidth = 2.5;
      c.beginPath();
      c.roundRect(x - 22, y - 30, 44, 60, 8);
      c.fill();
      c.stroke();

      // Taillights
      c.fillStyle = '#ff2a4b';
      c.fillRect(x - 18, y + 24, 8, 4);
      c.fillRect(x + 10, y + 24, 8, 4);

      // Ashuu face on windshield
      const face = s.faceImage;
      if (face && face.complete) {
        c.beginPath();
        c.arc(x, y - 4, 15, 0, Math.PI * 2);
        c.closePath();
        c.clip();
        c.drawImage(face, x - 15, y - 19, 30, 30);
      } else {
        c.fillStyle = '#ffb703';
        c.beginPath();
        c.arc(x, y - 4, 12, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();
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
        backgroundColor: 'transparent',
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
            <span>LEVEL 2 // CYBER CAR RUN</span>
          </div>
        </div>

        <div style={{ color: '#ffb703', fontSize: '0.8rem', fontWeight: 800 }}>
          GOAL: {TARGET_SCORE} PTS
        </div>
      </div>

      {/* Canvas Wrapper */}
      <div
        className="game-canvas-wrapper"
        style={{
          position: 'relative',
          maxWidth: '420px',
          height: '620px',
          border: '2px solid #ff2a4b',
          boxShadow: '0 0 35px rgba(255, 42, 75, 0.4)',
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
            SCORE: {score}
          </div>
          <div style={{ background: 'rgba(5, 5, 8, 0.9)', border: '1px solid #ffb703', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>
            ITEMS: ${cashCollected}
          </div>
        </div>

        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        {/* Short moment countdown before car begins moving */}
        {gameState === 'STARTING' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(5, 5, 8, 0.72)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 32,
              pointerEvents: 'none',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '0.9rem',
                fontWeight: 900,
                color: '#ffb703',
                letterSpacing: '0.15em',
                marginBottom: '8px',
              }}
            >
              ENGINE REVVED // GET READY!
            </div>
            <div
              style={{
                fontSize: '4.5rem',
                fontWeight: 900,
                color: '#ff2a4b',
                textShadow: '0 0 35px rgba(255, 42, 75, 0.8)',
              }}
            >
              {countdown > 0 ? countdown : 'GO!'}
            </div>
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
              <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>🚗⚡</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ff2a4b', marginBottom: '8px' }}>
                CYBER CAR RUN
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.84rem', marginBottom: '20px', lineHeight: 1.5 }}>
                Dodge oncoming cyber traffic and steer left/right! Reach {TARGET_SCORE} points to clear level!
              </p>
              <button onClick={startGame} className="btn-cyber-primary pulse-cyber" style={{ width: '100%', padding: '14px' }}>
                <span>[ START GAME ➔ ]</span>
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
                <span>CAR CRASHED // LEVEL FAILED!</span>
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
                  preload="auto"
                  onCanPlay={(e) => {
                    const v = e.currentTarget;
                    const p = v.play();
                    if (p !== undefined) {
                      p.catch(() => {
                        v.muted = true;
                        v.play().catch(() => {});
                      });
                    }
                  }}
                  onClick={(e) => {
                    const v = e.currentTarget;
                    v.muted = false;
                    v.play().catch(() => {});
                  }}
                  style={{
                    width: '100%',
                    maxHeight: '180px',
                    display: 'block',
                    backgroundColor: '#000',
                    objectFit: 'contain',
                    cursor: 'pointer',
                  }}
                >
                  <source src={BIRTHDAY_CONFIG.loseClipUrl} type="video/mp4" />
                </video>
              </div>

              <p style={{ color: '#cbd5e1', fontSize: '0.84rem', marginBottom: '14px' }}>
                Score: {score} • Traffic lo Ashuu car crash aipoindi! 😂 Ready to retry?
              </p>

              <button
                onClick={startGame}
                className="btn-cyber-primary pulse-cyber"
                style={{ width: '100%', padding: '12px', fontSize: '0.88rem' }}
              >
                <RotateCcw size={16} />
                <span>[ RETRY CAR RUN ]</span>
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
              <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>🚗🏆</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffb703', marginBottom: '6px' }}>
                HIGHWAY CLEARED!
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.86rem', marginBottom: '20px' }}>
                Los Santos traffic ni daati Ashuu racer pro status techukunnadu! Score: {score}.
              </p>
              <button
                onClick={() => {
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

      {/* On-Screen Mobile Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginTop: '12px',
          width: '100%',
          maxWidth: '420px',
          justifyContent: 'center',
        }}
      >
        <button onClick={moveLeft} className="btn-cyber-secondary" style={{ padding: '10px 16px' }}>
          <LeftIcon size={18} />
        </button>
        <button onClick={jump} className="btn-cyber-secondary" style={{ padding: '10px 20px', color: '#ffb703' }}>
          <ArrowUp size={18} />
          <span>JUMP</span>
        </button>
        <button onClick={slide} className="btn-cyber-secondary" style={{ padding: '10px 20px', color: '#ff2a4b' }}>
          <ArrowDown size={18} />
          <span>SLIDE</span>
        </button>
        <button onClick={moveRight} className="btn-cyber-secondary" style={{ padding: '10px 16px' }}>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default GtaChaosRunGame;
