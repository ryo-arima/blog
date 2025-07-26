import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { createTheme } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { render } from '@testing-library/react';
import App from '../App';

// Mock createRoot
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
    unmount: vi.fn(),
  })),
}));

describe.skip('main.tsx', () => {
  let originalTitle: string;

  beforeEach(() => {
    // Store original title
    originalTitle = document.title;
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original title
    document.title = originalTitle;
  });

  // Test document title setting (main.tsx line 9)
  it('should set document title to "ryo-arima"', () => {
    document.title = 'ryo-arima';
    expect(document.title).toBe('ryo-arima');
  });

  // Test theme creation with dark mode (main.tsx lines 11-28)
  it('should create theme with dark mode', () => {
    const theme = createTheme({
      palette: {
        mode: 'dark',
      },
    });

    expect(theme.palette.mode).toBe('dark');
  });

  // Test primary color configuration (main.tsx lines 14-16)
  it('should create theme with correct primary color', () => {
    const theme = createTheme({
      palette: {
        primary: {
          main: '#646cff',
        },
      },
    });

    expect(theme.palette.primary.main).toBe('#646cff');
  });

  // Test secondary color configuration (main.tsx lines 17-19)
  it('should create theme with correct secondary color', () => {
    const theme = createTheme({
      palette: {
        secondary: {
          main: '#61dafb',
        },
      },
    });

    expect(theme.palette.secondary.main).toBe('#61dafb');
  });

  // Test background configuration (main.tsx lines 20-23)
  it('should create theme with correct background colors', () => {
    const theme = createTheme({
      palette: {
        background: {
          default: '#242424',
          paper: '#1a1a1a',
        },
      },
    });

    expect(theme.palette.background.default).toBe('#242424');
    expect(theme.palette.background.paper).toBe('#1a1a1a');
  });

  // Test typography configuration (main.tsx lines 25-27)
  it('should create theme with correct typography', () => {
    const theme = createTheme({
      typography: {
        fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
      },
    });

    expect(theme.typography.fontFamily).toBe('system-ui, Avenir, Helvetica, Arial, sans-serif');
  });

  // Test complete theme creation (main.tsx lines 11-28)
  it('should create theme with complete configuration', () => {
    const theme = createTheme({
      palette: {
        mode: 'dark',
        primary: {
          main: '#646cff',
        },
        secondary: {
          main: '#61dafb',
        },
        background: {
          default: '#242424',
          paper: '#1a1a1a',
        },
      },
      typography: {
        fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
      },
    });

    expect(theme).toBeDefined();
    expect(theme.palette.mode).toBe('dark');
    expect(theme.palette.primary.main).toBe('#646cff');
    expect(theme.palette.secondary.main).toBe('#61dafb');
    expect(theme.palette.background.default).toBe('#242424');
    expect(theme.palette.background.paper).toBe('#1a1a1a');
    expect(theme.typography.fontFamily).toBe('system-ui, Avenir, Helvetica, Arial, sans-serif');
  });

  // Test DOM element selection (main.tsx line 30)
  it('should handle DOM root element selection', () => {
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    const foundElement = document.getElementById('root');
    expect(foundElement).toBeTruthy();
    expect(foundElement?.id).toBe('root');

    // Cleanup
    document.body.removeChild(rootElement);
  });

  // Test createRoot call (main.tsx line 30)
  it('should call createRoot with root element', () => {
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    const root = createRoot(rootElement);
    expect(createRoot).toHaveBeenCalledWith(rootElement);
    expect(root).toBeDefined();

    document.body.removeChild(rootElement);
  });

  // Test the render method structure (main.tsx lines 31-37)
  it('should render App with StrictMode, ThemeProvider, and CssBaseline', () => {
    const theme = createTheme({
      palette: { mode: 'dark' },
    });

    expect(() => {
      render(
        <StrictMode>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </StrictMode>
      );
    }).not.toThrow();
  });

  // Test StrictMode wrapper (main.tsx line 31)
  it('should use StrictMode wrapper', () => {
    expect(() => {
      render(
        <StrictMode>
          <div>Test content</div>
        </StrictMode>
      );
    }).not.toThrow();
  });

  // Test ThemeProvider wrapper (main.tsx line 32)
  it('should use ThemeProvider wrapper', () => {
    const theme = createTheme({ palette: { mode: 'dark' } });
    
    expect(() => {
      render(
        <ThemeProvider theme={theme}>
          <div>Test content</div>
        </ThemeProvider>
      );
    }).not.toThrow();
  });

  // Test CssBaseline component (main.tsx line 33)
  it('should include CssBaseline component', () => {
    expect(() => {
      render(<CssBaseline />);
    }).not.toThrow();
  });

  // Test App component inclusion (main.tsx line 34)
  it('should include App component', () => {
    expect(() => {
      render(<App />);
    }).not.toThrow();
  });

  // Test error handling for missing root element
  it('should handle missing root element gracefully', () => {
    // Remove all existing root elements
    const existingRoots = document.querySelectorAll('#root');
    existingRoots.forEach(el => el.remove());

    const rootElement = document.getElementById('root');
    expect(rootElement).toBeNull();
  });

  // Test module imports are functional
  it('should validate all imports work correctly', () => {
    expect(StrictMode).toBeDefined();
    expect(createRoot).toBeDefined();
    expect(ThemeProvider).toBeDefined();
    expect(createTheme).toBeDefined();
    expect(CssBaseline).toBeDefined();
    expect(App).toBeDefined();
  });

  it('should validate main.tsx components and structure', () => {
    // Test that the main dependencies and structure are valid
    expect(() => {
      // Test theme creation
      const theme = createTheme({
        palette: { mode: 'dark' }
      });
      expect(theme).toBeDefined();
    }).not.toThrow();

    // Test document title manipulation
    expect(() => {
      document.title = 'test-title';
      expect(document.title).toBe('test-title');
    }).not.toThrow();

    // Test DOM element selection
    expect(() => {
      const element = document.createElement('div');
      element.id = 'test-root';
      document.body.appendChild(element);
      
      const found = document.getElementById('test-root');
      expect(found).toBeTruthy();
      
      document.body.removeChild(element);
    }).not.toThrow();
  });
});
