import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the Tetris component to avoid complex game logic in App tests
vi.mock('../components/Tetris', () => ({
  default: () => <div data-testid="tetris-component">Tetris Game</div>
}));

// Mock the image import
vi.mock('../assets/ryo-arima.png', () => ({
  default: 'mocked-image-path'
}));

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

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {component}
    </ThemeProvider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    // Reset document title before each test
    document.title = 'Test';
  });

  it('should render without crashing', () => {
    renderWithTheme(<App />);
    expect(screen.getByTestId('tetris-component')).toBeInTheDocument();
  });

  it('should set document title to "ryo-arima"', () => {
    renderWithTheme(<App />);
    expect(document.title).toBe('ryo-arima');
  });

  it('should render profile information correctly', () => {
    renderWithTheme(<App />);
    
    // Check for name
    expect(screen.getByText('Ryo Arima')).toBeInTheDocument();
    
    // Check for bio
    expect(screen.getByText('🌱 Hack our issue! : ) Love & Peace & Technology : )')).toBeInTheDocument();
    
    // Check for location and timezone
    expect(screen.getByText('📍 Japan • 🕐 JST (UTC+9)')).toBeInTheDocument();
  });

  it('should render all social media links', () => {
    renderWithTheme(<App />);
    
    // Check for X/Twitter link
    const twitterLink = screen.getByRole('link', { name: /@RyoArima_X/ });
    expect(twitterLink).toBeInTheDocument();
    expect(twitterLink).toHaveAttribute('href', 'https://x.com/RyoArima_X');
    
    // Check for GitHub link
    const githubLink = screen.getByRole('link', { name: /github.com\/ryo-arima/ });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/ryo-arima');
    
    // Check for Qiita link
    const qiitaLink = screen.getByRole('link', { name: /qiita.com\/ryo-arima/ });
    expect(qiitaLink).toBeInTheDocument();
    expect(qiitaLink).toHaveAttribute('href', 'https://qiita.com/ryo-arima');
  });

  it('should render all skill chips', () => {
    renderWithTheme(<App />);
    
    expect(screen.getByText('Infrastructure Engineer')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Solution Architect')).toBeInTheDocument();
    expect(screen.getByText('Go • Python • TypeScript')).toBeInTheDocument();
  });

  it('should render profile avatar', () => {
    renderWithTheme(<App />);
    
    const avatar = screen.getByRole('img');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'mocked-image-path');
  });

  it('should have proper container structure', () => {
    const { container } = renderWithTheme(<App />);
    
    // Check for main container structure
    const mainContainer = container.querySelector('.MuiContainer-root');
    expect(mainContainer).toBeInTheDocument();
  });

  it('should render Tetris component in header', () => {
    renderWithTheme(<App />);
    
    const tetrisComponent = screen.getByTestId('tetris-component');
    expect(tetrisComponent).toBeInTheDocument();
    expect(tetrisComponent).toHaveTextContent('Tetris Game');
  });

  it('should have responsive design elements', () => {
    renderWithTheme(<App />);
    
    // Check for Paper component with proper styling
    const paperElement = screen.getByText('Ryo Arima').closest('.MuiPaper-root');
    expect(paperElement).toBeInTheDocument();
  });

  it('should render all required Material-UI icons', () => {
    renderWithTheme(<App />);
    
    // The icons should be rendered as part of the social links and chips
    // We can verify they exist by checking the social links container
    const socialLinksContainer = screen.getByText('@RyoArima_X').parentElement;
    expect(socialLinksContainer).toBeInTheDocument();
  });
});
