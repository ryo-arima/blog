# テストファイル構成

このディレクトリには、Tetrisゲームの統合されたテストスイートが含まれています。

## テストファイル一覧

### メインコンポーネント
- `App.test.tsx` - アプリケーション全体のテスト
- `Tetris.test.tsx` - Tetrisメインコンポーネントのテスト

### UIコンポーネント
- `ControlPanel.test.tsx` - コントロールパネルのテスト
- `GameBoard.test.tsx` - ゲームボードのテスト
- `ScorePanel.test.tsx` - スコアパネルのテスト

### ユーティリティ・ロジック
- `useTetrisGame.test.ts` - ゲームロジックフックのテスト
- `tetris-utils.test.ts` - ユーティリティ関数のテスト
- `tetris-constants.test.ts` - 定数定義のテスト
- `tetris-types.test.ts` - 型定義のテスト

### その他
- `main.test.tsx` - エントリーポイントのテスト
- `basic.test.ts` - 基本的なテスト設定
- `setup.ts` - テスト環境のセットアップ

## 削除された重複ファイル

以下の重複していたテストファイルを削除し、統合しました：

### Coverage系テスト（統合済み）
- tetris-90-percent-coverage.test.tsx
- tetris-advanced-coverage.test.tsx
- tetris-final-*-coverage.test.tsx (複数)
- tetris-strategic-*-coverage.test.tsx (複数)
- tetris-ultimate-*-coverage.test.tsx (複数)

### Main系テスト（統合済み）
- main-actual-execution.test.tsx
- main-complete-coverage.test.tsx
- main-coverage.test.tsx
- main-direct.test.tsx
- main-execution.test.tsx
- main.integration.test.tsx

### Component系テスト（統合済み）
- tetris-component.test.tsx
- tetris-edge-cases.test.tsx
- Tetris.advanced.test.tsx
- Tetris.coverage.test.tsx
- TetrisRefactored.test.tsx

### Components サブディレクトリ（削除）
- components/ ディレクトリ全体（メインディレクトリのテストと重複）

## テスト実行

```bash
# 全テスト実行
npm test

# カバレッジ付きテスト実行
npm run test:coverage

# 特定のテストファイル実行
npm test -- Tetris.test.tsx
```

## カバレッジ目標

- **全体**: 95%以上
- **useTetrisGame.ts**: 100%（達成済み）
- **tetris.utils.ts**: 95%以上
- **UIコンポーネント**: 90%以上
