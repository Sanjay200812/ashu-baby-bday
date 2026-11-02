import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Terminal, CheckCircle2, XCircle, ChevronRight, Sparkles, ArrowLeft, RotateCcw } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';
import { ControlInstructionModal } from '../common/ControlInstructionModal';

interface GamingQuizProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

export const GamingQuiz: React.FC<GamingQuizProps> = ({ onComplete, onBack }) => {
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  // Exactly 3 questions
  const questions = BIRTHDAY_CONFIG.gamingQuiz.slice(0, 3);
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

  const handleRetryQuestion = () => {
    soundSystem.playClick();
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleNext = () => {
    soundSystem.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      soundSystem.playVictory();
      confetti({
        particleCount: 160,
        spread: 90,
        colors: ['#ff2a4b', '#ffb703', '#ffffff', '#ff1744'],
      });
      onComplete(3);
    }
  };

  const isCorrectAnswer = selectedOption === currentQ.correctIndex;

  // Dynamic roast for the EXACT chosen option
  const selectedRoast =
    selectedOption !== null && currentQ.optionRoasts && currentQ.optionRoasts[selectedOption]
      ? currentQ.optionRoasts[selectedOption]
      : isCorrectAnswer
      ? currentQ.correctRoast
      : currentQ.tenglishRoast;

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '640px',
        margin: '0 auto',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        fontFamily: 'var(--font-mono)',
        backgroundColor: 'transparent',
      }}
    >
      {/* Control Instruction Modal in Tenglish */}
      {showInstructions && (
        <ControlInstructionModal
          levelNumber={4}
          levelTitle="FREE FIRE & GTA 5 VERIFICATION"
          objective="3 gaming questions ki correct answer chesi pro status prove chey!"
          desktopControls="MOUSE tho option click chey."
          mobileControls="Screen meedha TAP chesi answer select chey."
          tip="Prathi answer tarwatha Aakash & Sanjay nunchi funny roast untadi! All answers must be correct!"
          badgeIcon="🎯"
          onStartGame={() => setShowInstructions(false)}
        />
      )}

      {/* Top Header */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
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
            <span>LEVEL 4 // FREE FIRE & GTA 5 QUIZ</span>
          </div>
        </div>

        <div style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 700 }}>
          CLEARED: <span style={{ color: '#ffb703' }}>{score}</span> / {questions.length}
        </div>
      </div>

      {/* Main Card */}
      <div
        className="terminal-panel"
        style={{
          width: '100%',
          border: '1.5px solid #ff2a4b',
          boxShadow: '0 0 35px rgba(255, 42, 75, 0.35)',
          borderRadius: '10px',
          overflow: 'hidden',
          padding: '24px 20px',
        }}
      >
        {/* Progress & Badge */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#ffb703',
              background: 'rgba(255, 183, 3, 0.1)',
              border: '1px solid #ffb703',
              borderRadius: '20px',
              padding: '4px 14px',
            }}
          >
            QUESTION {currentIndex + 1} OF {questions.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9e646d' }}>
            ALL ANSWERS MUST BE CORRECT
          </div>
        </div>

        {/* Question Text */}
        <h2
          style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.45,
            marginBottom: '20px',
          }}
        >
          {currentQ.question}
        </h2>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {currentQ.options.map((option, idx) => {
            let borderCol = 'rgba(255, 255, 255, 0.12)';
            let bgCol = 'rgba(255, 255, 255, 0.03)';
            let textCol = '#fff';

            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                borderCol = '#ffb703';
                bgCol = 'rgba(255, 183, 3, 0.15)';
                textCol = '#ffb703';
              } else if (idx === selectedOption) {
                borderCol = '#ff2a4b';
                bgCol = 'rgba(255, 42, 75, 0.15)';
                textCol = '#ff2a4b';
              } else {
                borderCol = 'rgba(255, 255, 255, 0.06)';
                textCol = '#777';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 16px',
                  borderRadius: '6px',
                  background: bgCol,
                  border: `1.5px solid ${borderCol}`,
                  color: textCol,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: isAnswered ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{option}</span>
                {isAnswered && idx === currentQ.correctIndex && (
                  <CheckCircle2 size={18} color="#ffb703" />
                )}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                  <XCircle size={18} color="#ff2a4b" />
                )}
              </button>
            );
          })}
        </div>

        {/* Roast Reaction Box */}
        {isAnswered && (
          <div
            style={{
              background: isCorrectAnswer
                ? 'rgba(255, 183, 3, 0.08)'
                : 'rgba(255, 42, 75, 0.08)',
              border: `1px solid ${isCorrectAnswer ? '#ffb703' : '#ff2a4b'}`,
              borderRadius: '8px',
              padding: '14px 16px',
              marginBottom: '20px',
              animation: 'fadeIn 0.25s ease-out',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: isCorrectAnswer ? '#ffb703' : '#ff2a4b',
                marginBottom: '6px',
              }}
            >
              <Sparkles size={14} />
              <span>{isCorrectAnswer ? 'CORRECT REACTION:' : 'INCORRECT // ROAST:'}</span>
            </div>

            <div
              style={{
                fontSize: '0.92rem',
                lineHeight: 1.5,
                color: '#fff',
                fontStyle: 'italic',
              }}
            >
              "{selectedRoast}"
            </div>
            {!isCorrectAnswer && (
              <div style={{ color: '#ff2a4b', fontSize: '0.78rem', marginTop: '6px', fontWeight: 700 }}>
                ⚠️ Level lock: Wrong answer! You must answer correctly to proceed!
              </div>
            )}
          </div>
        )}

        {/* Action Button: Retry Question if wrong, Next/Proceed if correct */}
        {isAnswered && (
          <div>
            {!isCorrectAnswer ? (
              <button
                onClick={handleRetryQuestion}
                className="btn-cyber-primary pulse-cyber"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                }}
              >
                <RotateCcw size={16} />
                <span>[ TRY QUESTION AGAIN 🔄 ]</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn-cyber-primary pulse-cyber"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                }}
              >
                <span>
                  {currentIndex + 1 < questions.length
                    ? 'NEXT QUESTION ➔'
                    : 'PROCEED TO NEXT LEVEL ➔'}
                </span>
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamingQuiz;
