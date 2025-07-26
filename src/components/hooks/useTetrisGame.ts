import { useState, useCallback, useEffect } from 'react';
import type { Board, CurrentPiece, GameState } from '../types/tetris.types';
import { isValidCurrentPiece, isValidGameState } from '../types/tetris.types';
import { GAME_CONFIG } from '../constants/tetris.constants';
import {
  createEmptyBoard,
  spawnNewPiece,
  isValidPosition,
  placePiece,
  clearLines,
  checkGameOver,
  rotatePieceShape
} from '../utils/tetris.utils';

// スコア計算関数（テスト可能性の向上）
export const calculateScore = (linesCleared: number, matchPoints: number): number => {
  let totalScore = 0;
  
  if (linesCleared > 0) {
    const linePoints = GAME_CONFIG.SCORE_MULTIPLIERS.LINES[linesCleared] || linesCleared * 100;
    totalScore += linePoints;
  }
  
  if (matchPoints > 0) {
    totalScore += matchPoints;
  }
  
  return totalScore;
};

type MovePieceDirection = 'up' | 'down' | 'right' | 'left';

interface UseTetrisGameReturn {
  gameState: GameState;
  movePiece: (direction: MovePieceDirection) => void;
  rotatePiece: () => void;
  startGame: () => void;
  pauseGame: () => void;
  restartGame: () => void;
}

export const useTetrisGame = (): UseTetrisGameReturn => {
  const [board, setBoard] = useState<Board>(() => createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<CurrentPiece | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const gameState: GameState = {
    board,
    currentPiece,
    score,
    gameOver,
    isPlaying
  };

  const movePiece = useCallback((direction: MovePieceDirection) => {
    if (!isValidCurrentPiece(currentPiece) || gameOver) {
      return;
    }

    const newPosition = { ...currentPiece.position };
    
    switch (direction) {
      case 'up':
        newPosition.y -= 1;  // 上方向移動
        break;
      case 'down':
        newPosition.y += 1;  // 下方向移動
        break;
      case 'right':
        newPosition.x += 1;  // 右方向移動（落下）
        break;
      case 'left':
        newPosition.x -= 1;  // 左方向移動
        break;
    }

    const newPiece = { ...currentPiece, position: newPosition };

    if (isValidPosition(newPiece, newPosition, board)) {
      setCurrentPiece(newPiece);
    } else if (direction === 'right') {
      // ピースが着地した場合の処理
      const finalBoard = placePiece(currentPiece, board);
      const { newBoard: clearedBoard, linesCleared, matchPoints } = clearLines(finalBoard);
      
      setBoard(clearedBoard);
      
      // スコア加算：消去されたライン数に応じて点数を付与 + マッチポイント
      const totalScore = calculateScore(linesCleared, matchPoints);
      if (totalScore > 0) {
        setScore(prev => prev + totalScore);
      }
      
      // ゲームオーバーチェック
      if (checkGameOver(clearedBoard)) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }
      
      // 次のピースを生成
      const nextPiece = spawnNewPiece();
      if (isValidPosition(nextPiece, nextPiece.position, clearedBoard)) {
        setCurrentPiece(nextPiece);
      } else {
        setGameOver(true);
        setIsPlaying(false);
      }
    }
  }, [currentPiece, gameOver, board]);

  const rotatePiece = useCallback(() => {
    if (!isValidCurrentPiece(currentPiece) || gameOver) return;

    // 標準的なテトリスの回転処理（時計回り90度）
    const rotated = rotatePieceShape(currentPiece.shape);
    const rotatedPiece = { ...currentPiece, shape: rotated };

    // 壁蹴り（Wall Kick）のオフセットを試行
    for (const offset of GAME_CONFIG.WALL_KICK_OFFSETS) {
      const testPosition = {
        x: currentPiece.position.x + offset.x,
        y: currentPiece.position.y + offset.y
      };
      
      const testPiece = { ...rotatedPiece, position: testPosition };

      if (isValidPosition(testPiece, testPosition, board)) {
        setCurrentPiece(testPiece);
        
        // 回転後にマッチをチェック
        console.log('Checking matches after rotation...');
        setBoard(prevBoard => {
          const newBoard = prevBoard.map(row => [...row]);
          const result = clearLines(newBoard);
          if (result.linesCleared > 0 || result.matchPoints > 0) {
            console.log(`Found matches after rotation: lines=${result.linesCleared}, points=${result.matchPoints}`);
            setScore(prevScore => prevScore + result.matchPoints);
          }
          return newBoard;
        });
        return;
      }
    }
  }, [currentPiece, gameOver, board]);

  const startGame = useCallback(() => {
    const initialBoard = createEmptyBoard();
    setBoard(initialBoard);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    const newPiece = spawnNewPiece();
    setCurrentPiece(newPiece);
  }, []);

  const pauseGame = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const restartGame = useCallback(() => {
    const initialBoard = createEmptyBoard();
    setBoard(initialBoard);
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
    setCurrentPiece(null);
  }, []);

  // Game loop effect
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const intervalId = setInterval(() => {
      movePiece('right');
    }, GAME_CONFIG.FALL_SPEED);

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying, gameOver, movePiece]);

  // ゲーム初期化 - マウント時のみ実行
  useEffect(() => {
    const initialBoard = createEmptyBoard();
    setBoard(initialBoard);
    
    // ゲーム状態の妥当性チェック
    if (isValidGameState(gameState)) {
      console.log('Game state is valid');
    }
  }, []); // 空の依存配列でマウント時のみ実行

  return {
    gameState,
    movePiece,
    rotatePiece,
    startGame,
    pauseGame,
    restartGame,
  };
};
