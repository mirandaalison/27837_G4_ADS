import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup después de cada test
afterEach(() => {
  cleanup();
});

// Mock de localStorage
const localStorageMock = {
  getItem: (key) => {
    return localStorageMock[key] || null;
  },
  setItem: (key, value) => {
    localStorageMock[key] = value.toString();
  },
  removeItem: (key) => {
    delete localStorageMock[key];
  },
  clear: () => {
    Object.keys(localStorageMock).forEach(key => {
      if (key !== 'getItem' && key !== 'setItem' && key !== 'removeItem' && key !== 'clear') {
        delete localStorageMock[key];
      }
    });
  }
};

global.localStorage = localStorageMock;
