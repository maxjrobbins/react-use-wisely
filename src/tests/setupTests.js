import '@testing-library/jest-dom';

global.console = {
	...console,
	// Uncomment to ignore a specific log level
	// log: jest.fn(),
	error: jest.fn(),
	warn: jest.fn(),
};

// Mock localStorage
const localStorageMock = (() => {
	let store = {};
	return {
		getItem: jest.fn(key => store[key] || null),
		setItem: jest.fn((key, value) => {
			store[key] = String(value);
		}),
		removeItem: jest.fn(key => {
			delete store[key];
		}),
		clear: jest.fn(() => {
			store = {};
		}),
	};
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
	value: jest.fn(query => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});
