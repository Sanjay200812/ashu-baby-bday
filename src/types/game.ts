export type ScreenType =
  | 'LOCK'
  | 'WELCOME'
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
  // Lock state
  isUnlocked: boolean;

  // Mini games
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

  // Quizzes & Experience
  gamingQuizCompleted: boolean;
  gamingQuizScore: number;

  personalQuizCompleted: boolean;
  personalQuizScore: number;

  movieQuizCompleted: boolean;
  movieQuizScore: number;
}
