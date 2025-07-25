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
