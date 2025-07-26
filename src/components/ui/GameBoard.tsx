import React from 'react';
import { Box, Paper } from '@mui/material';
import type { Board } from '../types/tetris.types';
import { GAME_CONFIG, BLOCK_COLORS } from '../constants/tetris.constants';

interface GameBoardProps {
  displayBoard: Board;
}

export const GameBoard: React.FC<GameBoardProps> = ({ displayBoard }) => {
  // 入力検証
  if (!Array.isArray(displayBoard)) {
    console.error('GameBoard: displayBoard must be an array');
    return null;
  }

  return (
    <Paper 
      elevation={6}
      sx={{
        width: `${GAME_CONFIG.BOARD_WIDTH * 25}px`,
        height: `${GAME_CONFIG.BOARD_HEIGHT * 25}px`,
        background: '#222',
        border: '3px solid #fff',
        borderRadius: 0,
        p: 1,
        display: 'grid',
        gridTemplateRows: `repeat(${GAME_CONFIG.BOARD_HEIGHT}, 1fr)`,
        gap: '1px',
        overflow: 'hidden'
      }}
    >
      {displayBoard.map((row, rowIndex) => (
        <Box 
          key={rowIndex} 
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GAME_CONFIG.BOARD_WIDTH}, 1fr)`,
            gap: '1px'
          }}
        >
          {row.map((cell, colIndex) => {
            const blockColor = cell !== null ? BLOCK_COLORS[cell] : '#111';
            return (
              <Box
                key={colIndex}
                sx={{
                  width: '100%',
                  height: '100%',
                  minWidth: '20px',
                  minHeight: '20px',
                  backgroundColor: blockColor,
                  border: cell ? '1px solid #fff' : '1px solid #444',
                  borderRadius: 0.5,
                  transition: 'all 0.2s ease',
                  boxShadow: cell ? '0 0 4px rgba(255,255,255,0.3)' : 'none'
                }}
              />
            );
          })}
        </Box>
      ))}
    </Paper>
  );
};
