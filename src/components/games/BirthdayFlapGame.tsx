import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Terminal, ShieldAlert } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';
import { ControlInstructionModal } from '../common/ControlInstructionModal';

interface BirthdayFlapGameProps {
  onLevelComplete: (score: number) => void;
  onBack?: () => void;
}

interface CpuObstacleData {
  x: number;
  width: number;
  topHeight: number;
  bottomY: number;
  gap: number;
  baseCenterY: number;
  isMoving: boolean;
  moveSpeed: number;
  moveAmplitude: number;
  movePhase: number;
  hasPassed: boolean;
  graphics: Phaser.GameObjects.Graphics;
}

export const BirthdayFlapGame: React.FC<BirthdayFlapGameProps> = ({ onLevelComplete, onBack }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const loseVideoRef = useRef<HTMLVideoElement | null>(null);

  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [remainingPasses, setRemainingPasses] = useState<number>(12);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('birthday_flap_best') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE'>('IDLE');

  // When lose clip plays, pause background music so video sound is clear; resume on retry
  // Uses bg-music.mp3 ONLY for Game 1 (Flap Protocol)
  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      soundSystem.pauseMusic();
    } else if (gameState === 'PLAYING') {
      soundSystem.playFlapMusic();
    }
  }, [gameState]);

  // When exiting Flap Game, stop bg-music.mp3 and resume bg-song.mp3
  useEffect(() => {
    return () => {
      soundSystem.stopFlapMusicAndResumeSite();
    };
  }, []);

  useEffect(() => {
    if (!gameContainerRef.current) return;

    if (phaserGameRef.current) {
      phaserGameRef.current.destroy(true);
    }

    const GAME_WIDTH = 420;
    const GAME_HEIGHT = 620;
    const GROUND_HEIGHT = 65;
    const OBSTACLE_WIDTH = 64;
    const GAP_SIZE = 190; // Fair, generous, reachable gap
    const PLAYER_RADIUS = 16;

    class CyberFlapScene extends Phaser.Scene {
      private playerContainer!: Phaser.GameObjects.Container;
      private playerBody!: Phaser.Physics.Arcade.Body;
      private gridFloor!: Phaser.GameObjects.TileSprite;
      private scoreEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

      private obstacles: CpuObstacleData[] = [];
      private passedCount: number = 0;
      private currentSceneState: 'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE' = 'IDLE';
      private spawnTimer: number = 0;
      private SPAWN_INTERVAL: number = 1900;
      private gapTierCounter: number = 0;
      private localBest: number = 0;

      constructor() {
        super({ key: 'CyberFlapScene' });
      }

      preload() {
        this.load.image('characterFace', BIRTHDAY_CONFIG.characterFaceUrl);
      }

      create() {
        this.passedCount = 0;
        this.obstacles = [];
        this.spawnTimer = 0;
        this.currentSceneState = 'IDLE';

        // Background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x050508, 0x050508, 0x14080c, 0x14080c, 1);
        bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Ground Layer
        const groundG = this.make.graphics({ x: 0, y: 0 });
        groundG.fillStyle(0x0c0608, 1);
        groundG.fillRect(0, 0, 40, GROUND_HEIGHT);
        groundG.lineStyle(2, 0xff2a4b, 0.95);
        groundG.lineBetween(0, 2, 40, 2);
        groundG.lineStyle(1, 0xffb703, 0.4);
        groundG.lineBetween(20, 2, 20, GROUND_HEIGHT);
        if (!this.textures.exists('cyberGroundTexture')) {
          groundG.generateTexture('cyberGroundTexture', 40, GROUND_HEIGHT);
        }
        groundG.destroy();

        this.gridFloor = this.add.tileSprite(
          0,
          GAME_HEIGHT - GROUND_HEIGHT,
          GAME_WIDTH,
          GROUND_HEIGHT,
          'cyberGroundTexture'
        );
        this.gridFloor.setOrigin(0, 0);

        // Particles
        const spark = this.make.graphics({ x: 0, y: 0 });
        spark.fillStyle(0xff2a4b, 1);
        spark.fillCircle(3, 3, 3);
        if (!this.textures.exists('sparkleTexture')) {
          spark.generateTexture('sparkleTexture', 6, 6);
        }
        spark.destroy();

        this.scoreEmitter = this.add.particles(0, 0, 'sparkleTexture', {
          speed: { min: 90, max: 210 },
          scale: { start: 1, end: 0 },
          lifespan: 500,
          gravityY: 100,
          emitting: false,
        });

        this.buildPlayer();

        // Controls
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

        const halo = this.add.circle(0, 0, 22, 0xff2a4b, 0.25);
        const thruster = this.add.rectangle(-16, 6, 10, 16, 0xffb703, 0.85);
        this.playerContainer.add([halo, thruster]);

        const face = this.add.image(0, 0, 'characterFace');
        face.setDisplaySize(42, 42);
        this.playerContainer.add(face);

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
          this.playerBody.setGravityY(920);
        }

        if (this.currentSceneState !== 'PLAYING') return;

        soundSystem.playJump();
        this.playerBody.setVelocityY(-315);

        this.tweens.killTweensOf(this.playerContainer);
        this.tweens.add({
          targets: this.playerContainer,
          angle: -20,
          duration: 100,
          ease: 'Power1',
        });
      }

      // Vary obstacle gaps cleanly between upper, middle, and lower positions!
      spawnCpuObstaclePair() {
        this.gapTierCounter++;
        let topHeight: number;

        // Clean rotation across 3 positions: Upper, Middle, Lower
        const tier = this.gapTierCounter % 3;
        if (tier === 0) {
          // Upper gap (character flies high)
          topHeight = Phaser.Math.Between(90, 140);
        } else if (tier === 1) {
          // Middle gap (character flies center)
          topHeight = Phaser.Math.Between(180, 240);
        } else {
          // Lower gap (character flies lower)
          topHeight = Phaser.Math.Between(270, 320);
        }

        const bottomY = topHeight + GAP_SIZE;
        const bottomHeight = GAME_HEIGHT - GROUND_HEIGHT - bottomY;

        const isMoving = this.gapTierCounter > 2 && (this.gapTierCounter % 2 === 0);
        const baseCenterY = topHeight + GAP_SIZE / 2;
        const moveSpeed = 0.0024;
        const moveAmplitude = 24; // Fair, slight up and down oscillation to challenge player
        const movePhase = Phaser.Math.FloatBetween(0, Math.PI * 2);

        const g = this.add.graphics();
        this.drawCpuPair(g, GAME_WIDTH + 20, topHeight, bottomY, bottomHeight);

        this.obstacles.push({
          x: GAME_WIDTH + 20,
          width: OBSTACLE_WIDTH,
          topHeight,
          bottomY,
          gap: GAP_SIZE,
          baseCenterY,
          isMoving,
          moveSpeed,
          moveAmplitude,
          movePhase,
          hasPassed: false,
          graphics: g,
        });
      }

      drawCpuPair(g: Phaser.GameObjects.Graphics, x: number, topH: number, bottomY: number, bottomH: number) {
        g.clear();

        // TOP CPU TOWER
        g.fillStyle(0x140a0e, 1);
        g.fillRect(x, 0, OBSTACLE_WIDTH, topH);
        g.lineStyle(2, 0xff2a4b, 0.9);
        g.strokeRect(x, 0, OBSTACLE_WIDTH, topH);

        for (let fy = 10; fy < topH - 24; fy += 14) {
          g.fillStyle(0x240f16, 0.9);
          g.fillRect(x + 4, fy, OBSTACLE_WIDTH - 8, 8);
        }

        g.fillStyle(0x2a0812, 1);
        g.fillRect(x - 3, topH - 24, OBSTACLE_WIDTH + 6, 24);
        g.lineStyle(2, 0xffb703, 0.95);
        g.strokeRect(x - 3, topH - 24, OBSTACLE_WIDTH + 6, 24);

        g.fillStyle(0xffb703, 1);
        for (let p = 0; p < OBSTACLE_WIDTH; p += 10) {
          g.fillRect(x + p + 2, topH - 4, 5, 4);
        }

        // BOTTOM CPU TOWER
        g.fillStyle(0x140a0e, 1);
        g.fillRect(x, bottomY, OBSTACLE_WIDTH, bottomH);
        g.lineStyle(2, 0xff2a4b, 0.9);
        g.strokeRect(x, bottomY, OBSTACLE_WIDTH, bottomH);

        g.fillStyle(0x2a0812, 1);
        g.fillRect(x - 3, bottomY, OBSTACLE_WIDTH + 6, 24);
        g.lineStyle(2, 0xffb703, 0.95);
        g.strokeRect(x - 3, bottomY, OBSTACLE_WIDTH + 6, 24);

        g.fillStyle(0xffb703, 1);
        for (let p = 0; p < OBSTACLE_WIDTH; p += 10) {
          g.fillRect(x + p + 2, bottomY, 5, 4);
        }

        for (let fy = bottomY + 30; fy < bottomY + bottomH - 10; fy += 14) {
          g.fillStyle(0x240f16, 0.9);
          g.fillRect(x + 4, fy, OBSTACLE_WIDTH - 8, 8);
        }
      }

      update(time: number, delta: number) {
        if (this.currentSceneState !== 'PLAYING') return;

        this.gridFloor.tilePositionX += 2.2;

        if (this.playerBody.velocity.y > 0) {
          this.playerContainer.angle = Math.min(65, this.playerContainer.angle + 2.2);
        }

        const playerX = this.playerContainer.x;
        const playerY = this.playerContainer.y;

        // Ground Collision
        if (playerY + PLAYER_RADIUS >= GAME_HEIGHT - GROUND_HEIGHT) {
          this.triggerGameOver();
          return;
        }

        // Ceiling collision
        if (playerY - PLAYER_RADIUS <= 0) {
          this.playerContainer.y = PLAYER_RADIUS;
          this.playerBody.setVelocityY(0);
        }

        this.spawnTimer += delta;
        if (this.spawnTimer >= this.SPAWN_INTERVAL) {
          this.spawnTimer = 0;
          this.spawnCpuObstaclePair();
        }

        const SPEED = 2.4;
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
          const obs = this.obstacles[i];
          obs.x -= SPEED;

          // Slight up-and-down oscillation on moving obstacles
          if (obs.isMoving) {
            const dy = Math.sin(time * obs.moveSpeed + obs.movePhase) * obs.moveAmplitude;
            const currentCenterY = obs.baseCenterY + dy;
            obs.topHeight = Math.max(70, Math.min(GAME_HEIGHT - GROUND_HEIGHT - obs.gap - 70, currentCenterY - obs.gap / 2));
            obs.bottomY = obs.topHeight + obs.gap;
          }

          const bottomHeight = GAME_HEIGHT - GROUND_HEIGHT - obs.bottomY;
          this.drawCpuPair(obs.graphics, obs.x, obs.topHeight, obs.bottomY, bottomHeight);

          // EXACT COLLISION: Only triggers on real obstacle collision
          const isHorizontallyOverlapping =
            playerX + PLAYER_RADIUS > obs.x && playerX - PLAYER_RADIUS < obs.x + obs.width;

          if (isHorizontallyOverlapping) {
            if (playerY - PLAYER_RADIUS < obs.topHeight) {
              this.triggerGameOver();
              return;
            }
            if (playerY + PLAYER_RADIUS > obs.bottomY) {
              this.triggerGameOver();
              return;
            }
          }

          // PASS DETECTION
          if (!obs.hasPassed && playerX - PLAYER_RADIUS > obs.x + obs.width) {
            obs.hasPassed = true;
            this.handleSuccessfulPass();
          }

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
          colors: ['#ff2a4b', '#ffb703', '#ffffff', '#ff1744'],
        });

        setTimeout(() => {
          onLevelComplete(12);
        }, 1200);
      }

      restartGame() {
        // Destroy existing obstacle graphics
        this.obstacles.forEach((obs) => {
          if (obs.graphics) obs.graphics.destroy();
        });
        this.obstacles = [];
        this.passedCount = 0;
        this.spawnTimer = 0;
        this.gapTierCounter = 0;
        setRemainingPasses(12);

        // Reset player in-place without restarting scene or reloading
        this.tweens.killTweensOf(this.playerContainer);
        this.playerContainer.setPosition(100, (GAME_HEIGHT - GROUND_HEIGHT) / 2);
        this.playerContainer.angle = 0;
        if (this.playerBody) {
          this.playerBody.setVelocity(0, 0);
          this.playerBody.allowGravity = false;
        }

        // Restart idle bobbing tween
        this.tweens.add({
          targets: this.playerContainer,
          y: (GAME_HEIGHT - GROUND_HEIGHT) / 2 - 16,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });

        this.currentSceneState = 'IDLE';
        setGameState('IDLE');
        soundSystem.playMusic(BIRTHDAY_CONFIG.gameBgMusicUrl);
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      transparent: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: [CyberFlapScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
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
      {/* Control Instruction Modal in Tenglish */}
      {showInstructions && (
        <ControlInstructionModal
          levelNumber={1}
          levelTitle="FLAP PROTOCOL // CPU GATE"
          objective="Ashuu face tho 12 CPU gaps cross chey! Touch aithe out!"
          desktopControls="SPACEBAR or MOUSE CLICK tho jump chey."
          mobileControls="Screen meedha TAP chey to fly."
          tip="Gaps upper, middle, lower vary avthuntai. Steady rhythm maintain chey!"
          badgeIcon="🦅"
          onStartGame={() => setShowInstructions(false)}
        />
      )}

      {/* Top Header: Level & Record (NO sound toggle as requested) */}
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
                soundSystem.stopFlapMusicAndResumeSite();
                onBack();
              }}
              className="btn-cyber-secondary"
              style={{ padding: '4px 10px', fontSize: '0.72rem' }}
            >
              ◂ BACK
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff2a4b', fontSize: '0.82rem', fontWeight: 800 }}>
            <Terminal size={15} />
            <span>LEVEL 1 // FLAP PROTOCOL</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 42, 75, 0.1)',
            border: '1px solid rgba(255, 42, 75, 0.3)',
            padding: '5px 12px',
            borderRadius: '4px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#ffb703',
          }}
        >
          <Trophy size={13} />
          <span>RECORD: {bestScore}</span>
        </div>
      </div>

      {/* Main Canvas Frame */}
      <div
        className="game-canvas-wrapper"
        style={{
          position: 'relative',
          maxWidth: '440px',
          height: '620px',
          border: '2px solid #ff2a4b',
          boxShadow: '0 0 35px rgba(255, 42, 75, 0.35)',
        }}
      >
        {/* Remaining Passes HUD */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(5, 5, 8, 0.9)',
            border: '1px solid #ff2a4b',
            boxShadow: '0 0 15px rgba(255, 42, 75, 0.4)',
            padding: '6px 16px',
            borderRadius: '20px',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 700 }}>
            REMAINING PASSES:
          </div>
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 900,
              color: remainingPasses <= 3 ? '#ffb703' : '#ff2a4b',
            }}
          >
            {remainingPasses}
          </div>
        </div>

        {/* Phaser Canvas */}
        <div ref={gameContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Idle prompt */}
        {gameState === 'IDLE' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(5, 5, 8, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              zIndex: 15,
            }}
          >
            <div
              className="pulse-cyber"
              style={{
                background: 'rgba(5, 5, 8, 0.92)',
                border: '1px solid #ff2a4b',
                padding: '12px 24px',
                borderRadius: '6px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                TAP / SPACEBAR TO FLY!
              </div>
              <div style={{ fontSize: '0.75rem', color: '#ffb703' }}>
                12 CPU gaps daati level clear chey!
              </div>
            </div>
          </div>
        )}

        {/* Lose Screen: Contained lose-clip.mp4 with sound + Retry Button */}
        {gameState === 'GAMEOVER' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(5, 5, 8, 0.92)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 30,
              textAlign: 'center',
            }}
          >
            <div
              className="terminal-panel"
              style={{
                padding: '22px 20px',
                width: '100%',
                maxWidth: '330px',
                border: '1px solid #ff2a4b',
                boxShadow: '0 0 35px rgba(255, 42, 75, 0.4)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#ff2a4b',
                  fontWeight: 800,
                  fontSize: '1rem',
                  marginBottom: '12px',
                }}
              >
                <ShieldAlert size={18} />
                <span>COLLISION OCCURRED!</span>
              </div>

              {/* Contained Video Clip WITH AUDIO */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: '#000',
                  border: '1px solid rgba(255, 42, 75, 0.5)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.9)',
                  marginBottom: '16px',
                }}
              >
                <video
                  ref={loseVideoRef}
                  src={BIRTHDAY_CONFIG.loseClipUrl}
                  autoPlay
                  playsInline
                  loop
                  style={{
                    width: '100%',
                    maxHeight: '190px',
                    display: 'block',
                    backgroundColor: '#000',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              <div
                style={{
                  background: 'rgba(255, 42, 75, 0.08)',
                  borderRadius: '4px',
                  padding: '10px 14px',
                  marginBottom: '18px',
                  border: '1px solid rgba(255, 42, 75, 0.25)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#9e646d', fontSize: '0.8rem' }}>Passes Cleared:</span>
                  <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.92rem' }}>{12 - remainingPasses} / 12</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9e646d', fontSize: '0.8rem' }}>Remaining Needed:</span>
                  <span style={{ fontWeight: 800, color: '#ff2a4b', fontSize: '0.92rem' }}>12 PASSES</span>
                </div>
              </div>

              <button
                onClick={handleRestart}
                className="btn-cyber-primary pulse-cyber"
                style={{ width: '100%', padding: '12px', fontSize: '0.92rem' }}
              >
                <RotateCcw size={16} />
                <span>[ RETRY LEVEL 1 (12 PASSES) ]</span>
              </button>
            </div>
          </div>
        )}

        {/* Level Complete */}
        {gameState === 'COMPLETE' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(5, 5, 8, 0.9)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              zIndex: 30,
              textAlign: 'center',
            }}
          >
            <div
              className="terminal-panel"
              style={{
                padding: '28px 24px',
                border: '1px solid #ffb703',
                boxShadow: '0 0 40px rgba(255, 183, 3, 0.4)',
                maxWidth: '340px',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏆</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffb703', marginBottom: '8px' }}>
                LEVEL 1 CLEARED!
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '16px' }}>
                12 CPU barriers ni clean ga cross chesav! Photo moment loading...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
