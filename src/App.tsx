import React, { useState, useEffect } from 'react';
import { ScreenType, GameProgress } from './types/game';
import { HeadphonesIntroScreen } from './components/welcome/HeadphonesIntroScreen';
import { SystemBreachScreen } from './components/breach/SystemBreachScreen';
import { BirthdayFlapGame } from './components/games/BirthdayFlapGame';
import { CatchTheFoodGame } from './components/games/CatchTheFoodGame';
import { SleepModeGame } from './components/games/SleepModeGame';
import { GamingQuiz } from './components/quiz/GamingQuiz';
import { MovieExperience } from './components/movies/MovieExperience';
import { BirthdayLockScreen } from './components/lock/BirthdayLockScreen';
import { FinalSurprise } from './components/surprise/FinalSurprise';
import { LevelPhotoMoment } from './components/common/LevelPhotoMoment';
import { CodexaHackedModal } from './components/common/CodexaHackedModal';
import { FullScreenGalaxyWarning } from './components/common/FullScreenGalaxyWarning';
import { SpecialVideoLevel } from './components/surprise/SpecialVideoLevel';
import { GiftsSelectionLevel } from './components/gifts/GiftsSelectionLevel';
import { GtaChaosRunGame } from './components/games/GtaChaosRunGame';
import { SpiderWebSwingGame } from './components/games/SpiderWebSwingGame';
import { soundSystem } from './utils/audioSystem';
import { BIRTHDAY_CONFIG } from './config/birthdayConfig';

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
  // Always begin with Headphones screen as requested
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('HEADPHONES');

  // Tab switch warning state
  const [showTabWarning, setShowTabWarning] = useState<boolean>(false);

  // Codexa Agency 10-second hack message state
  const [isCodexaModalOpen, setIsCodexaModalOpen] = useState<boolean>(false);
  const [hasCodexaTriggered, setHasCodexaTriggered] = useState<boolean>(false);

  // Progress state
  const [progress, setProgress] = useState<GameProgress>(() => {
    return {
      isBreached: safeGetItem('southdev_breached') === 'true',
      isUnlocked: safeGetItem('southdev_unlocked') === 'true',
      currentLevel: safeGetNumber('southdev_current_level', 0),
      flapCompleted: safeGetItem('birthday_flap_completed') === 'true',
      flapBestScore: safeGetNumber('birthday_flap_best', 0),
      foodCompleted: safeGetItem('birthday_food_completed') === 'true',
      foodBestScore: safeGetNumber('birthday_food_best', 0),
      sleepCompleted: safeGetItem('birthday_sleep_completed') === 'true',
      sleepBestScore: safeGetNumber('birthday_sleep_best', 0),
      gamingQuizCompleted: safeGetItem('birthday_gquiz_completed') === 'true',
      gamingQuizScore: safeGetNumber('birthday_gquiz_score', 0),
      movieQuizCompleted: safeGetItem('birthday_mquiz_completed') === 'true',
      movieQuizScore: safeGetNumber('birthday_mquiz_score', 0),
      selectedGifts: safeGetJson<string[]>('southdev_selected_gifts', ['gta6', 'biryani_pass']),
      gtaCompleted: safeGetItem('birthday_gta_completed') === 'true',
      gtaBestScore: safeGetNumber('birthday_gta_best', 0),
      spidermanCompleted: safeGetItem('birthday_spiderman_completed') === 'true',
      spidermanBestScore: safeGetNumber('birthday_spiderman_best', 0),
      freefireCompleted: safeGetItem('birthday_freefire_completed') === 'true',
      freefireBestScore: safeGetNumber('birthday_freefire_best', 0),
      personalQuizCompleted: safeGetItem('birthday_pquiz_completed') === 'true',
      personalQuizScore: safeGetNumber('birthday_pquiz_score', 0),
      fragmentsCollected: safeGetJson<number[]>('southdev_fragments', []),
    };
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('southdev_breached', progress.isBreached ? 'true' : 'false');
      localStorage.setItem('southdev_unlocked', progress.isUnlocked ? 'true' : 'false');
      localStorage.setItem('southdev_current_level', progress.currentLevel.toString());
      localStorage.setItem('birthday_flap_completed', progress.flapCompleted ? 'true' : 'false');
      localStorage.setItem('birthday_food_completed', progress.foodCompleted ? 'true' : 'false');
      localStorage.setItem('birthday_sleep_completed', progress.sleepCompleted ? 'true' : 'false');
      localStorage.setItem('birthday_gquiz_completed', progress.gamingQuizCompleted ? 'true' : 'false');
      localStorage.setItem('birthday_mquiz_completed', progress.movieQuizCompleted ? 'true' : 'false');
      localStorage.setItem('southdev_selected_gifts', JSON.stringify(progress.selectedGifts));
      localStorage.setItem('southdev_fragments', JSON.stringify(progress.fragmentsCollected));
    } catch (err) {
      console.warn('LocalStorage sync ignored:', err);
    }
  }, [progress]);

  // Full-screen Tab switch listener: "Galaxy without lax!"
  useEffect(() => {
    const originalTitle = document.title || 'Ashu Birthday // South Dev';

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = '⚠️ Galaxy without lax!';
      } else {
        document.title = originalTitle;
        // Show prominent full-screen warning when returning to website
        setShowTabWarning(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Fictional Codexa Agency 10-second hack message:
  // Triggers every 30s on non-game/non-quiz/non-video/non-card screens only
  useEffect(() => {
    const isNonGameScreen = [
      'MOMENT_FLAP',
      'MOMENT_FOOD',
      'MOMENT_SLEEP',
      'MOMENT_SKILLS',
      'LEVEL_GIFTS',
      'AUTH',
    ].includes(currentScreen);

    if (!isNonGameScreen) {
      setIsCodexaModalOpen(false);
      return;
    }

    const interval = setInterval(() => {
      setIsCodexaModalOpen(true);
      const autoCloseTimer = setTimeout(() => {
        setIsCodexaModalOpen(false);
      }, 10000);
      return () => clearTimeout(autoCloseTimer);
    }, 30000);

    return () => clearInterval(interval);
  }, [currentScreen]);

  // ===================== SEQUENTIAL LEVEL HANDLERS =====================

  // Step 0 -> Step 1 (Headphones -> Hacker Mode Start)
  const handleHeadphonesProceed = () => {
    soundSystem.playMusic(BIRTHDAY_CONFIG.siteBgSongUrl);
    setCurrentScreen('BREACH');
  };

  // Step 1 -> Level 1 (Hacker Mode Start -> Flap Protocol)
  const handleBreachStart = () => {
    setProgress((p) => ({ ...p, isBreached: true, currentLevel: 1 }));
    setCurrentScreen('LEVEL_FLAP');
  };

  // Level 1 -> Photo Moment 1
  const handleFlapComplete = (score: number) => {
    soundSystem.playMusic(BIRTHDAY_CONFIG.siteBgSongUrl);
    setProgress((p) => ({
      ...p,
      flapCompleted: true,
      flapBestScore: Math.max(p.flapBestScore, score),
      currentLevel: 1,
    }));
    setCurrentScreen('MOMENT_FLAP');
  };

  // Photo Moment 1 -> Level 2 (Cyber Car Run)
  const handleMomentFlapProceed = () => {
    setCurrentScreen('LEVEL_CAR');
  };

  // Level 2 (Cyber Car Run) -> Level 3 (Foodie)
  const handleCarComplete = (score: number) => {
    setProgress((p) => ({
      ...p,
      gtaCompleted: true,
      gtaBestScore: Math.max(p.gtaBestScore, score),
      currentLevel: 2,
    }));
    setCurrentScreen('LEVEL_FOOD');
  };

  // Level 3 (Foodie) -> Photo Moment 2
  const handleFoodComplete = (score: number) => {
    setProgress((p) => ({
      ...p,
      foodCompleted: true,
      foodBestScore: Math.max(p.foodBestScore, score),
      currentLevel: 3,
    }));
    setCurrentScreen('MOMENT_FOOD');
  };

  // Photo Moment 2 -> Level 4 (Spider-Man Web Swing)
  const handleMomentFoodProceed = () => {
    setCurrentScreen('LEVEL_SPIDER');
  };

  // Level 4 (Spider-Man) -> Level 5 (Sleep Mode)
  const handleSpiderComplete = (score: number) => {
    setProgress((p) => ({
      ...p,
      spidermanCompleted: true,
      spidermanBestScore: Math.max(p.spidermanBestScore, score),
      currentLevel: 4,
    }));
    setCurrentScreen('LEVEL_SLEEP');
  };

  // Level 5 (Sleep Mode) -> Photo Moment 3
  const handleSleepComplete = (score: number) => {
    setProgress((p) => ({
      ...p,
      sleepCompleted: true,
      sleepBestScore: Math.max(p.sleepBestScore, score),
      currentLevel: 5,
    }));
    setCurrentScreen('MOMENT_SLEEP');
  };

  // Photo Moment 3 -> Level 6 (Gaming Quiz)
  const handleMomentSleepProceed = () => {
    setCurrentScreen('LEVEL_GAMING_QUIZ');
  };

  // Level 6 -> Photo Moment 4 (Skills Dossier)
  const handleGamingQuizComplete = (score: number) => {
    setProgress((p) => ({
      ...p,
      gamingQuizCompleted: true,
      gamingQuizScore: Math.max(p.gamingQuizScore, score),
      currentLevel: 6,
    }));
    setCurrentScreen('MOMENT_SKILLS');
  };

  // Photo Moment 4 -> Level 7 (Movie Quiz)
  const handleMomentSkillsProceed = () => {
    setCurrentScreen('LEVEL_MOVIE_QUIZ');
  };

  // Level 7 -> Level 8 (Special Video Reel Level)
  const handleMovieQuizComplete = (score: number) => {
    setProgress((p) => ({
      ...p,
      movieQuizCompleted: true,
      movieQuizScore: Math.max(p.movieQuizScore, score),
      currentLevel: 7,
    }));
    setCurrentScreen('LEVEL_VIDEO');
  };

  // Level 8 -> Level 9 (Gifts Selection Level)
  const handleVideoComplete = () => {
    setProgress((p) => ({ ...p, currentLevel: 8 }));
    setCurrentScreen('LEVEL_GIFTS');
  };

  // Level 9 -> Level 10 (Birthday Verification Gate)
  const handleGiftsComplete = (selectedIds: string[]) => {
    setProgress((p) => ({
      ...p,
      selectedGifts: selectedIds,
      currentLevel: 9,
    }));
    setCurrentScreen('AUTH');
  };

  // Birthday Verification Gate -> Final Celebration Screen (ONLY Birthday Card)
  const handleAuthComplete = () => {
    setProgress((p) => ({ ...p, isUnlocked: true, currentLevel: 10 }));
    soundSystem.playMusic(BIRTHDAY_CONFIG.birthdaySongUrl);
    setCurrentScreen('SURPRISE');
  };

  // Replay All Levels
  const handleReplayAll = () => {
    soundSystem.pauseMusic();
    setProgress((p) => ({ ...p, currentLevel: 0 }));
    setCurrentScreen('HEADPHONES');
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Full-Screen Tab Switch Warning: "Galaxy without lax!" */}
      <FullScreenGalaxyWarning
        isOpen={showTabWarning}
        onDismiss={() => setShowTabWarning(false)}
      />

      {/* Fictional Codexa Agency 10-Second Hacker Message */}
      <CodexaHackedModal
        isOpen={isCodexaModalOpen}
        onClose={() => setIsCodexaModalOpen(false)}
      />

      {/* STEP 0: Use Headphones for Best Experience */}
      {currentScreen === 'HEADPHONES' && (
        <HeadphonesIntroScreen onEnter={handleHeadphonesProceed} />
      )}

      {/* STEP 1: Hacker Mode Intro (Warning 69) */}
      {currentScreen === 'BREACH' && (
        <SystemBreachScreen
          onEnter={handleBreachStart}
          onBack={() => setCurrentScreen('HEADPHONES')}
        />
      )}

      {/* LEVEL 1: Flap Protocol */}
      {currentScreen === 'LEVEL_FLAP' && (
        <BirthdayFlapGame
          onLevelComplete={handleFlapComplete}
          onBack={() => setCurrentScreen('BREACH')}
        />
      )}

      {/* PHOTO MOMENT 1: Ashu Character */}
      {currentScreen === 'MOMENT_FLAP' && (
        <LevelPhotoMoment
          levelTitle="LEVEL 1 COMPLETE: FLAP MASTER!"
          badgeText="STAGE 1 CLEARED"
          photoUrl={BIRTHDAY_CONFIG.characterFaceUrl}
          tenglishQuote="12 CPU barriers ni rocket laaga daatesav! Asalu flying skills vere level Ashuu! 🦅🔥"
          nextButtonText="[ PROCEED TO LEVEL 2: CYBER CAR RUN ➔ ]"
          onProceed={handleMomentFlapProceed}
          onBack={() => setCurrentScreen('LEVEL_FLAP')}
        />
      )}

      {/* LEVEL 2: Cyber Car Run */}
      {currentScreen === 'LEVEL_CAR' && (
        <GtaChaosRunGame
          onComplete={handleCarComplete}
          onBack={() => setCurrentScreen('MOMENT_FLAP')}
        />
      )}

      {/* LEVEL 3: Restaurant Feast Catcher */}
      {currentScreen === 'LEVEL_FOOD' && (
        <CatchTheFoodGame
          onComplete={handleFoodComplete}
          onBack={() => setCurrentScreen('LEVEL_CAR')}
        />
      )}

      {/* PHOTO MOMENT 2: Ashu Foodie Photo */}
      {currentScreen === 'MOMENT_FOOD' && (
        <LevelPhotoMoment
          levelTitle="LEVEL 3 COMPLETE: FEAST SECURED!"
          badgeText="STAGE 3 CLEARED"
          photoUrl={BIRTHDAY_CONFIG.foodiePhotos[0]}
          tenglishQuote="10 plates Biryani & Feast finish chesav! Foodie Gang lo Ashuu thopu anthe! 🍗🤤"
          nextButtonText="[ PROCEED TO LEVEL 4: SPIDER-MAN PROTOCOL ➔ ]"
          onProceed={handleMomentFoodProceed}
          onBack={() => setCurrentScreen('LEVEL_FOOD')}
        />
      )}

      {/* LEVEL 4: Spider-Man Web Swing */}
      {currentScreen === 'LEVEL_SPIDER' && (
        <SpiderWebSwingGame
          onComplete={handleSpiderComplete}
          onBack={() => setCurrentScreen('MOMENT_FOOD')}
        />
      )}

      {/* LEVEL 5: Sleep Mode: Wake Up Ashuu */}
      {currentScreen === 'LEVEL_SLEEP' && (
        <SleepModeGame
          onComplete={handleSleepComplete}
          onBack={() => setCurrentScreen('LEVEL_SPIDER')}
        />
      )}

      {/* PHOTO MOMENT 3: Ashu Sleeping Photo */}
      {currentScreen === 'MOMENT_SLEEP' && (
        <LevelPhotoMoment
          levelTitle="LEVEL 5 COMPLETE: ASHUU AWAKE!"
          badgeText="STAGE 5 CLEARED"
          photoUrl={BIRTHDAY_CONFIG.sleepingPhotoUrl}
          tenglishQuote="Kadaaki 14-hour nidra nunchi lechaadu hero! College class miss avvakunda kapadaam! ⏰😴"
          nextButtonText="[ PROCEED TO LEVEL 6: GAMING QUIZ ➔ ]"
          onProceed={handleMomentSleepProceed}
          onBack={() => setCurrentScreen('LEVEL_SLEEP')}
        />
      )}

      {/* LEVEL 6: Free Fire & GTA 5 Quiz */}
      {currentScreen === 'LEVEL_GAMING_QUIZ' && (
        <GamingQuiz
          onComplete={handleGamingQuizComplete}
          onBack={() => setCurrentScreen('MOMENT_SLEEP')}
        />
      )}

      {/* PHOTO MOMENT 4: Ashu Skills Image */}
      {currentScreen === 'MOMENT_SKILLS' && (
        <LevelPhotoMoment
          levelTitle="LEVEL 6 COMPLETE: PRO GAMER VERIFIED!"
          badgeText="STAGE 6 CLEARED"
          photoUrl={BIRTHDAY_CONFIG.ashuuSkillsImageUrl}
          tenglishQuote="CodeXa Agency Founder, Pro Gamer, Lover Boy, Full-Stack Hacker Ashuu! 💻😎"
          nextButtonText="[ PROCEED TO LEVEL 7: TELUGU MOVIES ➔ ]"
          onProceed={handleMomentSkillsProceed}
          onBack={() => setCurrentScreen('LEVEL_GAMING_QUIZ')}
        />
      )}

      {/* LEVEL 7: Telugu Movie Quiz (Dude, Magadheera, Spider-Man) */}
      {currentScreen === 'LEVEL_MOVIE_QUIZ' && (
        <MovieExperience
          onComplete={handleMovieQuizComplete}
          onBack={() => setCurrentScreen('MOMENT_SKILLS')}
        />
      )}

      {/* LEVEL 8: Special Birthday Reel Video */}
      {currentScreen === 'LEVEL_VIDEO' && (
        <SpecialVideoLevel
          onComplete={handleVideoComplete}
          onBack={() => setCurrentScreen('LEVEL_MOVIE_QUIZ')}
        />
      )}

      {/* LEVEL 9: Selectable Gifts Area (GF set, GTA 6, PS5, etc.) */}
      {currentScreen === 'LEVEL_GIFTS' && (
        <GiftsSelectionLevel
          onComplete={handleGiftsComplete}
          onBack={() => setCurrentScreen('LEVEL_VIDEO')}
        />
      )}

      {/* LEVEL 10: Birthday Verification Gate (50021130 + Galaxy without lax question) */}
      {currentScreen === 'AUTH' && (
        <BirthdayLockScreen
          onUnlock={handleAuthComplete}
          onBack={() => setCurrentScreen('LEVEL_GIFTS')}
        />
      )}

      {/* FINAL CELEBRATION: Only Final Birthday Card with downloads & selected gifts */}
      {currentScreen === 'SURPRISE' && (
        <FinalSurprise
          selectedGiftIds={progress.selectedGifts}
          onReplayAll={handleReplayAll}
          onBack={() => setCurrentScreen('AUTH')}
        />
      )}
    </div>
  );
};

export default App;
