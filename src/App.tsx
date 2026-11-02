import React, { useState, useEffect } from 'react';
import { ScreenType, MiniGameId, GameProgress } from './types/game';
import { MusicPlayerPill } from './components/common/MusicPlayerPill';
import { BirthdayLockScreen } from './components/lock/BirthdayLockScreen';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { BirthdayFlapGame } from './components/games/BirthdayFlapGame';
import { ArcadeHub } from './components/arcade/ArcadeHub';
import { GtaChaosRunGame } from './components/games/GtaChaosRunGame';
import { SpiderWebSwingGame } from './components/games/SpiderWebSwingGame';
import { FreeFireSurvivalGame } from './components/games/FreeFireSurvivalGame';
import { CatchTheFoodGame } from './components/games/CatchTheFoodGame';
import { SleepModeGame } from './components/games/SleepModeGame';
import { GamingQuiz } from './components/quiz/GamingQuiz';
import { PersonalQuiz } from './components/quiz/PersonalQuiz';
import { MovieExperience } from './components/movies/MovieExperience';
import { FinalSurprise } from './components/surprise/FinalSurprise';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('LOCK');
  const [activeMiniGame, setActiveMiniGame] = useState<MiniGameId | null>(null);

  // Load progress from localStorage
  const [progress, setProgress] = useState<GameProgress>(() => {
    return {
      isUnlocked: localStorage.getItem('birthday_unlocked') === 'true',
      flapCompleted: localStorage.getItem('birthday_flap_completed') === 'true',
      flapBestScore: parseInt(localStorage.getItem('birthday_flap_best') || '0', 10),
      gtaCompleted: localStorage.getItem('birthday_gta_completed') === 'true',
      gtaBestScore: parseInt(localStorage.getItem('birthday_gta_best') || '0', 10),
      spidermanCompleted: localStorage.getItem('birthday_spiderman_completed') === 'true',
      spidermanBestScore: parseInt(localStorage.getItem('birthday_spiderman_best') || '0', 10),
      freefireCompleted: localStorage.getItem('birthday_freefire_completed') === 'true',
      freefireBestScore: parseInt(localStorage.getItem('birthday_freefire_best') || '0', 10),
      foodCompleted: localStorage.getItem('birthday_food_completed') === 'true',
      foodBestScore: parseInt(localStorage.getItem('birthday_food_best') || '0', 10),
      sleepCompleted: localStorage.getItem('birthday_sleep_completed') === 'true',
      sleepBestScore: parseInt(localStorage.getItem('birthday_sleep_best') || '0', 10),
      gamingQuizCompleted: localStorage.getItem('birthday_gquiz_completed') === 'true',
      gamingQuizScore: parseInt(localStorage.getItem('birthday_gquiz_score') || '0', 10),
      personalQuizCompleted: localStorage.getItem('birthday_pquiz_completed') === 'true',
      personalQuizScore: parseInt(localStorage.getItem('birthday_pquiz_score') || '0', 10),
      movieQuizCompleted: localStorage.getItem('birthday_mquiz_completed') === 'true',
      movieQuizScore: parseInt(localStorage.getItem('birthday_mquiz_score') || '0', 10),
    };
  });

  // Sync progress
  useEffect(() => {
    localStorage.setItem('birthday_unlocked', progress.isUnlocked ? 'true' : 'false');
    localStorage.setItem('birthday_flap_completed', progress.flapCompleted ? 'true' : 'false');
    localStorage.setItem('birthday_gta_completed', progress.gtaCompleted ? 'true' : 'false');
    localStorage.setItem('birthday_spiderman_completed', progress.spidermanCompleted ? 'true' : 'false');
    localStorage.setItem('birthday_freefire_completed', progress.freefireCompleted ? 'true' : 'false');
    localStorage.setItem('birthday_food_completed', progress.foodCompleted ? 'true' : 'false');
    localStorage.setItem('birthday_sleep_completed', progress.sleepCompleted ? 'true' : 'false');
    localStorage.setItem('birthday_gquiz_completed', progress.gamingQuizCompleted ? 'true' : 'false');
    localStorage.setItem('birthday_pquiz_completed', progress.personalQuizCompleted ? 'true' : 'false');
    localStorage.setItem('birthday_mquiz_completed', progress.movieQuizCompleted ? 'true' : 'false');
  }, [progress]);

  // Handlers
  const handleUnlockLock = () => {
    setProgress((p) => ({ ...p, isUnlocked: true }));
    setCurrentScreen('WELCOME');
  };

  const handleFlapComplete = (score: number) => {
    setProgress((p) => ({
      ...p,
      flapCompleted: true,
      flapBestScore: Math.max(p.flapBestScore, score),
    }));
    setCurrentScreen('ARCADE');
    setActiveMiniGame(null);
  };

  const handleGtaComplete = (score: number) => {
    setProgress((p) => ({
      ...p,
      gtaCompleted: true,
      gtaBestScore: Math.max(p.gtaBestScore, score),
    }));
  };

  const handleSpidermanComplete = (score: number) => {
    setProgress((p) => ({
      ...p,
      spidermanCompleted: true,
      spidermanBestScore: Math.max(p.spidermanBestScore, score),
    }));
  };

  const handleFreefireComplete = (score: number) => {
    setProgress((p) => ({
      ...p,
      freefireCompleted: true,
      freefireBestScore: Math.max(p.freefireBestScore, score),
    }));
  };

  const handleFoodComplete = (score: number) => {
    setProgress((p) => ({
      ...p,
      foodCompleted: true,
      foodBestScore: Math.max(p.foodBestScore, score),
    }));
  };

  const handleSleepComplete = (score: number) => {
    setProgress((p) => ({
      ...p,
      sleepCompleted: true,
      sleepBestScore: Math.max(p.sleepBestScore, score),
    }));
  };

  const handleGamingQuizComplete = (score: number) => {
    setProgress((p) => ({
      ...p,
      gamingQuizCompleted: true,
      gamingQuizScore: Math.max(p.gamingQuizScore, score),
    }));
  };

  const handlePersonalQuizComplete = (score: number) => {
    setProgress((p) => ({
      ...p,
      personalQuizCompleted: true,
      personalQuizScore: Math.max(p.personalQuizScore, score),
    }));
  };

  const handleMovieQuizComplete = (score: number) => {
    setProgress((p) => ({
      ...p,
      movieQuizCompleted: true,
      movieQuizScore: Math.max(p.movieQuizScore, score),
    }));
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Ambient background glows */}
      <div className="ambient-glow glow-top-left" />
      <div className="ambient-glow glow-bottom-right" />
      <div className="ambient-glow glow-center" />

      {/* Floating Audio Control Pill */}
      <MusicPlayerPill />

      {/* 1. Birthday Lock Screen */}
      {currentScreen === 'LOCK' && (
        <BirthdayLockScreen onUnlock={handleUnlockLock} />
      )}

      {/* 2. Opening Welcome Screen */}
      {currentScreen === 'WELCOME' && (
        <WelcomeScreen onStart={() => setCurrentScreen('GAME_FLAP')} />
      )}

      {/* 3. Game One: Birthday Flap Adventure */}
      {currentScreen === 'GAME_FLAP' && (
        <BirthdayFlapGame
          onLevelComplete={handleFlapComplete}
          onBackToArcade={progress.flapCompleted ? () => setCurrentScreen('ARCADE') : undefined}
          isUnlockedInArcade={progress.flapCompleted}
        />
      )}

      {/* 4. Birthday Arcade Hub & Games */}
      {currentScreen === 'ARCADE' && (
        <>
          {activeMiniGame === null && (
            <ArcadeHub
              progress={progress}
              onSelectGame={(gameId) => setActiveMiniGame(gameId)}
              onOpenGamingQuiz={() => setCurrentScreen('QUIZ_GAMING')}
              onOpenPersonalQuiz={() => setCurrentScreen('QUIZ_PERSONAL')}
              onOpenMovieExperience={() => setCurrentScreen('MOVIE_EXPERIENCE')}
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

          {activeMiniGame === 'gta' && (
            <GtaChaosRunGame
              onComplete={handleGtaComplete}
              onBack={() => setActiveMiniGame(null)}
            />
          )}

          {activeMiniGame === 'spiderman' && (
            <SpiderWebSwingGame
              onComplete={handleSpidermanComplete}
              onBack={() => setActiveMiniGame(null)}
            />
          )}

          {activeMiniGame === 'freefire' && (
            <FreeFireSurvivalGame
              onComplete={handleFreefireComplete}
              onBack={() => setActiveMiniGame(null)}
            />
          )}

          {activeMiniGame === 'food' && (
            <CatchTheFoodGame
              onComplete={handleFoodComplete}
              onBack={() => setActiveMiniGame(null)}
            />
          )}

          {activeMiniGame === 'sleep' && (
            <SleepModeGame
              onComplete={handleSleepComplete}
              onBack={() => setActiveMiniGame(null)}
            />
          )}
        </>
      )}

      {/* 5. Gaming Quiz */}
      {currentScreen === 'QUIZ_GAMING' && (
        <GamingQuiz
          onComplete={handleGamingQuizComplete}
          onBack={() => setCurrentScreen('ARCADE')}
          onNextSection={() => setCurrentScreen('QUIZ_PERSONAL')}
        />
      )}

      {/* 6. Funny Questions and Personal Quiz */}
      {currentScreen === 'QUIZ_PERSONAL' && (
        <PersonalQuiz
          onComplete={handlePersonalQuizComplete}
          onBack={() => setCurrentScreen('ARCADE')}
          onNextSection={() => setCurrentScreen('MOVIE_EXPERIENCE')}
        />
      )}

      {/* 7. Movie Lover Experience */}
      {currentScreen === 'MOVIE_EXPERIENCE' && (
        <MovieExperience
          onComplete={handleMovieQuizComplete}
          onBack={() => setCurrentScreen('ARCADE')}
          onOpenSurprise={() => setCurrentScreen('SURPRISE')}
        />
      )}

      {/* 8. Final Birthday Surprise signed by Aakash & Sanjay */}
      {currentScreen === 'SURPRISE' && (
        <FinalSurprise
          onReplayAll={() => {
            setCurrentScreen('LOCK');
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
