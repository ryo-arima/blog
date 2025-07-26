import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { GAME_CONFIG } from '../constants/tetris.constants';

interface ScorePanelProps {
  score: number;
  gameOver: boolean;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({ score, gameOver }) => {
  // 入力検証
  const validScore = typeof score === 'number' && score >= 0 ? score : 0;
  const validGameOver = typeof gameOver === 'boolean' ? gameOver : false;

  return (
    <Paper 
      elevation={4}
      sx={{
        width: `${2 * 25}px`, // 2列の幅
        height: `${GAME_CONFIG.BOARD_HEIGHT * 25}px`, // ボードと同じ高さ
        background: 'linear-gradient(135deg, rgba(100,108,255,0.3), rgba(97,218,251,0.3))',
        border: '2px solid rgba(255,255,255,0.3)',
        borderRadius: '8px 0 0 8px',
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Box sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="caption" sx={{ color: 'white', opacity: 0.8, fontSize: '0.7em' }}>
          SCORE
        </Typography>
        <Typography variant="h6" sx={{ 
          color: '#61dafb', 
          fontWeight: 'bold',
          fontSize: '1.2em',
          textShadow: '0 0 5px rgba(97,218,251,0.5)'
        }}>
          {validScore}
        </Typography>
        <Typography variant="caption" sx={{ 
          color: 'white', 
          opacity: 0.6, 
          fontSize: '0.6em',
          mt: 0.5
        }}>
          5+ = 10pt
        </Typography>
      </Box>
      
      {validGameOver && (
        <Chip 
          label="OVER"
          color="error"
          variant="filled"
          size="small"
          sx={{ fontSize: '0.6em', py: 0.5 }}
        />
      )}
    </Paper>
  );
};
