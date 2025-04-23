import React from 'react';
import { render, screen, act } from '@testing-library/react';
import useMedia from '../../hooks/useMedia';

// A test component that uses the hook
function TestComponent({ query, defaultState }) {
	const matches = useMedia(query, defaultState);

	return (
		<div>
			<div data-testid="matches">
				{matches ? 'Media query matches' : 'Media query does not match'}
			</div>
		</div>
	);
}

describe('useMedia', () => {
	// Store the original implementation
	const originalMatchMedia = window.matchMedia;

	// Mock implementation to use for tests
	let mockMatchMedia;
	let listeners = [];

	beforeAll(() => {
		// Spy on the original implementation instead of replacing it
		jest.spyOn(window, 'matchMedia');
	});

	afterAll(() => {
		// Restore all mocks when done
		jest.restoreAllMocks();
	});

	beforeEach(() => {
		// Reset listeners for each test
		listeners = [];
	});

	afterEach(() => {
		// Clear mocks between tests
		window.matchMedia.mockReset();
	});

	test('should use matchMedia result when available', () => {
		// Mock matchMedia to return true
		window.matchMedia.mockImplementation(() => ({
			matches: true,
			media: "(min-width: 600px)",
			onchange: null,
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		}));

		render(<TestComponent query="(min-width: 600px)" defaultState={false} />);

		expect(screen.getByTestId('matches').textContent).toBe('Media query matches');
	});

	test('should update when media query changes', () => {
		// Create a media query list mock
		const mockMql = {
			matches: false,
			media: "(min-width: 600px)",
			addEventListener: jest.fn((event, listener) => {
				listeners.push(listener);
			}),
			removeEventListener: jest.fn(),
		};

		window.matchMedia.mockImplementation(() => mockMql);

		render(<TestComponent query="(min-width: 600px)" defaultState={false} />);

		// Initial state should be false
		expect(screen.getByTestId('matches').textContent).toBe('Media query does not match');

		// Simulate media query change
		mockMql.matches = true;

		// Call all listeners to simulate the change event
		act(() => {
			listeners.forEach(listener => listener());
		});

		// State should be updated
		expect(screen.getByTestId('matches').textContent).toBe('Media query matches');
	});

	test('should support older browsers with addListener/removeListener', () => {
		// Mock matchMedia to use older API
		const mockMql = {
			matches: false,
			media: "(min-width: 600px)",
			addListener: jest.fn(listener => {
				listeners.push(listener);
			}),
			removeListener: jest.fn(),
		};

		window.matchMedia.mockImplementation(() => mockMql);

		const { unmount } = render(<TestComponent query="(min-width: 600px)" defaultState={false} />);

		// Check that listeners are added with the old API
		expect(mockMql.addListener).toHaveBeenCalled();

		// Unmount to check cleanup
		unmount();

		// Check that listeners are removed with the old API
		expect(mockMql.removeListener).toHaveBeenCalled();
	});

	test('should clean up event listeners on unmount', () => {
		// Mock matchMedia with modern API
		const mockMql = {
			matches: false,
			media: "(min-width: 600px)",
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
		};

		window.matchMedia.mockImplementation(() => mockMql);

		const { unmount } = render(<TestComponent query="(min-width: 600px)" defaultState={false} />);

		// Check that listeners are added
		expect(mockMql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

		// Unmount component
		unmount();

		// Check that listeners are removed
		expect(mockMql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
	});
});
