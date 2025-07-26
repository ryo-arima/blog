// Tetris game type definitions

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L' | 'Single' | 'Line2';

export interface Position {
  x: number;
  y: number;
}

export interface TetrominoShape {
  shape: number[][];
  color: string;
  blockType: number;
}

export interface CurrentPiece {
  shape: number[][];
  color: string;
  position: Position;
  type: TetrominoType;
  blockType: number;
}

export type Board = (number | null)[][];

export interface GameState {
  board: Board;
  currentPiece: CurrentPiece | null;
  score: number;
  gameOver: boolean;
  isPlaying: boolean;
}

export interface ClearLinesResult {
  newBoard: Board;
  linesCleared: number;
  matchPoints: number;
}

export interface WallKickOffset {
  x: number;
  y: number;
}

// Type guards and utility functions for better test coverage
export const isValidTetrominoType = (value: any): value is TetrominoType => {
  const validTypes: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L', 'Single', 'Line2'];
  return typeof value === 'string' && validTypes.includes(value as TetrominoType);
};

export const isValidPosition = (value: any): value is Position => {
  return (
    value != null &&
    typeof value === 'object' &&
    typeof value.x === 'number' &&
    typeof value.y === 'number' &&
    !isNaN(value.x) &&
    !isNaN(value.y)
  );
};

export const isValidCurrentPiece = (value: any): value is CurrentPiece => {
  return (
    value != null &&
    typeof value === 'object' &&
    Array.isArray(value.shape) &&
    typeof value.color === 'string' &&
    isValidPosition(value.position) &&
    isValidTetrominoType(value.type)
  );
};

export const isValidGameState = (value: any): value is GameState => {
  return (
    value != null &&
    typeof value === 'object' &&
    Array.isArray(value.board) &&
    (value.currentPiece === null || isValidCurrentPiece(value.currentPiece)) &&
    typeof value.score === 'number' &&
    typeof value.gameOver === 'boolean' &&
    typeof value.isPlaying === 'boolean'
  );
};

export const createEmptyPosition = (): Position => ({ x: 0, y: 0 });

export const createPosition = (x: number, y: number): Position => ({ x, y });

export const clonePosition = (position: Position): Position => ({ ...position });

export const arePositionsEqual = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

export const createEmptyGameState = (): GameState => ({
  board: [],
  currentPiece: null,
  score: 0,
  gameOver: false,
  isPlaying: false,
});

export const TETROMINO_TYPES: readonly TetrominoType[] = Object.freeze(['I', 'O', 'T', 'S', 'Z', 'J', 'L', 'Single', 'Line2']);

export const DEFAULT_BOARD_WIDTH = 10;
export const DEFAULT_BOARD_HEIGHT = 20;
