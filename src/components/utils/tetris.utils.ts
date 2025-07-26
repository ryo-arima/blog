import type { Board, CurrentPiece, Position, ClearLinesResult } from '../types/tetris.types';
import type { TetrominoType } from '../types/tetris.types';
import { isValidCurrentPiece } from '../types/tetris.types';
import { GAME_CONFIG, TETROMINOES, TETROMINO_TYPES } from '../constants/tetris.constants';

/**
 * 空のボードを作成
 */
export const createEmptyBoard = (): Board => {
  return Array(GAME_CONFIG.BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(GAME_CONFIG.BOARD_WIDTH).fill(null));
};

/**
 * ランダムなテトロミノタイプを取得
 */
export const getRandomTetromino = (): TetrominoType => {
  return TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
};

/**
 * 新しいピースを生成
 */
export const spawnNewPiece = (): CurrentPiece => {
  const type = getRandomTetromino();
  const tetromino = TETROMINOES[type];
  return {
    shape: tetromino.shape,
    color: tetromino.color,
    position: { 
      x: 0,  // 左端から開始
      y: Math.floor((GAME_CONFIG.BOARD_HEIGHT - 4) / 2)  // 縦方向の中央
    },
    type,
    blockType: tetromino.blockType
  };
};

/**
 * ピースが有効な位置にあるかチェック
 */
export const isValidPosition = (piece: CurrentPiece, newPosition: Position, board: Board): boolean => {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        const newY = newPosition.y + row;
        const newX = newPosition.x + col;
        
        // 横方向テトリス用の境界チェック
        if (newY < 0 || newY >= GAME_CONFIG.BOARD_HEIGHT || 
            newX < 0 || newX >= GAME_CONFIG.BOARD_WIDTH) {
          return false;
        }
        
        if (board[newY] && board[newY][newX]) {
          return false;
        }
      }
    }
  }
  return true;
};

/**
 * ピースをボードに配置
 */
export const placePiece = (piece: CurrentPiece, board: Board): Board => {
  // 入力検証
  if (!isValidCurrentPiece(piece)) {
    console.warn('Invalid piece provided to placePiece');
    return board.map(row => [...row]); // 元のボードのコピーを返す
  }
  
  const newBoard = board.map(row => [...row]);
  
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        const boardY = piece.position.y + row;
        const boardX = piece.position.x + col;
        
        // 境界チェックを追加
        if (boardY >= 0 && boardY < GAME_CONFIG.BOARD_HEIGHT && 
            boardX >= 0 && boardX < GAME_CONFIG.BOARD_WIDTH && 
            newBoard[boardY]) {
          newBoard[boardY][boardX] = piece.blockType;
        }
      }
    }
  }
  
  return newBoard;
};

/**
 * ピースを時計回りに90度回転
 */
export const rotatePieceShape = (shape: number[][]): number[][] => {
  return shape.map((row, i) =>
    row.map((_, j) => shape[shape.length - 1 - j][i])
  );
};

/**
 * 5つ以上の同じ色が連続したブロックをクリア
 */
const clearMatches = (currentBoard: Board) => {
  const toRemove: boolean[][] = Array(GAME_CONFIG.BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(GAME_CONFIG.BOARD_WIDTH).fill(false));
  let matchCount = 0;

  console.log('=== clearMatches Debug ===');
  console.log('Current board state:');
  currentBoard.forEach((row, rowIndex) => {
    console.log(`Row ${rowIndex}:`, row.map(cell => cell !== null ? `[${cell}]` : '⬜').join(' '));
  });
  
  // 水平方向（行）のマッチをチェック
  for (let row = 0; row < GAME_CONFIG.BOARD_HEIGHT; row++) {
    let consecutiveCount = 0;
    let currentBlockType = null;
    
    for (let col = 0; col < GAME_CONFIG.BOARD_WIDTH; col++) {
      const cellBlockType = currentBoard[row][col];
      
      if (cellBlockType === currentBlockType && currentBlockType !== null) {
        consecutiveCount++;
      } else {
        // 前の連続が5つ以上で同じブロックタイプなら削除対象
        if (consecutiveCount >= GAME_CONFIG.SCORE_MULTIPLIERS.MIN_MATCH_COUNT && currentBlockType !== null) {
          console.log(`✅ Horizontal match found: row ${row}, blockType ${currentBlockType}, count ${consecutiveCount}`);
          // 5つ以上連続している場合、削除対象としてマーク
          for (let i = col - consecutiveCount; i < col; i++) {
            toRemove[row][i] = true;
            console.log(`  - Marking for removal: (${row}, ${i})`);
          }
          matchCount += consecutiveCount;
        }
        
        // 新しいブロックタイプでカウントリセット
        consecutiveCount = cellBlockType !== null ? 1 : 0;
        currentBlockType = cellBlockType;
      }
    }
    
    // 行の最後もチェック
    if (consecutiveCount >= GAME_CONFIG.SCORE_MULTIPLIERS.MIN_MATCH_COUNT && currentBlockType !== null) {
      console.log(`✅ Horizontal match found (end): row ${row}, blockType ${currentBlockType}, count ${consecutiveCount}`);
      for (let i = GAME_CONFIG.BOARD_WIDTH - consecutiveCount; i < GAME_CONFIG.BOARD_WIDTH; i++) {
        toRemove[row][i] = true;
        console.log(`  - Marking for removal: (${row}, ${i})`);
      }
      matchCount += consecutiveCount;
    }
  }

  // 垂直方向（列）のマッチをチェック
  for (let col = 0; col < GAME_CONFIG.BOARD_WIDTH; col++) {
    let consecutiveCount = 0;
    let currentBlockType = null;
    
    for (let row = 0; row < GAME_CONFIG.BOARD_HEIGHT; row++) {
      const cellBlockType = currentBoard[row][col];
      
      if (cellBlockType === currentBlockType && currentBlockType !== null) {
        consecutiveCount++;
      } else {
        // 前の連続が5つ以上で同じブロックタイプなら削除対象
        if (consecutiveCount >= GAME_CONFIG.SCORE_MULTIPLIERS.MIN_MATCH_COUNT && currentBlockType !== null) {
          console.log(`✅ Vertical match found: col ${col}, blockType ${currentBlockType}, count ${consecutiveCount}`);
          // 5つ以上連続している場合、削除対象としてマーク
          for (let i = row - consecutiveCount; i < row; i++) {
            toRemove[i][col] = true;
            console.log(`  - Marking for removal: (${i}, ${col})`);
          }
          matchCount += consecutiveCount;
        }
        
        // 新しいブロックタイプでカウントリセット
        consecutiveCount = cellBlockType !== null ? 1 : 0;
        currentBlockType = cellBlockType;
      }
    }
    
    // 列の最後もチェック
    if (consecutiveCount >= GAME_CONFIG.SCORE_MULTIPLIERS.MIN_MATCH_COUNT && currentBlockType !== null) {
      console.log(`✅ Vertical match found (end): col ${col}, blockType ${currentBlockType}, count ${consecutiveCount}`);
      for (let i = GAME_CONFIG.BOARD_HEIGHT - consecutiveCount; i < GAME_CONFIG.BOARD_HEIGHT; i++) {
        toRemove[i][col] = true;
        console.log(`  - Marking for removal: (${i}, ${col})`);
      }
      matchCount += consecutiveCount;
    }
  }

  // マークされたブロックを削除
  let totalRemoved = 0;
  if (matchCount > 0) {
    for (let row = 0; row < GAME_CONFIG.BOARD_HEIGHT; row++) {
      for (let col = 0; col < GAME_CONFIG.BOARD_WIDTH; col++) {
        if (toRemove[row][col]) {
          currentBoard[row][col] = null;
          totalRemoved++;
        }
      }
    }
  }

  console.log(`Total blocks removed: ${totalRemoved}`);
  console.log('=== clearMatches Debug End ===');

  return { matchCount, matchPoints: matchCount * GAME_CONFIG.SCORE_MULTIPLIERS.MATCH_BLOCK };
};

/**
 * ブロック落下処理（重力適用）- 削除された空間のみに重力を適用（横方向テトリス用）
 */
const applyGravity = (currentBoard: Board) => {
  console.log('🌍 Applying gravity (horizontal - blocks fall to the right)...');
  
  // 各行に対して水平方向の重力を適用（右方向に落下）
  for (let row = 0; row < GAME_CONFIG.BOARD_HEIGHT; row++) {
    // 右から左に向かって空のセルを見つけて、左のブロックを右に移動
    for (let targetCol = GAME_CONFIG.BOARD_WIDTH - 1; targetCol >= 0; targetCol--) {
      if (currentBoard[row][targetCol] === null) {
        // 空のセルを見つけた場合、その左にあるブロックを探す
        for (let sourceCol = targetCol - 1; sourceCol >= 0; sourceCol--) {
          if (currentBoard[row][sourceCol] !== null) {
            // ブロックを見つけたら右に移動
            console.log(`  Moving block from (${row}, ${sourceCol}) to (${row}, ${targetCol})`);
            currentBoard[row][targetCol] = currentBoard[row][sourceCol];
            currentBoard[row][sourceCol] = null;
            break;
          }
        }
      }
    }
  }
  
  console.log('🌍 Horizontal gravity applied successfully');
};

/**
 * ライン消去処理（5つ以上の同じ色のブロック連続マッチのみ）
 */
export const clearLines = (board: Board): ClearLinesResult => {
  let newBoard = board.map(row => [...row]);
  let linesCleared = 0;
  let totalMatchPoints = 0;

  console.log('🎯 clearLines called');

  // マッチ検出と削除を繰り返し実行（連鎖反応）
  let hasMatches = true;
  let iterationCount = 0;
  while (hasMatches && iterationCount < 10) { // 無限ループ防止
    iterationCount++;
    console.log(`🔄 Match iteration ${iterationCount}`);
    
    const { matchCount, matchPoints } = clearMatches(newBoard);
    if (matchCount > 0) {
      console.log(`📊 Found ${matchCount} matching blocks, points: ${matchPoints}`);
      totalMatchPoints += matchPoints;
      applyGravity(newBoard);
      console.log('⬇️ Gravity applied');
    } else {
      console.log('❌ No matches found, stopping');
      hasMatches = false;
    }
  }

  if (iterationCount >= 10) {
    console.warn('⚠️ Maximum iterations reached, stopping to prevent infinite loop');
  }

  console.log(`✅ clearLines finished: totalMatchPoints=${totalMatchPoints}`);
  return { newBoard, linesCleared, matchPoints: totalMatchPoints };
};

/**
 * ゲームオーバー判定：右端近くにブロックが詰まった場合
 */
export const checkGameOver = (board: Board): boolean => {
  return board.some((row: (number | null)[]) => {
    let filledFromRight = 0;
    for (let i = GAME_CONFIG.BOARD_WIDTH - 1; i >= 0; i--) {
      if (row[i] !== null) {
        filledFromRight++;
      } else {
        break;
      }
    }
    return filledFromRight >= GAME_CONFIG.BOARD_WIDTH - GAME_CONFIG.SCORE_MULTIPLIERS.GAME_OVER_THRESHOLD;
  });
};

/**
 * ボードとカレントピースを合成して表示用ボードを作成
 */
export const createDisplayBoard = (board: Board, currentPiece: CurrentPiece | null): Board => {
  const display = board.map(row => [...row]);
  
  if (currentPiece) {
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col]) {
          const boardY = currentPiece.position.y + row;
          const boardX = currentPiece.position.x + col;
          if (boardY >= 0 && boardY < GAME_CONFIG.BOARD_HEIGHT && 
              boardX >= 0 && boardX < GAME_CONFIG.BOARD_WIDTH && 
              display[boardY]) {
            display[boardY][boardX] = currentPiece.blockType;
          }
        }
      }
    }
  }
  
  return display;
};
