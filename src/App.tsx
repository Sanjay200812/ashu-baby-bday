import React, { useState, useEffect } from 'react';
import { ScreenType, MiniGameId, GameProgress } from './types/game';
import { MusicPlayerPill } from './components/common/MusicPlayerPill';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { BirthdayFlapGame } from './components/games/BirthdayFlapGame';
import { ArcadeHub } from './components/arcade/ArcadeHub';
import { CatchGiftsGame } from './components/games/CatchGiftsGame';
import { MemoryMatchGame } from './components/games/MemoryMatchGame';
import { ReactionGame } from './components/games/ReactionGame';
import { BalloonPopGame } from './components/games/BalloonPopGame';
import { FinalSurprise } from './components/surprise/FinalSurprise';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('WELCOME');
  const [activeMiniGame, setActiveMiniGame] = useState<MiniGameId | null>(null);

  // Load progress from localStorage
  const [progress, setProgress] = useState<GameProgress>(() => {
    return {
      flapCompleted: localStorage.getItem('birthday_flap_completed') === 'true',
      flapBestScore: parseInt(localStorage.getItem('birthday_flap_best') || '0', 10),
      catchCompleted: localStorage.getItem('birthday_catch_completed') === 'true',
      catchBestScore: parseInt(localStorage.getItem('birthday_catch_best') || '0', 10),
      memoryCompleted: localStorage.getItem('birthday_memory_completed') === 'true',
      memoryBestMoves: parseInt(localStorage.getItem('birthday_memory_best') || '0', 10),
      reactionCompleted: localStorage.getItem('birthday_reaction_completed') === 'true',
      reactionBestMs: parseInt(localStorage.getItem('birthday_reaction_best') || '0', 10),
      balloonCompleted: localStorage.getItem('birthday_balloon_completed') === 'true',
      balloonBestScore: parseInt(localStorage.getItem('birthday_balloon_best') || '0', 10),
    };
  });

  // Keep state synced with localStorage
  useEffect(() => {
    localStorage.setItem('birthday_flap_completed', progress.flapCompleted ? 'true' : 'false');
    localStorage.setItem('birthday_catch_completed', progress.catchCompleted ? 'true' : 'false');
    localStorage.setItem('birthday_memory_completed', progress.memoryCompleted ? 'true' : 'false');
    localStorage.setItem('birthday_reaction_completed', progress.reactionCompleted ? 'true' : 'false');
    localStorage.setItem('birthday_balloon_completed', progress.balloonCompleted ? 'true' : 'false');
  }, [progress]);

  // Handlers for game completions
  const handleFlapComplete = (score: number) => {
    setProgress((prev) => ({
      ...prev,
      flapCompleted: true,
      flapBestScore: Math.max(prev.flapBestScore, score),
    }));
    setCurrentScreen('ARCADE');
    setActiveMiniGame(null);
  };

  const handleCatchComplete = (score: number) => {
    setProgress((prev) => ({
      ...prev,
      catchCompleted: true,
      catchBestScore: Math.max(prev.catchBestScore, score),
    }));
  };

  const handleMemoryComplete = (moves: number) => {
    setProgress((prev) => ({
      ...prev,
      memoryCompleted: true,
      memoryBestMoves: prev.memoryBestMoves === 0 ? moves : Math.min(prev.memoryBestMoves, moves),
    }));
  };

  const handleReactionComplete = (ms: number) => {
    setProgress((prev) => ({
      ...prev,
      reactionCompleted: true,
      reactionBestMs: prev.reactionBestMs === 0 ? ms : Math.min(prev.reactionBestMs, ms),
    }));
  };

  const handleBalloonComplete = (score: number) => {
    setProgress((prev) => ({
      ...prev,
      balloonCompleted: true,
      balloonBestScore: Math.max(prev.balloonBestScore, score),
    }));
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Ambient background glows */}
      <div className="ambient-glow glow-top-left" />
      <div className="ambient-glow glow-bottom-right" />
      <div className="ambient-glow glow-center" />

      {/* Persistent Audio Control Pill */}
      <MusicPlayerPill />

      {/* Screen Router */}
      {currentScreen === 'WELCOME' && (
        <WelcomeScreen onStart={() => setCurrentScreen('GAME_FLAP')} />
      )}

      {currentScreen === 'GAME_FLAP' && (
        <BirthdayFlapGame
          onLevelComplete={handleFlapComplete}
          onBackToArcade={progress.flapCompleted ? () => setCurrentScreen('ARCADE') : undefined}
          isUnlockedInArcade={progress.flapCompleted}
        />
      )}

      {currentScreen === 'ARCADE' && (
        <>
          {activeMiniGame === null && (
            <ArcadeHub
              progress={progress}
              onSelectGame={(gameId) => setActiveMiniGame(gameId)}
              onOpenSurprise={() => setCurrentScreen('SURPRISE')}
            />
          )}

          {activeMiniGame === 'flap' && (
            <BirthdayFlapGame
              onLevelComplete={handleFlapComplete}
              onBackToArcade={() => setActiveMiniGame(null)}
              isUnlockedInArcade={true}
            />
          )}

          {activeMiniGame === 'catch' && (
            <CatchGiftsGame
              onComplete={handleCatchComplete}
              onBack={() => setActiveMiniGame(null)}
            />
          )}

          {activeMiniGame === 'memory' && (
            <MemoryMatchGame
              onComplete={handleMemoryComplete}
              onBack={() => setActiveMiniGame(null)}
            />
          )}

          {activeMiniGame === 'reaction' && (
            <ReactionGame
              onComplete={handleReactionComplete}
              onBack={() => setActiveMiniGame(null)}
            />
          )}

          {activeMiniGame === 'balloon' && (
            <BalloonPopGame
              onComplete={handleBalloonComplete}
              onBack={() => setActiveMiniGame(null)}
            />
          )}
        </>
      )}

      {currentScreen === 'SURPRISE' && (
        <FinalSurprise
          onReplayAll={() => {
            setCurrentScreen('WELCOME');
            setActiveMiniGame(null);
          }}
          onBackToArcade={() => {
            setCurrentScreen('ARCADE');
            setActiveMiniGame(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
