import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowLeft, Terminal, ShieldAlert, Sparkles, Film, Sun } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';
import { LoseClipPlayer } from '../common/LoseClipPlayer';

interface SleepModeGameProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

export const SleepModeGame: React.FC<SleepModeGameProps> = ({ onComplete, onBack }) => {
  const [attempt, setAttempt] = useState<number>(1);
  const [gameState, setGameState] = useState<'SCENE' | 'LOSING' | 'AWAKE'>('SCENE');

  // Pause background music when lose clip plays
  useEffect(() => {
    if (gameState === 'LOSING') {
      soundSystem.pauseMusic();
    } else if (gameState === 'SCENE') {
      soundSystem.playSiteMusic();
    }
  }, [gameState]);

  const handleWakeUpClick = () => {
    soundSystem.playClick();

    if (attempt < 3) {
      // First and second attempts: play lose-clip.mp4
      soundSystem.playHit();
      setGameState('LOSING');
    } else {
      // Third attempt: Ashuu successfully wakes up! Reveal sleeping-photo-2.png
      soundSystem.playVictory();
      setGameState('AWAKE');

      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#ff2a4b', '#ffb703', '#ffffff', '#ff1744'],
      });
    }
  };

  const handleRetry = () => {
    soundSystem.playClick();
    soundSystem.playSiteMusic();
    setAttempt((prev) => prev + 1);
    setGameState('SCENE');
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
        backgroundColor: 'transparent',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          padding: '0 4px',
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
            <span>NIGHT SHOW // ATTEMPT {attempt}/3</span>
          </div>
        </div>

        <div style={{ color: '#ffb703', fontSize: '0.78rem', fontWeight: 700 }}>
          {attempt < 3 ? 'SLEEP MODE 😴' : 'WAKE UP TIME ⏰'}
        </div>
      </div>

      {/* Main Container */}
      <div
        className="terminal-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '24px 20px',
          border: '1.5px solid #ff2a4b',
          boxShadow: '0 0 45px rgba(255, 42, 75, 0.4)',
          borderRadius: '12px',
          textAlign: 'center',
        }}
      >
        {gameState === 'SCENE' && (
          <div>
            {/* Short Tenglish message */}
            <div
              style={{
                background: 'rgba(255, 42, 75, 0.1)',
                border: '1px solid rgba(255, 42, 75, 0.4)',
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '18px',
                color: '#ffb703',
                fontSize: '0.94rem',
                fontWeight: 800,
                lineHeight: 1.45,
              }}
            >
              {attempt < 3 ? (
                <span>"Ashu nannu night show annadu… inka akkada scene chudandi!" 🎬😴</span>
              ) : (
                <span>"Movie ayipoyindhi… Wake up, Ashu!" 🍿🌅</span>
              )}
            </div>

            {/* Photo 1: Sleeping in Theater */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxHeight: '300px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2px solid rgba(255, 42, 75, 0.6)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.9)',
                marginBottom: '20px',
                backgroundColor: '#000',
              }}
            >
              <img
                src={BIRTHDAY_CONFIG.sleepingPhotoUrl}
                alt="Ashu Sleeping Photo 1"
                style={{
                  width: '100%',
                  height: '280px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(5, 5, 8, 0.85)',
                  border: '1px solid #ff2a4b',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: '#ff2a4b',
                }}
              >
                💤 DEEP SLEEP IN THEATER
              </div>
            </div>

            {/* Wake Up Button */}
            <button
              onClick={handleWakeUpClick}
              className="btn-cyber-primary pulse-cyber"
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '1.05rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
              }}
            >
              <span>Wake up, Ashu! ⏰</span>
            </button>
          </div>
        )}

        {/* Losing Clip: Attempts 1 & 2 */}
        {gameState === 'LOSING' && (
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#ff2a4b',
                fontWeight: 900,
                fontSize: '0.92rem',
                marginBottom: '12px',
              }}
            >
              <ShieldAlert size={16} />
              <span>SNOOZE OVERDOSE // ATTEMPT {attempt} FAILED!</span>
            </div>

            {/* Contained Video Clip WITH AUDIO */}
            {/* Loss Video Clip WITH Audio & Unmute overlay */}
            <LoseClipPlayer
              maxHeight="210px"
              onResumeMusic={() => soundSystem.playSiteMusic()}
            />

            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.5 }}>
              Arey Ashuu! Movie interval lo kooda levaledhu, blanket laagukoni padukunnadu! 😂
            </p>

            <button
              onClick={handleRetry}
              className="btn-cyber-primary pulse-cyber"
              style={{ width: '100%', padding: '13px', fontSize: '0.92rem' }}
            >
              <RotateCcw size={16} />
              <span>[ RETRY WAKE UP (ATTEMPT {attempt + 1}/3) ]</span>
            </button>
          </div>
        )}

        {/* Awake & Successful: Attempt 3 */}
        {gameState === 'AWAKE' && (
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 183, 3, 0.15)',
                border: '1px solid #ffb703',
                borderRadius: '20px',
                padding: '4px 14px',
                fontSize: '0.82rem',
                fontWeight: 900,
                color: '#ffb703',
                marginBottom: '12px',
              }}
            >
              <Sun size={15} />
              <span>SUCCESSFULLY AWAKE // FACE REVEALED!</span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', marginBottom: '6px' }}>
              Movie ayipoyindhi… Wake up, Ashu! 🌅
            </h3>

            {/* Photo 2: Face Clearly Visible */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxHeight: '300px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2.5px solid #ffb703',
                boxShadow: '0 0 35px rgba(255, 183, 3, 0.45)',
                margin: '14px 0 18px',
                backgroundColor: '#000',
              }}
            >
              <img
                src={BIRTHDAY_CONFIG.sleepingPhotoUrl2}
                alt="Ashu Sleeping Photo 2 Face Revealed"
                style={{
                  width: '100%',
                  height: '280px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.86rem', marginBottom: '20px', lineHeight: 1.5 }}>
              Kadaaki Ashuu nidra nunchi lechaadu! Face clear ga kanipisthundi! Hero ready for the next level! 🔥
            </p>

            <button
              onClick={() => {
                soundSystem.playClick();
                onComplete(100);
              }}
              className="btn-cyber-primary"
              style={{ width: '100%', padding: '14px', fontSize: '0.94rem' }}
            >
              <span>[ PROCEED TO NEXT LEVEL ➔ ]</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SleepModeGame;
