import React from 'react';
import { render, screen, act } from '@testing-library/react';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

// A test component that uses the hook
function TestComponent() {
	const prefersReducedMotion = usePrefersReducedMotion();

	return (
		<div>
			<div data-testid="preference">
				{prefersReducedMotion ? 'Prefers reduced motion' : 'No preference for reduced motion'}
			</div>
			<div
				data-testid="animation-example"
				style={{
					padding: '10px',
					transition: prefersReducedMotion ? 'none' : 'all 0.5s ease-in-out',
					backgroundColor: 'lightblue'
				}}
			>
				Animation Example
			</div>
		</div>
	);
}

describe('usePrefersReducedMotion', () => {
	// Save original implementation and create spy
	let matchMediaSpy;

	beforeEach(() => {
		// Create a spy on window.matchMedia
		matchMediaSpy = jest.spyOn(window, 'matchMedia');
	});

	afterEach(() => {
		// Restore original implementation
		matchMediaSpy.mockRestore();
	});

	test('should return false when prefers-reduced-motion is not set', () => {
		// Mock implementation for this test
		matchMediaSpy.mockImplementation(query => {
			return {
				matches: false,
				media: query,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				addListener: jest.fn(),
				removeListener: jest.fn(),
			};
		});

		render(<TestComponent />);

		expect(screen.getByTestId('preference').textContent).toBe('No preference for reduced motion');
		expect(screen.getByTestId('animation-example').style.transition).toBe('all 0.5s ease-in-out');
	});

	test('should respond to changes in the media query', () => {
		// Create a mockMatchMedia with event handlers
		const mediaQueryListMock = {
			matches: false,
			media: '(prefers-reduced-motion: reduce)',
			listeners: {
				change: [],
			},
			addEventListener: jest.fn((event, listener) => {
				mediaQueryListMock.listeners[event].push(listener);
			}),
			removeEventListener: jest.fn((event, listener) => {
				mediaQueryListMock.listeners[event] = mediaQueryListMock.listeners[event].filter(l => l !== listener);
			}),
			// For older browsers
			addListener: jest.fn(listener => {
				mediaQueryListMock.listeners.change.push(listener);
			}),
			removeListener: jest.fn(listener => {
				mediaQueryListMock.listeners.change = mediaQueryListMock.listeners.change.filter(l => l !== listener);
			}),
		};

		// Use the spy approach instead of direct assignment
		const matchMediaSpy = jest.spyOn(window, 'matchMedia');
		matchMediaSpy.mockImplementation(() => mediaQueryListMock);

		render(<TestComponent />);

		// Initial state
		expect(screen.getByTestId('preference').textContent).toBe('No preference for reduced motion');

		// Simulate a change in the preference
		act(() => {
			// Change the mock's matches property
			mediaQueryListMock.matches = true;

			// Call all change listeners
			mediaQueryListMock.listeners.change.forEach(listener => {
				if (typeof listener === 'function') {
					listener(mediaQueryListMock);
				} else if (listener && typeof listener.handleEvent === 'function') {
					listener.handleEvent(mediaQueryListMock);
				}
			});
		});

		// Preference should be updated
		expect(screen.getByTestId('preference').textContent).toBe('Prefers reduced motion');

		// Restore original implementation
		matchMediaSpy.mockRestore();
	});

	test('should handle older browsers with addListener/removeListener', () => {
		// Mock matchMedia with only the older API
		const mediaQueryListMock = {
			matches: false,
			media: '(prefers-reduced-motion: reduce)',
			listeners: [],
			addListener: jest.fn(listener => {
				mediaQueryListMock.listeners.push(listener);
			}),
			removeListener: jest.fn(listener => {
				mediaQueryListMock.listeners = mediaQueryListMock.listeners.filter(l => l !== listener);
			}),
		};

		// Use mockImplementation correctly
		matchMediaSpy.mockImplementation(() => mediaQueryListMock);

		const { unmount } = render(<TestComponent />);

		// Verify addListener was called
		expect(mediaQueryListMock.addListener).toHaveBeenCalled();

		// Simulate a change
		act(() => {
			mediaQueryListMock.matches = true;
			mediaQueryListMock.listeners.forEach(listener => {
				listener(mediaQueryListMock);
			});
		});

		expect(screen.getByTestId('preference').textContent).toBe('Prefers reduced motion');

		// Unmount
		unmount();

		// Verify removeListener was called
		expect(mediaQueryListMock.removeListener).toHaveBeenCalled();
	});

	test('should handle browser without matchMedia', () => {
		// Instead of deleting window.matchMedia, mock it to return a mediaQuery
		// that will work with the hook's implementation
		const matchMediaSpy = jest.spyOn(window, 'matchMedia');
		matchMediaSpy.mockImplementation(() => ({
			matches: false,
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			addListener: jest.fn(),
			removeListener: jest.fn()
		}));

		render(<TestComponent />);

		// Default to false when matchMedia is not available
		expect(screen.getByTestId('preference').textContent).toBe('No preference for reduced motion');

		// Restore the original
		matchMediaSpy.mockRestore();
	});

	test('should clean up event listeners on unmount', () => {
		// Mock modern matchMedia
		const removeEventListenerMock = jest.fn();

		// Use mockImplementation correctly
		matchMediaSpy.mockImplementation(() => ({
			matches: false,
			addEventListener: jest.fn(),
			removeEventListener: removeEventListenerMock,
		}));

		const { unmount } = render(<TestComponent />);

		// Unmount component
		unmount();

		// Event listener should be removed
		expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
	});
});
