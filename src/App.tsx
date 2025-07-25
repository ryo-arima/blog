import { useEffect } from 'react'
import {
  Typography,
  Container,
  Box,
  Avatar,
  Chip,
  Paper,
} from '@mui/material'
import {
  Code,
  X,
  GitHub,
  Article,
} from '@mui/icons-material'
import ryoArimaImage from './assets/ryo-arima.png'
import './App.css'
import Tetris from './components/Tetris'

function App() {
  // ページタイトルを設定
  useEffect(() => {
    document.title = 'ryo-arima'
  }, [])

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header with Tetris */}
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ maxWidth: '850px', width: '100%' }}>
            <Tetris />
          </Box>
        </Box>
      </Container>

      {/* Main Content */}
      <Container maxWidth="lg">
        {/* Profile Section - GitHubプロフィール風 */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              mb: 4, 
              maxWidth: '850px',
              width: '100%',
              background: 'linear-gradient(135deg, rgba(100, 108, 255, 0.1), rgba(97, 218, 251, 0.1))',
              borderRadius: 3
            }}
          >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
            {/* プロフィール画像と名前 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Avatar
                src={ryoArimaImage}
                sx={{ 
                  width: 120, 
                  height: 120,
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.05)' },
                  mb: 2
                }}
              />
              
              {/* 名前をアイコンの近く、左寄せに配置 */}
              <Typography variant="h4" component="h1" sx={{ 
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'left'
              }}>
                Ryo Arima
              </Typography>
            </Box>
            
            {/* プロフィール情報 */}
            <Box sx={{ flex: 1, ml: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="body1" sx={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 3,
                lineHeight: 1.6,
                fontSize: '1.1rem',
                textAlign: 'left'
              }}>
                🌱 Hack our issue! : ) Love & Peace & Technology : )
              </Typography>
              
              <Box sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 1,
                  textAlign: 'left'
                }}>
                  📍 Japan • 🕐 JST (UTC+9)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <X sx={{ color: '#61dafb', fontSize: '1rem' }} />
                    <a href="https://x.com/RyoArima_X" style={{ color: '#61dafb', textDecoration: 'none' }}>@RyoArima_X</a>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <GitHub sx={{ color: '#61dafb', fontSize: '1rem' }} />
                    <a href="https://github.com/ryo-arima" style={{ color: '#61dafb', textDecoration: 'none' }}>github.com/ryo-arima</a>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Article sx={{ color: '#55c500', fontSize: '1rem' }} />
                    <a href="https://qiita.com/ryo-arima" style={{ color: '#61dafb', textDecoration: 'none' }}>qiita.com/ryo-arima</a>
                  </Box>
                </Box>
              </Box>
              
              {/* 専門スキルタグ */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                <Chip 
                  label="Infrastructure Engineer" 
                  variant="outlined" 
                  sx={{ 
                    color: '#ff6b6b', 
                    borderColor: '#ff6b6b',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.1)' }
                  }}
                />
                <Chip 
                  label="Software Engineer" 
                  variant="outlined" 
                  sx={{ 
                    color: '#4ecdc4', 
                    borderColor: '#4ecdc4',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: 'rgba(78, 205, 196, 0.1)' }
                  }}
                />
                <Chip 
                  label="Solution Architect" 
                  variant="outlined" 
                  sx={{ 
                    color: '#45b7d1', 
                    borderColor: '#45b7d1',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: 'rgba(69, 183, 209, 0.1)' }
                  }}
                />
                <Chip 
                  icon={<Code />} 
                  label="Go • Python • TypeScript" 
                  variant="outlined" 
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export default App
