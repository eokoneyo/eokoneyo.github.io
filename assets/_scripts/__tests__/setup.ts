import failOnConsole from 'jest-fail-on-console';

failOnConsole();

// Add global mock for localStorage, it not defined in jsdom
Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
  },
});
