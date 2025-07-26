import { describe, it, expect } from 'vitest';
import { GAME_CONFIG, TETROMINOES, TETROMINO_TYPES } from '../../../components/constants/tetris.constants';

describe('tetris.constants', () => {
  describe('GAME_CONFIG', () => {
    it('should have correct board dimensions', () => {
      expect(GAME_CONFIG.BOARD_HEIGHT).toBe(10);
      expect(GAME_CONFIG.BOARD_WIDTH).toBe(30);
      expect(typeof GAME_CONFIG.BOARD_HEIGHT).toBe('number');
      expect(typeof GAME_CONFIG.BOARD_WIDTH).toBe('number');
    });

    it('should have fall speed configuration', () => {
      expect(GAME_CONFIG.FALL_SPEED).toBe(800);
      expect(typeof GAME_CONFIG.FALL_SPEED).toBe('number');
    });

    it('should have wall kick offsets', () => {
      expect(Array.isArray(GAME_CONFIG.WALL_KICK_OFFSETS)).toBe(true);
      expect(GAME_CONFIG.WALL_KICK_OFFSETS.length).toBeGreaterThan(0);
      
      // 最初のオフセットは元の位置
      expect(GAME_CONFIG.WALL_KICK_OFFSETS[0]).toEqual({ x: 0, y: 0 });
      
      // 全てのオフセットがx, yプロパティを持つ
      GAME_CONFIG.WALL_KICK_OFFSETS.forEach(offset => {
        expect(typeof offset.x).toBe('number');
        expect(typeof offset.y).toBe('number');
      });
    });

    it('should have score multipliers configuration', () => {
      expect(Array.isArray(GAME_CONFIG.SCORE_MULTIPLIERS.LINES)).toBe(true);
      expect(GAME_CONFIG.SCORE_MULTIPLIERS.LINES[0]).toBe(0);
      expect(GAME_CONFIG.SCORE_MULTIPLIERS.LINES[1]).toBe(100);
      expect(GAME_CONFIG.SCORE_MULTIPLIERS.LINES[2]).toBe(300);
      expect(GAME_CONFIG.SCORE_MULTIPLIERS.LINES[3]).toBe(500);
      expect(GAME_CONFIG.SCORE_MULTIPLIERS.LINES[4]).toBe(800);
      
      expect(GAME_CONFIG.SCORE_MULTIPLIERS.MATCH_BLOCK).toBe(10);
      expect(GAME_CONFIG.SCORE_MULTIPLIERS.MIN_MATCH_COUNT).toBe(5);
      expect(GAME_CONFIG.SCORE_MULTIPLIERS.GAME_OVER_THRESHOLD).toBe(2);
    });
  });

  describe('TETROMINOES', () => {
    it('should have all standard tetromino types', () => {
      const expectedTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L', 'Single', 'Line2'];
      
      expectedTypes.forEach(type => {
        expect(TETROMINOES).toHaveProperty(type);
      });
      
      expect(Object.keys(TETROMINOES)).toHaveLength(expectedTypes.length);
    });

    it('should have correct I-piece shape', () => {
      const iPiece = TETROMINOES.I;
      expect(iPiece.shape[1]).toEqual([1, 1, 1, 0]);
      expect(iPiece.color).toBe('#00f0f0');
    });

    it('should have correct O-piece shape', () => {
      const oPiece = TETROMINOES.O;
      expect(oPiece.shape[1]).toEqual([0, 1, 1, 0]);
      expect(oPiece.shape[2]).toEqual([0, 1, 1, 0]);
      expect(oPiece.color).toBe('#f0f000');
    });

    it('should have correct T-piece shape', () => {
      const tPiece = TETROMINOES.T;
      expect(tPiece.shape[1]).toEqual([0, 1, 0, 0]);
      expect(tPiece.shape[2]).toEqual([1, 1, 1, 0]);
      expect(tPiece.color).toBe('#a000f0');
    });

    it('should have correct S-piece shape', () => {
      const sPiece = TETROMINOES.S;
      expect(sPiece.shape[1]).toEqual([0, 1, 1, 0]);
      expect(sPiece.shape[2]).toEqual([1, 1, 0, 0]);
      expect(sPiece.color).toBe('#00f000');
    });

    it('should have correct Z-piece shape', () => {
      const zPiece = TETROMINOES.Z;
      expect(zPiece.shape[1]).toEqual([1, 1, 0, 0]);
      expect(zPiece.shape[2]).toEqual([0, 1, 1, 0]);
      expect(zPiece.color).toBe('#f00000');
    });

    it('should have correct J-piece shape', () => {
      const jPiece = TETROMINOES.J;
      expect(jPiece.shape[1]).toEqual([1, 0, 0, 0]);
      expect(jPiece.shape[2]).toEqual([1, 1, 0, 0]);
      expect(jPiece.color).toBe('#0000f0');
    });

    it('should have correct L-piece shape', () => {
      const lPiece = TETROMINOES.L;
      expect(lPiece.shape[1]).toEqual([0, 0, 1, 0]);
      expect(lPiece.shape[2]).toEqual([1, 1, 1, 0]);
      expect(lPiece.color).toBe('#f0a000');
    });

    it('should have correct Single-piece shape', () => {
      const singlePiece = TETROMINOES.Single;
      expect(singlePiece.shape[1]).toEqual([0, 1, 0, 0]);
      expect(singlePiece.color).toBe('#ff69b4');
    });

    it('should have correct Line2-piece shape', () => {
      const line2Piece = TETROMINOES.Line2;
      expect(line2Piece.shape[1]).toEqual([1, 1, 0, 0]);
      expect(line2Piece.color).toBe('#32cd32');
    });

    it('should have valid colors for all pieces', () => {
      Object.values(TETROMINOES).forEach(piece => {
        expect(typeof piece.color).toBe('string');
        expect(piece.color).toMatch(/^#[0-9a-f]{6}$/i);
        expect(piece.color.length).toBe(7);
      });
    });

    it('should have 4x4 shapes for all pieces', () => {
      Object.values(TETROMINOES).forEach(piece => {
        expect(piece.shape).toHaveLength(4);
        piece.shape.forEach(row => {
          expect(row).toHaveLength(4);
          row.forEach(cell => {
            expect([0, 1]).toContain(cell);
          });
        });
      });
    });
  });

  describe('TETROMINO_TYPES', () => {
    it('should contain all tetromino type keys', () => {
      const expectedTypes = Object.keys(TETROMINOES);
      expect(TETROMINO_TYPES).toHaveLength(expectedTypes.length);
      
      expectedTypes.forEach(type => {
        expect(TETROMINO_TYPES).toContain(type);
      });
    });

    it('should be an array of strings', () => {
      expect(Array.isArray(TETROMINO_TYPES)).toBe(true);
      TETROMINO_TYPES.forEach(type => {
        expect(typeof type).toBe('string');
      });
    });

    it('should have exactly 9 tetromino types', () => {
      expect(TETROMINO_TYPES).toHaveLength(9);
    });
  });
});
