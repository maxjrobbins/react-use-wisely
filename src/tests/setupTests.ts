import "@testing-library/jest-dom";

// Mock console methods
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  value: jest.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", {
  value: jest.fn(),
  writable: true,
});

// Mock Notification API
Object.defineProperty(window, "Notification", {
  value: {
    permission: "granted",
    requestPermission: jest.fn().mockResolvedValue("granted"),
  },
  writable: true,
});

// Mock Permissions API
Object.defineProperty(navigator, "permissions", {
  value: {
    query: jest.fn().mockImplementation(({ name }) => {
      if (name === "notifications") {
        return Promise.resolve({ state: "granted" });
      }
      return Promise.resolve({ state: "prompt" });
    }),
  },
  writable: true,
});
