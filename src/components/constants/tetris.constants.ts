import type { TetrominoShape, TetrominoType, WallKickOffset } from '../types/tetris.types';

// ゲーム設定定数
export const GAME_CONFIG = {
  BOARD_HEIGHT: 10,
  BOARD_WIDTH: 30, // 固定幅設定でプロフィールカードと幅を揃える
  FALL_SPEED: 800, // ミリ秒（少し速くして流れを良くする）
  WALL_KICK_OFFSETS: [
    { x: 0, y: 0 },   // 元の位置
    { x: -1, y: 0 },  // 左に1マス
    { x: 1, y: 0 },   // 右に1マス
    { x: 0, y: -1 },  // 上に1マス
    { x: 0, y: 1 },   // 下に1マス
    { x: -1, y: -1 }, // 左上に1マス
    { x: 1, y: -1 },  // 右上に1マス
    { x: -1, y: 1 },  // 左下に1マス
    { x: 1, y: 1 },   // 右下に1マス
    { x: -2, y: 0 },  // 左に2マス
    { x: 2, y: 0 },   // 右に2マス
  ] as WallKickOffset[],
  SCORE_MULTIPLIERS: {
    LINES: [0, 100, 300, 500, 800],
    MATCH_BLOCK: 10,
    MIN_MATCH_COUNT: 5, // 5つ以上に修正
    GAME_OVER_THRESHOLD: 2 // 上端から2行以内まで詰まったらゲームオーバー
  }
} as const;

// ブロック色とIDのマッピング
export const BLOCK_TYPES = {
  EMPTY: 0,
  I_PIECE: 1,      // シアン
  O_PIECE: 2,      // 黄色
  T_PIECE: 3,      // 紫
  S_PIECE: 4,      // 緑
  Z_PIECE: 5,      // 赤
  J_PIECE: 6,      // 青
  L_PIECE: 7,      // オレンジ
  SINGLE_PIECE: 8, // ピンク
  LINE2_PIECE: 9   // ライムグリーン
} as const;

// 番号から色への変換マップ
export const BLOCK_COLORS: Record<number, string> = {
  [BLOCK_TYPES.EMPTY]: '',
  [BLOCK_TYPES.I_PIECE]: '#00f0f0',
  [BLOCK_TYPES.O_PIECE]: '#f0f000',
  [BLOCK_TYPES.T_PIECE]: '#a000f0',
  [BLOCK_TYPES.S_PIECE]: '#00f000',
  [BLOCK_TYPES.Z_PIECE]: '#f00000',
  [BLOCK_TYPES.J_PIECE]: '#0000f0',
  [BLOCK_TYPES.L_PIECE]: '#f0a000',
  [BLOCK_TYPES.SINGLE_PIECE]: '#ff69b4',
  [BLOCK_TYPES.LINE2_PIECE]: '#32cd32'
};

// テトロミノの形状定義（4つ以下の小さなテトリミノ）
export const TETROMINOES: Record<TetrominoType, TetrominoShape> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: BLOCK_COLORS[BLOCK_TYPES.I_PIECE],
    blockType: BLOCK_TYPES.I_PIECE
  },
  O: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: BLOCK_COLORS[BLOCK_TYPES.O_PIECE],
    blockType: BLOCK_TYPES.O_PIECE
  },
  T: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: BLOCK_COLORS[BLOCK_TYPES.T_PIECE],
    blockType: BLOCK_TYPES.T_PIECE
  },
  S: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    color: BLOCK_COLORS[BLOCK_TYPES.S_PIECE],
    blockType: BLOCK_TYPES.S_PIECE
  },
  Z: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: BLOCK_COLORS[BLOCK_TYPES.Z_PIECE],
    blockType: BLOCK_TYPES.Z_PIECE
  },
  J: {
    shape: [
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    color: BLOCK_COLORS[BLOCK_TYPES.J_PIECE],
    blockType: BLOCK_TYPES.J_PIECE
  },
  L: {
    shape: [
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: BLOCK_COLORS[BLOCK_TYPES.L_PIECE],
    blockType: BLOCK_TYPES.L_PIECE
  },
  // 新しい小さなピース
  Single: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: BLOCK_COLORS[BLOCK_TYPES.SINGLE_PIECE],
    blockType: BLOCK_TYPES.SINGLE_PIECE
  },
  Line2: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: BLOCK_COLORS[BLOCK_TYPES.LINE2_PIECE],
    blockType: BLOCK_TYPES.LINE2_PIECE
  }
};

// テトロミノタイプの配列（ランダム選択用）
export const TETROMINO_TYPES: TetrominoType[] = Object.keys(TETROMINOES) as TetrominoType[];
