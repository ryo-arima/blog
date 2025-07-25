import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Refresh,
  KeyboardArrowUp,
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  RotateRight,
} from '@mui/icons-material';

// テトリスのピースの形状定義（4つ以下の小さなテトリミノ）
const TETROMINOES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#00f0f0'
  },
  O: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: '#f0f000'
  },
  T: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: '#a000f0'
  },
  S: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#00f000'
  },
  Z: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: '#f00000'
  },
  J: {
    shape: [
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#0000f0'
  },
  L: {
    shape: [
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: '#f0a000'
  },
  // 新しい小さなピース
  Single: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#ff69b4'
  },
  Line2: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#32cd32'
  }
};

const BOARD_HEIGHT = 10;

// 画面幅に応じて動的にボード幅を計算
const calculateBoardWidth = () => {
  if (typeof window !== 'undefined') {
    const screenWidth = window.innerWidth;
    // セルサイズ25px + ギャップを考慮して計算
    const availableWidth = Math.min(screenWidth - 100, 800); // 最大800px
    return Math.max(Math.floor(availableWidth / 25), 15); // 最小15列
  }
  return 20; // デフォルト値
};

type TetrominoType = keyof typeof TETROMINOES;
type Board = (string | null)[][];

interface Position {
  x: number;
  y: number;
}

interface CurrentPiece {
  shape: number[][];
  color: string;
  position: Position;
  type: TetrominoType;
}

const Tetris: React.FC = () => {
  const [boardWidth, setBoardWidth] = useState(calculateBoardWidth());
  const [board, setBoard] = useState<Board>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(boardWidth).fill(null))
  );
  const [currentPiece, setCurrentPiece] = useState<CurrentPiece | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const createEmptyBoard = useCallback((): Board => {
    return Array(BOARD_HEIGHT).fill(null).map(() => Array(boardWidth).fill(null));
  }, [boardWidth]);

  const getRandomTetromino = useCallback((): TetrominoType => {
    const types = Object.keys(TETROMINOES) as TetrominoType[];
    return types[Math.floor(Math.random() * types.length)];
  }, []);

  // 画面サイズ変更の監視
  useEffect(() => {
    const handleResize = () => {
      const newWidth = calculateBoardWidth();
      if (newWidth !== boardWidth) {
        setBoardWidth(newWidth);
        setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(newWidth).fill(null)));
        setCurrentPiece(null);
        setGameOver(false);
        setIsPlaying(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [boardWidth]);

  const isValidPosition = useCallback((piece: CurrentPiece, newPosition: Position): boolean => {
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const newY = newPosition.y + row;
          const newX = newPosition.x + col;
          
          // 横方向テトリス用の境界チェック
          if (newY < 0 || newY >= BOARD_HEIGHT || newX < 0 || newX >= boardWidth) {
            return false;
          }
          
          if (board[newY] && board[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  }, [board, boardWidth]);

  const placePiece = useCallback((piece: CurrentPiece): Board => {
    const newBoard = board.map(row => [...row]);
    
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const boardY = piece.position.y + row;
          const boardX = piece.position.x + col;
          
          // 境界チェックを追加
          if (boardY >= 0 && boardY < BOARD_HEIGHT && 
              boardX >= 0 && boardX < boardWidth && 
              newBoard[boardY]) {
            newBoard[boardY][boardX] = piece.color;
          }
        }
      }
    }
    
    return newBoard;
  }, [board]);

  const clearLines = useCallback((board: Board): { newBoard: Board; linesCleared: number; matchPoints: number } => {
    let newBoard = board.map(row => [...row]);
    let linesCleared = 0;
    let totalMatchPoints = 0;

    // 5つ以上の同じ色が連続したブロックを検出・削除
    const clearMatches = (currentBoard: Board) => {
      const toRemove: boolean[][] = Array(BOARD_HEIGHT).fill(null).map(() => Array(boardWidth).fill(false));
      let matchCount = 0;
      let matchPoints = 0;

      // 水平方向（行）のマッチをチェック
      for (let row = 0; row < BOARD_HEIGHT; row++) {
        let consecutiveCount = 0;
        let currentColor = null;
        
        for (let col = 0; col < boardWidth; col++) {
          if (currentBoard[row][col] === currentColor && currentColor !== null) {
            consecutiveCount++;
          } else {
            if (consecutiveCount >= 5 && currentColor !== null) {
              // 5つ以上連続している場合、削除対象としてマーク
              for (let i = col - consecutiveCount; i < col; i++) {
                toRemove[row][i] = true;
              }
              matchCount += consecutiveCount;
            }
            consecutiveCount = currentBoard[row][col] !== null ? 1 : 0;
            currentColor = currentBoard[row][col];
          }
        }
        // 行の最後もチェック
        if (consecutiveCount >= 5 && currentColor !== null) {
          for (let i = boardWidth - consecutiveCount; i < boardWidth; i++) {
            toRemove[row][i] = true;
          }
          matchCount += consecutiveCount;
        }
      }

      // 垂直方向（列）のマッチをチェック
      for (let col = 0; col < boardWidth; col++) {
        let consecutiveCount = 0;
        let currentColor = null;
        
        for (let row = 0; row < BOARD_HEIGHT; row++) {
          if (currentBoard[row][col] === currentColor && currentColor !== null) {
            consecutiveCount++;
          } else {
            if (consecutiveCount >= 5 && currentColor !== null) {
              // 5つ以上連続している場合、削除対象としてマーク
              for (let i = row - consecutiveCount; i < row; i++) {
                toRemove[i][col] = true;
              }
              matchCount += consecutiveCount;
            }
            consecutiveCount = currentBoard[row][col] !== null ? 1 : 0;
            currentColor = currentBoard[row][col];
          }
        }
        // 列の最後もチェック
        if (consecutiveCount >= 5 && currentColor !== null) {
          for (let i = BOARD_HEIGHT - consecutiveCount; i < BOARD_HEIGHT; i++) {
            toRemove[i][col] = true;
          }
          matchCount += consecutiveCount;
        }
      }

      // マークされたブロックを削除
      if (matchCount > 0) {
        for (let row = 0; row < BOARD_HEIGHT; row++) {
          for (let col = 0; col < boardWidth; col++) {
            if (toRemove[row][col]) {
              currentBoard[row][col] = null;
            }
          }
        }
        matchPoints = matchCount * 10; // ブロック数 × 10ポイント
      }

      return { matchCount, matchPoints };
    };

    // ブロック落下処理（重力適用）
    const applyGravity = (currentBoard: Board) => {
      // 横方向テトリス用の重力処理：ブロックを右側に詰める
      for (let row = 0; row < BOARD_HEIGHT; row++) {
        const rowBlocks = [];
        
        // 各行で非nullのブロックを左から順番に収集
        for (let col = 0; col < boardWidth; col++) {
          if (currentBoard[row][col] !== null) {
            rowBlocks.push(currentBoard[row][col]);
          }
        }
        
        // 行をクリア
        for (let col = 0; col < boardWidth; col++) {
          currentBoard[row][col] = null;
        }
        
        // ブロックを右端から配置（重力で右に落ちる）
        const startCol = boardWidth - rowBlocks.length;
        for (let i = 0; i < rowBlocks.length; i++) {
          currentBoard[row][startCol + i] = rowBlocks[i];
        }
      }
    };

    // マッチ検出と削除を繰り返し実行（連鎖反応）
    let hasMatches = true;
    while (hasMatches) {
      const { matchCount, matchPoints } = clearMatches(newBoard);
      if (matchCount > 0) {
        totalMatchPoints += matchPoints;
        applyGravity(newBoard);
      } else {
        hasMatches = false;
      }
    }

    // 従来の完全列削除もチェック
    for (let col = boardWidth - 1; col >= 0; col--) {
      let isFullColumn = true;
      for (let row = 0; row < BOARD_HEIGHT; row++) {
        if (newBoard[row][col] === null) {
          isFullColumn = false;
          break;
        }
      }
      
      if (isFullColumn) {
        for (let row = 0; row < BOARD_HEIGHT; row++) {
          newBoard[row].splice(col, 1);
          newBoard[row].unshift(null);
        }
        linesCleared++;
        col++;
      }
    }

    return { newBoard, linesCleared, matchPoints: totalMatchPoints };
  }, [boardWidth]);

  const spawnNewPiece = useCallback((): CurrentPiece => {
    const type = getRandomTetromino();
    const tetromino = TETROMINOES[type];
    return {
      shape: tetromino.shape,
      color: tetromino.color,
      position: { 
        x: 0,  // 左端から開始
        y: Math.floor((BOARD_HEIGHT - 4) / 2)  // 縦方向の中央
      },
      type
    };
  }, [getRandomTetromino]);

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver) return;

    // 標準的なテトリスの回転処理（時計回り90度）
    const rotated = currentPiece.shape.map((row, i) =>
      row.map((_, j) => currentPiece.shape[currentPiece.shape.length - 1 - j][i])
    );

    const rotatedPiece = {
      ...currentPiece,
      shape: rotated
    };

    // 壁蹴り（Wall Kick）のオフセットを試行
    const wallKickOffsets = [
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
    ];

    // 各オフセットを試して有効な位置を見つける
    for (const offset of wallKickOffsets) {
      const testPosition = {
        x: currentPiece.position.x + offset.x,
        y: currentPiece.position.y + offset.y
      };
      
      const testPiece = {
        ...rotatedPiece,
        position: testPosition
      };

      if (isValidPosition(testPiece, testPosition)) {
        setCurrentPiece(testPiece);
        return; // 成功したら終了
      }
    }
    
    // どのオフセットでも回転できない場合は回転しない
    // （従来の動作を維持）
  }, [currentPiece, gameOver, isValidPosition]);

  const movePiece = useCallback((direction: 'left' | 'right' | 'down') => {
    if (!currentPiece || gameOver) return;

    const newPosition = { ...currentPiece.position };
    
    switch (direction) {
      case 'left':
        newPosition.y -= 1;  // 上方向移動
        break;
      case 'right':
        newPosition.y += 1;  // 下方向移動
        break;
      case 'down':
        newPosition.x += 1;  // 右方向移動（落下）
        break;
    }

    const newPiece = { ...currentPiece, position: newPosition };

    if (isValidPosition(newPiece, newPosition)) {
      setCurrentPiece(newPiece);
    } else if (direction === 'down') {
      // ピースを現在の位置に固定（右端に到達したか、他のブロックに当たった）
      const boardWithPiece = placePiece(currentPiece);
      
      // ライン消去処理（縦ライン - 横方向テトリス + 5つ以上マッチ）
      const { newBoard: clearedBoard, linesCleared, matchPoints } = clearLines(boardWithPiece);
      
      // ゲームオーバー判定：右端近くにブロックが詰まった場合
      const isGameOver = clearedBoard.some((row: (string | null)[]) => {
        let filledFromRight = 0;
        for (let i = boardWidth - 1; i >= 0; i--) {
          if (row[i] !== null) {
            filledFromRight++;
          } else {
            break;
          }
        }
        return filledFromRight >= boardWidth - 2; // 右端から2列以内まで詰まったらゲームオーバー
      });
      
      if (isGameOver) {
        setGameOver(true);
        setIsPlaying(false);
        setBoard(clearedBoard);
        return;
      }
      
      setBoard(clearedBoard);
      
      // スコア加算：消去されたライン数に応じて点数を付与 + マッチポイント
      if (linesCleared > 0) {
        const linePoints = [0, 100, 300, 500, 800][linesCleared] || linesCleared * 100;
        setScore(prev => prev + linePoints);
      }
      
      // マッチングで得られたポイントを追加
      if (matchPoints > 0) {
        setScore(prev => prev + matchPoints);
      }
      
      // 次のピースを生成
      const nextPiece = spawnNewPiece();
      if (isValidPosition(nextPiece, nextPiece.position)) {
        setCurrentPiece(nextPiece);
      } else {
        setGameOver(true);
        setIsPlaying(false);
      }
    }
  }, [currentPiece, gameOver, isValidPosition, placePiece, clearLines, spawnNewPiece, boardWidth]);

  const startGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPiece(spawnNewPiece());
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const pauseGame = () => {
    setIsPlaying(!isPlaying);
  };

  // ゲームループ
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = setInterval(() => {
      movePiece('down');
    }, 1000);

    return () => clearInterval(gameLoop);
  }, [isPlaying, gameOver, movePiece]);

  // ボードとカレントピースを合成して表示用ボードを作成
  const displayBoard = useCallback(() => {
    const display = board.map(row => [...row]);
    
    if (currentPiece) {
      for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
          if (currentPiece.shape[row][col]) {
            const boardY = currentPiece.position.y + row;
            const boardX = currentPiece.position.x + col;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < boardWidth && display[boardY]) {
              display[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }
    
    return display;
  }, [board, currentPiece]);

  const displayBoardData = displayBoard();

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {/* Game Board - 一番上に配置 */}
      <Paper 
        elevation={6}
        sx={{
          width: `${boardWidth * 25}px`,
          height: `${BOARD_HEIGHT * 25}px`,
          background: '#222',
          border: '3px solid #fff',
          borderRadius: 2,
          p: 1,
          display: 'grid',
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
          gap: '1px',
          overflow: 'hidden'
        }}
      >
        {displayBoardData.map((row, rowIndex) => (
          <Box 
            key={rowIndex} 
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${boardWidth}, 1fr)`,
              gap: '1px'
            }}
          >
            {row.map((cell, colIndex) => (
              <Box
                key={colIndex}
                sx={{
                  width: '100%',
                  height: '100%',
                  minWidth: '20px',
                  minHeight: '20px',
                  backgroundColor: cell || '#111',
                  border: cell ? '1px solid #fff' : '1px solid #444',
                  borderRadius: 0.5,
                  transition: 'all 0.2s ease',
                  boxShadow: cell ? '0 0 4px rgba(255,255,255,0.3)' : 'none'
                }}
              />
            ))}
          </Box>
        ))}
      </Paper>

      {/* Game Info - コンパクトな情報表示 */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Chip 
          label={`Score: ${score}`}
          color="secondary"
          variant="filled"
          sx={{ fontSize: '1em', fontWeight: 'bold' }}
        />
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Horizontal Tetris
        </Typography>
        {gameOver && (
          <Chip 
            label="GAME OVER"
            color="error"
            variant="filled"
            sx={{ fontSize: '1em', fontWeight: 'bold' }}
          />
        )}
      </Box>

      {/* Controls - コンパクトなコントロール */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
        {/* Game Control Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {!isPlaying ? (
            <Button 
              variant="contained"
              onClick={startGame}
              startIcon={gameOver ? <Refresh /> : <PlayArrow />}
              size="small"
              sx={{
                background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ee5a52, #ff6b6b)',
                }
              }}
            >
              {gameOver ? 'Restart' : 'Start'}
            </Button>
          ) : (
            <Button 
              variant="contained"
              onClick={pauseGame}
              startIcon={<Pause />}
              color="warning"
              size="small"
            >
              Pause
            </Button>
          )}
        </Box>

        {/* Movement Controls */}
        {isPlaying && !gameOver && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            {/* 上ボタン（上方向移動） */}
            <IconButton
              onClick={() => movePiece('left')}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                color: 'white'
              }}
              size="small"
              title="上に移動"
            >
              <KeyboardArrowUp />
            </IconButton>
            
            {/* 中央の横ボタンと回転ボタン */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton
                onClick={() => movePiece('down')}
                sx={{ 
                  backgroundColor: 'rgba(100,255,100,0.3)',
                  '&:hover': { backgroundColor: 'rgba(100,255,100,0.5)' },
                  color: 'white'
                }}
                size="small"
                title="右に落下（加速）"
              >
                <KeyboardArrowLeft />
              </IconButton>
              
              <IconButton
                onClick={rotatePiece}
                sx={{ 
                  backgroundColor: 'rgba(255,100,100,0.3)',
                  '&:hover': { backgroundColor: 'rgba(255,100,100,0.5)' },
                  color: 'white',
                  mx: 1
                }}
                size="small"
                title="回転"
              >
                <RotateRight />
              </IconButton>
              
              <IconButton
                onClick={() => movePiece('down')}
                sx={{ 
                  backgroundColor: 'rgba(100,255,100,0.3)',
                  '&:hover': { backgroundColor: 'rgba(100,255,100,0.5)' },
                  color: 'white'
                }}
                size="small"
                title="右に落下（加速）"
              >
                <KeyboardArrowRight />
              </IconButton>
            </Box>
            
            {/* 下ボタン（下方向移動） */}
            <IconButton
              onClick={() => movePiece('right')}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                color: 'white'
              }}
              size="small"
              title="下に移動"
            >
              <KeyboardArrowDown />
            </IconButton>
            
            {/* 操作説明 */}
            <Typography variant="caption" sx={{ color: 'white', textAlign: 'center', mt: 1, fontSize: '0.7em' }}>
              ↑↓: 上下移動 | ←→: 右に落下 | 🔄: 回転 | 完全な列で消去 | 5つ以上で+10pt/ブロック
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Tetris;
