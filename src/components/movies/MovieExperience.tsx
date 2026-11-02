import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Film, Trophy, Clapperboard, Sparkles, ChevronRight, RotateCcw, Gift } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface MovieExperienceProps {
  onComplete: (score: number) => void;
  onBack: () => void;
  onOpenSurprise: () => void;
}

export const MovieExperience: React.FC<MovieExperienceProps> = ({ onComplete, onBack, onOpenSurprise }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const questions = BIRTHDAY_CONFIG.movieQuiz;
  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      soundSystem.playScore();
      setScore((s) => s + 1);
    } else {
      soundSystem.playHit();
    }
  };

  const handleNext = () => {
    soundSystem.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Completed!
      setIsCompleted(true);
      soundSystem.playVictory();
      confetti({ particleCount: 110, spread: 80 });
      onComplete(score + (selectedOption === currentQ.correctIndex ? 1 : 0));
    }
  };

  const handleRestart = () => {
    soundSystem.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsAnswered(false);
    setIsCompleted(false);
  };

  const getCinephileTitle = () => {
    if (score >= 5) return { title: '🎬 OSCAR-LEVEL CINEPHILE MASTER', color: '#ffd700' };
    if (score >= 4) return { title: '🍿 CERTIFIED FILM BUFF', color: '#00e5ff' };
    return { title: '🎟️ CASUAL MOVIE ENTHUSIAST', color: '#cbd5e1' };
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto',
        padding: '36px 16px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
      }}
    >
      {/* Top Header */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => {
            soundSystem.playClick();
            onBack();
          }}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>Arcade Menu</span>
        </button>

        <div style={{ color: '#ffd700', fontWeight: 800, fontSize: '0.9rem' }}>
          🍿 CINEPHILE SCORE: {score} / {questions.length}
        </div>
      </div>

      {!isCompleted ? (
        <div
          className="glass-panel"
          style={{
            width: '100%',
            padding: '36px 28px',
            border: '1px solid rgba(255, 215, 0, 0.45)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(255, 215, 0, 0.15)',
            position: 'relative',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 215, 0, 0.15)',
              border: '1px solid #ffd700',
              borderRadius: '9999px',
              padding: '4px 14px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#ffd700',
              marginBottom: '18px',
            }}
          >
            <Clapperboard size={14} />
            <span>MOVIE LOVER CHALLENGE • {currentIndex + 1} OF {questions.length}</span>
          </div>

          {/* Emoji Clue Banner */}
          <div
            style={{
              background: 'rgba(15, 17, 30, 0.85)',
              border: '1px solid rgba(255, 215, 0, 0.25)',
              borderRadius: '16px',
              padding: '18px',
              textAlign: 'center',
              marginBottom: '22px',
            }}
          >
            <div style={{ fontSize: '2.4rem', letterSpacing: '0.25em', marginBottom: '8px' }}>
              {currentQ.emojiClue}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Guess The Film From The Clues
            </div>
          </div>

          {/* Clues bullet points */}
          <div style={{ marginBottom: '24px' }}>
            {currentQ.clues.map((clue, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  color: '#e2e8f0',
                  fontSize: '0.94rem',
                  lineHeight: 1.5,
                  marginBottom: '8px',
                }}
              >
                <span style={{ color: '#ffd700' }}>•</span>
                <span>{clue}</span>
              </div>
            ))}
          </div>

          {/* Options Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {currentQ.options.map((opt, idx) => {
              let bg = 'rgba(255, 255, 255, 0.06)';
              let border = '1px solid rgba(255, 255, 255, 0.14)';
              let textColor = '#fff';

              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  bg = 'rgba(34, 197, 94, 0.25)';
                  border = '1px solid #22c55e';
                  textColor = '#4ade80';
                } else if (idx === selectedOption) {
                  bg = 'rgba(239, 68, 68, 0.25)';
                  border = '1px solid #ef4444';
                  textColor = '#f87171';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  style={{
                    padding: '14px 12px',
                    borderRadius: '12px',
                    background: bg,
                    border,
                    color: textColor,
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: isAnswered ? 'default' : 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Fun Fact Toast */}
          {isAnswered && (
            <div
              style={{
                background: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '20px',
                fontSize: '0.88rem',
                color: '#fef08a',
              }}
            >
              🎬 <strong>Did you know?</strong> {currentQ.funFact}
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <button
              onClick={handleNext}
              className="btn-primary-glow"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              <span>{currentIndex + 1 === questions.length ? 'SEE CINEPHILE RESULTS' : 'NEXT MOVIE'}</span>
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      ) : (
        /* Results Card */
        <div
          className="glass-panel"
          style={{
            width: '100%',
            padding: '40px 28px',
            textAlign: 'center',
            border: '1px solid rgba(255, 215, 0, 0.5)',
          }}
        >
          <div style={{ fontSize: '3.6rem', marginBottom: '12px' }}>🎬</div>

          <h2 className="gold-text-shimmer" style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '8px' }}>
            Movie Challenge Conquered!
          </h2>

          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: getCinephileTitle().color, marginBottom: '16px' }}>
            {getCinephileTitle().title}
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '32px' }}>
            You identified <strong style={{ color: '#ffd700' }}>{score} / {questions.length}</strong> blockbuster films! Time for the main birthday event.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                soundSystem.playClick();
                onOpenSurprise();
              }}
              className="btn-primary-glow pulse-glow"
              style={{ padding: '14px 30px' }}
            >
              <Gift size={18} fill="#120d02" />
              <span>OPEN FINAL BIRTHDAY CARD</span>
              <ChevronRight size={18} />
            </button>

            <button onClick={handleRestart} className="btn-secondary" style={{ padding: '14px 22px' }}>
              <RotateCcw size={16} />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
