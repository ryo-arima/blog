import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ControlPanel } from '../../../components/ui/ControlPanel';

describe('ControlPanel', () => {
  const defaultProps = {
    isPlaying: false,
    gameOver: false,
    onStartGame: vi.fn(),
    onPauseGame: vi.fn(),
    onMovePiece: vi.fn(),
    onRotatePiece: vi.fn(),
  };

  it('should render start button when not playing', () => {
    render(<ControlPanel {...defaultProps} />);
    
    const startButton = screen.getByTitle('Start');
    expect(startButton).toBeDefined();
  });

  it('should render restart button when game is over', () => {
    render(<ControlPanel {...defaultProps} gameOver={true} />);
    
    const restartButton = screen.getByTitle('Restart');
    expect(restartButton).toBeDefined();
  });

  it('should render pause button when playing', () => {
    render(<ControlPanel {...defaultProps} isPlaying={true} />);
    
    const pauseButton = screen.getByTitle('Pause');
    expect(pauseButton).toBeDefined();
  });

  it('should call onStartGame when start button is clicked', () => {
    const onStartGame = vi.fn();
    render(<ControlPanel {...defaultProps} onStartGame={onStartGame} />);
    
    const startButton = screen.getByTitle('Start');
    fireEvent.click(startButton);
    
    expect(onStartGame).toHaveBeenCalledTimes(1);
  });

  it('should call onPauseGame when pause button is clicked', () => {
    const onPauseGame = vi.fn();
    render(<ControlPanel {...defaultProps} isPlaying={true} onPauseGame={onPauseGame} />);
    
    const pauseButton = screen.getByTitle('Pause');
    fireEvent.click(pauseButton);
    
    expect(onPauseGame).toHaveBeenCalledTimes(1);
  });

  it('should call onMovePiece with correct direction when movement buttons are clicked', () => {
    const onMovePiece = vi.fn();
    render(<ControlPanel {...defaultProps} isPlaying={true} onMovePiece={onMovePiece} />);
    
    // 上方向移動
    const upButton = screen.getByTitle('Move Up');
    fireEvent.click(upButton);
    expect(onMovePiece).toHaveBeenCalledWith('up');
    
    // 下方向移動
    const downButton = screen.getByTitle('Move Down');
    fireEvent.click(downButton);
    expect(onMovePiece).toHaveBeenCalledWith('down');
    
    // 右に落下
    const fallButton = screen.getByTitle('Drop');
    fireEvent.click(fallButton);
    expect(onMovePiece).toHaveBeenCalledWith('right');
  });

  it('should call onRotatePiece when rotate button is clicked', () => {
    const onRotatePiece = vi.fn();
    render(<ControlPanel {...defaultProps} isPlaying={true} onRotatePiece={onRotatePiece} />);
    
    const rotateButton = screen.getByTitle('Rotate');
    fireEvent.click(rotateButton);
    
    expect(onRotatePiece).toHaveBeenCalledTimes(1);
  });

  it('should render all control buttons', () => {
    render(<ControlPanel {...defaultProps} />);
    
    expect(screen.getByTitle('Move Up')).toBeDefined();
    expect(screen.getByTitle('Move Down')).toBeDefined();
    expect(screen.getByTitle('Rotate')).toBeDefined();
    expect(screen.getByTitle('Drop')).toBeDefined();
  });

  it('should have correct button styling', () => {
    const { container } = render(<ControlPanel {...defaultProps} />);
    
    // IconButtonが存在することを確認
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(5); // Start/Pause + 5つのコントロールボタン
  });

  it('should display different button states correctly', () => {
    const { rerender } = render(<ControlPanel {...defaultProps} />);
    
    // 初期状態：スタートボタン
    expect(screen.getByTitle('Start')).toBeDefined();
    
    // プレイ中：ポーズボタン
    rerender(<ControlPanel {...defaultProps} isPlaying={true} />);
    expect(screen.getByTitle('Pause')).toBeDefined();
    
    // ゲームオーバー：リスタートボタン
    rerender(<ControlPanel {...defaultProps} gameOver={true} />);
    expect(screen.getByTitle('Restart')).toBeDefined();
  });

  // Input validation and edge cases coverage
  it('should handle invalid prop types gracefully', () => {
    // Test with invalid isPlaying value
    const invalidProps = {
      ...defaultProps,
      isPlaying: 'invalid' as any,
      gameOver: null as any,
      onStartGame: null as any,
      onPauseGame: 'invalid' as any,
      onMovePiece: undefined as any,
      onRotatePiece: {} as any,
    };
    
    // Should render without crashing even with invalid props
    expect(() => render(<ControlPanel {...invalidProps} />)).not.toThrow();
  });

  it('should use fallback functions when invalid callbacks are provided', () => {
    // Test with various invalid callback types
    const invalidCallbackProps = {
      isPlaying: false,
      gameOver: false,
      onStartGame: null as any,
      onPauseGame: undefined as any,
      onMovePiece: 'not a function' as any,
      onRotatePiece: 123 as any,
    };
    
    // Should render without errors and test button click in single render
    render(<ControlPanel {...invalidCallbackProps} />);
    
    const startButton = screen.getByTitle('Start');
    expect(() => fireEvent.click(startButton)).not.toThrow();
  });

  it('should handle boolean type validation for isPlaying and gameOver', () => {
    // Test non-boolean values for isPlaying and gameOver
    const testCases = [
      { isPlaying: null, gameOver: undefined },
      { isPlaying: 'true', gameOver: 'false' },
      { isPlaying: 1, gameOver: 0 },
      { isPlaying: [], gameOver: {} },
    ];
    
    testCases.forEach(({ isPlaying, gameOver }) => {
      const props = {
        ...defaultProps,
        isPlaying: isPlaying as any,
        gameOver: gameOver as any,
      };
      
      const { unmount } = render(<ControlPanel {...props} />);
      
      // Should default to 'Start' button when invalid boolean values are provided
      expect(screen.getByTitle('Start')).toBeInTheDocument();
      
      // Movement buttons should be disabled
      expect(screen.getByTitle('Move Up')).toBeDisabled();
      expect(screen.getByTitle('Move Down')).toBeDisabled();
      expect(screen.getByTitle('Rotate')).toBeDisabled();
      expect(screen.getByTitle('Drop')).toBeDisabled();
      
      // Clean up to prevent multiple elements in DOM
      unmount();
    });
  });

  it('should handle edge case prop combinations', () => {
    // Test with both isPlaying and gameOver true
    render(<ControlPanel {...defaultProps} isPlaying={true} gameOver={true} />);
    
    // Movement buttons should be disabled when game is over
    const moveUpButton = screen.getByTitle('Move Up');
    const moveDownButton = screen.getByTitle('Move Down');
    const rotateButton = screen.getByTitle('Rotate');
    const dropButton = screen.getByTitle('Drop');
    
    expect(moveUpButton).toBeDisabled();
    expect(moveDownButton).toBeDisabled();
    expect(rotateButton).toBeDisabled();
    expect(dropButton).toBeDisabled();
  });

  it('should handle disabled state for movement buttons when not playing', () => {
    render(<ControlPanel {...defaultProps} isPlaying={false} gameOver={false} />);
    
    // Movement buttons should be disabled when not playing
    const moveUpButton = screen.getByTitle('Move Up');
    const moveDownButton = screen.getByTitle('Move Down');
    const rotateButton = screen.getByTitle('Rotate');
    const dropButton = screen.getByTitle('Drop');
    
    expect(moveUpButton).toBeDisabled();
    expect(moveDownButton).toBeDisabled();
    expect(rotateButton).toBeDisabled();
    expect(dropButton).toBeDisabled();
  });

  it('should not trigger callbacks when buttons are disabled', () => {
    const onMovePiece = vi.fn();
    const onRotatePiece = vi.fn();
    
    render(<ControlPanel 
      {...defaultProps} 
      isPlaying={false} 
      gameOver={true}
      onMovePiece={onMovePiece} 
      onRotatePiece={onRotatePiece} 
    />);
    
    // Try to click disabled buttons
    const moveUpButton = screen.getByTitle('Move Up');
    const rotateButton = screen.getByTitle('Rotate');
    
    fireEvent.click(moveUpButton);
    fireEvent.click(rotateButton);
    
    // Callbacks should not be called when buttons are disabled
    expect(onMovePiece).not.toHaveBeenCalled();
    expect(onRotatePiece).not.toHaveBeenCalled();
  });

  it('should handle start button click when game is over', () => {
    const onStartGame = vi.fn();
    render(<ControlPanel {...defaultProps} gameOver={true} onStartGame={onStartGame} />);
    
    // Start button should be disabled when game is over
    const startButton = screen.getByTitle('Start');
    expect(startButton).toBeDisabled();
    
    // Clicking disabled button should not trigger callback
    fireEvent.click(startButton);
    expect(onStartGame).not.toHaveBeenCalled();
  });

  // Additional coverage tests for styling and UI state
  it('should render with correct paper styling and structure', () => {
    const { container } = render(<ControlPanel {...defaultProps} />);
    
    // Check Paper component is rendered
    const paperElement = container.querySelector('.MuiPaper-root');
    expect(paperElement).toBeInTheDocument();
    
    // Check button containers exist
    const buttonContainers = container.querySelectorAll('.MuiBox-root');
    expect(buttonContainers.length).toBeGreaterThanOrEqual(2);
  });

  it('should handle all movement directions correctly when playing', () => {
    const onMovePiece = vi.fn();
    render(<ControlPanel {...defaultProps} isPlaying={true} onMovePiece={onMovePiece} />);
    
    // Test all movement directions
    fireEvent.click(screen.getByTitle('Move Up'));
    expect(onMovePiece).toHaveBeenLastCalledWith('up');
    
    fireEvent.click(screen.getByTitle('Move Down'));
    expect(onMovePiece).toHaveBeenLastCalledWith('down');
    
    fireEvent.click(screen.getByTitle('Drop'));
    expect(onMovePiece).toHaveBeenLastCalledWith('right');
    
    expect(onMovePiece).toHaveBeenCalledTimes(3);
  });

  it('should handle rapid button clicks without errors', () => {
    const onMovePiece = vi.fn();
    const onRotatePiece = vi.fn();
    
    render(<ControlPanel 
      {...defaultProps} 
      isPlaying={true} 
      onMovePiece={onMovePiece} 
      onRotatePiece={onRotatePiece} 
    />);
    
    const moveUpButton = screen.getByTitle('Move Up');
    const rotateButton = screen.getByTitle('Rotate');
    
    // Rapid clicks
    for (let i = 0; i < 5; i++) {
      fireEvent.click(moveUpButton);
      fireEvent.click(rotateButton);
    }
    
    expect(onMovePiece).toHaveBeenCalledTimes(5);
    expect(onRotatePiece).toHaveBeenCalledTimes(5);
  });

  it('should maintain button state consistency across re-renders', () => {
    const { rerender } = render(<ControlPanel {...defaultProps} isPlaying={false} />);
    
    // Initial state - buttons disabled
    expect(screen.getByTitle('Move Up')).toBeDisabled();
    expect(screen.getByTitle('Rotate')).toBeDisabled();
    
    // Playing state - buttons enabled
    rerender(<ControlPanel {...defaultProps} isPlaying={true} />);
    expect(screen.getByTitle('Move Up')).not.toBeDisabled();
    expect(screen.getByTitle('Rotate')).not.toBeDisabled();
    
    // Game over state - buttons disabled again
    rerender(<ControlPanel {...defaultProps} isPlaying={true} gameOver={true} />);
    expect(screen.getByTitle('Move Up')).toBeDisabled();
    expect(screen.getByTitle('Rotate')).toBeDisabled();
  });

  // Function coverage tests
  it('should test all arrow function implementations in onClick handlers', () => {
    const onMovePiece = vi.fn();
    const onRotatePiece = vi.fn();
    
    render(<ControlPanel 
      {...defaultProps} 
      isPlaying={true} 
      onMovePiece={onMovePiece} 
      onRotatePiece={onRotatePiece} 
    />);
    
    // Test arrow functions for move piece with different directions
    fireEvent.click(screen.getByTitle('Move Up'));
    expect(onMovePiece).toHaveBeenCalledWith('up');
    
    fireEvent.click(screen.getByTitle('Move Down'));
    expect(onMovePiece).toHaveBeenCalledWith('down');
    
    fireEvent.click(screen.getByTitle('Drop'));
    expect(onMovePiece).toHaveBeenCalledWith('right');
    
    // Test direct function call for rotate
    fireEvent.click(screen.getByTitle('Rotate'));
    expect(onRotatePiece).toHaveBeenCalledTimes(1);
  });

  it('should test fallback functions when callbacks are not functions', () => {
    // Test with non-function callbacks to trigger fallback functions
    const invalidProps = {
      isPlaying: true,
      gameOver: false,
      onStartGame: 'not a function' as any,
      onPauseGame: null as any,
      onMovePiece: undefined as any,
      onRotatePiece: {} as any,
    };
    
    render(<ControlPanel {...invalidProps} />);
    
    // These clicks should not crash and use fallback functions
    expect(() => {
      fireEvent.click(screen.getByTitle('Pause'));
    }).not.toThrow();
    
    expect(() => {
      fireEvent.click(screen.getByTitle('Move Up'));
    }).not.toThrow();
    
    expect(() => {
      fireEvent.click(screen.getByTitle('Rotate'));
    }).not.toThrow();
  });

  it('should test restart button functionality (third onClick scenario)', () => {
    const onStartGame = vi.fn();
    
    // Test restart button when game is over
    render(<ControlPanel 
      {...defaultProps} 
      gameOver={true} 
      isPlaying={false}
      onStartGame={onStartGame} 
    />);
    
    // Find restart button and verify it uses safeOnStartGame
    const restartButton = screen.getByTitle('Restart');
    fireEvent.click(restartButton);
    
    expect(onStartGame).toHaveBeenCalledTimes(1);
  });

  it('should test all safe function validations', () => {
    // Test each safe function individually with invalid inputs
    const testCases = [
      { invalidProp: 'onStartGame', value: null },
      { invalidProp: 'onPauseGame', value: undefined },
      { invalidProp: 'onMovePiece', value: 'string' },
      { invalidProp: 'onRotatePiece', value: 123 },
    ];
    
    testCases.forEach(({ invalidProp, value }) => {
      const props = {
        ...defaultProps,
        isPlaying: true,
        [invalidProp]: value,
      };
      
      // Should render without errors
      expect(() => render(<ControlPanel {...props} />)).not.toThrow();
    });
  });

  it('should test boolean validation functions', () => {
    // Test typeof checks for boolean validation
    const nonBooleanValues = [
      null, undefined, 'true', 'false', 1, 0, [], {}, function() {}
    ];
    
    nonBooleanValues.forEach((value) => {
      const props = {
        ...defaultProps,
        isPlaying: value as any,
        gameOver: value as any,
      };
      
      const { unmount } = render(<ControlPanel {...props} />);
      
      // Should default to start button state when non-boolean values are provided
      expect(screen.getByTitle('Start')).toBeInTheDocument();
      
      // Movement buttons should be disabled
      expect(screen.getByTitle('Move Up')).toBeDisabled();
      
      // Clean up to prevent multiple elements in DOM
      unmount();
    });
  });

  it('should test component re-render with function prop changes', () => {
    const initialOnStartGame = vi.fn();
    const newOnStartGame = vi.fn();
    
    const { rerender } = render(<ControlPanel 
      {...defaultProps} 
      onStartGame={initialOnStartGame} 
    />);
    
    fireEvent.click(screen.getByTitle('Start'));
    expect(initialOnStartGame).toHaveBeenCalledTimes(1);
    
    // Re-render with new function
    rerender(<ControlPanel 
      {...defaultProps} 
      onStartGame={newOnStartGame} 
    />);
    
    fireEvent.click(screen.getByTitle('Start'));
    expect(newOnStartGame).toHaveBeenCalledTimes(1);
    expect(initialOnStartGame).toHaveBeenCalledTimes(1); // Should not be called again
  });

  it('should test component with mixed valid and invalid function props', () => {
    const validOnStartGame = vi.fn();
    const validOnMovePiece = vi.fn();
    
    const mixedProps = {
      isPlaying: true,
      gameOver: false,
      onStartGame: validOnStartGame,
      onPauseGame: null as any, // Invalid
      onMovePiece: validOnMovePiece,
      onRotatePiece: 'invalid' as any, // Invalid
    };
    
    render(<ControlPanel {...mixedProps} />);
    
    // Valid functions should work
    fireEvent.click(screen.getByTitle('Pause'));
    // Should not crash even though onPauseGame is invalid
    
    fireEvent.click(screen.getByTitle('Move Up'));
    expect(validOnMovePiece).toHaveBeenCalledWith('up');
    
    // Invalid rotate function should not crash
    fireEvent.click(screen.getByTitle('Rotate'));
  });

  // Arrow function coverage tests
  it('should test all inline arrow functions used in onClick handlers', () => {
    const onMovePiece = vi.fn();
    
    render(<ControlPanel 
      {...defaultProps} 
      isPlaying={true} 
      onMovePiece={onMovePiece} 
    />);
    
    // Each onClick arrow function should be tested individually
    // () => safeOnMovePiece('up')
    fireEvent.click(screen.getByTitle('Move Up'));
    expect(onMovePiece).toHaveBeenLastCalledWith('up');
    
    // () => safeOnMovePiece('down')  
    fireEvent.click(screen.getByTitle('Move Down'));
    expect(onMovePiece).toHaveBeenLastCalledWith('down');
    
    // () => safeOnMovePiece('right')
    fireEvent.click(screen.getByTitle('Drop'));
    expect(onMovePiece).toHaveBeenLastCalledWith('right');
    
    expect(onMovePiece).toHaveBeenCalledTimes(3);
  });

  it('should test safe function execution paths', () => {
    // Test that all safe functions are created and can be executed
    const mockFunctions = {
      onStartGame: vi.fn(),
      onPauseGame: vi.fn(),
      onMovePiece: vi.fn(),
      onRotatePiece: vi.fn(),
    };
    
    // Test with valid functions
    const { rerender } = render(<ControlPanel 
      {...defaultProps} 
      isPlaying={true} 
      {...mockFunctions}
    />);
    
    // Test all safe function executions
    fireEvent.click(screen.getByTitle('Pause'));
    expect(mockFunctions.onPauseGame).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByTitle('Move Up'));
    expect(mockFunctions.onMovePiece).toHaveBeenCalledWith('up');
    
    fireEvent.click(screen.getByTitle('Rotate'));
    expect(mockFunctions.onRotatePiece).toHaveBeenCalledTimes(1);
    
    // Re-render with start state
    rerender(<ControlPanel 
      {...defaultProps} 
      isPlaying={false} 
      {...mockFunctions}
    />);
    
    fireEvent.click(screen.getByTitle('Start'));
    expect(mockFunctions.onStartGame).toHaveBeenCalledTimes(1);
  });

  it('should test typeof function validations for all callback props', () => {
    // Test each function validation path
    const invalidValues = [null, undefined, 'string', 123, {}, []];
    
    invalidValues.forEach((invalidValue) => {
      // Test onStartGame validation
      const propsWithInvalidStart = {
        ...defaultProps,
        onStartGame: invalidValue as any,
      };
      expect(() => render(<ControlPanel {...propsWithInvalidStart} />)).not.toThrow();
      
      // Test onPauseGame validation
      const propsWithInvalidPause = {
        ...defaultProps,
        isPlaying: true,
        onPauseGame: invalidValue as any,
      };
      expect(() => render(<ControlPanel {...propsWithInvalidPause} />)).not.toThrow();
      
      // Test onMovePiece validation
      const propsWithInvalidMove = {
        ...defaultProps,
        isPlaying: true,
        onMovePiece: invalidValue as any,
      };
      expect(() => render(<ControlPanel {...propsWithInvalidMove} />)).not.toThrow();
      
      // Test onRotatePiece validation
      const propsWithInvalidRotate = {
        ...defaultProps,
        isPlaying: true,
        onRotatePiece: invalidValue as any,
      };
      expect(() => render(<ControlPanel {...propsWithInvalidRotate} />)).not.toThrow();
    });
  });

  // Complete function coverage test
  it('should exercise all internal functions and conditional renders', () => {
    const mockFunctions = {
      onStartGame: vi.fn(),
      onPauseGame: vi.fn(),
      onMovePiece: vi.fn(),
      onRotatePiece: vi.fn(),
    };
    
    // Test all three main button states: Start, Pause, Restart
    const { rerender } = render(<ControlPanel 
      {...defaultProps} 
      isPlaying={false} 
      gameOver={false}
      {...mockFunctions}
    />);
    
    // Test Start button (first condition: !validIsPlaying)
    fireEvent.click(screen.getByTitle('Start'));
    expect(mockFunctions.onStartGame).toHaveBeenCalledTimes(1);
    
    // Test Pause button (second condition: validIsPlaying && !validGameOver)
    rerender(<ControlPanel 
      {...defaultProps} 
      isPlaying={true} 
      gameOver={false}
      {...mockFunctions}
    />);
    
    fireEvent.click(screen.getByTitle('Pause'));
    expect(mockFunctions.onPauseGame).toHaveBeenCalledTimes(1);
    
    // Test Restart button (always rendered after main buttons)
    rerender(<ControlPanel 
      {...defaultProps} 
      isPlaying={false} 
      gameOver={true}
      {...mockFunctions}
    />);
    
    fireEvent.click(screen.getByTitle('Restart'));
    expect(mockFunctions.onStartGame).toHaveBeenCalledTimes(2);
    
    // Test all movement buttons with their specific arrow functions
    rerender(<ControlPanel 
      {...defaultProps} 
      isPlaying={true} 
      gameOver={false}
      {...mockFunctions}
    />);
    
    // Each movement button tests a different arrow function
    fireEvent.click(screen.getByTitle('Move Up')); // () => safeOnMovePiece('up')
    expect(mockFunctions.onMovePiece).toHaveBeenLastCalledWith('up');
    
    fireEvent.click(screen.getByTitle('Move Down')); // () => safeOnMovePiece('down')
    expect(mockFunctions.onMovePiece).toHaveBeenLastCalledWith('down');
    
    fireEvent.click(screen.getByTitle('Drop')); // () => safeOnMovePiece('right')
    expect(mockFunctions.onMovePiece).toHaveBeenLastCalledWith('right');
    
    fireEvent.click(screen.getByTitle('Rotate')); // safeOnRotatePiece directly
    expect(mockFunctions.onRotatePiece).toHaveBeenCalledTimes(1);
  });
});
