import { describe, it, expect } from 'vitest'

// 基本的な数学関数のテスト
describe('Basic Math Functions', () => {
  it('should add numbers correctly', () => {
    expect(1 + 1).toBe(2)
    expect(2 + 3).toBe(5)
  })

  it('should multiply numbers correctly', () => {
    expect(2 * 3).toBe(6)
    expect(5 * 4).toBe(20)
  })
})

// テトリスボード幅計算のテスト
describe('Tetris Board Width Calculation', () => {
  const calculateBoardWidth = (screenWidth: number) => {
    if (typeof window !== 'undefined') {
      const availableWidth = Math.min(screenWidth - 100, 800)
      return Math.max(Math.floor(availableWidth / 25), 15)
    }
    return 20
  }

  it('should calculate minimum board width', () => {
    expect(calculateBoardWidth(300)).toBe(15) // 最小値
  })

  it('should calculate normal board width', () => {
    expect(calculateBoardWidth(800)).toBe(28) // (800-100)/25 = 28
  })

  it('should cap at maximum board width', () => {
    expect(calculateBoardWidth(2000)).toBe(32) // (800)/25 = 32
  })

  it('should handle edge cases', () => {
    expect(calculateBoardWidth(0)).toBe(15) // 最小値
    expect(calculateBoardWidth(-100)).toBe(15) // 最小値
  })
})

// Additional utility function tests
describe('Utility Functions', () => {
  // Color validation
  const isValidTetrisColor = (color: string | null): boolean => {
    const validColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'cyan', 'pink', 'lime']
    return color !== null && validColors.includes(color)
  }

  it('should validate tetris colors correctly', () => {
    expect(isValidTetrisColor('red')).toBe(true)
    expect(isValidTetrisColor('blue')).toBe(true)
    expect(isValidTetrisColor('invalid')).toBe(false)
    expect(isValidTetrisColor(null)).toBe(false)
  })

  // Score calculation
  const calculateScore = (matches: number, level: number = 1): number => {
    return matches * 10 * level
  }

  it('should calculate score correctly', () => {
    expect(calculateScore(5, 1)).toBe(50)
    expect(calculateScore(10, 2)).toBe(200)
    expect(calculateScore(0, 1)).toBe(0)
  })

  // Position validation
  const isValidPosition = (x: number, y: number, boardWidth: number, boardHeight: number): boolean => {
    return x >= 0 && x < boardWidth && y >= 0 && y < boardHeight
  }

  it('should validate positions correctly', () => {
    expect(isValidPosition(5, 5, 10, 20)).toBe(true)
    expect(isValidPosition(-1, 5, 10, 20)).toBe(false)
    expect(isValidPosition(10, 5, 10, 20)).toBe(false)
    expect(isValidPosition(5, 20, 10, 20)).toBe(false)
  })

  // Array operations
  const createEmptyBoard = (width: number, height: number): (null)[][] => {
    return Array(height).fill(null).map(() => Array(width).fill(null))
  }

  it('should create empty board correctly', () => {
    const board = createEmptyBoard(5, 3)
    expect(board.length).toBe(3)
    expect(board[0].length).toBe(5)
    expect(board[0][0]).toBe(null)
  })

  // String operations
  const formatScore = (score: number): string => {
    return score.toLocaleString()
  }

  it('should format score correctly', () => {
    expect(formatScore(1000)).toBe('1,000')
    expect(formatScore(123456)).toBe('123,456')
    expect(formatScore(0)).toBe('0')
  })
})
