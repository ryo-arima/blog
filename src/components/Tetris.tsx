import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { useTetrisGame } from './hooks/useTetrisGame';
import { ScorePanel } from './ui/ScorePanel';
import { GameBoard } from './ui/GameBoard';
import { ControlPanel } from './ui/ControlPanel';
import { createDisplayBoard } from './utils/tetris.utils';

/**
 * Tetris Game Component (統合版)
 * 
 * このコンポーネントは完全にリファクタリングされたTetrisゲームの実装です。
 * 
 * アーキテクチャの改善点:
 * - 型定義とインターフェースの分離 (types/tetris.types.ts)
 * - 定数の整理とモジュール化 (constants/tetris.constants.ts)
 * - ゲームロジックのカスタムフック化 (hooks/useTetrisGame.ts)
 * - UIコンポーネントの分割 (ui/ScorePanel.tsx, GameBoard.tsx, ControlPanel.tsx)
 * - ユーティリティ関数の集約 (utils/tetris.utils.ts)
 * - パフォーマンス最適化（useMemo使用）
 * 
 * ゲーム仕様:
 * - 横方向の重力システム（左から右へピースが落下）
 * - 数値ベースのブロック管理システム（1-9の数字でブロックタイプを管理）
 * - 5個以上の連続する同色ブロックのマッチング
 * - リアルタイムでのUI更新とゲーム状態管理
 * 
 * @version 2.0.0
 * @author GitHub Copilot
 */
const Tetris: React.FC = () => {
  // カスタムフックからゲーム状態と操作関数を取得
  const { gameState, movePiece, rotatePiece, startGame, pauseGame } = useTetrisGame();
  
  // 表示用ボードの作成（メモ化でパフォーマンス最適化）
  // currentPieceとboardの状態が変更された時のみ再計算される
  const displayBoard = useMemo(() => {
    return createDisplayBoard(gameState.board, gameState.currentPiece);
  }, [gameState.board, gameState.currentPiece]);

  return (
    <Box sx={{ 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start', 
      gap: 0 
    }}>
      {/* 左パネル - スコア表示とゲーム情報 */}
      <ScorePanel 
        score={gameState.score} 
        gameOver={gameState.gameOver} 
      />

      {/* 中央パネル - ゲームボード（メイン表示エリア） */}
      <GameBoard displayBoard={displayBoard} />

      {/* 右パネル - ゲーム操作コントロール */}
      <ControlPanel
        isPlaying={gameState.isPlaying}
        gameOver={gameState.gameOver}
        onStartGame={startGame}
        onPauseGame={pauseGame}
        onMovePiece={movePiece}
        onRotatePiece={rotatePiece}
      />
    </Box>
  );
};

export default Tetris;
