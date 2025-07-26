import { describe, it, expect } from 'vitest';
import type { 
  TetrominoType, 
  Position, 
  TetrominoShape, 
  CurrentPiece, 
  Board, 
  GameState,
  ClearLinesResult,
  WallKickOffset
} from '../../../components/types/tetris.types';
import {
  isValidTetrominoType,
  isValidPosition,
  isValidCurrentPiece,
  isValidGameState,
  createEmptyPosition,
  createPosition,
  clonePosition,
  arePositionsEqual,
  createEmptyGameState,
  TETROMINO_TYPES,
  DEFAULT_BOARD_WIDTH,
  DEFAULT_BOARD_HEIGHT
} from '../../../components/types/tetris.types';

describe('tetris.types', () => {
  describe('Type Guards', () => {
    describe('isValidTetrominoType', () => {
      it('should return true for valid tetromino types', () => {
        expect(isValidTetrominoType('I')).toBe(true);
        expect(isValidTetrominoType('O')).toBe(true);
        expect(isValidTetrominoType('T')).toBe(true);
        expect(isValidTetrominoType('S')).toBe(true);
        expect(isValidTetrominoType('Z')).toBe(true);
        expect(isValidTetrominoType('J')).toBe(true);
        expect(isValidTetrominoType('L')).toBe(true);
        expect(isValidTetrominoType('Single')).toBe(true);
        expect(isValidTetrominoType('Line2')).toBe(true);
      });

      it('should return false for invalid tetromino types', () => {
        expect(isValidTetrominoType('X')).toBe(false);
        expect(isValidTetrominoType('')).toBe(false);
        expect(isValidTetrominoType(123)).toBe(false);
        expect(isValidTetrominoType(null)).toBe(false);
        expect(isValidTetrominoType(undefined)).toBe(false);
        expect(isValidTetrominoType({})).toBe(false);
        expect(isValidTetrominoType([])).toBe(false);
      });
    });

    describe('isValidPosition', () => {
      it('should return true for valid positions', () => {
        expect(isValidPosition({ x: 0, y: 0 })).toBe(true);
        expect(isValidPosition({ x: 5, y: 10 })).toBe(true);
        expect(isValidPosition({ x: -1, y: 20 })).toBe(true);
      });

      it('should return false for invalid positions', () => {
        expect(isValidPosition(null)).toBe(false);
        expect(isValidPosition(undefined)).toBe(false);
        expect(isValidPosition({})).toBe(false);
        expect(isValidPosition({ x: 'invalid', y: 0 })).toBe(false);
        expect(isValidPosition({ x: 0, y: 'invalid' })).toBe(false);
        expect(isValidPosition({ x: NaN, y: 0 })).toBe(false);
        expect(isValidPosition({ x: 0, y: NaN })).toBe(false);
        expect(isValidPosition({ x: 0 })).toBe(false);
        expect(isValidPosition({ y: 0 })).toBe(false);
        expect(isValidPosition('string')).toBe(false);
        expect(isValidPosition(123)).toBe(false);
      });
    });

    describe('isValidCurrentPiece', () => {
      it('should return true for valid current pieces', () => {
        const validPiece: CurrentPiece = {
          shape: [[1, 0], [1, 1]],
          color: '#ff0000',
          position: { x: 5, y: 10 },
          type: 'T',
          blockType: 1
        };
        expect(isValidCurrentPiece(validPiece)).toBe(true);
      });

      it('should return false for invalid current pieces', () => {
        expect(isValidCurrentPiece(null)).toBe(false);
        expect(isValidCurrentPiece(undefined)).toBe(false);
        expect(isValidCurrentPiece({})).toBe(false);
        expect(isValidCurrentPiece({ shape: 'invalid' })).toBe(false);
        expect(isValidCurrentPiece({ 
          shape: [[1]], 
          color: 123,
          position: { x: 0, y: 0 },
          type: 'T'
        })).toBe(false);
        expect(isValidCurrentPiece({ 
          shape: [[1]], 
          color: '#ff0000',
          position: 'invalid',
          type: 'T'
        })).toBe(false);
        expect(isValidCurrentPiece({ 
          shape: [[1]], 
          color: '#ff0000',
          position: { x: 0, y: 0 },
          type: 'INVALID'
        })).toBe(false);
      });
    });

    describe('isValidGameState', () => {
      it('should return true for valid game states', () => {
        const validState: GameState = {
          board: [[]],
          currentPiece: null,
          score: 0,
          gameOver: false,
          isPlaying: false
        };
        expect(isValidGameState(validState)).toBe(true);

        const validStateWithPiece: GameState = {
          board: [[]],
          currentPiece: {
            shape: [[1]],
            color: '#ff0000',
            position: { x: 0, y: 0 },
            type: 'T',
            blockType: 1
          },
          score: 100,
          gameOver: true,
          isPlaying: true
        };
        expect(isValidGameState(validStateWithPiece)).toBe(true);
      });

      it('should return false for invalid game states', () => {
        expect(isValidGameState(null)).toBe(false);
        expect(isValidGameState(undefined)).toBe(false);
        expect(isValidGameState({})).toBe(false);
        expect(isValidGameState({ board: 'invalid' })).toBe(false);
        expect(isValidGameState({ 
          board: [],
          currentPiece: 'invalid',
          score: 0,
          gameOver: false,
          isPlaying: false
        })).toBe(false);
        expect(isValidGameState({ 
          board: [],
          currentPiece: null,
          score: 'invalid',
          gameOver: false,
          isPlaying: false
        })).toBe(false);
        expect(isValidGameState({ 
          board: [],
          currentPiece: null,
          score: 0,
          gameOver: 'invalid',
          isPlaying: false
        })).toBe(false);
        expect(isValidGameState({ 
          board: [],
          currentPiece: null,
          score: 0,
          gameOver: false,
          isPlaying: 'invalid'
        })).toBe(false);
      });
    });
  });

  describe('Utility Functions', () => {
    describe('createEmptyPosition', () => {
      it('should create position at origin', () => {
        const position = createEmptyPosition();
        expect(position).toEqual({ x: 0, y: 0 });
      });
    });

    describe('createPosition', () => {
      it('should create position with given coordinates', () => {
        const position = createPosition(5, 10);
        expect(position).toEqual({ x: 5, y: 10 });
      });
    });

    describe('clonePosition', () => {
      it('should create a copy of position', () => {
        const original = { x: 5, y: 10 };
        const cloned = clonePosition(original);
        
        expect(cloned).toEqual(original);
        expect(cloned).not.toBe(original); // Different reference
        
        // Modify original to ensure independence
        original.x = 99;
        expect(cloned.x).toBe(5);
      });
    });

    describe('arePositionsEqual', () => {
      it('should return true for equal positions', () => {
        expect(arePositionsEqual({ x: 5, y: 10 }, { x: 5, y: 10 })).toBe(true);
        expect(arePositionsEqual({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(true);
        expect(arePositionsEqual({ x: -1, y: -1 }, { x: -1, y: -1 })).toBe(true);
      });

      it('should return false for different positions', () => {
        expect(arePositionsEqual({ x: 5, y: 10 }, { x: 5, y: 11 })).toBe(false);
        expect(arePositionsEqual({ x: 5, y: 10 }, { x: 6, y: 10 })).toBe(false);
        expect(arePositionsEqual({ x: 5, y: 10 }, { x: 0, y: 0 })).toBe(false);
      });
    });

    describe('createEmptyGameState', () => {
      it('should create initial game state', () => {
        const state = createEmptyGameState();
        expect(state).toEqual({
          board: [],
          currentPiece: null,
          score: 0,
          gameOver: false,
          isPlaying: false
        });
      });
    });
  });

  describe('Constants', () => {
    describe('TETROMINO_TYPES', () => {
      it('should contain all valid tetromino types', () => {
        expect(TETROMINO_TYPES).toEqual(['I', 'O', 'T', 'S', 'Z', 'J', 'L', 'Single', 'Line2']);
        expect(TETROMINO_TYPES.length).toBe(9);
      });

      it('should be readonly', () => {
        expect(Object.isFrozen(TETROMINO_TYPES)).toBe(true);
      });
    });

    describe('Board dimensions', () => {
      it('should have default board dimensions', () => {
        expect(DEFAULT_BOARD_WIDTH).toBe(10);
        expect(DEFAULT_BOARD_HEIGHT).toBe(20);
      });
    });
  });

  describe('TetrominoType', () => {
    it('should define valid tetromino types', () => {
      const validTypes: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L', 'Single', 'Line2'];
      
      // TypeScriptコンパイル時にチェックされるため、実行時テストは型の利用例を確認
      validTypes.forEach(type => {
        expect(typeof type).toBe('string');
      });
    });
  });

  describe('Position', () => {
    it('should have x and y coordinates', () => {
      const position: Position = { x: 5, y: 10 };
      
      expect(position.x).toBe(5);
      expect(position.y).toBe(10);
      expect(typeof position.x).toBe('number');
      expect(typeof position.y).toBe('number');
    });
  });

  describe('TetrominoShape', () => {
    it('should have shape, color, and blockType properties', () => {
      const shape: TetrominoShape = {
        shape: [[1, 0], [1, 1]],
        color: '#ff0000',
        blockType: 1
      };
      
      expect(Array.isArray(shape.shape)).toBe(true);
      expect(Array.isArray(shape.shape[0])).toBe(true);
      expect(typeof shape.color).toBe('string');
      expect(typeof shape.blockType).toBe('number');
    });
  });

  describe('CurrentPiece', () => {
    it('should have all required properties', () => {
      const piece: CurrentPiece = {
        shape: [[1, 1], [1, 1]],
        color: '#f0f000',
        position: { x: 0, y: 5 },
        type: 'O',
        blockType: 1
      };
      
      expect(Array.isArray(piece.shape)).toBe(true);
      expect(typeof piece.color).toBe('string');
      expect(typeof piece.position.x).toBe('number');
      expect(typeof piece.position.y).toBe('number');
      expect(typeof piece.type).toBe('string');
      expect(typeof piece.blockType).toBe('number');
    });
  });

  describe('Board', () => {
    it('should be a 2D array of numbers or null', () => {
      const board: Board = [
        [null, 1, null],
        [2, null, 3]
      ];
      
      expect(Array.isArray(board)).toBe(true);
      expect(Array.isArray(board[0])).toBe(true);
      expect(board[0][0]).toBeNull();
      expect(typeof board[0][1]).toBe('number');
      expect(typeof board[1][0]).toBe('number');
    });
  });

  describe('GameState', () => {
    it('should have all game state properties', () => {
      const gameState: GameState = {
        board: [[null, null], [null, null]],
        currentPiece: null,
        score: 100,
        gameOver: false,
        isPlaying: true
      };
      
      expect(Array.isArray(gameState.board)).toBe(true);
      expect(gameState.currentPiece).toBeNull();
      expect(typeof gameState.score).toBe('number');
      expect(typeof gameState.gameOver).toBe('boolean');
      expect(typeof gameState.isPlaying).toBe('boolean');
    });

    it('should support currentPiece as CurrentPiece object', () => {
      const gameState: GameState = {
        board: [[null, null], [null, null]],
        currentPiece: {
          shape: [[1]],
          color: '#ff0000',
          position: { x: 0, y: 0 },
          type: 'Single',
          blockType: 1
        },
        score: 200,
        gameOver: false,
        isPlaying: true
      };
      
      expect(gameState.currentPiece).not.toBeNull();
      expect(gameState.currentPiece?.type).toBe('Single');
    });
  });

  describe('ClearLinesResult', () => {
    it('should have all clear lines result properties', () => {
      const result: ClearLinesResult = {
        newBoard: [[null, null], [null, null]],
        linesCleared: 2,
        matchPoints: 50
      };
      
      expect(Array.isArray(result.newBoard)).toBe(true);
      expect(typeof result.linesCleared).toBe('number');
      expect(typeof result.matchPoints).toBe('number');
    });
  });

  describe('WallKickOffset', () => {
    it('should have x and y offset properties', () => {
      const offset: WallKickOffset = { x: -1, y: 0 };
      
      expect(typeof offset.x).toBe('number');
      expect(typeof offset.y).toBe('number');
    });
  });
});
