import React, { useState, useEffect } from 'react';
import { ScreenType, MiniGameId, GameProgress } from './types/game';
import { MusicPlayerPill } from './components/common/MusicPlayerPill';
import { SystemBreachScreen } from './components/breach/SystemBreachScreen';
import { BirthdayLockScreen } from './components/lock/BirthdayLockScreen';
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
import { FoodMemoriesSection } from './components/foodie/FoodMemoriesSection';
import { AshuuSkillsSection } from './components/profile/AshuuSkillsSection';
import { FinalSurprise } from './components/surprise/FinalSurprise';
import { CommandTerminalModal } from './components/terminal/CommandTerminalModal';
import { SystemStatusModal } from './components/dashboard/SystemStatusModal';
import { MatrixRain } from './components/terminal/MatrixRain';
import { soundSystem } from './utils/audioSystem';

const safeGetItem = (key: string, fallback: string = ''): string => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

const safeGetNumber = (key: string, fallback: number = 0): number => {
  try {
    const val = localStorage.getItem(key);
    if (!val) return fallback;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? fallback : parsed;
  } catch {
    return fallback;
  }
};

const safeGetJson = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    return Array.isArray(fallback) && !Array.isArray(parsed) ? fallback : parsed;
  } catch {
    return fallback;
  }
};

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('BREACH');
  const [activeMiniGame, setActiveMiniGame] = useState<MiniGameId | null>(null);

  // Overlays
  const [isCliOpen, setIsCliOpen] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [isMatrixActive, setIsMatrixActive] = useState<boolean>(false);

  // Progress state with safe fallback getters
  const [progress, setProgress] = useState<GameProgress>(() => {
    return {
      isBreached: safeGetItem('southdev_breached') === 'true',
      isUnlocked: safeGetItem('southdev_unlocked') === 'true',
      flapCompleted: safeGetItem('birthday_flap_completed') === 'true',
      flapBestScore: safeGetNumber('birthday_flap_best', 0),
      gtaCompleted: safeGetItem('birthday_gta_completed') === 'true',
      gtaBestScore: safeGetNumber('birthday_gta_best', 0),
      spidermanCompleted: safeGetItem('birthday_spiderman_completed') === 'true',
      spidermanBestScore: safeGetNumber('birthday_spiderman_best', 0),
      freefireCompleted: safeGetItem('birthday_freefire_completed') === 'true',
      freefireBestScore: safeGetNumber('birthday_freefire_best', 0),
      foodCompleted: safeGetItem('birthday_food_completed') === 'true',
      foodBestScore: safeGetNumber('birthday_food_best', 0),
      sleepCompleted: safeGetItem('birthday_sleep_completed') === 'true',
      sleepBestScore: safeGetNumber('birthday_sleep_best', 0),
      gamingQuizCompleted: safeGetItem('birthday_gquiz_completed') === 'true',
      gamingQuizScore: safeGetNumber('birthday_gquiz_score', 0),
      personalQuizCompleted: safeGetItem('birthday_pquiz_completed') === 'true',
      personalQuizScore: safeGetNumber('birthday_pquiz_score', 0),
      movieQuizCompleted: safeGetItem('birthday_mquiz_completed') === 'true',
      movieQuizScore: safeGetNumber('birthday_mquiz_score', 0),
      fragmentsCollected: safeGetJson<number[]>('southdev_fragments', []),
    };
  });

  // Sync to localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('southdev_breached', progress.isBreached ? 'true' : 'false');
      localStorage.setItem('southdev_unlocked', progress.isUnlocked ? 'true' : 'false');
      localStorage.setItem('birthday_flap_completed', progress.flapCompleted ? 'true' : 'false');
      localStorage.setItem('birthday_gta_completed', progress.gtaCompleted ? 'true' : 'false');
      localStorage.setItem('birthday_spiderman_completed', progress.spidermanCompleted ? 'true' : 'false');
      localStorage.setItem('birthday_freefire_completed', progress.freefireCompleted ? 'true' : 'false');
      localStorage.setItem('birthday_food_completed', progress.foodCompleted ? 'true' : 'false');
      localStorage.setItem('birthday_sleep_completed', progress.sleepCompleted ? 'true' : 'false');
      localStorage.setItem('birthday_gquiz_completed', progress.gamingQuizCompleted ? 'true' : 'false');
      localStorage.setItem('birthday_pquiz_completed', progress.personalQuizCompleted ? 'true' : 'false');
      localStorage.setItem('birthday_mquiz_completed', progress.movieQuizCompleted ? 'true' : 'false');
      localStorage.setItem('southdev_fragments', JSON.stringify(progress.fragmentsCollected));
    } catch (err) {
      console.warn('LocalStorage write ignored:', err);
    }
  }, [progress]);

  // Global key listener for ~ to toggle Command Terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        setIsCliOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const awardFragment = (fragmentId: number) => {
    setProgress((prev) => {
      const frags = Array.isArray(prev?.fragmentsCollected) ? prev.fragmentsCollected : [];
      if (!frags.includes(fragmentId)) {
        soundSystem.playScore();
        return {
          ...prev,
          fragmentsCollected: [...frags, fragmentId],
        };
      }
      return prev;
    });
  };

  // Progression Handlers: Load -> Opening Game -> Pass 12 -> Birthday Auth -> Arcade
  const handleBreachComplete = () => {
    setProgress((p) => ({ ...p, isBreached: true }));
    setCurrentScreen('GAME_FLAP');
  };

  const handleFlapComplete = (score: number) => {
    awardFragment(1);
    setProgress((p) => ({
      ...p,
      flapCompleted: true,
      flapBestScore: Math.max(p.flapBestScore, score),
      isUnlocked: true,
    }));
    setCurrentScreen('ARCADE');
    setActiveMiniGame(null);
  };

  const handleAuthComplete = () => {
    setProgress((p) => ({ ...p, isUnlocked: true }));
    setCurrentScreen('ARCADE');
  };

  const handleGtaComplete = (score: number) => {
    awardFragment(2);
    setProgress((p) => ({
      ...p,
      gtaCompleted: true,
      gtaBestScore: Math.max(p.gtaBestScore, score),
    }));
  };

  const handleSpidermanComplete = (score: number) => {
    awardFragment(3);
    setProgress((p) => ({
      ...p,
      spidermanCompleted: true,
      spidermanBestScore: Math.max(p.spidermanBestScore, score),
    }));
  };

  const handleFreefireComplete = (score: number) => {
    awardFragment(4);
    setProgress((p) => ({
      ...p,
      freefireCompleted: true,
      freefireBestScore: Math.max(p.freefireBestScore, score),
    }));
  };

  const handleFoodComplete = (score: number) => {
    awardFragment(5);
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
      {/* Matrix Rain Stream Overlay */}
      {isMatrixActive && <MatrixRain onClose={() => setIsMatrixActive(false)} />}

      {/* Floating Audio Control & CLI Toggle Pill: Only on unlocked arcade/website screens */}
      {currentScreen !== 'BREACH' && currentScreen !== 'GAME_FLAP' && (
        <MusicPlayerPill onOpenCli={() => setIsCliOpen(true)} />
      )}

      {/* 1. Stage One: Fake System Breach & Boot */}
      {currentScreen === 'BREACH' && (
        <SystemBreachScreen onEnter={handleBreachComplete} />
      )}

      {/* 2. Stage Two: Birthday Authentication */}
      {currentScreen === 'AUTH' && (
        <BirthdayLockScreen onUnlock={handleAuthComplete} />
      )}

      {/* 3. Stage Three: Birthday Flap Adventure */}
      {currentScreen === 'GAME_FLAP' && (
        <BirthdayFlapGame
          onLevelComplete={handleFlapComplete}
          onBackToArcade={progress.flapCompleted ? () => setCurrentScreen('ARCADE') : undefined}
          isUnlockedInArcade={progress.flapCompleted}
        />
      )}

      {/* 4. Stage Four: South Dev Cyber Arcade */}
      {currentScreen === 'ARCADE' && (
        <>
          {activeMiniGame === null && (
            <ArcadeHub
              progress={progress}
              onSelectGame={(gameId) => setActiveMiniGame(gameId)}
              onOpenGamingQuiz={() => setCurrentScreen('QUIZ_GAMING')}
              onOpenPersonalQuiz={() => setCurrentScreen('QUIZ_PERSONAL')}
              onOpenMovieExperience={() => setCurrentScreen('MOVIE_EXPERIENCE')}
              onOpenFoodie={() => setCurrentScreen('FOODIE')}
              onOpenSkills={() => setCurrentScreen('SKILLS')}
              onOpenSurprise={() => setCurrentScreen('SURPRISE')}
              onOpenCli={() => setIsCliOpen(true)}
              onOpenDashboard={() => setIsDashboardOpen(true)}
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

      {/* 5. Stage Five: South Dev Knowledge Database */}
      {currentScreen === 'QUIZ_GAMING' && (
        <GamingQuiz
          onComplete={handleGamingQuizComplete}
          onBack={() => setCurrentScreen('ARCADE')}
          onNextSection={() => setCurrentScreen('QUIZ_PERSONAL')}
        />
      )}

      {/* 6. Stage Six: Personal Data Interrogation */}
      {currentScreen === 'QUIZ_PERSONAL' && (
        <PersonalQuiz
          onComplete={handlePersonalQuizComplete}
          onBack={() => setCurrentScreen('ARCADE')}
          onNextSection={() => setCurrentScreen('MOVIE_EXPERIENCE')}
        />
      )}

      {/* 7. Movie Knowledge Decryption */}
      {currentScreen === 'MOVIE_EXPERIENCE' && (
        <MovieExperience
          onComplete={handleMovieQuizComplete}
          onBack={() => setCurrentScreen('ARCADE')}
          onOpenSurprise={() => setCurrentScreen('SURPRISE')}
        />
      )}

      {/* 8. Food Memories (Foodie Archives) */}
      {currentScreen === 'FOODIE' && (
        <FoodMemoriesSection onBack={() => setCurrentScreen('ARCADE')} />
      )}

      {/* 9. Ashuu's Skills Profile (CodeXa Founder Dossier) */}
      {currentScreen === 'SKILLS' && (
        <AshuuSkillsSection onBack={() => setCurrentScreen('ARCADE')} />
      )}

      {/* 10. Final Stage: Birthday Card Signed by Aakash & Sanjay */}
      {currentScreen === 'SURPRISE' && (
        <FinalSurprise
          onReplayAll={() => {
            setCurrentScreen('BREACH');
            setActiveMiniGame(null);
          }}
          onBackToArcade={() => {
            setCurrentScreen('ARCADE');
            setActiveMiniGame(null);
          }}
          onOpenFoodie={() => setCurrentScreen('FOODIE')}
          onOpenSkills={() => setCurrentScreen('SKILLS')}
        />
      )}

      {/* Hidden Command Terminal Modal */}
      <CommandTerminalModal
        isOpen={isCliOpen}
        onClose={() => setIsCliOpen(false)}
        progress={progress}
        onNavigateArcade={() => {
          setCurrentScreen('ARCADE');
          setActiveMiniGame(null);
        }}
        onToggleMatrix={() => setIsMatrixActive((prev) => !prev)}
        onUnlockSecretFragment={() => awardFragment(1)}
      />

      {/* System Status Dashboard Modal */}
      <SystemStatusModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        progress={progress}
      />
    </div>
  );
};

export default App;
