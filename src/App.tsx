import { useState } from 'react'
import {
  AppBar,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Box,
  Avatar,
  Chip,
  Fab,
  Paper,
} from '@mui/material'
import {
  PlayArrow,
  Add,
  Code,
  SportsEsports,
} from '@mui/icons-material'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Tetris from './components/Tetris'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header with Tetris */}
      <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none', mb: 4 }}>
        <Container>
          <Tetris />
        </Container>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg">
        {/* Logo Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(100, 108, 255, 0.1), rgba(97, 218, 251, 0.1))',
            borderRadius: 3
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 3 }}>
            <Avatar
              src={viteLogo}
              sx={{ 
                width: 80, 
                height: 80,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            />
            <Avatar
              src={reactLogo}
              sx={{ 
                width: 80, 
                height: 80,
                animation: 'spin 20s linear infinite',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            />
          </Box>
          
          <Typography variant="h2" component="h1" gutterBottom sx={{ 
            background: 'linear-gradient(45deg, #646cff, #61dafb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            Vite + React + Material-UI
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
            <Chip icon={<Code />} label="TypeScript" color="primary" />
            <Chip icon={<SportsEsports />} label="Tetris Game" color="secondary" />
            <Chip icon={<PlayArrow />} label="Material-UI" color="success" />
          </Box>
        </Paper>

        {/* Interactive Cards */}
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box sx={{ flex: '1', minWidth: '300px', maxWidth: '500px' }}>
            <Card 
              elevation={6}
              sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, rgba(100, 108, 255, 0.05), rgba(97, 218, 251, 0.05))',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
                }
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom color="primary">
                  Interactive Counter
                </Typography>
                
                <Box sx={{ my: 4 }}>
                  <Fab 
                    color="primary" 
                    size="large"
                    onClick={() => setCount((count) => count + 1)}
                    sx={{ 
                      mr: 2,
                      background: 'linear-gradient(45deg, #646cff, #535bf2)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #535bf2, #646cff)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <Add />
                  </Fab>
                  
                  <Typography variant="h3" component="span" color="secondary">
                    {count}
                  </Typography>
                </Box>

                <Typography variant="body1" color="text.secondary">
                  Click the button to increment the counter
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1', minWidth: '300px', maxWidth: '500px' }}>
            <Card 
              elevation={6}
              sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, rgba(97, 218, 251, 0.05), rgba(100, 108, 255, 0.05))',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
                }
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom color="secondary">
                  Hot Module Replacement
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ my: 3 }}>
                  Edit <code style={{ 
                    background: 'rgba(100, 108, 255, 0.1)', 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>src/App.tsx</code> and save to test HMR
                </Typography>

                <Button 
                  variant="contained" 
                  color="secondary"
                  size="large"
                  sx={{
                    background: 'linear-gradient(45deg, #61dafb, #21cff3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #21cff3, #61dafb)',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 6, mb: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Click on the Vite and React logos to learn more
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default App
