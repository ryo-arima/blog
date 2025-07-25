import '@testing-library/jest-dom'

// グローバルなモック設定
;(globalThis as any).ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Windowオブジェクトのモック
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
})

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
})
