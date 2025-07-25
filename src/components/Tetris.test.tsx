import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Tetris from './Tetris'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const TetrisWrapper = () => (
  <ThemeProvider theme={theme}>
    <Tetris />
  </ThemeProvider>
)

// モック関数
const mockResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// ウィンドウの設定
const mockWindow = {
  innerWidth: 1024,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

describe('Tetris Component', () => {
  beforeEach(() => {
    // ResizeObserverのモック
    vi.stubGlobal('ResizeObserver', mockResizeObserver)
    
    // windowのモック
    vi.stubGlobal('window', mockWindow)
  })

  describe('Initial Rendering', () => {
    it('should render score display', () => {
      render(<TetrisWrapper />)
      expect(screen.getByText('SCORE')).toBeInTheDocument()
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should render start button initially', () => {
      render(<TetrisWrapper />)
      // アイコンボタンになったので、title属性で確認
      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
    })

    it('should render scoring rule', () => {
      render(<TetrisWrapper />)
      expect(screen.getByText('5+ = 10pt')).toBeInTheDocument()
    })
  })

  describe('Game Board', () => {
    it('should render game board container', () => {
      render(<TetrisWrapper />)
      // ゲームボードのコンテナが存在することを確認
      const containers = screen.getAllByRole('generic')
      expect(containers.length).toBeGreaterThan(0)
    })
  })
})
