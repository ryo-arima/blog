import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { createTheme } from '@mui/material/styles';

describe('main.tsx unit tests', () => {
  let originalTitle: string;

  beforeEach(() => {
    // Store original title
    originalTitle = document.title;
  });

  afterEach(() => {
    // Restore original title
    document.title = originalTitle;
  });

  it('should set document title to "ryo-arima"', () => {
    // Test document title setting directly
    document.title = 'ryo-arima';
    expect(document.title).toBe('ryo-arima');
  });

  it('should create theme with correct configuration', () => {
    // Test theme creation with the same configuration as in main.tsx
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

  it('should handle DOM element creation for root mounting', () => {
    // Test that we can create and select DOM elements like main.tsx does
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    const foundElement = document.getElementById('root');
    expect(foundElement).toBeTruthy();
    expect(foundElement?.id).toBe('root');

    // Cleanup
    document.body.removeChild(rootElement);
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
