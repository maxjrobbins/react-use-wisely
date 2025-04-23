import React from 'react';
import { render, screen, act } from '@testing-library/react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

// A test component that uses the hook
function TestComponent({ options = {} }) {
	const [ref, isIntersecting] = useIntersectionObserver(options);

	return (
		<div>
			<div
				data-testid="observed-element"
				ref={ref}
				style={{ height: '100px', width: '100px' }}
			>
				Observed Element
			</div>
			<div data-testid="status">
				{isIntersecting ? 'Element is visible' : 'Element is not visible'}
			</div>
		</div>
	);
}

describe('useIntersectionObserver', () => {
	let mockIntersectionObserver;
	let mockInstance;
	let mockEntryList;

	beforeEach(() => {
		// Mock IntersectionObserver implementation
		mockEntryList = [];
		mockInstance = {
			observe: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn()
		};

		mockIntersectionObserver = jest.fn().mockImplementation(callback => {
			mockInstance.callback = callback;
			return mockInstance;
		});

		// Mock the global IntersectionObserver
		window.IntersectionObserver = mockIntersectionObserver;
	});

	test('should initialize with isIntersecting as false', () => {
		render(<TestComponent />);

		expect(screen.getByTestId('status').textContent).toBe('Element is not visible');
	});

	test('should call IntersectionObserver with correct options', () => {
		const options = {
			root: null,
			rootMargin: '10px',
			threshold: 0.5
		};

		render(<TestComponent options={options} />);

		expect(mockIntersectionObserver).toHaveBeenCalledWith(
			expect.any(Function),
			options
		);
	});

	test('should call observe on the target element', () => {
		render(<TestComponent />);

		const element = screen.getByTestId('observed-element');

		// The element passed to observe should be the actual DOM element
		expect(mockInstance.observe).toHaveBeenCalled();
		expect(mockInstance.observe.mock.calls[0][0]).toBe(element);
	});

	test('should update isIntersecting when intersection changes', () => {
		render(<TestComponent />);

		// Initial state
		expect(screen.getByTestId('status').textContent).toBe('Element is not visible');

		// Simulate intersection
		const mockEntry = {
			isIntersecting: true,
			target: screen.getByTestId('observed-element')
		};

		mockEntryList = [mockEntry];

		// Use act to handle state updates
		act(() => {
			mockInstance.callback(mockEntryList);
		});

		// State should be updated
		expect(screen.getByTestId('status').textContent).toBe('Element is visible');

		// Simulate leaving intersection
		mockEntry.isIntersecting = false;

		act(() => {
			mockInstance.callback(mockEntryList);
		});

		// State should be updated again
		expect(screen.getByTestId('status').textContent).toBe('Element is not visible');
	});

	test('should unobserve the target element on unmount', () => {
		const { unmount } = render(<TestComponent />);

		// Store the element before unmounting
		const element = screen.getByTestId('observed-element');

		// Unmount component
		unmount();

		// Check that unobserve was called at least once
		expect(mockInstance.unobserve).toHaveBeenCalled();
	});

	test('should handle null ref', () => {
		function NullRefComponent() {
			// eslint-disable-next-line no-unused-vars
			const [ref, isIntersecting] = useIntersectionObserver();

			// Don't use the ref
			return (
				<div>
					<div data-testid="status">
						{isIntersecting ? 'Element is visible' : 'Element is not visible'}
					</div>
				</div>
			);
		}

		render(<NullRefComponent />);

		// Should not throw an error and default to not intersecting
		expect(screen.getByTestId('status').textContent).toBe('Element is not visible');

		// observe should not have been called
		expect(mockInstance.observe).not.toHaveBeenCalled();
	});

	test('should handle multiple threshold values', () => {
		const options = {
			threshold: [0, 0.5, 1.0]
		};

		render(<TestComponent options={options} />);

		expect(mockIntersectionObserver).toHaveBeenCalledWith(
			expect.any(Function),
			options
		);

		// Simulate intersection at 0.75 (above 0.5 threshold)
		const mockEntry = {
			isIntersecting: true,
			intersectionRatio: 0.75,
			target: screen.getByTestId('observed-element')
		};

		mockEntryList = [mockEntry];

		act(() => {
			mockInstance.callback(mockEntryList);
		});

		expect(screen.getByTestId('status').textContent).toBe('Element is visible');
	});
});
