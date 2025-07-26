import React from 'react';
import { Box, Paper, IconButton } from '@mui/material';
import {
  PlayArrow,
  Pause,
  Refresh,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  RotateRight,
} from '@mui/icons-material';
import { GAME_CONFIG } from '../constants/tetris.constants';

interface ControlPanelProps {
  isPlaying: boolean;
  gameOver: boolean;
  onStartGame: () => void;
  onPauseGame: () => void;
  onMovePiece: (direction: 'up' | 'down' | 'right') => void;
  onRotatePiece: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  gameOver,
  onStartGame,
  onPauseGame,
  onMovePiece,
  onRotatePiece,
}) => {
  // 入力検証 - 型ガードを活用したプロダクトコードの改善
  const validIsPlaying = typeof isPlaying === 'boolean' ? isPlaying : false;
  const validGameOver = typeof gameOver === 'boolean' ? gameOver : false;
  
  // 関数の検証
  const safeOnStartGame = typeof onStartGame === 'function' ? onStartGame : () => {};
  const safeOnPauseGame = typeof onPauseGame === 'function' ? onPauseGame : () => {};
  const safeOnMovePiece = typeof onMovePiece === 'function' ? onMovePiece : () => {};
  const safeOnRotatePiece = typeof onRotatePiece === 'function' ? onRotatePiece : () => {};

  return (
    <Paper 
      elevation={4}
      sx={{
        width: `${3 * 25}px`, // 3列分の幅
        height: `${GAME_CONFIG.BOARD_HEIGHT * 25}px`, // ボードと同じ高さ
        background: 'linear-gradient(135deg, rgba(255,87,51,0.15), rgba(255,140,0,0.15))', // 赤オレンジ系のグラデーション
        border: '2px solid rgba(255,87,51,0.4)',
        borderRadius: '0 8px 8px 0',
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      {/* ゲーム制御ボタン */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 0.75, 
        alignItems: 'center',
        width: '100%'
      }}>
        {!validIsPlaying ? (
          <IconButton 
            onClick={safeOnStartGame}
            disabled={validGameOver}
            sx={{
              backgroundColor: 'rgba(255,87,51,0.8)', // 赤オレンジ
              '&:hover': { backgroundColor: 'rgba(255,87,51,1.0)' },
              '&:disabled': { backgroundColor: 'rgba(100,100,100,0.2)', color: 'rgba(255,255,255,0.3)' },
              color: 'white',
              fontSize: '1em',
              width: 38,
              height: 32,
              borderRadius: 0 // 四角いボタン
            }}
            size="small"
            title="Start"
          >
            <PlayArrow />
          </IconButton>
        ) : (
          <IconButton 
            onClick={safeOnPauseGame}
            sx={{
              backgroundColor: 'rgba(255,140,0,0.8)', // オレンジ
              '&:hover': { backgroundColor: 'rgba(255,140,0,1.0)' },
              color: 'white',
              fontSize: '1em',
              width: 38,
              height: 32,
              borderRadius: 0 // 四角いボタン
            }}
            size="small"
            title="Pause"
          >
            <Pause />
          </IconButton>
        )}
        
        <IconButton 
          onClick={safeOnStartGame}
          sx={{
            backgroundColor: 'rgba(220,20,60,0.8)', // クリムゾン
            '&:hover': { backgroundColor: 'rgba(220,20,60,1.0)' },
            color: 'white',
            fontSize: '1em',
            width: 38,
            height: 32,
            borderRadius: 0 // 四角いボタン
          }}
          size="small"
                      title="Restart"
        >
          <Refresh />
        </IconButton>
      </Box>

      {/* 移動・回転ボタン - 縦配置 */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 0.75,
        width: '100%',
        alignItems: 'center'
      }}>
        {/* 上ボタン（上方向移動） */}
        <IconButton
          onClick={() => safeOnMovePiece('up')}
          disabled={!validIsPlaying || validGameOver}
          sx={{ 
            backgroundColor: 'rgba(255,99,71,0.8)', // トマト色
            '&:hover': { backgroundColor: 'rgba(255,99,71,1.0)' },
            '&:disabled': { backgroundColor: 'rgba(100,100,100,0.2)', color: 'rgba(255,255,255,0.3)' },
            color: 'white',
            width: 38,
            height: 32,
            borderRadius: 0 // 四角いボタン
          }}
          size="small"
          title="Move Up"
        >
          <KeyboardArrowLeft sx={{ fontSize: '1em', transform: 'rotate(90deg)' }} />
        </IconButton>
        
        {/* 回転ボタン */}
        <IconButton
          onClick={safeOnRotatePiece}
          disabled={!validIsPlaying || validGameOver}
          sx={{ 
            backgroundColor: 'rgba(255,69,0,0.8)', // 赤オレンジ
            '&:hover': { backgroundColor: 'rgba(255,69,0,1.0)' },
            '&:disabled': { backgroundColor: 'rgba(100,100,100,0.2)', color: 'rgba(255,255,255,0.3)' },
            color: 'white',
            width: 38,
            height: 32,
            borderRadius: 0 // 四角いボタン
          }}
          size="small"
          title="Rotate"
        >
          <RotateRight sx={{ fontSize: '1em' }} />
        </IconButton>
        
        {/* 下ボタン（下方向移動） */}
        <IconButton
          onClick={() => safeOnMovePiece('down')}
          disabled={!validIsPlaying || validGameOver}
          sx={{ 
            backgroundColor: 'rgba(255,165,0,0.8)', // オレンジ
            '&:hover': { backgroundColor: 'rgba(255,165,0,1.0)' },
            '&:disabled': { backgroundColor: 'rgba(100,100,100,0.2)', color: 'rgba(255,255,255,0.3)' },
            color: 'white',
            width: 38,
            height: 32,
            borderRadius: 0 // 四角いボタン
          }}
          size="small"
          title="Move Down"
        >
          <KeyboardArrowLeft sx={{ fontSize: '1em', transform: 'rotate(-90deg)' }} />
        </IconButton>
        
        {/* 右ボタン（落下加速） */}
        <IconButton
          onClick={() => safeOnMovePiece('right')}
          disabled={!validIsPlaying || validGameOver}
          sx={{ 
            backgroundColor: 'rgba(255,127,80,0.8)', // コーラル
            '&:hover': { backgroundColor: 'rgba(255,127,80,1.0)' },
            '&:disabled': { backgroundColor: 'rgba(100,100,100,0.2)', color: 'rgba(255,255,255,0.3)' },
            color: 'white',
            width: 38,
            height: 32,
            borderRadius: 0 // 四角いボタン
          }}
          size="small"
          title="Drop"
        >
          <KeyboardArrowRight sx={{ fontSize: '1em' }} />
        </IconButton>
      </Box>
    </Paper>
  );
};
