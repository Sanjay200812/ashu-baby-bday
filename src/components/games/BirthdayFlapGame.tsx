import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, Terminal, ChevronRight, ShieldAlert } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface BirthdayFlapGameProps {
  onLevelComplete: (score: number) => void;
  onBackToArcade?: () => void;
  isUnlockedInArcade?: boolean;
}

export const BirthdayFlapGame: React.FC<BirthdayFlapGameProps> = ({
  onLevelComplete,
  onBackToArcade,
  isUnlockedInArcade = false,
}) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('birthday_flap_best') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE'>('IDLE');
  const levelGoal = BIRTHDAY_CONFIG.flapGoalScore || 12;

  // Background Game Music: Only plays while actively in PLAYING state
  useEffect(() => {
    const audio = new Audio(BIRTHDAY_CONFIG.gameBgMusicUrl);
    audio.loop = true;
    audio.volume = 0.55;
    bgAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      bgAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      bgAudioRef.current?.play().catch(() => {});
    } else {
      bgAudioRef.current?.pause();
      if (gameState === 'IDLE') {
        if (bgAudioRef.current) bgAudioRef.current.currentTime = 0;
      }
    }
  }, [gameState]);

  useEffect(() => {
    if (!gameContainerRef.current) return;

    if (phaserGameRef.current) {
      phaserGameRef.current.destroy(true);
    }

    const GAME_WIDTH = 420;
    const GAME_HEIGHT = 640;
    const GROUND_HEIGHT = 70;

    class CyberFlapScene extends Phaser.Scene {
      private player!: Phaser.GameObjects.Container;
      private playerPhysicsBody!: Phaser.Physics.Arcade.Body;
      private obstacles!: Phaser.Physics.Arcade.Group;
      private scoreParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
      private gridFloor!: Phaser.GameObjects.TileSprite;
      private codeFragments!: Phaser.GameObjects.Group;
      private currentScore: number = 0;
      private localBestScore: number = 0;
      private currentGameState: 'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE' = 'IDLE';
      private obstacleTimer!: Phaser.Time.TimerEvent;
      private passedPipes: Set<Phaser.GameObjects.GameObject> = new Set();

      constructor() {
        super({ key: 'CyberFlapScene' });
      }

      preload() {
        this.load.image('characterFace', BIRTHDAY_CONFIG.characterFaceUrl);
      }

      create() {
        this.currentScore = 0;
        try {
          this.localBestScore = parseInt(localStorage.getItem('birthday_flap_best') || '0', 10);
        } catch {
          this.localBestScore = 0;
        }
        this.currentGameState = 'IDLE';
        this.passedPipes.clear();

        // 1. Cyber City Background Grid
        const bgGrad = this.add.graphics();
        bgGrad.fillGradientStyle(0x05070a, 0x05070a, 0x0a141b, 0x0a141b, 1);
        bgGrad.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Neon cyber grid lines
        const gridG = this.add.graphics();
        gridG.lineStyle(1, 0x00ff66, 0.08);
        for (let x = 0; x < GAME_WIDTH; x += 32) {
          gridG.lineBetween(x, 0, x, GAME_HEIGHT);
        }
        for (let y = 0; y < GAME_HEIGHT; y += 32) {
          gridG.lineBetween(0, y, GAME_WIDTH, y);
        }

        // Floating hex code fragments in background
        const hexCodes = ['0x7F', '0x2A', '0xSOUTH', '0xDEV', '0x2005', '0xCODEXA'];
        this.codeFragments = this.add.group();
        for (let i = 0; i < 8; i++) {
          const txt = this.add.text(
            Phaser.Math.Between(20, GAME_WIDTH - 40),
            Phaser.Math.Between(40, GAME_HEIGHT - 120),
            hexCodes[i % hexCodes.length],
            { font: '10px Fira Code', color: '#00ff66' }
          );
          txt.setAlpha(0.2);
          this.tweens.add({
            targets: txt,
            y: txt.y - 40,
            alpha: 0.05,
            duration: Phaser.Math.Between(2000, 4000),
            yoyo: true,
            repeat: -1,
          });
        }

        // 2. Score Particle Emitter (Neon Green Sparkles)
        const sparkGraphics = this.make.graphics({ x: 0, y: 0 });
        sparkGraphics.fillStyle(0x00ff66, 1);
        sparkGraphics.fillCircle(4, 4, 3);
        sparkGraphics.generateTexture('neonSparkleTexture', 8, 8);
        sparkGraphics.destroy();

        this.scoreParticles = this.add.particles(0, 0, 'neonSparkleTexture', {
          speed: { min: 80, max: 200 },
          scale: { start: 1, end: 0 },
          lifespan: 500,
          gravityY: 150,
          emitting: false,
        });

        // 3. Obstacles Group
        this.obstacles = this.physics.add.group();

        // 4. Ground Layer (Neon Cyber-Floor)
        const groundGraphics = this.make.graphics({ x: 0, y: 0 });
        groundGraphics.fillStyle(0x06090e, 1);
        groundGraphics.fillRect(0, 0, 40, GROUND_HEIGHT);
        groundGraphics.lineStyle(2, 0x00ff66, 0.9);
        groundGraphics.lineBetween(0, 2, 40, 2);
        // Floor grid blocks
        groundGraphics.lineStyle(1, 0x00e5ff, 0.4);
        groundGraphics.lineBetween(20, 2, 20, GROUND_HEIGHT);
        groundGraphics.generateTexture('cyberGroundTexture', 40, GROUND_HEIGHT);
        groundGraphics.destroy();

        this.gridFloor = this.add.tileSprite(
          0,
          GAME_HEIGHT - GROUND_HEIGHT,
          GAME_WIDTH,
          GROUND_HEIGHT,
          'cyberGroundTexture'
        );
        this.gridFloor.setOrigin(0, 0);
        this.physics.add.existing(this.gridFloor, true);

        // 5. Build Player Character (South Dev Face + Cyber Jetpack/Cape)
        this.buildPlayerCharacter();

        // 6. Collisions
        this.physics.add.collider(this.player, this.gridFloor, () => {
          this.triggerGameOver();
        });

        this.physics.add.overlap(this.player, this.obstacles, () => {
          this.triggerGameOver();
        });

        // 7. Inputs (Pointer / Touch and Keyboard Spacebar)
        this.input.on('pointerdown', () => this.handleJump());
        this.input.keyboard?.on('keydown-SPACE', () => this.handleJump());

        // Obstacle Spawn Timer
        this.obstacleTimer = this.time.addEvent({
          delay: 1750,
          callback: this.spawnObstaclePair,
          callbackScope: this,
          loop: true,
          paused: true,
        });
      }

      buildPlayerCharacter() {
        this.player = this.add.container(100, GAME_HEIGHT / 2 - 40);
        this.player.setSize(48, 48);
        this.physics.world.enable(this.player);
        this.playerPhysicsBody = this.player.body as Phaser.Physics.Arcade.Body;
        this.playerPhysicsBody.setCircle(22, 2, 2);
        this.playerPhysicsBody.setCollideWorldBounds(true);
        this.playerPhysicsBody.allowGravity = false;

        // Cyber Aura
        const aura = this.add.circle(0, 2, 26, 0x00ff66, 0.2);
        this.player.add(aura);

        // Cyber Jetpack Wings / Thrusters
        const thruster = this.add.rectangle(-14, 8, 12, 20, 0x00e5ff);
        this.player.add(thruster);

        // Face Image
        const faceImg = this.add.image(0, -2, 'characterFace');
        faceImg.setDisplaySize(46, 46);
        this.player.add(faceImg);

        // Cyber Visor / Headpiece
        const visor = this.add.rectangle(0, -6, 32, 6, 0x00ff66, 0.85);
        this.player.add(visor);

        // Floating idle tween
        this.tweens.add({
          targets: this.player,
          y: GAME_HEIGHT / 2 - 20,
          duration: 900,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }

      handleJump() {
        if (this.currentGameState === 'IDLE') {
          this.currentGameState = 'PLAYING';
          setGameState('PLAYING');
          this.tweens.killTweensOf(this.player);
          this.playerPhysicsBody.allowGravity = true;
          this.playerPhysicsBody.setGravityY(820);
          this.obstacleTimer.paused = false;
        }

        if (this.currentGameState !== 'PLAYING') return;

        soundSystem.playJump();
        this.playerPhysicsBody.setVelocityY(-310);

        this.tweens.killTweensOf(this.player);
        this.tweens.add({
          targets: this.player,
          angle: -22,
          duration: 120,
          ease: 'Power1',
        });
      }

      spawnObstaclePair() {
        if (this.currentGameState !== 'PLAYING') return;

        // Gap shrinks slightly as score increases (starts generous at 180px for fair mobile play)
        const gap = Math.max(150, 180 - Math.floor(this.currentScore / 3) * 6);
        const speed = -(150 + Math.min(50, this.currentScore * 3));
        const minTop = 60;
        const maxTop = GAME_HEIGHT - GROUND_HEIGHT - gap - 60;
        const topHeight = Phaser.Math.Between(minTop, maxTop);
        const bottomY = topHeight + gap;
        const bottomHeight = GAME_HEIGHT - GROUND_HEIGHT - bottomY;

        // Top Digital Barrier
        const topObstacle = this.createCyberBarrier(GAME_WIDTH + 40, 0, 54, topHeight, true);
        this.obstacles.add(topObstacle);
        (topObstacle.body as Phaser.Physics.Arcade.Body).setVelocityX(speed);
        (topObstacle.body as Phaser.Physics.Arcade.Body).setImmovable(true);
        (topObstacle.body as Phaser.Physics.Arcade.Body).allowGravity = false;

        // Bottom Digital Barrier
        const bottomObstacle = this.createCyberBarrier(GAME_WIDTH + 40, bottomY, 54, bottomHeight, false);
        this.obstacles.add(bottomObstacle);
        (bottomObstacle.body as Phaser.Physics.Arcade.Body).setVelocityX(speed);
        (bottomObstacle.body as Phaser.Physics.Arcade.Body).setImmovable(true);
        (bottomObstacle.body as Phaser.Physics.Arcade.Body).allowGravity = false;
      }

      createCyberBarrier(x: number, y: number, width: number, height: number, isTop: boolean) {
        const container = this.add.container(x, y);
        container.setSize(width, height);
        this.physics.world.enable(container);

        const g = this.add.graphics();
        // Cyber pillar
        g.fillStyle(0x0a141b, 1);
        g.fillRoundedRect(0, 0, width, height, 4);

        // Neon barrier rim
        g.lineStyle(2, 0x00ff66, 0.9);
        g.strokeRoundedRect(0, 0, width, height, 4);

        // Circuit line inside barrier
        g.lineStyle(1, 0x00e5ff, 0.7);
        g.lineBetween(width / 2, 4, width / 2, height - 4);
        for (let py = 16; py < height - 10; py += 30) {
          g.strokeCircle(width / 2, py, 4);
        }

        // Barrier Core Tip Node
        const tipY = isTop ? height - 6 : 6;
        const coreNode = this.add.circle(width / 2, tipY, 5, 0x00ff66);

        container.add([g, coreNode]);
        return container;
      }

      update() {
        if (this.currentGameState === 'PLAYING') {
          this.gridFloor.tilePositionX += 2.5;

          if (this.playerPhysicsBody.velocity.y > 60) {
            this.player.angle = Math.min(65, this.player.angle + 2.4);
          }

          // Check score on passing barrier pairs
          this.obstacles.getChildren().forEach((child) => {
            const obstacle = child as Phaser.GameObjects.Container;
            if (!this.passedPipes.has(obstacle) && obstacle.x + obstacle.width < this.player.x) {
              this.passedPipes.add(obstacle);
              if (this.passedPipes.size % 2 === 0) {
                this.handleScore();
              }
            }

            if (obstacle.x < -80) {
              this.obstacles.remove(obstacle, true, true);
            }
          });
        }
      }

      handleScore() {
        this.currentScore += 1;
        setScore(this.currentScore);
        soundSystem.playScore();

        this.scoreParticles.emitParticleAt(this.player.x + 20, this.player.y, 8);

        if (this.currentScore > this.localBestScore) {
          this.localBestScore = this.currentScore;
          setBestScore(this.localBestScore);
          try {
            localStorage.setItem('birthday_flap_best', this.localBestScore.toString());
          } catch {
            // Ignore
          }
        }

        if (this.currentScore >= levelGoal && this.currentGameState !== 'COMPLETE') {
          this.triggerLevelComplete();
        }
      }

      triggerGameOver() {
        if (this.currentGameState !== 'PLAYING') return;
        this.currentGameState = 'GAMEOVER';
        setGameState('GAMEOVER');

        soundSystem.playHit();
        this.cameras.main.shake(250, 0.02);
        this.obstacleTimer.paused = true;
        this.playerPhysicsBody.setVelocity(0, 200);
        this.obstacles.setVelocityX(0);
      }

      triggerLevelComplete() {
        this.currentGameState = 'COMPLETE';
        setGameState('COMPLETE');

        soundSystem.playVictory();
        this.obstacleTimer.paused = true;
        this.obstacles.setVelocityX(0);

        confetti({
          particleCount: 140,
          spread: 85,
          origin: { y: 0.5 },
          colors: ['#00ff66', '#00e5ff', '#ffd700', '#ffffff'],
        });

        onLevelComplete(this.currentScore);
      }

      restartGame() {
        this.scene.restart();
        this.currentScore = 0;
        this.currentGameState = 'IDLE';
        setGameState('IDLE');
        setScore(0);
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: '#05070a',
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
  }, [levelGoal, onLevelComplete]);

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
      {/* Top Header */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          padding: '0 4px',
        }}
      >
        {isUnlockedInArcade && onBackToArcade ? (
          <button
            onClick={() => {
              soundSystem.playClick();
              onBackToArcade();
            }}
            className="btn-cyber-secondary"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            <ArrowLeft size={15} />
            <span>[ ARCADE_HUB ]</span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00ff66', fontSize: '0.85rem', fontWeight: 800 }}>
            <Terminal size={16} />
            <span>MODULE 01: FLAP_PROTOCOL</span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 255, 102, 0.08)',
            border: '1px solid rgba(0, 255, 102, 0.3)',
            padding: '6px 14px',
            borderRadius: '4px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#00ff66',
          }}
        >
          <Trophy size={14} />
          <span>RECORD: {bestScore}</span>
        </div>
      </div>

      {/* Canvas Wrapper */}
      <div className="game-canvas-wrapper">
        <div ref={gameContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Live Score Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 20,
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
              fontSize: '2.8rem',
              fontWeight: 900,
              color: '#00ff66',
              textShadow: '0 0 16px rgba(0, 255, 102, 0.8)',
              lineHeight: 1,
            }}
          >
            {score}
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              color: '#00e5ff',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            GOAL: {levelGoal} PASSES
          </span>
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
              background: 'rgba(5, 7, 10, 0.55)',
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
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                Navigate 12 barriers in a single run to unlock Birthday Website!
              </div>
            </div>
          </div>
        )}

        {/* Lose Screen with lose-clip.mp4 & Prominent Retry Button */}
        {gameState === 'GAMEOVER' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5, 7, 10, 0.94)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '18px',
              zIndex: 30,
              textAlign: 'center',
              overflowY: 'auto',
            }}
          >
            <div
              className="terminal-panel"
              style={{
                padding: '24px 20px',
                width: '100%',
                maxWidth: '340px',
                border: '1px solid #ff3344',
                boxShadow: '0 0 35px rgba(255, 51, 68, 0.35)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#ff3344',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  marginBottom: '12px',
                  letterSpacing: '0.04em',
                }}
              >
                <ShieldAlert size={20} />
                <span>FLAP PROTOCOL FAILED</span>
              </div>

              {/* Video Clip with Controls & Autoplay Compliance */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: '#000',
                  border: '1px solid rgba(255, 51, 68, 0.5)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.9)',
                  marginBottom: '14px',
                }}
              >
                <video
                  src={BIRTHDAY_CONFIG.loseClipUrl}
                  controls
                  playsInline
                  autoPlay
                  muted
                  loop
                  style={{
                    width: '100%',
                    maxHeight: '190px',
                    display: 'block',
                    backgroundColor: '#000',
                    objectFit: 'contain',
                  }}
                />
              </div>

              {/* Pass Progress */}
              <div
                style={{
                  background: 'rgba(255, 51, 68, 0.08)',
                  borderRadius: '4px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  border: '1px solid rgba(255, 51, 68, 0.25)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Passes this run:</span>
                  <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{score} / {levelGoal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Best Record:</span>
                  <span style={{ fontWeight: 800, color: '#00ff66', fontSize: '0.95rem' }}>{bestScore}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#ff7080', marginTop: '6px' }}>
                  Must reach 12 passes in one run to unlock the system!
                </div>
              </div>

              {/* Prominent Retry Button */}
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

        {/* Level Complete Modal */}
        {gameState === 'COMPLETE' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5, 7, 10, 0.94)',
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
                boxShadow: '0 0 35px rgba(0, 255, 102, 0.35)',
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
                GAME MODULE 01 COMPLETE
              </div>

              <h2
                className="text-neon-green"
                style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px' }}
              >
                ACCESSING SOUTH DEV ARCADE...
              </h2>

              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', marginBottom: '24px' }}>
                12 successful passes achieved! The full cyber arcade & birthday surprise have been decrypted.
              </p>

              <button
                onClick={() => {
                  soundSystem.playClick();
                  onLevelComplete(score);
                }}
                className="btn-cyber-primary pulse-cyber"
                style={{ width: '100%', padding: '14px', fontSize: '1rem', marginBottom: '12px' }}
              >
                <span>[ ENTER BIRTHDAY ARCADE ]</span>
                <ChevronRight size={18} />
              </button>

              <button
                onClick={handleRestart}
                className="btn-cyber-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
              >
                <RotateCcw size={15} />
                <span>Replay Module</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '12px', color: '#5c7866', fontSize: '0.78rem', textAlign: 'center' }}>
        Click, tap screen, or press <kbd style={{ background: '#0a141b', padding: '2px 6px', border: '1px solid #00ff66', color: '#00ff66' }}>Space</kbd> to fly!
      </div>
    </div>
  );
};
