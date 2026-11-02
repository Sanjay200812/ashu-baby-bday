import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle2, Laugh, Trophy, ChevronRight, RotateCcw } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface PersonalQuizProps {
  onComplete: (score: number) => void;
  onBack: () => void;
  onNextSection?: () => void;
}

export const PersonalQuiz: React.FC<PersonalQuizProps> = ({ onComplete, onBack, onNextSection }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const questions = BIRTHDAY_CONFIG.personalQuiz;
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

        <div style={{ color: '#e040fb', fontWeight: 800, fontSize: '0.9rem' }}>
          FUN SCORE: {score} / {questions.length}
        </div>
      </div>

      {!isCompleted ? (
        <div
          className="glass-panel"
          style={{
            width: '100%',
            padding: '36px 28px',
            border: '1px solid rgba(224, 64, 251, 0.4)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 35px rgba(224, 64, 251, 0.2)',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(224, 64, 251, 0.15)',
              border: '1px solid #e040fb',
              borderRadius: '9999px',
              padding: '4px 14px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#e040fb',
              marginBottom: '16px',
            }}
          >
            <Laugh size={14} />
            <span>AAKASH & SANJAY'S ROAST • {currentIndex + 1} OF {questions.length}</span>
          </div>

          {/* Question Text */}
          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.45,
              marginBottom: '24px',
            }}
          >
            {currentQ.question}
          </h2>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
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
                    padding: '14px 18px',
                    borderRadius: '14px',
                    background: bg,
                    border,
                    color: textColor,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: isAnswered ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === currentQ.correctIndex && <CheckCircle2 size={18} color="#22c55e" />}
                </button>
              );
            })}
          </div>

          {/* Explanation / Joke */}
          {isAnswered && (
            <div
              style={{
                background: 'rgba(224, 64, 251, 0.12)',
                border: '1px solid rgba(224, 64, 251, 0.35)',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '20px',
                fontSize: '0.88rem',
                color: '#f0abfc',
              }}
            >
              😂 {currentQ.explanation}
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <button
              onClick={handleNext}
              className="btn-primary-glow"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', background: '#e040fb' }}
            >
              <span>{currentIndex + 1 === questions.length ? 'VIEW FRIENDSHIP RATING' : 'NEXT ROAST'}</span>
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      ) : (
        /* Final Friendship Result */
        <div
          className="glass-panel"
          style={{
            width: '100%',
            padding: '40px 28px',
            textAlign: 'center',
            border: '1px solid rgba(224, 64, 251, 0.5)',
          }}
        >
          <div style={{ fontSize: '3.8rem', marginBottom: '12px' }}>🤝</div>

          <h2 className="gold-text-shimmer" style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '8px' }}>
            Friendship Quotient: 1000%
          </h2>

          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e040fb', marginBottom: '16px' }}>
            CERTIFIED BEST BRO OF THE YEAR
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '32px', lineHeight: 1.6 }}>
            Scored <strong style={{ color: '#ffd700' }}>{score} / {questions.length}</strong>! Verified and stamped with brotherly love by Aakash and Sanjay.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {onNextSection && (
              <button onClick={onNextSection} className="btn-primary-glow pulse-glow" style={{ padding: '14px 28px' }}>
                <span>PLAY MOVIE LOVER CHALLENGE</span>
                <ChevronRight size={18} />
              </button>
            )}
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
