export type ScreenType = 'WELCOME' | 'GAME_FLAP' | 'ARCADE' | 'SURPRISE';

export type MiniGameId = 'flap' | 'catch' | 'memory' | 'reaction' | 'balloon';

export interface GameProgress {
  flapCompleted: boolean;
  flapBestScore: number;
  catchCompleted: boolean;
  catchBestScore: number;
  memoryCompleted: boolean;
  memoryBestMoves: number;
  reactionCompleted: boolean;
  reactionBestMs: number;
  balloonCompleted: boolean;
  balloonBestScore: number;
}
