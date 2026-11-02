import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Heart, Sparkles, Terminal, ShieldAlert, ArrowLeft, Play, Pause } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';
import { ControlInstructionModal } from '../common/ControlInstructionModal';
import { LoseClipPlayer } from '../common/LoseClipPlayer';

interface CatchTheFoodGameProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

interface FallingPhotoDish {
  id: number;
  x: number;
  y: number;
  speed: number;
  photoUrl: string;
  dishName: string;
  size: number;
}

export const CatchTheFoodGame: React.FC<CatchTheFoodGameProps> = ({ onComplete, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [attempt, setAttempt] = useState<number>(1);
  const [dishesCaught, setDishesCaught] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [reactionText, setReactionText] = useState<string>('Ready for the Feast!');
  const [recentDishPhoto, setRecentDishPhoto] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE'>('IDLE');

  const TARGET_DISHES = 10;

  const DISH_NAMES = [
    'Crispy Pani Puri Plate #1',
    'Spicy Teekha Pani Puri',
    'Sweet Meetha Pani Puri',
    'Special Masala Pani Puri',
    'Crunchy Sev Pani Puri',
    'Dahi Pani Puri Delight',
    'Double Masala Pani Puri',
    'Chatpata Pani Puri Plate',
    'Hyderabadi Style Pani Puri',
    'Grand 10th Pani Puri Plate!',
  ];

  const stateRef = useRef({
    basketX: 210,
    basketWidth: 86,
    basketHeight: 40,
    dishesCaught: 0,
    lives: 3,
    items: [] as FallingPhotoDish[],
    nextId: 1,
    spawnCooldown: 0,
    isPaused: false,
    gameState: 'IDLE' as 'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE',
    attemptNumber: 1,
  });

  // Keep stateRef.attemptNumber in sync
  useEffect(() => {
    stateRef.current.attemptNumber = attempt;
  }, [attempt]);

  // Pause background music when lose clip plays
  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      soundSystem.pauseMusic();
    } else if (gameState === 'PLAYING') {
      soundSystem.playSiteMusic();
    }
  }, [gameState]);

  // Preload images into memory
  const imagesRef = useRef<{ [key: string]: HTMLImageElement }>({});
  const eatingAvatarRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // Load 7 food photos
    BIRTHDAY_CONFIG.foodiePhotos.forEach((url) => {
      const img = new Image();
      img.src = url;
      imagesRef.current[url] = img;
    });

    // Load Ashuu eating avatar
    const eatingImg = new Image();
    eatingImg.src = BIRTHDAY_CONFIG.eatingPhotoUrl;
    eatingAvatarRef.current = eatingImg;
  }, []);

  const startGame = () => {
    soundSystem.playClick();
    const s = stateRef.current;
    s.dishesCaught = 0;
    s.lives = 3;
    s.items = [];
    s.isPaused = false;
    s.gameState = 'PLAYING';

    setDishesCaught(0);
    setLives(3);
    setIsPaused(false);
    setReactionText(
      attempt < 3
        ? `ATTEMPT ${attempt}: PANI PURI TSUNAMI! Catch them if you can! 😂`
        : 'ATTEMPT 3: Pani Puri Mode! Catch 10 plates to clear level!'
    );
    setRecentDishPhoto(null);
    setGameState('PLAYING');

    // On attempts 1 & 2: Show ALL food items together at beginning moving quickly!
    if (attempt < 3) {
      const xPositions = [45, 95, 150, 210, 265, 320, 375];
      BIRTHDAY_CONFIG.foodiePhotos.forEach((photoUrl, idx) => {
        s.items.push({
          id: s.nextId++,
          x: xPositions[idx] || 40 + idx * 50,
          y: -30 - Math.random() * 40,
          speed: 8.0 + Math.random() * 2.5, // Super fast deliberate overload
          photoUrl,
          dishName: DISH_NAMES[idx] || 'Pani Puri Special Plate',
          size: 60,
        });
      });
      s.spawnCooldown = 15;
    } else {
      s.spawnCooldown = 30;
    }
  };

  const togglePause = () => {
    soundSystem.playClick();
    setIsPaused((p) => {
      stateRef.current.isPaused = !p;
      return !p;
    });
  };


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 420);
    const height = (canvas.height = 600);
    stateRef.current.basketX = width / 2;

    const updateBasketX = (clientX: number) => {
      if (stateRef.current.isPaused || stateRef.current.gameState !== 'PLAYING') return;
      const rect = canvas.getBoundingClientRect();
      const scale = width / rect.width;
      const x = (clientX - rect.left) * scale;
      stateRef.current.basketX = Math.max(
        stateRef.current.basketWidth / 2,
        Math.min(width - stateRef.current.basketWidth / 2, x)
      );
    };

    const onMouseMove = (e: MouseEvent) => updateBasketX(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) updateBasketX(e.touches[0].clientX);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.isPaused || stateRef.current.gameState !== 'PLAYING') return;
      const step = 28;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        stateRef.current.basketX = Math.max(
          stateRef.current.basketWidth / 2,
          stateRef.current.basketX - step
        );
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        stateRef.current.basketX = Math.min(
          width - stateRef.current.basketWidth / 2,
          stateRef.current.basketX + step
        );
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    let animId: number;

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const s = stateRef.current;

      // Draw background: Deep cyber black with subtle red glow
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);

      // Ambient glow
      const radialG = ctx.createRadialGradient(width / 2, 80, 10, width / 2, 80, 240);
      radialG.addColorStop(0, 'rgba(255, 42, 75, 0.12)');
      radialG.addColorStop(1, 'transparent');
      ctx.fillStyle = radialG;
      ctx.fillRect(0, 0, width, height);

      // Floor line
      ctx.strokeStyle = '#ff2a4b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height - 20);
      ctx.lineTo(width, height - 20);
      ctx.stroke();

      if (s.gameState !== 'PLAYING' || s.isPaused) {
        // Draw basket while paused
        drawBasket(ctx, s.basketX, height - 55, s.basketWidth, s.basketHeight);
        return;
      }

      // Spawning dishes
      s.spawnCooldown--;
      if (s.spawnCooldown <= 0) {
        s.spawnCooldown = 55 + Math.floor(Math.random() * 30);
        const photoIndex = Math.floor(Math.random() * BIRTHDAY_CONFIG.foodiePhotos.length);
        const photoUrl = BIRTHDAY_CONFIG.foodiePhotos[photoIndex];
        const dishName = DISH_NAMES[photoIndex] || 'Crispy Pani Puri Plate';

        s.items.push({
          id: s.nextId++,
          x: 40 + Math.random() * (width - 80),
          y: -40,
          speed: 2.4 + Math.random() * 1.4,
          photoUrl,
          dishName,
          size: 56, // Prominent photo size
        });
      }

      const basketY = height - 55;

      // Update & Draw falling dishes
      for (let i = s.items.length - 1; i >= 0; i--) {
        const item = s.items[i];
        item.y += item.speed;

        // Draw Pani Puri Plate
        const radius = item.size / 2;
        ctx.save();
        ctx.translate(item.x, item.y);

        // Plate shadow & glow
        ctx.shadowColor = 'rgba(255, 183, 3, 0.45)';
        ctx.shadowBlur = 12;

        // Plate Outer Rim
        ctx.fillStyle = '#181216';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Plate Border (Golden Cyber Steel)
        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset shadow

        // Inner plate bed
        ctx.fillStyle = '#22181c';
        ctx.beginPath();
        ctx.arc(0, 0, radius - 4, 0, Math.PI * 2);
        ctx.fill();

        // Center bowl of Spicy Teekha Mint Water (Pani)
        const bowlRadius = radius * 0.38;
        const mintGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, bowlRadius);
        mintGrad.addColorStop(0, '#74c69d');
        mintGrad.addColorStop(0.7, '#2d6a4f');
        mintGrad.addColorStop(1, '#1b4332');
        ctx.fillStyle = mintGrad;
        ctx.beginPath();
        ctx.arc(0, 0, bowlRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#95d5b2';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 5 Crispy Golden Puris around the bowl
        const puriCount = 5;
        const orbitRadius = radius * 0.58;
        const puriRadius = radius * 0.26;

        for (let p = 0; p < puriCount; p++) {
          const angle = (p * 2 * Math.PI) / puriCount;
          const px = Math.cos(angle) * orbitRadius;
          const py = Math.sin(angle) * orbitRadius;

          // Crispy Puri shell
          const puriGrad = ctx.createRadialGradient(px, py, 1, px, py, puriRadius);
          puriGrad.addColorStop(0, '#ffe3a8');
          puriGrad.addColorStop(0.6, '#f4a261');
          puriGrad.addColorStop(1, '#c85a17');
          ctx.fillStyle = puriGrad;
          ctx.beginPath();
          ctx.arc(px, py, puriRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#e76f51';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Crack opening in puri with tamarind & spicy filling
          ctx.fillStyle = '#6f1d1b'; // Tamarind chutney
          ctx.beginPath();
          ctx.arc(px, py - 1, puriRadius * 0.45, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#52b788'; // Drop of mint pani
          ctx.beginPath();
          ctx.arc(px + 1, py, puriRadius * 0.22, 0, Math.PI * 2);
          ctx.fill();
        }

        // Tiny floating banner: PANI PURI
        ctx.fillStyle = 'rgba(5, 5, 8, 0.85)';
        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 1;
        const tagW = 64;
        const tagH = 14;
        ctx.beginPath();
        ctx.roundRect(-tagW / 2, radius - 2, tagW, tagH, 3);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffb703';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🥟 PANI PURI', 0, radius + 5);

        ctx.restore();

        // Check collision with Ashuu's basket
        const distX = Math.abs(item.x - s.basketX);
        const distY = Math.abs(item.y - basketY);

        if (distX < s.basketWidth / 2 + 15 && distY < s.basketHeight / 2 + 15) {
          // Catch dish!
          soundSystem.playScore();
          s.dishesCaught += 1;
          setDishesCaught(s.dishesCaught);
          setRecentDishPhoto(item.photoUrl);
          setReactionText(`Secured: ${item.dishName}! 🥟`);
          s.items.splice(i, 1);

          // Check win condition
          if (s.dishesCaught >= TARGET_DISHES) {
            s.gameState = 'COMPLETE';
            setGameState('COMPLETE');
            soundSystem.playVictory();
            confetti({
              particleCount: 160,
              spread: 90,
              colors: ['#ff2a4b', '#ffb703', '#ffffff', '#2ec4b6'],
            });
            return;
          }
          continue;
        }

        // Dropped below screen
        if (item.y > height + 20) {
          s.items.splice(i, 1);
          s.lives -= 1;
          setLives(s.lives);
          soundSystem.playHit();
          setReactionText('Pani Puri plate slipped away! Watch out!');

          if (s.lives <= 0) {
            s.gameState = 'GAMEOVER';
            setGameState('GAMEOVER');
            return;
          }
        }
      }

      // Draw Ashuu's Feast Plate at bottom
      drawBasket(ctx, s.basketX, basketY, s.basketWidth, s.basketHeight);
    };

    const drawBasket = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
      // Plate base
      c.fillStyle = 'rgba(255, 42, 75, 0.2)';
      c.strokeStyle = '#ff2a4b';
      c.lineWidth = 2;
      c.beginPath();
      c.roundRect(x - w / 2, y, w, h, 8);
      c.fill();
      c.stroke();

      // Ashuu Eating Avatar inside the plate
      const eatingImg = eatingAvatarRef.current;
      if (eatingImg && eatingImg.complete) {
        c.save();
        c.beginPath();
        c.arc(x, y + h / 2, 18, 0, Math.PI * 2);
        c.closePath();
        c.clip();
        c.drawImage(eatingImg, x - 18, y + h / 2 - 18, 36, 36);
        c.restore();
        c.strokeStyle = '#ffb703';
        c.lineWidth = 2;
        c.beginPath();
        c.arc(x, y + h / 2, 18, 0, Math.PI * 2);
        c.stroke();
      } else {
        c.fillStyle = '#fff';
        c.font = '16px monospace';
        c.textAlign = 'center';
        c.fillText('🥟 ASHU', x, y + 24);
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onComplete]);

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
      }}
    >
      {/* Control Instruction Modal before gameplay starts */}
      {showInstructions && (
        <ControlInstructionModal
          levelNumber={3}
          levelTitle="PANI PURI FEAST PROTOCOL"
          objective="Ashuu favorite Pani Puri plates painunchi paduthunnai. 10 plates plate lo catch chey!"
          desktopControls="MOUSE or LEFT/RIGHT ARROWS tho plate move chey."
          mobileControls="Screen meedha FINGER drag chesi plate move chey."
          tip="3 plates slip aithe out! Fast ga catch chey!"
          badgeIcon="🥟"
          onStartGame={() => {
            setShowInstructions(false);
            startGame();
          }}
        />
      )}

      {/* Top Header */}
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
          {onBack && (
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
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff2a4b', fontSize: '0.82rem', fontWeight: 800 }}>
            <Terminal size={15} />
            <span>PANI PURI FEAST // ATTEMPT {attempt}/3</span>
          </div>
        </div>

        {/* Pause Button */}
        {gameState === 'PLAYING' && (
          <button
            onClick={togglePause}
            className="btn-cyber-secondary"
            style={{ padding: '5px 12px', fontSize: '0.75rem' }}
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>
        )}
      </div>

      {/* Canvas Wrapper */}
      <div
        className="game-canvas-wrapper"
        style={{
          position: 'relative',
          maxWidth: '440px',
          height: '600px',
          border: '2px solid #ff2a4b',
          boxShadow: '0 0 35px rgba(255, 42, 75, 0.35)',
        }}
      >
        {/* HUD Overlay: Dishes Caught & Lives */}
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
          {/* Target Counter */}
          <div
            style={{
              background: 'rgba(5, 5, 8, 0.9)',
              border: '1px solid #ff2a4b',
              padding: '6px 14px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>PANI PURI:</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffb703' }}>
              {dishesCaught} / {TARGET_DISHES}
            </span>
          </div>

          {/* Lives */}
          <div
            style={{
              background: 'rgba(5, 5, 8, 0.9)',
              border: '1px solid #ff2a4b',
              padding: '6px 12px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                size={16}
                fill={i < lives ? '#ff2a4b' : 'none'}
                color={i < lives ? '#ff2a4b' : '#555'}
              />
            ))}
          </div>
        </div>

        {/* Reaction Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            background: 'rgba(5, 5, 8, 0.88)',
            border: '1px solid rgba(255, 42, 75, 0.3)',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '0.78rem',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        >
          <span style={{ color: '#ffb703', fontWeight: 700 }}>{reactionText}</span>
          <span style={{ fontSize: '1.1rem' }}>🥟</span>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            cursor: 'ew-resize',
          }}
        />

        {/* Pause Overlay */}
        {isPaused && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(5, 5, 8, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 30,
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>
              GAME PAUSED
            </div>
            <button onClick={togglePause} className="btn-cyber-primary">
              <Play size={16} />
              <span>RESUME GAME</span>
            </button>
          </div>
        )}

        {/* Game Over Overlay with lose-clip.mp4 */}
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
                <span>PANI PURI OVERLOAD // ATTEMPT {attempt} FAILED!</span>
              </div>

              {/* Loss Video Clip WITH Audio */}
              <LoseClipPlayer
                maxHeight="180px"
                onResumeMusic={() => soundSystem.playSiteMusic()}
              />

              <p style={{ color: '#cbd5e1', fontSize: '0.82rem', marginBottom: '14px', lineHeight: 1.4 }}>
                {attempt < 3
                  ? `Pani Puri flood lo Ashuu plates anni slip aipoyayi! 😂 Attempt ${attempt + 1} ready?`
                  : 'Pani Puri plates dropped! Ready to retry?'}
              </p>

              <button
                onClick={() => {
                  soundSystem.playClick();
                  setAttempt((a) => a + 1);
                  startGame();
                }}
                className="btn-cyber-primary pulse-cyber"
                style={{ width: '100%', padding: '12px', fontSize: '0.88rem' }}
              >
                <RotateCcw size={16} />
                <span>[ RETRY PANI PURI {attempt < 3 ? `(ATTEMPT ${attempt + 1}/3)` : ''} ]</span>
              </button>
            </div>
          </div>
        )}

        {/* Complete Overlay - Immediately display large eating-photo.png */}
        {gameState === 'COMPLETE' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(5, 5, 8, 0.95)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px 16px',
              zIndex: 35,
              textAlign: 'center',
              animation: 'fadeIn 0.3s ease-out',
            }}
          >
            <div
              className="terminal-panel"
              style={{
                padding: '24px 20px',
                border: '2px solid #ffb703',
                boxShadow: '0 0 50px rgba(255, 183, 3, 0.55)',
                maxWidth: '380px',
                width: '100%',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '6px' }}>🥟🎉</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffb703', marginBottom: '4px' }}>
                PANI PURI FEAST COMPLETE!
              </div>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '12px' }}>
                10 Plates of Pani Puri Secured by Ashuu!
              </div>

              {/* Large, clearly visible eating-photo.png */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '260px',
                  height: '240px',
                  borderRadius: '12px',
                  margin: '0 auto 14px',
                  overflow: 'hidden',
                  border: '3px solid #ffb703',
                  boxShadow: '0 0 30px rgba(255, 183, 3, 0.5)',
                  backgroundColor: '#000',
                }}
              >
                <img
                  src={BIRTHDAY_CONFIG.eatingPhotoUrl}
                  alt="Ashuu Eating Pani Puri"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              <p style={{ color: '#fff', fontSize: '0.86rem', fontWeight: 700, marginBottom: '6px' }}>
                10 plates Pani Puri clean sweep chesav! 🥟
              </p>
              <p style={{ color: '#9e646d', fontSize: '0.78rem', marginBottom: '16px' }}>
                Foodie Gang lo Ashuu thopu anthe! 🤤✨
              </p>
              <button
                onClick={() => {
                  soundSystem.playClick();
                  onComplete(10);
                }}
                className="btn-cyber-primary pulse-cyber"
                style={{ width: '100%', padding: '14px', fontSize: '0.88rem', fontWeight: 900 }}
              >
                <span>[ PROCEED TO LEVEL 4: SPIDER-MAN PROTOCOL ➔ ]</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
