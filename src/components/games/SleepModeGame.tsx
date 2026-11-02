import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, Zap, Clock, CheckCircle2, Bed } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface SleepModeGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

export const SleepModeGame: React.FC<SleepModeGameProps> = ({ onComplete, onBack }) => {
  const [drowsiness, setDrowsiness] = useState<number>(20);
  const [score, setScore] = useState<number>(0);
  const [awakeSeconds, setAwakeSeconds] = useState<number>(0);
  const [activeAlert, setActiveAlert] = useState<{ id: number; text: string; icon: string } | null>(null);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE'>('IDLE');
  const [bestScore, setBestScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('birthday_sleep_best') || '0', 10);
  });

  const TARGET_SECONDS = 30; // Stay awake 30s to win

  const stateRef = useRef({
    drowsiness: 20,
    score: 0,
    awakeSeconds: 0,
    gameState: 'IDLE' as 'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE',
    alertTimeout: null as number | null,
  });

  const WAKE_ALERTS = [
    { text: 'Alarm 1 of 8 ringing!', icon: '⏰' },
    { text: 'Aakash spilled cold coffee!', icon: '☕' },
    { text: 'Sanjay shouting: Wake up bro!', icon: '📢' },
    { text: 'Professor asks a question!', icon: '🧑‍🏫' },
    { text: 'Free food arrived!', icon: '🍕' },
  ];

  const startGame = () => {
    soundSystem.playClick();
    const s = stateRef.current;
    s.drowsiness = 20;
    s.score = 0;
    s.awakeSeconds = 0;
    s.gameState = 'PLAYING';

    setDrowsiness(20);
    setScore(0);
    setAwakeSeconds(0);
    setActiveAlert(null);
    setGameState('PLAYING');
  };

  const handleWakeUpClick = () => {
    const s = stateRef.current;
    if (s.gameState !== 'PLAYING') return;

    soundSystem.playJump();
    s.drowsiness = Math.max(0, s.drowsiness - 22);
    s.score += 10;
    setDrowsiness(s.drowsiness);
    setScore(s.score);

    // If an alert was active, reward bonus!
    if (activeAlert) {
      soundSystem.playScore();
      s.score += 20;
      setScore(s.score);
      setActiveAlert(null);
    }
  };

  // Main game tick: Drowsiness climbs continuously
  useEffect(() => {
    let tickInterval: number;
    if (gameState === 'PLAYING') {
      tickInterval = window.setInterval(() => {
        const s = stateRef.current;
        // Drowsiness rate speeds up over time
        const rate = 1.6 + Math.min(2.5, s.awakeSeconds * 0.08);
        s.drowsiness += rate;
        setDrowsiness(Math.floor(s.drowsiness));

        // Random wake alert
        if (!activeAlert && Math.random() < 0.25) {
          const alert = WAKE_ALERTS[Math.floor(Math.random() * WAKE_ALERTS.length)];
          setActiveAlert({ id: Date.now(), ...alert });
          soundSystem.playCardFlip();
        }

        // Check if fell asleep
        if (s.drowsiness >= 100) {
          s.gameState = 'GAMEOVER';
          setGameState('GAMEOVER');
          soundSystem.playHit();

          const currentBest = parseInt(localStorage.getItem('birthday_sleep_best') || '0', 10);
          if (s.score > currentBest) {
            localStorage.setItem('birthday_sleep_best', s.score.toString());
            setBestScore(s.score);
          }
        }
      }, 200);
    }
    return () => clearInterval(tickInterval);
  }, [gameState, activeAlert]);

  // Second timer for win condition
  useEffect(() => {
    let timer: number;
    if (gameState === 'PLAYING') {
      timer = window.setInterval(() => {
        const s = stateRef.current;
        s.awakeSeconds += 1;
        setAwakeSeconds(s.awakeSeconds);

        if (s.awakeSeconds >= TARGET_SECONDS && s.gameState !== 'COMPLETE') {
          s.gameState = 'COMPLETE';
          setGameState('COMPLETE');
          soundSystem.playVictory();
          confetti({ particleCount: 110, spread: 80 });

          const currentBest = parseInt(localStorage.getItem('birthday_sleep_best') || '0', 10);
          if (s.score > currentBest) {
            localStorage.setItem('birthday_sleep_best', s.score.toString());
            setBestScore(s.score);
          }
          onComplete(s.score);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, onComplete]);

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

        <div style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.9rem' }}>
          ⏱️ AWAKE: {awakeSeconds}s / {TARGET_SECONDS}s
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

      {/* Main Interactive Stage */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '560px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 20px',
          border: '1px solid rgba(129, 140, 248, 0.3)',
        }}
      >
        {/* Eyelid Vignette Over Screen representing Drowsiness */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle, transparent ${Math.max(10, 80 - drowsiness * 0.7)}%, rgba(5, 7, 20, ${drowsiness / 100}) 100%)`,
            pointerEvents: 'none',
            zIndex: 5,
            transition: 'background 0.2s ease',
          }}
        />

        {/* Top HUD: Drowsiness Meter */}
        <div style={{ width: '100%', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: drowsiness > 70 ? '#ef4444' : '#818cf8' }}>
              {drowsiness > 70 ? '😴 Drowsiness Critical!' : '💤 Drowsiness Meter'}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>{Math.min(100, Math.floor(drowsiness))}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.min(100, drowsiness)}%`,
                height: '100%',
                background: drowsiness > 70 ? '#ef4444' : drowsiness > 40 ? '#f59e0b' : '#6366f1',
                transition: 'width 0.2s',
              }}
            />
          </div>
        </div>

        {/* Middle: Floating Zzz & Sleeping Photo Preview */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
            margin: 'auto 0',
          }}
        >
          {/* Sleeping Photo Avatar */}
          <div
            style={{
              position: 'relative',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #818cf8',
              boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)',
              marginBottom: '16px',
            }}
          >
            <img
              src={BIRTHDAY_CONFIG.sleepingPhotoUrl}
              alt="Sleeping"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Floating Zzz */}
          <div
            style={{
              fontSize: '1.8rem',
              color: '#818cf8',
              fontWeight: 800,
              fontFamily: 'monospace',
              animation: 'bounce 1.5s infinite',
            }}
          >
            {drowsiness > 50 ? 'Z z Z . . .' : 'Keep fighting!'}
          </div>

          {/* Active Alert Toast */}
          {activeAlert && (
            <div
              style={{
                marginTop: '12px',
                background: 'rgba(239, 68, 68, 0.25)',
                border: '1px solid #ef4444',
                borderRadius: '12px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#fff',
                fontSize: '0.88rem',
                fontWeight: 700,
                animation: 'pulse 0.8s infinite',
              }}
            >
              <span>{activeAlert.icon}</span>
              <span>{activeAlert.text}</span>
            </div>
          )}
        </div>

        {/* Big WAKE UP Button */}
        <div style={{ width: '100%', zIndex: 10 }}>
          <button
            onClick={handleWakeUpClick}
            className="btn-primary-glow pulse-glow"
            style={{
              width: '100%',
              padding: '18px',
              fontSize: '1.25rem',
              background: 'linear-gradient(135deg, #ffd700 0%, #6366f1 100%)',
              color: '#ffffff',
            }}
          >
            <Zap size={22} fill="#ffffff" />
            <span>FIGHT SLEEP! (TAP)</span>
          </button>
        </div>

        {/* Start Game Modal */}
        {gameState === 'IDLE' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10, 11, 20, 0.88)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
              zIndex: 20,
            }}
          >
            <div className="glass-panel" style={{ padding: '32px 24px', maxWidth: '320px', width: '100%' }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>😴</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#818cf8', marginBottom: '8px' }}>
                Sleep Mode Challenge
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '24px', lineHeight: 1.5 }}>
                Tap fast to fight drowsiness and stay awake for {TARGET_SECONDS} seconds! Don't let your eyes close!
              </p>
              <button
                onClick={startGame}
                className="btn-primary-glow pulse-glow"
                style={{ width: '100%', padding: '14px', fontSize: '1.1rem', background: '#6366f1' }}
              >
                STAY AWAKE
              </button>
            </div>
          </div>
        )}

        {/* Game Over Modal with Funny Sleeping Photo Reaction */}
        {gameState === 'GAMEOVER' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10, 11, 20, 0.94)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
              zIndex: 25,
            }}
          >
            <div className="glass-panel" style={{ padding: '32px 24px', maxWidth: '320px', width: '100%' }}>
              {/* Photo */}
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '0 auto 12px',
                  border: '3px solid #818cf8',
                }}
              >
                <img
                  src={BIRTHDAY_CONFIG.sleepingPhotoUrl}
                  alt="Sleeping"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <h2 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#818cf8', marginBottom: '6px' }}>
                OUT COLD! 💤
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', marginBottom: '20px' }}>
                14-hour nap mode engaged! Bro could sleep through the apocalypse.
              </p>
              <button
                onClick={startGame}
                className="btn-primary-glow"
                style={{ width: '100%', padding: '14px', fontSize: '1.05rem', background: '#6366f1' }}
              >
                <RotateCcw size={18} />
                <span>WAKE UP & TRY AGAIN</span>
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
              background: 'rgba(10, 11, 20, 0.94)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
              zIndex: 25,
            }}
          >
            <div className="glass-panel" style={{ padding: '36px 24px', maxWidth: '340px', width: '100%' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(129, 140, 248, 0.2)',
                  border: '2px solid #818cf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckCircle2 size={32} color="#818cf8" />
              </div>
              <h2 className="gold-text-shimmer" style={{ fontSize: '1.7rem', fontWeight: 900, marginBottom: '8px' }}>
                Wide Awake Legend!
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '24px' }}>
                Defeated the drowsiness monster for a full 30 seconds! Score: <strong style={{ color: '#ffd700' }}>{score}</strong>.
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
        Keep tapping "FIGHT SLEEP!" to lower drowsiness before the timer runs out!
      </div>
    </div>
  );
};
