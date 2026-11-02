export type ScreenType =
  | 'BREACH'
  | 'AUTH'
  | 'GAME_FLAP'
  | 'ARCADE'
  | 'QUIZ_GAMING'
  | 'QUIZ_PERSONAL'
  | 'MOVIE_EXPERIENCE'
  | 'SURPRISE';

export type MiniGameId =
  | 'flap'
  | 'gta'
  | 'spiderman'
  | 'freefire'
  | 'food'
  | 'sleep';

export interface GameProgress {
  // Breach & Auth
  isBreached: boolean;
  isUnlocked: boolean;

  // Games
  flapCompleted: boolean;
  flapBestScore: number;

  gtaCompleted: boolean;
  gtaBestScore: number;

  spidermanCompleted: boolean;
  spidermanBestScore: number;

  freefireCompleted: boolean;
  freefireBestScore: number;

  foodCompleted: boolean;
  foodBestScore: number;

  sleepCompleted: boolean;
  sleepBestScore: number;

  // Quizzes
  gamingQuizCompleted: boolean;
  gamingQuizScore: number;

  personalQuizCompleted: boolean;
  personalQuizScore: number;

  movieQuizCompleted: boolean;
  movieQuizScore: number;

  // Secret Data Fragments (5 fragments scattered across games and arcade)
  fragmentsCollected: number[]; // e.g. [1, 2, 3, 4, 5]
}
