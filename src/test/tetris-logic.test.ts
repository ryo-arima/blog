// テトリスゲームロジックのユニットテスト
import { describe, it, expect } from 'vitest'

// テトリスのピース形状定義（テスト用）
const TETROMINOES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#00f0f0'
  },
  O: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: '#f0f000'
  },
  Single: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#ff69b4'
  },
  Line2: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#32cd32'
  }
}

// ボード作成ヘルパー
const createEmptyBoard = (width: number, height: number) => {
  return Array(height).fill(null).map(() => Array(width).fill(null))
}

// ピース配置ヘルパー
const placePieceOnBoard = (board: any[][], piece: any, position: { x: number, y: number }) => {
  const newBoard = board.map(row => [...row])
  
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        const boardY = position.y + row
        const boardX = position.x + col
        
        if (boardY >= 0 && boardY < board.length && 
            boardX >= 0 && boardX < board[0].length) {
          newBoard[boardY][boardX] = piece.color
        }
      }
    }
  }
  
  return newBoard
}

// 有効位置チェックヘルパー
const isValidPosition = (board: any[][], piece: any, position: { x: number, y: number }) => {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        const newY = position.y + row
        const newX = position.x + col
        
        if (newY < 0 || newY >= board.length || newX < 0 || newX >= board[0].length) {
          return false
        }
        
        if (board[newY] && board[newY][newX]) {
          return false
        }
      }
    }
  }
  return true
}

// マッチング検出ヘルパー
const detectMatches = (board: any[][], minMatch: number = 5) => {
  const toRemove: boolean[][] = Array(board.length).fill(null).map(() => Array(board[0].length).fill(false))
  let matchCount = 0

  // 水平方向のマッチをチェック
  for (let row = 0; row < board.length; row++) {
    let consecutiveCount = 0
    let currentColor = null
    
    for (let col = 0; col < board[0].length; col++) {
      if (board[row][col] === currentColor && currentColor !== null) {
        consecutiveCount++
      } else {
        if (consecutiveCount >= minMatch && currentColor !== null) {
          for (let i = col - consecutiveCount; i < col; i++) {
            toRemove[row][i] = true
          }
          matchCount += consecutiveCount
        }
        consecutiveCount = board[row][col] !== null ? 1 : 0
        currentColor = board[row][col]
      }
    }
    
    if (consecutiveCount >= minMatch && currentColor !== null) {
      for (let i = board[0].length - consecutiveCount; i < board[0].length; i++) {
        toRemove[row][i] = true
      }
      matchCount += consecutiveCount
    }
  }

  return { toRemove, matchCount }
}

// 回転ヘルパー
const rotatePiece = (piece: any) => {
  return piece.shape.map((row: any, i: number) =>
    row.map((_: any, j: number) => piece.shape[piece.shape.length - 1 - j][i])
  )
}

describe('Tetris Game Logic', () => {
  describe('Board Operations', () => {
    it('should create an empty board', () => {
      const board = createEmptyBoard(10, 10)
      expect(board).toHaveLength(10)
      expect(board[0]).toHaveLength(10)
      expect(board[0][0]).toBeNull()
    })

    it('should place a piece on the board', () => {
      const board = createEmptyBoard(10, 10)
      const piece = TETROMINOES.Single
      const position = { x: 5, y: 5 }
      
      const newBoard = placePieceOnBoard(board, piece, position)
      // Singleピースは shape[1][1] = 1 なので、位置は (position.y + 1, position.x + 1) = (6, 6)
      expect(newBoard[6][6]).toBe(piece.color)
    })
  })

  describe('Piece Validation', () => {
    it('should validate valid piece positions', () => {
      const board = createEmptyBoard(10, 10)
      const piece = TETROMINOES.O
      const position = { x: 5, y: 5 }
      
      expect(isValidPosition(board, piece, position)).toBe(true)
    })

    it('should reject pieces outside board boundaries', () => {
      const board = createEmptyBoard(10, 10)
      const piece = TETROMINOES.O
      
      // O ピースの実際の形状: shape[1][1], shape[1][2], shape[2][1], shape[2][2] = 1
      // 左端外 - x=-2 だと shape[1][1] が x=-2+1=-1 で範囲外
      expect(isValidPosition(board, piece, { x: -2, y: 1 })).toBe(false)
      // 右端外 - x=9 だと shape[1][2] が x=9+2=11 で範囲外
      expect(isValidPosition(board, piece, { x: 9, y: 1 })).toBe(false)
      // 上端外 - y=-2 だと shape[1][1] が y=-2+1=-1 で範囲外
      expect(isValidPosition(board, piece, { x: 1, y: -2 })).toBe(false)
      // 下端外 - y=9 だと shape[2][1] が y=9+2=11 で範囲外
      expect(isValidPosition(board, piece, { x: 1, y: 9 })).toBe(false)
    })

    it('should reject pieces overlapping with existing blocks', () => {
      const board = createEmptyBoard(10, 10)
      board[6][6] = '#ff0000' // 既存のブロック
      
      const piece = TETROMINOES.Single
      const position = { x: 5, y: 5 } // これで Single ピースが (6,6) に配置される
      
      expect(isValidPosition(board, piece, position)).toBe(false)
    })
  })

  describe('Match Detection', () => {
    it('should detect horizontal matches of 5 or more', () => {
      const board = createEmptyBoard(10, 10)
      // 5つの同色ブロックを横に配置
      for (let i = 0; i < 5; i++) {
        board[5][i] = '#00ff00'
      }
      
      const { matchCount } = detectMatches(board, 5)
      expect(matchCount).toBe(5)
    })

    it('should not detect matches less than 5', () => {
      const board = createEmptyBoard(10, 10)
      // 4つの同色ブロックを横に配置
      for (let i = 0; i < 4; i++) {
        board[5][i] = '#00ff00'
      }
      
      const { matchCount } = detectMatches(board, 5)
      expect(matchCount).toBe(0)
    })

    it('should detect multiple separate matches', () => {
      const board = createEmptyBoard(10, 10)
      // 最初のマッチ（5ブロック）
      for (let i = 0; i < 5; i++) {
        board[3][i] = '#00ff00'
      }
      // 2番目のマッチ（6ブロック）
      for (let i = 0; i < 6; i++) {
        board[7][i] = '#ff0000'
      }
      
      const { matchCount } = detectMatches(board, 5)
      expect(matchCount).toBe(11) // 5 + 6
    })

    it('should not match across different colors', () => {
      const board = createEmptyBoard(10, 10)
      // 交互に色を配置
      board[5][0] = '#00ff00'
      board[5][1] = '#ff0000'
      board[5][2] = '#00ff00'
      board[5][3] = '#ff0000'
      board[5][4] = '#00ff00'
      
      const { matchCount } = detectMatches(board, 5)
      expect(matchCount).toBe(0)
    })
  })

  describe('Piece Rotation', () => {
    it('should rotate I piece correctly', () => {
      const piece = TETROMINOES.I
      const rotated = rotatePiece(piece)
      
      // I ピース元: [0,0,0,0], [1,1,1,0], [0,0,0,0], [0,0,0,0]
      // 回転後:    [0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,0,0]
      expect(rotated[0][2]).toBe(1)
      expect(rotated[1][2]).toBe(1) 
      expect(rotated[2][2]).toBe(1)
      expect(rotated[0][1]).toBe(0)
    })

    it('should rotate O piece correctly (should remain the same)', () => {
      const piece = TETROMINOES.O
      const rotated = rotatePiece(piece)
      
      // O ピースは回転しても同じ形状
      expect(rotated[1][1]).toBe(1)
      expect(rotated[1][2]).toBe(1)
      expect(rotated[2][1]).toBe(1)
      expect(rotated[2][2]).toBe(1)
    })

    it('should rotate Line2 piece correctly', () => {
      const piece = TETROMINOES.Line2
      const rotated = rotatePiece(piece)
      
      // Line2 ピース元: [0,0,0,0], [1,1,0,0], [0,0,0,0], [0,0,0,0]
      // 回転後:        [0,0,1,0], [0,0,1,0], [0,0,0,0], [0,0,0,0]
      expect(rotated[0][2]).toBe(1)
      expect(rotated[1][2]).toBe(1)
    })
  })

  describe('Game Mechanics', () => {
    it('should calculate correct board width for given screen size', () => {
      const calculateBoardWidth = (screenWidth: number) => {
        const availableWidth = Math.min(screenWidth - 100, 800)
        return Math.max(Math.floor(availableWidth / 25), 15)
      }
      
      expect(calculateBoardWidth(400)).toBe(15) // 最小値
      expect(calculateBoardWidth(1000)).toBe(32) // 通常値
      expect(calculateBoardWidth(2000)).toBe(32) // 最大値制限
    })

    it('should properly handle edge cases in piece placement', () => {
      const board = createEmptyBoard(10, 10)
      const piece = TETROMINOES.Single
      
      // 境界ギリギリの有効な配置（Single ピースの実際のブロックは shape[1][1]）
      const position = { x: 8, y: 8 } // これで実際のブロックは board[9][9] に配置される
      const newBoard = placePieceOnBoard(board, piece, position)
      
      expect(newBoard[9][9]).toBe(piece.color)
    })
  })
})
