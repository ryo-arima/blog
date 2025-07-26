import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScorePanel } from '../../../components/ui/ScorePanel';

describe('ScorePanel', () => {
  it('should render score correctly', () => {
    render(<ScorePanel score={1000} gameOver={false} />);
    
    expect(screen.getByText('SCORE')).toBeDefined();
    expect(screen.getByText('1000')).toBeDefined();
    expect(screen.getByText('5+ = 10pt')).toBeDefined();
  });

  it('should not show game over chip when game is not over', () => {
    render(<ScorePanel score={500} gameOver={false} />);
    
    expect(screen.queryByText('OVER')).toBeNull();
  });

  it('should show game over chip when game is over', () => {
    render(<ScorePanel score={2000} gameOver={true} />);
    
    expect(screen.getByText('OVER')).toBeDefined();
  });

  it('should render zero score correctly', () => {
    render(<ScorePanel score={0} gameOver={false} />);
    
    expect(screen.getByText('0')).toBeDefined();
  });

  it('should render high score correctly', () => {
    render(<ScorePanel score={999999} gameOver={false} />);
    
    expect(screen.getByText('999999')).toBeDefined();
  });

  it('should handle invalid score prop', () => {
    // 無効なscoreの場合、0が表示される
    render(<ScorePanel score={'invalid' as any} gameOver={false} />);
    
    expect(screen.getByText('0')).toBeDefined();
  });

  it('should handle negative score', () => {
    // 負のscoreの場合、0が表示される
    render(<ScorePanel score={-100} gameOver={false} />);
    
    expect(screen.getByText('0')).toBeDefined();
  });

  it('should handle invalid gameOver prop', () => {
    // 無効なgameOverの場合、デフォルトでfalseになる
    render(<ScorePanel score={1000} gameOver={'invalid' as any} />);
    
    // OVER チップが表示されないことを確認
    expect(screen.queryByText('OVER')).toBeNull();
  });
});
