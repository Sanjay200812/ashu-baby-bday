import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Terminal, ChevronRight, RotateCcw } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface GamingQuizProps {
  onComplete: (score: number) => void;
  onBack: () => void;
  onNextSection?: () => void;
}

export const GamingQuiz: React.FC<GamingQuizProps> = ({ onComplete, onBack, onNextSection }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const questions = BIRTHDAY_CONFIG.gamingQuiz;
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
      confetti({ particleCount: 100, spread: 75, colors: ['#00ff66', '#00e5ff', '#ffffff'] });
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

  const getRank = () => {
    if (score >= 5) return { title: '👑 KERNEL_ROOT // LEVEL 100 GAMING DEITY', color: '#00ff66' };
    if (score >= 4) return { title: '⚡ HARDCORE ESPORTS SPECIALIST', color: '#00e5ff' };
    if (score >= 3) return { title: '🎮 TACTICAL CASUAL FRAGGER', color: '#ffb703' };
    return { title: '🕹️ RECRUIT SCRIPT-KIDDIE', color: '#94a3b8' };
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

        <div style={{ color: '#00ff66', fontWeight: 800, fontSize: '0.88rem' }}>
          BUFFER: {score} / {questions.length}
        </div>
      </div>

      {!isCompleted ? (
        <div
          className="terminal-panel"
          style={{
            width: '100%',
            overflow: 'hidden',
            border: '1px solid rgba(0, 255, 102, 0.4)',
          }}
        >
          {/* Terminal Title Bar */}
          <div className="terminal-header-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={14} color="#00ff66" />
              <span>SOUTH DEV KNOWLEDGE DATABASE</span>
            </div>
            <div>RECORD {currentIndex + 1} OF {questions.length}</div>
          </div>

          <div style={{ padding: '32px 24px' }}>
            {/* Question Text */}
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
                let bg = 'rgba(0, 255, 102, 0.04)';
                let border = '1px solid rgba(0, 255, 102, 0.2)';
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
                    {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                      <XCircle size={18} color="#ff3344" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Fact Explanation */}
            {isAnswered && (
              <div
                style={{
                  background: 'rgba(0, 229, 255, 0.08)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  borderRadius: '4px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  fontSize: '0.85rem',
                  color: '#00e5ff',
                }}
              >
                &gt; LOG_OUTPUT: {currentQ.explanation}
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="btn-cyber-primary"
                style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
              >
                <span>{currentIndex + 1 === questions.length ? '[ COMPILE RESULTS ]' : '[ NEXT QUERY ]'}</span>
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Terminal */
        <div
          className="terminal-panel"
          style={{
            width: '100%',
            padding: '36px 28px',
            textAlign: 'center',
            border: '1px solid #00ff66',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '4px',
              background: 'rgba(0, 255, 102, 0.15)',
              border: '1px solid #00ff66',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Trophy size={32} color="#00ff66" />
          </div>

          <h2 className="text-neon-green" style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>
            DATABASE QUERY COMPLETE
          </h2>

          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: getRank().color, marginBottom: '16px' }}>
            {getRank().title}
          </div>

          <p style={{ color: '#5c7866', fontSize: '0.92rem', marginBottom: '28px' }}>
            Score: <strong style={{ color: '#00ff66' }}>{score} / {questions.length}</strong> correct records verified.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {onNextSection && (
              <button onClick={onNextSection} className="btn-cyber-primary pulse-cyber" style={{ padding: '12px 24px' }}>
                <span>[ OPEN DATA INTERROGATION ]</span>
                <ChevronRight size={16} />
              </button>
            )}
            <button onClick={handleRestart} className="btn-cyber-secondary" style={{ padding: '12px 20px' }}>
              <RotateCcw size={15} />
              <span>[ RETRY QUERY ]</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
