import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle2, Laugh, ChevronRight, RotateCcw, AlertTriangle } from 'lucide-react';
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
      setIsCompleted(true);
      soundSystem.playVictory();
      confetti({ particleCount: 110, spread: 80, colors: ['#ff3344', '#00ff66', '#ffd700'] });
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
        fontFamily: 'var(--font-mono)',
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
          className="btn-cyber-secondary"
          style={{ padding: '8px 16px', fontSize: '0.82rem' }}
        >
          <ArrowLeft size={16} />
          <span>[ ARCADE_HUB ]</span>
        </button>

        <div style={{ color: '#ff3344', fontWeight: 800, fontSize: '0.88rem' }}>
          INTERROGATION SCORE: {score} / {questions.length}
        </div>
      </div>

      {!isCompleted ? (
        <div
          className="terminal-panel"
          style={{
            width: '100%',
            overflow: 'hidden',
            border: '1px solid rgba(255, 51, 68, 0.45)',
          }}
        >
          {/* Terminal Header */}
          <div className="terminal-header-bar" style={{ background: 'rgba(255, 51, 68, 0.1)', color: '#ff3344' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={15} color="#ff3344" />
              <span>PERSONAL DATA INTERROGATION</span>
            </div>
            <div>SUSPECT: ASHU // CASE #{currentIndex + 1}</div>
          </div>

          <div style={{ padding: '32px 24px' }}>
            {/* Question */}
            <h2
              style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#e2fce8',
                lineHeight: 1.5,
                marginBottom: '24px',
              }}
            >
              &gt; {currentQ.question}
            </h2>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {currentQ.options.map((opt, idx) => {
                let bg = 'rgba(255, 51, 68, 0.04)';
                let border = '1px solid rgba(255, 51, 68, 0.2)';
                let textColor = '#cbd5e1';

                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    bg = 'rgba(0, 255, 102, 0.2)';
                    border = '1px solid #00ff66';
                    textColor = '#00ff66';
                  } else if (idx === selectedOption) {
                    bg = 'rgba(255, 51, 68, 0.2)';
                    border = '1px solid #ff3344';
                    textColor = '#ff3344';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '4px',
                      background: bg,
                      border,
                      color: textColor,
                      fontSize: '0.92rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: isAnswered ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>[{String.fromCharCode(65 + idx)}] {opt}</span>
                    {isAnswered && idx === currentQ.correctIndex && <CheckCircle2 size={18} color="#00ff66" />}
                  </button>
                );
              })}
            </div>

            {/* Humorous Terminal Interrogation Feedback */}
            {isAnswered && (
              <div
                style={{
                  background: 'rgba(255, 51, 68, 0.08)',
                  border: '1px solid rgba(255, 51, 68, 0.35)',
                  borderRadius: '4px',
                  padding: '14px',
                  marginBottom: '20px',
                  fontSize: '0.86rem',
                  lineHeight: 1.6,
                  color: '#ff7788',
                }}
              >
                <div>&gt; ANSWER RECEIVED</div>
                <div>&gt; PROCESSING PERSONALITY DATA...</div>
                <div style={{ color: '#00ff66', fontWeight: 800, marginTop: '4px' }}>
                  &gt; RESULT: LEGENDARY LEVELS OF CHAOS DETECTED!
                </div>
                <div style={{ color: '#cbd5e1', marginTop: '6px', fontSize: '0.82rem' }}>
                  💡 {currentQ.explanation}
                </div>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="btn-cyber-primary"
                style={{ width: '100%', padding: '14px', fontSize: '0.95rem', background: '#ff3344', borderColor: '#ff3344' }}
              >
                <span>{currentIndex + 1 === questions.length ? '[ FINALIZE DOSSIER ]' : '[ NEXT INTERROGATION ]'}</span>
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results */
        <div
          className="terminal-panel"
          style={{
            width: '100%',
            padding: '36px 28px',
            textAlign: 'center',
            border: '1px solid #ff3344',
          }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🤝</div>

          <h2 className="text-alert-red" style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>
            DOSSIER COMPILED: BROTHER FOR LIFE
          </h2>

          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#00ff66', marginBottom: '16px' }}>
            INTERROGATION VERDICT: 100% INNOCENT OF BEING BORING
          </div>

          <p style={{ color: '#5c7866', fontSize: '0.92rem', marginBottom: '28px' }}>
            Aakash & Sanjay have officially confirmed all charges of maximum friendship, insane gaming energy, and legendary late arrivals.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {onNextSection && (
              <button onClick={onNextSection} className="btn-cyber-primary pulse-cyber" style={{ padding: '12px 24px' }}>
                <span>[ OPEN MOVIE DECRYPTION ]</span>
                <ChevronRight size={16} />
              </button>
            )}
            <button onClick={handleRestart} className="btn-cyber-secondary" style={{ padding: '12px 20px' }}>
              <RotateCcw size={15} />
              <span>[ RE-INTERROGATE ]</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
