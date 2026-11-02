import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Terminal, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface BirthdayFlapGameProps {
  onLevelComplete: (score: number) => void;
  onBackToArcade?: () => void;
  isUnlockedInArcade?: boolean;
}

interface CpuObstacleData {
  x: number;
  width: number;
  topHeight: number;
  bottomY: number;
  gap: number;
  hasPassed: boolean;
  graphics: Phaser.GameObjects.Graphics;
}

export const BirthdayFlapGame: React.FC<BirthdayFlapGameProps> = ({
  onLevelComplete,
  onBackToArcade,
  isUnlockedInArcade = false,
}) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  const [remainingPasses, setRemainingPasses] = useState<number>(12);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('birthday_flap_best') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE'>('IDLE');
  const [isMuted, setIsMuted] = useState<boolean>(soundSystem.getIsMuted());

  // 1. Synchronized Background Music
  useEffect(() => {
    const audio = new Audio(BIRTHDAY_CONFIG.gameBgMusicUrl);
    audio.loop = true;
    audio.volume = isMuted ? 0 : 0.55;
    bgAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      bgAudioRef.current = null;
    };
  }, []);

  // Update volume when mute toggles
  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = isMuted ? 0 : 0.55;
    }
  }, [isMuted]);

  // Play only while actively in PLAYING state
  useEffect(() => {
    if (gameState === 'PLAYING') {
      soundSystem.registerUserInteraction();
      bgAudioRef.current?.play().catch(() => {});
    } else {
      bgAudioRef.current?.pause();
      if (gameState === 'IDLE' && bgAudioRef.current) {
        bgAudioRef.current.currentTime = 0;
      }
    }
  }, [gameState]);

  const handleToggleSound = () => {
    const muted = soundSystem.toggleMute();
    setIsMuted(muted);
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = muted ? 0 : 0.55;
    }
  };

  // 2. Phaser Game Instance with Precision Geometry Engine
  useEffect(() => {
    if (!gameContainerRef.current) return;

    if (phaserGameRef.current) {
      phaserGameRef.current.destroy(true);
    }

    const GAME_WIDTH = 420;
    const GAME_HEIGHT = 640;
    const GROUND_HEIGHT = 70;
    const OBSTACLE_WIDTH = 64;
    const GAP_SIZE = 180; // Generous, fair, clear gap
    const PLAYER_RADIUS = 16; // Precision collision radius around Ashu's face

    class CyberFlapScene extends Phaser.Scene {
      private playerContainer!: Phaser.GameObjects.Container;
      private playerBody!: Phaser.Physics.Arcade.Body;
      private gridFloor!: Phaser.GameObjects.TileSprite;
      private scoreEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

      private obstacles: CpuObstacleData[] = [];
      private passedCount: number = 0;
      private localBest: number = 0;
      private currentSceneState: 'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE' = 'IDLE';
      private spawnTimer: number = 0;
      private SPAWN_INTERVAL: number = 1900; // Milliseconds between CPU obstacles

      constructor() {
        super({ key: 'CyberFlapScene' });
      }

      preload() {
        // Load clean character face image without visor
        this.load.image('characterFace', BIRTHDAY_CONFIG.characterFaceUrl);
      }

      create() {
        this.passedCount = 0;
        this.obstacles = [];
        this.spawnTimer = 0;
        this.currentSceneState = 'IDLE';

        try {
          this.localBest = parseInt(localStorage.getItem('birthday_flap_best') || '0', 10);
        } catch {
          this.localBest = 0;
        }

        // A. Background: Cyber Dark Grid
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x040609, 0x040609, 0x081018, 0x081018, 1);
        bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Neon grid lines
        const grid = this.add.graphics();
        grid.lineStyle(1, 0x00ff66, 0.08);
        for (let x = 0; x < GAME_WIDTH; x += 30) {
          grid.lineBetween(x, 0, x, GAME_HEIGHT);
        }
        for (let y = 0; y < GAME_HEIGHT; y += 30) {
          grid.lineBetween(0, y, GAME_WIDTH, y);
        }

        // B. Ground Layer
        const groundG = this.make.graphics({ x: 0, y: 0 });
        groundG.fillStyle(0x060a0f, 1);
        groundG.fillRect(0, 0, 40, GROUND_HEIGHT);
        groundG.lineStyle(2, 0x00ff66, 0.9);
        groundG.lineBetween(0, 2, 40, 2);
        groundG.lineStyle(1, 0x00e5ff, 0.4);
        groundG.lineBetween(20, 2, 20, GROUND_HEIGHT);
        groundG.generateTexture('cyberGroundTexture', 40, GROUND_HEIGHT);
        groundG.destroy();

        this.gridFloor = this.add.tileSprite(
          0,
          GAME_HEIGHT - GROUND_HEIGHT,
          GAME_WIDTH,
          GROUND_HEIGHT,
          'cyberGroundTexture'
        );
        this.gridFloor.setOrigin(0, 0);

        // C. Particles for Successful Passes
        const spark = this.make.graphics({ x: 0, y: 0 });
        spark.fillStyle(0x00ff66, 1);
        spark.fillCircle(3, 3, 3);
        spark.generateTexture('sparkleTexture', 6, 6);
        spark.destroy();

        this.scoreEmitter = this.add.particles(0, 0, 'sparkleTexture', {
          speed: { min: 90, max: 210 },
          scale: { start: 1, end: 0 },
          lifespan: 500,
          gravityY: 100,
          emitting: false,
        });

        // D. Build Clean Character (NO green marks over face)
        this.buildPlayer();

        // E. Touch & Keyboard Controls
        this.input.on('pointerdown', () => this.handleJump());
        this.input.keyboard?.on('keydown-SPACE', () => this.handleJump());
      }

      buildPlayer() {
        this.playerContainer = this.add.container(100, (GAME_HEIGHT - GROUND_HEIGHT) / 2);
        this.playerContainer.setSize(38, 38);

        this.physics.world.enable(this.playerContainer);
        this.playerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
        this.playerBody.setCollideWorldBounds(false);
        this.playerBody.allowGravity = false;

        // Subtle Cyan/Green Energy Thruster & Halo behind head
        const halo = this.add.circle(0, 0, 22, 0x00e5ff, 0.25);
        const thruster = this.add.rectangle(-16, 6, 10, 16, 0x00ff66, 0.8);
        this.playerContainer.add([halo, thruster]);

        // Clean Character Face (properly sized, oriented, NO marks over face)
        const face = this.add.image(0, 0, 'characterFace');
        face.setDisplaySize(42, 42);
        this.playerContainer.add(face);

        // Idle floating tween
        this.tweens.add({
          targets: this.playerContainer,
          y: (GAME_HEIGHT - GROUND_HEIGHT) / 2 - 16,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }

      handleJump() {
        if (this.currentSceneState === 'IDLE') {
          this.currentSceneState = 'PLAYING';
          setGameState('PLAYING');
          this.tweens.killTweensOf(this.playerContainer);
          this.playerBody.allowGravity = true;
          this.playerBody.setGravityY(820);
        }

        if (this.currentSceneState !== 'PLAYING') return;

        soundSystem.playJump();
        this.playerBody.setVelocityY(-305);

        this.tweens.killTweensOf(this.playerContainer);
        this.tweens.add({
          targets: this.playerContainer,
          angle: -20,
          duration: 100,
          ease: 'Power1',
        });
      }

      spawnCpuObstaclePair() {
        // Vary topHeight randomly while guaranteeing reachable, fair, clear gap
        const minTop = 80;
        const maxTop = GAME_HEIGHT - GROUND_HEIGHT - GAP_SIZE - 70; // 570 - 180 - 70 = 320
        const topHeight = Phaser.Math.Between(minTop, maxTop);
        const bottomY = topHeight + GAP_SIZE;
        const bottomHeight = GAME_HEIGHT - GROUND_HEIGHT - bottomY;

        const g = this.add.graphics();
        this.drawCpuPair(g, GAME_WIDTH + 20, topHeight, bottomY, bottomHeight);

        this.obstacles.push({
          x: GAME_WIDTH + 20,
          width: OBSTACLE_WIDTH,
          topHeight,
          bottomY,
          gap: GAP_SIZE,
          hasPassed: false,
          graphics: g,
        });
      }

      // Draw beautifully rendered CPU-themed obstacles
      drawCpuPair(g: Phaser.GameObjects.Graphics, x: number, topH: number, bottomY: number, bottomH: number) {
        g.clear();

        // 1. TOP CPU TOWER (Motherboard/Heatsink descending from top)
        // Main Silicon Body
        g.fillStyle(0x060c14, 1);
        g.fillRect(x, 0, OBSTACLE_WIDTH, topH);

        // Border & Bus Tracks
        g.lineStyle(2, 0x00ff66, 0.85);
        g.strokeRect(x, 0, OBSTACLE_WIDTH, topH);

        // Circuit Traces inside Top Body
        g.lineStyle(1, 0x00e5ff, 0.6);
        g.lineBetween(x + 16, 0, x + 16, topH - 18);
        g.lineBetween(x + 32, 0, x + 32, topH - 24);
        g.lineBetween(x + 48, 0, x + 48, topH - 18);

        // Golden CPU Microchip Socket facing the gap
        g.fillStyle(0x1a2634, 1);
        g.fillRect(x + 4, topH - 16, OBSTACLE_WIDTH - 8, 16);
        g.lineStyle(2, 0xffd700, 1);
        g.strokeRect(x + 4, topH - 16, OBSTACLE_WIDTH - 8, 16);

        // Golden Processor Pins along the gap edge
        g.fillStyle(0xffd700, 1);
        for (let p = x + 8; p < x + OBSTACLE_WIDTH - 8; p += 8) {
          g.fillRect(p, topH - 3, 4, 3);
        }

        // Glowing Core LED on Top Chip
        g.fillStyle(0x00ff66, 1);
        g.fillCircle(x + OBSTACLE_WIDTH / 2, topH - 8, 3);

        // 2. BOTTOM CPU TOWER (Server Mainframe rising from ground)
        // Main Silicon Body
        g.fillStyle(0x060c14, 1);
        g.fillRect(x, bottomY, OBSTACLE_WIDTH, bottomH);

        // Border
        g.lineStyle(2, 0x00e5ff, 0.85);
        g.strokeRect(x, bottomY, OBSTACLE_WIDTH, bottomH);

        // Circuit Traces inside Bottom Body
        g.lineStyle(1, 0x00ff66, 0.6);
        g.lineBetween(x + 16, bottomY + 18, x + 16, bottomY + bottomH);
        g.lineBetween(x + 32, bottomY + 24, x + 32, bottomY + bottomH);
        g.lineBetween(x + 48, bottomY + 18, x + 48, bottomY + bottomH);

        // Golden CPU Microchip Socket facing the gap
        g.fillStyle(0x1a2634, 1);
        g.fillRect(x + 4, bottomY, OBSTACLE_WIDTH - 8, 16);
        g.lineStyle(2, 0xffd700, 1);
        g.strokeRect(x + 4, bottomY, OBSTACLE_WIDTH - 8, 16);

        // Golden Processor Pins along the gap edge
        g.fillStyle(0xffd700, 1);
        for (let p = x + 8; p < x + OBSTACLE_WIDTH - 8; p += 8) {
          g.fillRect(p, bottomY, 4, 3);
        }

        // Glowing Core LED on Bottom Chip
        g.fillStyle(0x00e5ff, 1);
        g.fillCircle(x + OBSTACLE_WIDTH / 2, bottomY + 8, 3);
      }

      update(time: number, delta: number) {
        if (this.currentSceneState !== 'PLAYING') return;

        // Ground scroll
        this.gridFloor.tilePositionX += 2.4;

        // Player tilt on fall
        if (this.playerBody.velocity.y > 60) {
          this.playerContainer.angle = Math.min(60, this.playerContainer.angle + 2.2);
        }

        // Spawn timer
        this.spawnTimer += delta;
        if (this.spawnTimer >= this.SPAWN_INTERVAL) {
          this.spawnTimer = 0;
          this.spawnCpuObstaclePair();
        }

        const SPEED = 145; // Smooth, fair horizontal speed
        const moveDist = SPEED * (delta / 1000);

        const playerX = this.playerContainer.x;
        const playerY = this.playerContainer.y;
        const groundY = GAME_HEIGHT - GROUND_HEIGHT;

        // A. Ceiling & Ground Collisions
        if (playerY - PLAYER_RADIUS <= 0) {
          this.playerContainer.y = PLAYER_RADIUS;
          this.playerBody.setVelocityY(0);
        }

        if (playerY + PLAYER_RADIUS >= groundY) {
          this.triggerGameOver();
          return;
        }

        // B. Obstacles Movement, Pixel-Perfect Collision & Pass Detection
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
          const obs = this.obstacles[i];
          obs.x -= moveDist;

          // Redraw graphics at new x position
          const bottomH = groundY - obs.bottomY;
          this.drawCpuPair(obs.graphics, obs.x, obs.topHeight, obs.bottomY, bottomH);

          // 1. COLLISION DETECTION: Strict & Mathematically Exact
          // Is player horizontally within the obstacle tower width?
          const isHorizontallyOverlapping =
            playerX + PLAYER_RADIUS > obs.x && playerX - PLAYER_RADIUS < obs.x + obs.width;

          if (isHorizontallyOverlapping) {
            // Did player touch the top CPU obstacle?
            if (playerY - PLAYER_RADIUS < obs.topHeight) {
              this.triggerGameOver();
              return;
            }

            // Did player touch the bottom CPU obstacle?
            if (playerY + PLAYER_RADIUS > obs.bottomY) {
              this.triggerGameOver();
              return;
            }

            // OTHERWISE: Player is strictly inside the gap!
            // Passing through the gap will NEVER trigger game over!
          }

          // 2. PASS DETECTION: Count pass only when safely cleared the obstacle horizontally
          if (!obs.hasPassed && playerX - PLAYER_RADIUS > obs.x + obs.width) {
            obs.hasPassed = true;
            this.handleSuccessfulPass();
          }

          // Cleanup offscreen obstacles
          if (obs.x < -OBSTACLE_WIDTH - 20) {
            obs.graphics.destroy();
            this.obstacles.splice(i, 1);
          }
        }
      }

      handleSuccessfulPass() {
        this.passedCount += 1;
        const remaining = Math.max(0, 12 - this.passedCount);
        setRemainingPasses(remaining);
        soundSystem.playScore();

        this.scoreEmitter.emitParticleAt(this.playerContainer.x + 20, this.playerContainer.y, 8);

        if (this.passedCount > this.localBest) {
          this.localBest = this.passedCount;
          setBestScore(this.localBest);
          try {
            localStorage.setItem('birthday_flap_best', this.localBest.toString());
          } catch {
            // Ignore
          }
        }

        // Win Condition: 12 passes in a single run
        if (this.passedCount >= 12 && this.currentSceneState !== 'COMPLETE') {
          this.triggerLevelComplete();
        }
      }

      triggerGameOver() {
        if (this.currentSceneState !== 'PLAYING') return;
        this.currentSceneState = 'GAMEOVER';
        setGameState('GAMEOVER');

        soundSystem.playHit();
        this.cameras.main.shake(200, 0.02);
        this.playerBody.setVelocity(0, 180);
      }

      triggerLevelComplete() {
        this.currentSceneState = 'COMPLETE';
        setGameState('COMPLETE');

        soundSystem.playVictory();
        this.playerBody.setVelocity(0, 0);

        confetti({
          particleCount: 160,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#00ff66', '#00e5ff', '#ffd700', '#ffffff'],
        });

        // Open original birthday website immediately without lose clip
        setTimeout(() => {
          onLevelComplete(12);
        }, 1200);
      }

      restartGame() {
        // Destroy existing graphics
        this.obstacles.forEach((obs) => obs.graphics.destroy());
        this.obstacles = [];
        this.passedCount = 0;
        this.spawnTimer = 0;
        setRemainingPasses(12);

        this.scene.restart();
        this.currentSceneState = 'IDLE';
        setGameState('IDLE');
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: '#040609',
      physics: {
        default: 'arcade',
        arcade: { debug: false },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [CyberFlapScene],
    };

    const game = new Phaser.Game(config);
    phaserGameRef.current = game;

    return () => {
      game.destroy(true);
      phaserGameRef.current = null;
    };
  }, [onLevelComplete]);

  const handleRestart = () => {
    soundSystem.playClick();
    if (phaserGameRef.current) {
      const scene = phaserGameRef.current.scene.getScene('CyberFlapScene') as any;
      if (scene && scene.restartGame) {
        scene.restartGame();
      }
    }
  };

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
      {/* Top Header: Protocol, Record, and Sound Toggle */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00ff66', fontSize: '0.82rem', fontWeight: 800 }}>
          <Terminal size={15} />
          <span>FLAP PROTOCOL // CPU GATE</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Sound Mute/Unmute Toggle */}
          <button
            onClick={handleToggleSound}
            className="btn-cyber-secondary"
            style={{
              padding: '5px 10px',
              fontSize: '0.75rem',
              borderColor: isMuted ? 'rgba(255, 51, 68, 0.4)' : '#00ff66',
              color: isMuted ? '#ff7080' : '#00ff66',
            }}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isMuted ? 'MUTED' : 'AUDIO:ON'}</span>
          </button>

          {/* Record Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 255, 102, 0.08)',
              border: '1px solid rgba(0, 255, 102, 0.3)',
              padding: '5px 12px',
              borderRadius: '4px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#00ff66',
            }}
          >
            <Trophy size={13} />
            <span>BEST: {bestScore}</span>
          </div>
        </div>
      </div>

      {/* Game Canvas Wrapper */}
      <div className="game-canvas-wrapper" style={{ border: '2px solid #00ff66' }}>
        <div ref={gameContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Live Remaining Passes Countdown Display (12 -> 11 -> ... -> 0) */}
        <div
          style={{
            position: 'absolute',
            top: 18,
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 20,
          }}
        >
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              color: remainingPasses <= 3 ? '#00e5ff' : '#00ff66',
              textShadow: '0 0 16px rgba(0, 255, 102, 0.8)',
              lineHeight: 1,
            }}
          >
            {remainingPasses}
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              color: '#00e5ff',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: '4px',
            }}
          >
            REMAINING PASSES
          </span>

          {/* Progress Indicator Dots (12 Dots) */}
          <div style={{ display: 'flex', gap: '3px', marginTop: '6px' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '1px',
                  background: i < (12 - remainingPasses) ? '#00ff66' : 'rgba(255, 255, 255, 0.15)',
                  boxShadow: i < (12 - remainingPasses) ? '0 0 6px #00ff66' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Idle Start Prompt */}
        {gameState === 'IDLE' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(4, 6, 9, 0.55)',
              zIndex: 25,
              pointerEvents: 'none',
              padding: '20px',
            }}
          >
            <div
              className="terminal-panel"
              style={{
                padding: '18px 24px',
                textAlign: 'center',
                border: '1px solid #00ff66',
                boxShadow: '0 0 25px rgba(0, 255, 102, 0.25)',
              }}
            >
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#00ff66', marginBottom: '6px' }}>
                [ TAP / PRESS SPACE TO FLY ]
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                Fly safely through 12 CPU obstacle gaps to unlock the birthday site!
              </div>
            </div>
          </div>
        )}

        {/* Lose Screen: Clean Contained Video Clip (NO browser controls) + Retry Button */}
        {gameState === 'GAMEOVER' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(4, 6, 9, 0.94)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 30,
              textAlign: 'center',
              overflowY: 'auto',
            }}
          >
            <div
              className="terminal-panel"
              style={{
                padding: '22px 20px',
                width: '100%',
                maxWidth: '320px',
                border: '1px solid #ff3344',
                boxShadow: '0 0 35px rgba(255, 51, 68, 0.4)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#ff3344',
                  fontWeight: 800,
                  fontSize: '1rem',
                  marginBottom: '12px',
                  letterSpacing: '0.04em',
                }}
              >
                <ShieldAlert size={18} />
                <span>CPU BARRIER COLLISION</span>
              </div>

              {/* Clean Contained Video Clip: NO BROWSER CONTROLS */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: '#000',
                  border: '1px solid rgba(255, 51, 68, 0.5)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.9)',
                  marginBottom: '16px',
                }}
              >
                <video
                  src={BIRTHDAY_CONFIG.loseClipUrl}
                  autoPlay
                  muted
                  playsInline
                  loop
                  style={{
                    width: '100%',
                    maxHeight: '190px',
                    display: 'block',
                    backgroundColor: '#000',
                    objectFit: 'contain',
                    pointerEvents: 'none', // Prevents any browser interaction overlays
                  }}
                />
              </div>

              {/* Pass Progress */}
              <div
                style={{
                  background: 'rgba(255, 51, 68, 0.08)',
                  borderRadius: '4px',
                  padding: '10px 14px',
                  marginBottom: '18px',
                  border: '1px solid rgba(255, 51, 68, 0.25)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Passes Cleared:</span>
                  <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.92rem' }}>{12 - remainingPasses} / 12</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Remaining Needed:</span>
                  <span style={{ fontWeight: 800, color: '#ff3344', fontSize: '0.92rem' }}>12 PASSES</span>
                </div>
              </div>

              {/* Clearly Visible Retry Button Outside Video */}
              <button
                onClick={handleRestart}
                className="btn-cyber-primary pulse-cyber"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1rem',
                  backgroundColor: 'rgba(0, 255, 102, 0.16)',
                  borderColor: '#00ff66',
                  color: '#00ff66',
                  boxShadow: '0 0 25px rgba(0, 255, 102, 0.4)',
                }}
              >
                <RotateCcw size={16} />
                <span>[ RETRY FLAP SEQUENCE ]</span>
              </button>
            </div>
          </div>
        )}

        {/* Level Complete Screen (12 Passes Done -> Opens Birthday Website) */}
        {gameState === 'COMPLETE' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(4, 6, 9, 0.94)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              zIndex: 35,
              textAlign: 'center',
            }}
          >
            <div
              className="terminal-panel"
              style={{
                padding: '36px 24px',
                width: '100%',
                maxWidth: '340px',
                border: '1px solid #00ff66',
                boxShadow: '0 0 35px rgba(0, 255, 102, 0.4)',
              }}
            >
              <div
                style={{
                  color: '#00ff66',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  marginBottom: '8px',
                }}
              >
                ALL 12 PASSES COMPLETE!
              </div>

              <h2
                className="text-neon-green"
                style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px' }}
              >
                ACCESS GRANTED // BIRTHDAY SYSTEM UNLOCKED
              </h2>

              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', marginBottom: '24px' }}>
                Decryption complete. Entering South Dev's official birthday arcade & celebration...
              </p>

              <button
                onClick={() => onLevelComplete(12)}
                className="btn-cyber-primary pulse-cyber"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                <span>[ ENTER BIRTHDAY WEBSITE ]</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '12px', color: '#5c7866', fontSize: '0.78rem', textAlign: 'center' }}>
        Tap screen, click, or press <kbd style={{ background: '#0a141b', padding: '2px 6px', border: '1px solid #00ff66', color: '#00ff66' }}>Space</kbd> to fly
      </div>
    </div>
  );
};
