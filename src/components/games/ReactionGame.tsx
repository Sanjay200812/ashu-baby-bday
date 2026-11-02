import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, Zap, AlertTriangle } from 'lucide-react';
import { soundSystem } from '../../utils/audioSystem';

interface ReactionGameProps {
  onComplete: (ms: number) => void;
  onBack: () => void;
}

type TestState = 'IDLE' | 'WAITING' | 'CLICK' | 'EARLY' | 'RESULT';

export const ReactionGame: React.FC<ReactionGameProps> = ({ onComplete, onBack }) => {
  const [state, setState] = useState<TestState>('IDLE');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestMs, setBestMs] = useState<number>(() => {
    return parseInt(localStorage.getItem('birthday_reaction_best') || '0', 10);
  });
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  const startTest = () => {
    soundSystem.playClick();
    setState('WAITING');
    setReactionTime(null);

    // Random suspense delay between 1.8s and 4.2s
    const delay = Math.random() * 2400 + 1800;
    timeoutRef.current = window.setTimeout(() => {
      startTimeRef.current = performance.now();
      setState('CLICK');
      soundSystem.playScore();
    }, delay);
  };

  const handleAreaClick = () => {
    if (state === 'WAITING') {
      // Clicked too early!
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('EARLY');
      soundSystem.playHit();
    } else if (state === 'CLICK') {
      // Successful tap!
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(elapsed);
      setState('RESULT');
      soundSystem.playVictory();

      const currentBest = parseInt(localStorage.getItem('birthday_reaction_best') || '0', 10);
      if (currentBest === 0 || elapsed < currentBest) {
        localStorage.setItem('birthday_reaction_best', elapsed.toString());
        setBestMs(elapsed);
      }

      if (elapsed < 380) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      }

      onComplete(elapsed);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getRank = (ms: number) => {
    if (ms < 220) return { title: '⚡ Godspeed Birthday Legend!', color: '#ffd700' };
    if (ms < 300) return { title: '🎉 Lightning Reflexes!', color: '#00e5ff' };
    if (ms < 420) return { title: '🎂 Sweet & Steady Party Champ!', color: '#e040fb' };
    return { title: '🍰 Relaxed Chill Mode!', color: '#94a3b8' };
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
      {/* Top Header */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
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

        {bestMs > 0 && (
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
            <span>BEST: {bestMs} ms</span>
          </div>
        )}
      </div>

      {/* Interactive Reaction Surface */}
      <div
        onClick={handleAreaClick}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '460px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          textAlign: 'center',
          cursor: state === 'WAITING' || state === 'CLICK' ? 'pointer' : 'default',
          transition: 'all 0.25s ease',
          background:
            state === 'WAITING'
              ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.25) 0%, rgba(185, 28, 28, 0.15) 100%)'
              : state === 'CLICK'
              ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.4) 0%, rgba(34, 197, 94, 0.25) 100%)'
              : 'rgba(24, 27, 44, 0.7)',
          borderColor:
            state === 'WAITING' ? '#ef4444' : state === 'CLICK' ? '#4ade80' : 'rgba(255, 215, 0, 0.25)',
          boxShadow:
            state === 'CLICK'
              ? '0 0 45px rgba(74, 222, 128, 0.5), inset 0 0 30px rgba(74, 222, 128, 0.2)'
              : '0 12px 40px rgba(0,0,0,0.5)',
        }}
      >
        {state === 'IDLE' && (
          <div>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>⚡</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffd700', marginBottom: '12px' }}>
              Birthday Reflex Test
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '28px', lineHeight: 1.6 }}>
              When the screen turns green and the Birthday Cake appears, TAP as fast as you can!
            </p>
            <button onClick={startTest} className="btn-primary-glow pulse-glow" style={{ padding: '14px 36px' }}>
              <Zap size={18} />
              <span>START TEST</span>
            </button>
          </div>
        )}

        {state === 'WAITING' && (
          <div>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px', animation: 'pulse 1s infinite' }}>⏳</div>
            <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ef4444', marginBottom: '8px' }}>
              WAIT FOR IT...
            </h2>
            <p style={{ color: '#fca5a5', fontSize: '0.95rem' }}>Don't tap yet! Wait for the cake...</p>
          </div>
        )}

        {state === 'CLICK' && (
          <div>
            <div style={{ fontSize: '4.5rem', marginBottom: '12px', animation: 'bounce 0.6s infinite' }}>🎂</div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4ade80', marginBottom: '6px' }}>TAP NOW!</h1>
            <p style={{ color: '#bbf7d0', fontSize: '1rem', fontWeight: 600 }}>TOUCH ANYWHERE!</p>
          </div>
        )}

        {state === 'EARLY' && (
          <div>
            <AlertTriangle size={56} color="#ef4444" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ef4444', marginBottom: '8px' }}>Too Soon!</h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '24px' }}>
              You jumped the gun before the cake appeared!
            </p>
            <button onClick={startTest} className="btn-primary-glow" style={{ padding: '12px 28px' }}>
              <RotateCcw size={16} />
              <span>TRY AGAIN</span>
            </button>
          </div>
        )}

        {state === 'RESULT' && reactionTime !== null && (
          <div>
            <div style={{ fontSize: '1rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Reaction Time
            </div>
            <div
              className="gold-text-shimmer"
              style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, margin: '8px 0 12px' }}
            >
              {reactionTime} <span style={{ fontSize: '1.5rem' }}>ms</span>
            </div>

            <div
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: getRank(reactionTime).color,
                marginBottom: '28px',
              }}
            >
              {getRank(reactionTime).title}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={startTest} className="btn-primary-glow" style={{ padding: '12px 24px' }}>
                <RotateCcw size={16} />
                <span>Test Again</span>
              </button>
              <button
                onClick={() => {
                  soundSystem.playClick();
                  onBack();
                }}
                className="btn-secondary"
                style={{ padding: '12px 20px' }}
              >
                Arcade
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '16px', color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center' }}>
        Measure how quickly you react when the birthday cake appears!
      </div>
    </div>
  );
};
