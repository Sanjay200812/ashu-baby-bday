import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, Star, CheckCircle } from 'lucide-react';
import { soundSystem } from '../../utils/audioSystem';

interface MemoryMatchGameProps {
  onComplete: (moves: number) => void;
  onBack: () => void;
}

interface Card {
  id: number;
  icon: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ICONS = [
  { icon: '🎂', name: 'Cake' },
  { icon: '🎁', name: 'Gift' },
  { icon: '🎈', name: 'Balloon' },
  { icon: '🧁', name: 'Cupcake' },
  { icon: '👑', name: 'Crown' },
  { icon: '🌟', name: 'Star' },
  { icon: '🥳', name: 'Party' },
  { icon: '🥂', name: 'Cheers' },
];

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onComplete, onBack }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [bestMoves, setBestMoves] = useState<number>(() => {
    return parseInt(localStorage.getItem('birthday_memory_best') || '0', 10);
  });

  const setupGame = () => {
    soundSystem.playClick();
    const paired = [...ICONS, ...ICONS];
    // Fisher-Yates shuffle
    for (let i = paired.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [paired[i], paired[j]] = [paired[j], paired[i]];
    }

    const initialCards: Card[] = paired.map((item, index) => ({
      id: index,
      icon: item.icon,
      name: item.name,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initialCards);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setSeconds(0);
    setIsTimerRunning(false);
    setIsCompleted(false);
  };

  useEffect(() => {
    setupGame();
  }, []);

  // Timer
  useEffect(() => {
    let interval: number;
    if (isTimerRunning && !isCompleted) {
      interval = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isCompleted]);

  const handleCardClick = (id: number) => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    const clickedCard = cards[id];
    if (clickedCard.isFlipped || clickedCard.isMatched || flippedCards.length >= 2) {
      return;
    }

    soundSystem.playCardFlip();

    // Flip card
    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = newCards[firstId];
      const secondCard = newCards[secondId];

      if (firstCard.icon === secondCard.icon) {
        // MATCH!
        setTimeout(() => {
          soundSystem.playScore();
          newCards[firstId].isMatched = true;
          newCards[secondId].isMatched = true;
          setCards([...newCards]);
          setFlippedCards([]);
          const newPairs = matchedPairs + 1;
          setMatchedPairs(newPairs);

          // All pairs matched!
          if (newPairs === ICONS.length) {
            handleGameWin(moves + 1);
          }
        }, 350);
      } else {
        // MISMATCH - Flip back
        setTimeout(() => {
          newCards[firstId].isFlipped = false;
          newCards[secondId].isFlipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  const handleGameWin = (totalMoves: number) => {
    setIsCompleted(true);
    setIsTimerRunning(false);
    soundSystem.playVictory();

    const currentBest = parseInt(localStorage.getItem('birthday_memory_best') || '0', 10);
    if (currentBest === 0 || totalMoves < currentBest) {
      localStorage.setItem('birthday_memory_best', totalMoves.toString());
      setBestMoves(totalMoves);
    }

    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.5 },
    });

    onComplete(totalMoves);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getStars = () => {
    if (moves <= 14) return 3;
    if (moves <= 20) return 2;
    return 1;
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

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
            Time: <strong style={{ color: '#fff' }}>{formatTime(seconds)}</strong>
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
            Moves: <strong style={{ color: '#ffd700' }}>{moves}</strong>
          </div>
        </div>

        {bestMoves > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#ffd700',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            <Trophy size={15} />
            <span>{bestMoves}</span>
          </div>
        )}
      </div>

      {/* 4x4 Cards Grid */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          position: 'relative',
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            style={{
              aspectRatio: '1/1',
              perspective: '1000px',
              cursor: card.isMatched || card.isFlipped ? 'default' : 'pointer',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Card Back */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, #1e2238 0%, #151728 100%)',
                  border: '1.5px solid rgba(255, 215, 0, 0.25)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                }}
              >
                <span style={{ fontSize: '1.4rem', opacity: 0.7 }}>✨</span>
              </div>

              {/* Card Front */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: card.isMatched
                    ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%)'
                    : 'linear-gradient(135deg, #2a2046 0%, #1f1836 100%)',
                  border: card.isMatched ? '2px solid #4ade80' : '2px solid #ffd700',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  boxShadow: card.isMatched ? '0 0 15px rgba(74, 222, 128, 0.4)' : '0 0 15px rgba(255, 215, 0, 0.3)',
                }}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}

        {/* Completion Modal */}
        {isCompleted && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(9, 10, 20, 0.94)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
              zIndex: 30,
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255, 215, 0, 0.15)',
                border: '2px solid #ffd700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <CheckCircle size={32} color="#ffd700" />
            </div>

            <h2 className="gold-text-shimmer" style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>
              Pairs Matched!
            </h2>

            {/* Stars */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  size={26}
                  fill={s <= getStars() ? '#ffd700' : 'none'}
                  color={s <= getStars() ? '#ffd700' : '#475569'}
                />
              ))}
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '24px' }}>
              Completed in <strong style={{ color: '#fff' }}>{moves} moves</strong> ({formatTime(seconds)})!
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

            <button
              onClick={setupGame}
              className="btn-secondary"
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
            >
              <RotateCcw size={16} />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: '16px', color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center' }}>
        Find all 8 matching birthday pairs in the fewest moves!
      </div>
    </div>
  );
};

