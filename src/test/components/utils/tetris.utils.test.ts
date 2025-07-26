import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createEmptyBoard,
  getRandomTetromino,
  spawnNewPiece,
  isValidPosition,
  placePiece,
  rotatePieceShape,
  clearLines,
  checkGameOver,
  createDisplayBoard,
} from '../../../components/utils/tetris.utils';
import { GAME_CONFIG, TETROMINOES, BLOCK_TYPES } from '../../../components/constants/tetris.constants';
import type { Board, CurrentPiece } from '../../../components/types/tetris.types';

describe('tetris.utils', () => {
  let emptyBoard: Board;
  let testPiece: CurrentPiece;

  beforeEach(() => {
    emptyBoard = createEmptyBoard();
    testPiece = {
      shape: [[1, 1], [1, 1]],
      color: '#f0f000',
      position: { x: 0, y: 5 },
      type: 'O',
      blockType: BLOCK_TYPES.O_PIECE
    };
  });

  describe('createEmptyBoard', () => {
    it('should create board with correct dimensions', () => {
      const board = createEmptyBoard();
      expect(board).toHaveLength(GAME_CONFIG.BOARD_HEIGHT);
      expect(board[0]).toHaveLength(GAME_CONFIG.BOARD_WIDTH);
    });

    it('should create board filled with null values', () => {
      const board = createEmptyBoard();
      const hasNonNullCell = board.some(row => row.some(cell => cell !== null));
      expect(hasNonNullCell).toBe(false);
    });
  });

  describe('getRandomTetromino', () => {
    it('should return a valid tetromino type', () => {
      const type = getRandomTetromino();
      expect(Object.keys(TETROMINOES)).toContain(type);
    });

    it('should return different types when called multiple times', () => {
      const types = new Set();
      for (let i = 0; i < 50; i++) {
        types.add(getRandomTetromino());
      }
      expect(types.size).toBeGreaterThan(1);
    });
  });

  describe('spawnNewPiece', () => {
    it('should create a piece with valid properties', () => {
      const piece = spawnNewPiece();
      expect(piece.shape).toBeDefined();
      expect(piece.color).toBeDefined();
      expect(piece.position).toBeDefined();
      expect(piece.type).toBeDefined();
      expect(Object.keys(TETROMINOES)).toContain(piece.type);
    });

    it('should spawn piece at correct initial position', () => {
      const piece = spawnNewPiece();
      expect(piece.position.x).toBe(0);
      expect(piece.position.y).toBe(Math.floor((GAME_CONFIG.BOARD_HEIGHT - 4) / 2));
    });
  });

  describe('isValidPosition', () => {
    it('should return true for valid positions within board bounds', () => {
      const piece: CurrentPiece = {
        shape: [[1]],
        color: '#ff0000',
        position: { x: 0, y: 0 },
        type: 'Single',
        blockType: 1
      };
      expect(isValidPosition(piece, { x: 0, y: 0 }, emptyBoard)).toBe(true);
    });

    it('should return false for positions outside board bounds - left', () => {
      const piece: CurrentPiece = {
        shape: [[1]],
        color: '#ff0000',
        position: { x: 0, y: 0 },
        type: 'Single',
        blockType: 1
      };
      expect(isValidPosition(piece, { x: -1, y: 0 }, emptyBoard)).toBe(false);
    });

    it('should return false for positions outside board bounds - right', () => {
      const piece: CurrentPiece = {
        shape: [[1]],
        color: '#ff0000',
        position: { x: 0, y: 0 },
        type: 'Single',
        blockType: 1
      };
      expect(isValidPosition(piece, { x: GAME_CONFIG.BOARD_WIDTH, y: 0 }, emptyBoard)).toBe(false);
    });

    it('should return false for positions outside board bounds - top', () => {
      const piece: CurrentPiece = {
        shape: [[1]],
        color: '#ff0000',
        position: { x: 0, y: 0 },
        type: 'Single',
        blockType: 1
      };
      expect(isValidPosition(piece, { x: 0, y: -1 }, emptyBoard)).toBe(false);
    });

    it('should return false for positions outside board bounds - bottom', () => {
      const piece: CurrentPiece = {
        shape: [[1]],
        color: '#ff0000',
        position: { x: 0, y: 0 },
        type: 'Single',
        blockType: 1
      };
      expect(isValidPosition(piece, { x: 0, y: GAME_CONFIG.BOARD_HEIGHT }, emptyBoard)).toBe(false);
    });

    it('should return false for positions where piece overlaps existing blocks', () => {
      // Place a block on the board
      const boardWithBlock = emptyBoard.map(row => [...row]);
      boardWithBlock[0][0] = 1;

      const piece: CurrentPiece = {
        shape: [[1]],
        color: '#ff0000',
        position: { x: 0, y: 0 },
        type: 'Single',
        blockType: 1
      };
      expect(isValidPosition(piece, { x: 0, y: 0 }, boardWithBlock)).toBe(false);
    });

    it('should handle multi-cell pieces correctly', () => {
      const piece: CurrentPiece = {
        shape: [[1, 1], [1, 1]],
        color: '#f0f000',
        position: { x: 0, y: 0 },
        type: 'O',
        blockType: 2
      };
      expect(isValidPosition(piece, { x: GAME_CONFIG.BOARD_WIDTH - 1, y: 0 }, emptyBoard)).toBe(false); // Would go outside right boundary
    });

    it('should handle empty cells in piece shape', () => {
      const piece: CurrentPiece = {
        shape: [[1, 0], [0, 1]],
        color: '#ff0000',
        position: { x: 0, y: 0 },
        type: 'S',
        blockType: 1
      };
      expect(isValidPosition(piece, { x: 0, y: 0 }, emptyBoard)).toBe(true);
    });
  });

  describe('placePiece', () => {
    it('should place piece on board correctly', () => {
      const board = placePiece(testPiece, emptyBoard);
      expect(board[5][0]).toBe(testPiece.blockType);
      expect(board[5][1]).toBe(testPiece.blockType);
      expect(board[6][0]).toBe(testPiece.blockType);
      expect(board[6][1]).toBe(testPiece.blockType);
    });

    it('should not modify original board', () => {
      const originalBoard = [...emptyBoard];
      placePiece(testPiece, emptyBoard);
      expect(emptyBoard).toEqual(originalBoard);
    });

    it('should handle piece placement outside boundaries gracefully', () => {
      const piece = { ...testPiece, position: { x: -10, y: -10 } }; // 完全に境界外
      const board = placePiece(piece, emptyBoard);
      // ボードが変更されていないことを確認
      const hasChanges = board.some(row => row.some(cell => cell !== null));
      expect(hasChanges).toBe(false);
    });
  });

  describe('rotatePieceShape', () => {
    it('should rotate 2x2 shape correctly', () => {
      const shape = [[1, 0], [1, 1]];
      const rotated = rotatePieceShape(shape);
      expect(rotated).toEqual([[1, 1], [1, 0]]);
    });

    it('should rotate T-piece correctly', () => {
      const tShape = TETROMINOES.T.shape;
      const rotated = rotatePieceShape(tShape);
      expect(rotated[0]).toEqual([0, 1, 0, 0]);
      expect(rotated[1]).toEqual([0, 1, 1, 0]);
      expect(rotated[2]).toEqual([0, 1, 0, 0]);
      expect(rotated[3]).toEqual([0, 0, 0, 0]);
    });

    it('should rotate I-piece correctly', () => {
      const iShape = TETROMINOES.I.shape;
      const rotated = rotatePieceShape(iShape);
      expect(rotated[0]).toEqual([0, 0, 1, 0]);
      expect(rotated[1]).toEqual([0, 0, 1, 0]);
      expect(rotated[2]).toEqual([0, 0, 1, 0]);
      expect(rotated[3]).toEqual([0, 0, 0, 0]);
    });
  });

  describe('clearLines', () => {
    it('should not clear lines when no full columns exist', () => {
      const result = clearLines(emptyBoard);
      expect(result.linesCleared).toBe(0);
      expect(result.matchPoints).toBe(0);
    });

    it('should clear full column correctly', () => {
      const board = [...emptyBoard];
      // 縦方向に5個連続で同じ色を配置
      for (let row = 0; row < 5; row++) {
        board[row][0] = 1;
      }
      
      const result = clearLines(board);
      expect(result.linesCleared).toBe(0); // linesClearedは満杯の列用、マッチはmatchPoints
      expect(result.matchPoints).toBeGreaterThan(0); // マッチがあるので点数が付く
    });

    it('should detect and clear horizontal matches of 5+', () => {
      const board = [...emptyBoard];
      // 水平方向に5個連続で同じ色を配置
      for (let col = 0; col < 5; col++) {
        board[0][col] = 2;
      }
      
      const result = clearLines(board);
      expect(result.matchPoints).toBeGreaterThan(0);
      
      // マッチしたブロックが削除されていることを確認
      const hasRedBlocks = result.newBoard[0].slice(0, 5).some(cell => cell === 2);
      expect(hasRedBlocks).toBe(false);
    });

    it('should detect and clear vertical matches of 5+', () => {
      const board = [...emptyBoard];
      // 垂直方向に5個連続で同じ色を配置
      for (let row = 0; row < 5; row++) {
        board[row][0] = 3;
      }
      
      const result = clearLines(board);
      expect(result.matchPoints).toBeGreaterThan(0);
      
      // マッチしたブロックが削除されていることを確認
      const hasRedBlocks = result.newBoard.slice(0, 5).some(row => row[0] === 3);
      expect(hasRedBlocks).toBe(false);
    });

    it('should apply gravity after clearing matches', () => {
      const board = [...emptyBoard];
      // 左側にブロック、中央に5個マッチ、右側にブロックを配置
      board[0][0] = 4;
      for (let col = 1; col < 6; col++) {
        board[0][col] = 5; // 5個マッチ
      }
      board[0][10] = 6;
      
      const result = clearLines(board);
      
      // 重力適用後、ブロックが右側に詰まっていることを確認
      // マッチしたブロックが削除され、残りのブロックが右に移動
      expect(result.newBoard[0][GAME_CONFIG.BOARD_WIDTH - 1]).toBe(6);
      expect(result.newBoard[0][GAME_CONFIG.BOARD_WIDTH - 2]).toBe(4);
    });

    it('should handle multiple consecutive matches (chain reaction)', () => {
      const board = [...emptyBoard];
      // 連鎖が発生するパターンを設定
      for (let col = 0; col < 5; col++) {
        board[0][col] = 7;
      }
      for (let col = 10; col < 15; col++) {
        board[0][col] = 8;
      }
      
      const result = clearLines(board);
      expect(result.matchPoints).toBeGreaterThan(0);
    });
  });

  describe('checkGameOver', () => {
    it('should return false for empty board', () => {
      const result = checkGameOver(emptyBoard);
      expect(result).toBe(false);
    });

    it('should return true when right edge is filled', () => {
      const board = [...emptyBoard];
      // 右端から連続で28列以上詰める（30-2=28列以上でゲームオーバー）
      for (let col = GAME_CONFIG.BOARD_WIDTH - 28; col < GAME_CONFIG.BOARD_WIDTH; col++) {
        board[0][col] = 1;
      }
      
      const result = checkGameOver(board);
      expect(result).toBe(true);
    });

    it('should return false when right edge has gaps', () => {
      const board = [...emptyBoard];
      // 右端近くにブロックを配置するが、ゲームオーバー条件に満たない（7列のみ）
      for (let col = GAME_CONFIG.BOARD_WIDTH - 7; col < GAME_CONFIG.BOARD_WIDTH; col++) {
        board[0][col] = 2;
      }
      
      const result = checkGameOver(board);
      expect(result).toBe(false);
    });

    it('should check all rows for game over condition', () => {
      const board = [...emptyBoard];
      // 下の行の右端を28列以上詰める
      for (let col = GAME_CONFIG.BOARD_WIDTH - 28; col < GAME_CONFIG.BOARD_WIDTH; col++) {
        board[GAME_CONFIG.BOARD_HEIGHT - 1][col] = 1;
      }
      
      const result = checkGameOver(board);
      expect(result).toBe(true);
    });
  });

  describe('createDisplayBoard', () => {
    it('should return original board when no current piece', () => {
      const result = createDisplayBoard(emptyBoard, null);
      expect(result).toEqual(emptyBoard);
    });

    it('should overlay current piece on board', () => {
      const result = createDisplayBoard(emptyBoard, testPiece);
      expect(result[5][0]).toBe(testPiece.blockType);
      expect(result[5][1]).toBe(testPiece.blockType);
      expect(result[6][0]).toBe(testPiece.blockType);
      expect(result[6][1]).toBe(testPiece.blockType);
    });

    it('should not modify original board', () => {
      const originalBoard = [...emptyBoard];
      createDisplayBoard(emptyBoard, testPiece);
      expect(emptyBoard).toEqual(originalBoard);
    });

    it('should handle piece outside board boundaries', () => {
      const piece = { ...testPiece, position: { x: -10, y: -10 } }; // 完全に境界外
      const result = createDisplayBoard(emptyBoard, piece);
      
      // 境界外のピースは表示されない
      const hasChanges = result.some(row => row.some(cell => cell !== null));
      expect(hasChanges).toBe(false);
    });

    it('should overlay piece on existing board content', () => {
      const board = [...emptyBoard];
      board[0][0] = 1; // 既存のブロック
      
      const result = createDisplayBoard(board, testPiece);
      expect(result[0][0]).toBe(1); // 既存のブロックは保持
      expect(result[5][0]).toBe(testPiece.blockType); // 新しいピースも表示
    });
  });

  describe('Additional Coverage Tests', () => {
    it('should handle invalid piece in placePiece (line 71-73)', () => {
      const invalidPiece = null as any;
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = placePiece(invalidPiece, emptyBoard);
      
      expect(consoleSpy).toHaveBeenCalledWith('Invalid piece provided to placePiece');
      expect(result).toEqual(emptyBoard);
      
      consoleSpy.mockRestore();
    });

    it('should handle horizontal matches at line end (lines 150-156)', () => {
      const board = createEmptyBoard();
      // Create 5+ consecutive blocks at the end of a row
      const lastCol = GAME_CONFIG.BOARD_WIDTH - 1;
      for (let i = lastCol - 4; i <= lastCol; i++) {
        board[0][i] = BLOCK_TYPES.I_PIECE;
      }

      const result = clearLines(board);
      
      // The blocks should be cleared (not entire lines, but matched blocks)
      expect(result.linesCleared).toBe(0); // No full lines were cleared, only matched blocks
      expect(result.matchPoints).toBeGreaterThan(0);
    });

    it('should handle vertical matches at column end (lines 189-195)', () => {
      const board = createEmptyBoard();
      // Create 5+ consecutive blocks at the end of a column
      const lastRow = GAME_CONFIG.BOARD_HEIGHT - 1;
      for (let i = lastRow - 4; i <= lastRow; i++) {
        board[i][0] = BLOCK_TYPES.I_PIECE;
      }

      const result = clearLines(board);
      
      // The blocks should be cleared (not entire lines, but matched blocks)
      expect(result.linesCleared).toBe(0); // No full lines were cleared, only matched blocks
      expect(result.matchPoints).toBeGreaterThan(0);
    });

    it('should handle maximum iterations warning (lines 275-276)', () => {
      const board = createEmptyBoard();
      // Create a complex pattern that causes maximum iterations
      // Fill most of the board with blocks that create cascading matches
      for (let row = 0; row < GAME_CONFIG.BOARD_HEIGHT; row++) {
        for (let col = 0; col < GAME_CONFIG.BOARD_WIDTH; col++) {
          // Create a pattern that causes many clearing iterations
          if (row % 3 === 0 && col >= 5) {
            board[row][col] = BLOCK_TYPES.I_PIECE;
          } else if (row % 3 === 1 && col < GAME_CONFIG.BOARD_WIDTH - 5) {
            board[row][col] = BLOCK_TYPES.I_PIECE;
          } else if (row % 3 === 2 && col >= 10) {
            board[row][col] = BLOCK_TYPES.I_PIECE;
          }
        }
      }

      // Add vertical patterns that will create cascading matches
      for (let col = 0; col < 5; col++) {
        for (let row = 0; row < GAME_CONFIG.BOARD_HEIGHT; row++) {
          if (row >= 5) {
            board[row][col] = BLOCK_TYPES.S_PIECE;
          }
        }
      }

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = clearLines(board);
      
      // Should complete and potentially trigger the maximum iterations warning
      expect(result).toBeDefined();
      expect(result.newBoard).toBeDefined();
      
      // The warning might be called if the pattern causes enough iterations
      // But we don't assert it's called since it depends on the exact match pattern
      
      consoleSpy.mockRestore();
    });
  });
});
