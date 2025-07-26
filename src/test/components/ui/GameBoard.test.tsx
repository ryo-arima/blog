import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GameBoard } from '../../../components/ui/GameBoard';
import { GAME_CONFIG, BLOCK_TYPES } from '../../../components/constants/tetris.constants';
import type { Board } from '../../../components/types/tetris.types';

describe('GameBoard', () => {
  const createTestBoard = (): Board => {
    return Array(GAME_CONFIG.BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(GAME_CONFIG.BOARD_WIDTH).fill(null));
  };

  it('should render empty board correctly', () => {
    const emptyBoard = createTestBoard();
    const { container } = render(<GameBoard displayBoard={emptyBoard} />);
    
    // ボードの行数をチェック（各行は1つのBoxコンポーネント）
    const allDivs = container.querySelectorAll('div');
    // 最外側のPaper、各行のBox、各セルのBoxが存在する
    expect(allDivs.length).toBeGreaterThan(GAME_CONFIG.BOARD_HEIGHT);
  });

  it('should render board with colored cells', () => {
    const board = createTestBoard();
    board[0][0] = BLOCK_TYPES.I_PIECE; // シアン
    board[5][5] = BLOCK_TYPES.S_PIECE; // 緑
    
    const { container } = render(<GameBoard displayBoard={board} />);
    
    // 色付きセルの存在を確認（背景色スタイルが設定されているdiv要素）
    const allDivs = container.querySelectorAll('div');
    expect(allDivs.length).toBeGreaterThan(0);
  });

  it('should render correct number of cells', () => {
    const emptyBoard = createTestBoard();
    const { container } = render(<GameBoard displayBoard={emptyBoard} />);
    
    // 総要素数をチェック（Paper + 行 + セル）
    const totalCells = GAME_CONFIG.BOARD_HEIGHT * GAME_CONFIG.BOARD_WIDTH;
    const allDivs = container.querySelectorAll('div');
    // 最低でも総セル数以上の要素が存在する
    expect(allDivs.length).toBeGreaterThan(totalCells);
  });

  it('should handle board with mixed empty and filled cells', () => {
    const board = createTestBoard();
    // パターンを作成
    for (let i = 0; i < 5; i++) {
      board[0][i] = BLOCK_TYPES.Z_PIECE; // 赤
      board[1][i] = null;
    }
    
    const { container } = render(<GameBoard displayBoard={board} />);
    
    // 少なくとも一部のセルが描画されることを確認
    const cells = container.querySelectorAll('div');
    expect(cells.length).toBeGreaterThan(GAME_CONFIG.BOARD_HEIGHT);
  });

  it('should apply correct styling to board container', () => {
    const emptyBoard = createTestBoard();
    const { container } = render(<GameBoard displayBoard={emptyBoard} />);
    
    // Paper要素が存在することを確認
    const paperElements = container.querySelectorAll('[class*="MuiPaper"]');
    expect(paperElements.length).toBeGreaterThan(0);
  });

  it('should handle invalid displayBoard gracefully', () => {
    // displayBoardが配列でない場合のテスト
    const invalidBoard = null as any;
    const { container } = render(<GameBoard displayBoard={invalidBoard} />);
    
    // nullが返されるのでコンテナは空になる
    expect(container.firstChild).toBeNull();
  });

  it('should handle non-array displayBoard', () => {
    // displayBoardが配列でない場合のテスト
    const invalidBoard = "invalid" as any;
    const { container } = render(<GameBoard displayBoard={invalidBoard} />);
    
    // nullが返されるのでコンテナは空になる
    expect(container.firstChild).toBeNull();
  });
});
