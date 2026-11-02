import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, Sparkles, ChevronRight } from 'lucide-react';
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

  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('birthday_flap_best') || '0', 10);
  });
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE'>('IDLE');
  const [levelGoal] = useState<number>(BIRTHDAY_CONFIG.flapGoalScore || 10);

  useEffect(() => {
    if (!gameContainerRef.current) return;

    // Destroy any existing instance
    if (phaserGameRef.current) {
      phaserGameRef.current.destroy(true);
    }

    const GAME_WIDTH = 420;
    const GAME_HEIGHT = 640;
    const GROUND_HEIGHT = 80;

    class FlapScene extends Phaser.Scene {
      private player!: Phaser.GameObjects.Container;
      private playerPhysicsBody!: Phaser.Physics.Arcade.Body;
      private obstacles!: Phaser.Physics.Arcade.Group;
      private scoreParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
      private groundTiles!: Phaser.GameObjects.TileSprite;
      private cloudTiles!: Phaser.GameObjects.TileSprite;
      private currentScore: number = 0;
      private localBestScore: number = 0;
      private currentGameState: 'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE' = 'IDLE';
      private obstacleTimer!: Phaser.Time.TimerEvent;
      private passedPipes: Set<Phaser.GameObjects.GameObject> = new Set();
      private capeWave: number = 0;
      private capeGraphic!: Phaser.GameObjects.Graphics;

      constructor() {
        super({ key: 'FlapScene' });
      }

      preload() {
        // Load the character face image configured in birthdayConfig
        this.load.image('characterFace', BIRTHDAY_CONFIG.characterFaceUrl);
      }

      create() {
        this.currentScore = 0;
        this.localBestScore = parseInt(localStorage.getItem('birthday_flap_best') || '0', 10);
        this.currentGameState = 'IDLE';
        this.passedPipes.clear();

        // 1. Dynamic Backgrounds
        const bgGrad = this.add.graphics();
        bgGrad.fillGradientStyle(0x130e2e, 0x130e2e, 0x090a14, 0x090a14, 1);
        bgGrad.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Twinkling stars
        for (let i = 0; i < 40; i++) {
          const starX = Phaser.Math.Between(10, GAME_WIDTH - 10);
          const starY = Phaser.Math.Between(10, GAME_HEIGHT - GROUND_HEIGHT - 30);
          const starRadius = Phaser.Math.FloatBetween(1, 2.5);
          const star = this.add.circle(starX, starY, starRadius, 0xffd700, Phaser.Math.FloatBetween(0.3, 0.9));
          this.tweens.add({
            targets: star,
            alpha: 0.1,
            duration: Phaser.Math.Between(1200, 2400),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: Phaser.Math.Between(0, 1500),
          });
        }

        // Procedural Clouds
        const cloudGraphics = this.make.graphics({ x: 0, y: 0 });
        cloudGraphics.fillStyle(0xffffff, 0.12);
        cloudGraphics.fillCircle(25, 20, 18);
        cloudGraphics.fillCircle(45, 16, 22);
        cloudGraphics.fillCircle(68, 20, 16);
        cloudGraphics.fillRoundedRect(10, 22, 70, 18, 9);
        cloudGraphics.generateTexture('cloudTexture', 90, 44);
        cloudGraphics.destroy();

        this.cloudTiles = this.add.tileSprite(0, 120, GAME_WIDTH, 44, 'cloudTexture');
        this.cloudTiles.setOrigin(0, 0);

        // 2. Score Sparkle Particles
        const sparkGraphics = this.make.graphics({ x: 0, y: 0 });
        sparkGraphics.fillStyle(0xffd700, 1);
        sparkGraphics.fillCircle(4, 4, 4);
        sparkGraphics.generateTexture('sparkleTexture', 8, 8);
        sparkGraphics.destroy();

        this.scoreParticles = this.add.particles(0, 0, 'sparkleTexture', {
          speed: { min: 60, max: 180 },
          scale: { start: 1, end: 0 },
          lifespan: 600,
          gravityY: 100,
          emitting: false,
        });

        // 3. Obstacles Group
        this.obstacles = this.physics.add.group();

        // 4. Ground Layer
        const groundGraphics = this.make.graphics({ x: 0, y: 0 });
        groundGraphics.fillStyle(0x1a1c30, 1);
        groundGraphics.fillRect(0, 0, 40, GROUND_HEIGHT);
        // Festive stripes on ground
        groundGraphics.fillStyle(0xffd700, 0.7);
        groundGraphics.fillTriangle(0, 0, 15, 0, 0, 15);
        groundGraphics.fillTriangle(20, 0, 35, 0, 0, 35);
        groundGraphics.lineStyle(3, 0xffd700, 0.9);
        groundGraphics.lineBetween(0, 2, 40, 2);
        groundGraphics.generateTexture('groundTexture', 40, GROUND_HEIGHT);
        groundGraphics.destroy();

        this.groundTiles = this.add.tileSprite(
          0,
          GAME_HEIGHT - GROUND_HEIGHT,
          GAME_WIDTH,
          GROUND_HEIGHT,
          'groundTexture'
        );
        this.groundTiles.setOrigin(0, 0);
        this.physics.add.existing(this.groundTiles, true);

        // 5. Build Animated Player Character
        this.buildPlayerCharacter();

        // 6. Collisions
        this.physics.add.collider(this.player, this.groundTiles, () => {
          this.triggerGameOver();
        });

        this.physics.add.overlap(this.player, this.obstacles, () => {
          this.triggerGameOver();
        });

        // 7. Inputs
        this.input.on('pointerdown', () => this.handleJump());
        this.input.keyboard?.on('keydown-SPACE', () => this.handleJump());

        // Spawn timer
        this.obstacleTimer = this.time.addEvent({
          delay: 1700,
          callback: this.spawnObstaclePair,
          callbackScope: this,
          loop: true,
          paused: true,
        });
      }

      buildPlayerCharacter() {
        this.player = this.add.container(100, GAME_HEIGHT / 2 - 40);
        this.player.setSize(52, 52);
        this.physics.world.enable(this.player);
        this.playerPhysicsBody = this.player.body as Phaser.Physics.Arcade.Body;
        this.playerPhysicsBody.setCircle(24, 2, 2);
        this.playerPhysicsBody.setCollideWorldBounds(true);
        this.playerPhysicsBody.allowGravity = false;

        // Animated Cape behind player
        this.capeGraphic = this.add.graphics();
        this.player.add(this.capeGraphic);

        // Hero body aura
        const bodyAura = this.add.circle(0, 2, 26, 0xffd700, 0.25);
        this.player.add(bodyAura);

        // Flying body suit
        const bodySuit = this.add.ellipse(0, 10, 34, 26, 0x6a11cb, 1);
        this.player.add(bodySuit);

        // Birthday face
        const faceImg = this.add.image(0, -2, 'characterFace');
        faceImg.setDisplaySize(48, 48);
        this.player.add(faceImg);

        // Sparkle Party Hat
        const hat = this.add.triangle(0, -32, -14, 12, 14, 12, 0, -12, 0xff4081);
        const hatPomPom = this.add.circle(0, -44, 4, 0xffd700);
        this.player.add(hat);
        this.player.add(hatPomPom);

        // Floating idle tween before starting
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

        // Tilt up
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

        const gap = Math.max(145, 175 - Math.floor(this.currentScore / 3) * 5); // gradual challenge
        const speed = -(150 + Math.min(60, this.currentScore * 3));
        const minTop = 60;
        const maxTop = GAME_HEIGHT - GROUND_HEIGHT - gap - 60;
        const topHeight = Phaser.Math.Between(minTop, maxTop);
        const bottomY = topHeight + gap;
        const bottomHeight = GAME_HEIGHT - GROUND_HEIGHT - bottomY;

        // TOP CANDLE TOWER
        const topObstacle = this.createCandleTower(GAME_WIDTH + 40, 0, 56, topHeight, true);
        this.obstacles.add(topObstacle);
        const topBody = topObstacle.body as Phaser.Physics.Arcade.Body;
        topBody.setVelocityX(speed);
        topBody.setImmovable(true);
        topBody.allowGravity = false;

        // BOTTOM CANDLE TOWER
        const bottomObstacle = this.createCandleTower(GAME_WIDTH + 40, bottomY, 56, bottomHeight, false);
        this.obstacles.add(bottomObstacle);
        const bottomBody = bottomObstacle.body as Phaser.Physics.Arcade.Body;
        bottomBody.setVelocityX(speed);
        bottomBody.setImmovable(true);
        bottomBody.allowGravity = false;
      }

      createCandleTower(x: number, y: number, width: number, height: number, isTop: boolean) {
        const container = this.add.container(x, y);
        container.setSize(width, height);
        this.physics.world.enable(container);

        const g = this.add.graphics();
        // Candle Pillar Gradient/Colors
        const baseColor = isTop ? 0x7c3aed : 0xec4899;
        g.fillStyle(baseColor, 1);
        g.fillRoundedRect(0, 0, width, height, 10);

        // Candle Stripes
        g.fillStyle(0xffd700, 0.85);
        for (let py = 15; py < height; py += 32) {
          g.fillRect(4, py, width - 8, 10);
        }

        // Candle Rim
        g.lineStyle(2, 0xffffff, 0.4);
        g.strokeRoundedRect(0, 0, width, height, 10);

        // Candle Flame at tip
        const flameY = isTop ? height - 6 : 4;
        const flame = this.add.triangle(width / 2, flameY, -6, 10, 6, 10, 0, -8, 0xffa500);
        const flameInner = this.add.circle(width / 2, flameY + 4, 3, 0xffeb3b);

        container.add([g, flame, flameInner]);
        return container;
      }

      update(time: number) {
        // Parallax background movement
        if (this.currentGameState === 'PLAYING') {
          this.cloudTiles.tilePositionX += 0.35;
          this.groundTiles.tilePositionX += 2.6;

          // Animated cape fluttering
          this.capeWave += 0.25;
          this.capeGraphic.clear();
          this.capeGraphic.fillStyle(0xff3366, 0.95);
          const capeOffset = Math.sin(this.capeWave) * 6;
          this.capeGraphic.fillTriangle(-12, 6, -34 + capeOffset, 22, -14, 18);

          // Tilt down smoothly when falling
          if (this.playerPhysicsBody.velocity.y > 60) {
            this.player.angle = Math.min(65, this.player.angle + 2.4);
          }

          // Check scoring
          this.obstacles.getChildren().forEach((child) => {
            const obstacle = child as Phaser.GameObjects.Container;
            if (!this.passedPipes.has(obstacle) && obstacle.x + obstacle.width < this.player.x) {
              this.passedPipes.add(obstacle);
              // Each pair has 2 obstacles, so count score once per pair
              if (this.passedPipes.size % 2 === 0) {
                this.handleScore();
              }
            }

            // Cleanup offscreen obstacles
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

        // Emit celebration sparkles
        this.scoreParticles.emitParticleAt(this.player.x + 20, this.player.y, 8);

        if (this.currentScore > this.localBestScore) {
          this.localBestScore = this.currentScore;
          setBestScore(this.localBestScore);
          localStorage.setItem('birthday_flap_best', this.localBestScore.toString());
        }

        // Check Level Complete Goal!
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

        // Stop all moving obstacles
        this.obstacles.setVelocityX(0);
      }

      triggerLevelComplete() {
        this.currentGameState = 'COMPLETE';
        setGameState('COMPLETE');

        soundSystem.playVictory();
        this.obstacleTimer.paused = true;
        this.obstacles.setVelocityX(0);

        // Big Confetti burst
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#ffd700', '#ff4081', '#00e5ff', '#7c3aed'],
        });

        // Trigger callback to update arcade progress
        onLevelComplete(this.currentScore);
      }

      restartGame() {
        this.scene.restart();
        setGameState('IDLE');
        setScore(0);
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: '#0d0f1d',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [FlapScene],
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
      const scene = phaserGameRef.current.scene.getScene('FlapScene') as any;
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
      }}
    >
      {/* Top Bar Navigation & Info */}
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
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} />
            <span>Arcade Menu</span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffd700' }}>
            <Sparkles size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>LEVEL 1: BIRTHDAY FLAP</span>
          </div>
        )}

        {/* Best Score Trophy */}
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
      </div>

      {/* Phaser Canvas Container */}
      <div className="game-canvas-wrapper">
        <div ref={gameContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* In-Game Score Overlay Header */}
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
              fontFamily: 'Outfit, sans-serif',
              fontSize: '2.8rem',
              fontWeight: 900,
              color: '#ffffff',
              textShadow: '0 0 16px rgba(255, 215, 0, 0.8), 0 3px 6px rgba(0,0,0,0.8)',
              lineHeight: 1,
            }}
          >
            {score}
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              color: '#ffd700',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            Target: {levelGoal}
          </span>
        </div>

        {/* Tap to Start / Idle Banner */}
        {gameState === 'IDLE' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.35)',
              zIndex: 25,
              pointerEvents: 'none',
            }}
          >
            <div
              className="glass-panel"
              style={{
                padding: '16px 28px',
                textAlign: 'center',
                animation: 'bounce 1.5s infinite',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffd700', marginBottom: '4px' }}>
                TAP OR PRESS SPACE
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>Flap past 10 obstacles to unlock the Arcade!</p>
            </div>
          </div>
        )}

        {/* Game Over Modal Overlay */}
        {gameState === 'GAMEOVER' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(9, 10, 20, 0.88)',
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
              className="glass-panel"
              style={{
                padding: '32px 24px',
                width: '100%',
                maxWidth: '320px',
                border: '1px solid rgba(255, 64, 129, 0.4)',
                boxShadow: '0 12px 35px rgba(255, 64, 129, 0.25)',
              }}
            >
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ff4081', marginBottom: '12px' }}>
                GAME OVER
              </h2>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Score</span>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>{score}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Best Score</span>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#ffd700' }}>{bestScore}</span>
                </div>
              </div>

              <button
                onClick={handleRestart}
                className="btn-primary-glow"
                style={{ width: '100%', padding: '14px 20px', fontSize: '1.05rem' }}
              >
                <RotateCcw size={18} />
                <span>TRY AGAIN</span>
              </button>
            </div>
          </div>
        )}

        {/* Level 1 Complete Overlay */}
        {gameState === 'COMPLETE' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(9, 10, 20, 0.92)',
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
              className="glass-panel"
              style={{
                padding: '36px 24px',
                width: '100%',
                maxWidth: '340px',
                border: '1px solid rgba(255, 215, 0, 0.6)',
                boxShadow: '0 16px 45px rgba(255, 215, 0, 0.35)',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(255, 215, 0, 0.15)',
                  border: '2px solid #ffd700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 0 25px rgba(255, 215, 0, 0.5)',
                }}
              >
                <Trophy size={32} color="#ffd700" />
              </div>

              <h2
                className="gold-text-shimmer"
                style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}
              >
                Level 1 Complete!
              </h2>

              <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '24px' }}>
                You scored <strong style={{ color: '#ffd700' }}>{score}</strong>! The full Birthday Arcade has been
                unlocked.
              </p>

              <button
                onClick={() => {
                  soundSystem.playClick();
                  onLevelComplete(score);
                }}
                className="btn-primary-glow pulse-glow"
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  fontSize: '1.05rem',
                  marginBottom: '12px',
                }}
              >
                <span>ENTER BIRTHDAY ARCADE</span>
                <ChevronRight size={18} />
              </button>

              <button
                onClick={handleRestart}
                className="btn-secondary"
                style={{ width: '100%', padding: '10px 16px', fontSize: '0.9rem' }}
              >
                <RotateCcw size={16} />
                <span>Replay Flap</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control Helper for Mobile / Desktop */}
      <div
        style={{
          marginTop: '12px',
          color: '#94a3b8',
          fontSize: '0.82rem',
          textAlign: 'center',
        }}
      >
        Click anywhere, tap screen, or press <kbd style={{ background: '#1e2238', padding: '2px 6px', borderRadius: '4px', border: '1px solid #334155' }}>Space</kbd> to flap!
      </div>
    </div>
  );
};
