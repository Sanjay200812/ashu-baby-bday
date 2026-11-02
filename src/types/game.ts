export type ScreenType =
  | 'HEADPHONES' // Step 0: Headphones prompt
  | 'BREACH' // Step 1: Hacker Mode Intro (Warning 69)
  | 'LEVEL_FLAP' // Level 1: Flap Protocol (12 passes)
  | 'MOMENT_FLAP' // Photo Moment: Ashu character
  | 'LEVEL_CAR' // Level 2: Cyber Car Run
  | 'LEVEL_FOOD' // Level 3: Restaurant Feast
  | 'MOMENT_FOOD' // Photo Moment: Ashu Foodie
  | 'LEVEL_SPIDER' // Level 4: Spider-Man Web Swing
  | 'LEVEL_SLEEP' // Level 5: Wake Up Ashuu
  | 'MOMENT_SLEEP' // Photo Moment: Ashu Sleeping
  | 'LEVEL_GAMING_QUIZ' // Level 6: Free Fire & GTA 5 Quiz
  | 'MOMENT_SKILLS' // Photo Moment: Ashu Skills / Hacker Dossier
  | 'LEVEL_MOVIE_QUIZ' // Level 7: Telugu Movie Quiz (Dude, Spider-Man, Magadheera)
  | 'LEVEL_VIDEO' // Level 8: Special Video Reel Level
  | 'LEVEL_GIFTS' // Level 9: Selectable Gifts Area (GF set, GTA 6, PS5, etc.)
  | 'AUTH' // Birthday Verification Gate (50021130 + Galaxy without lax question)
  | 'SURPRISE' // Final Birthday Card & Celebration
  | 'FOODIE'
  | 'SKILLS'
  | 'ARCADE'
  | 'GAME_FLAP'
  | 'QUIZ_GAMING'
  | 'QUIZ_PERSONAL'
  | 'MOVIE_EXPERIENCE';

export type MiniGameId =
  | 'flap'
  | 'gta'
  | 'spiderman'
  | 'freefire'
  | 'food'
  | 'sleep';

export interface GameProgress {
  isBreached: boolean;
  isUnlocked: boolean;
  currentLevel: number;
  flapCompleted: boolean;
  flapBestScore: number;
  foodCompleted: boolean;
  foodBestScore: number;
  sleepCompleted: boolean;
  sleepBestScore: number;
  gamingQuizCompleted: boolean;
  gamingQuizScore: number;
  movieQuizCompleted: boolean;
  movieQuizScore: number;
  selectedGifts: string[]; // Selected gift IDs for final card
  gtaCompleted: boolean;
  gtaBestScore: number;
  spidermanCompleted: boolean;
  spidermanBestScore: number;
  freefireCompleted: boolean;
  freefireBestScore: number;
  personalQuizCompleted: boolean;
  personalQuizScore: number;
  fragmentsCollected: number[];
}
