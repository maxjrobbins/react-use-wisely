import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import useResizeObserver from '../../hooks/useResizeObserver';

describe('useResizeObserver', () => {
	let originalResizeObserver;
	let mockResizeObserverInstance;

	beforeEach(() => {
		// Store original ResizeObserver
		originalResizeObserver = window.ResizeObserver;

		// Create a more comprehensive mock
		mockResizeObserverInstance = {
			observe: jest.fn(),
			disconnect: jest.fn()
		};

		window.ResizeObserver = jest.fn().mockImplementation((callback) => {
			mockResizeObserverInstance.callback = callback;
			return mockResizeObserverInstance;
		});
	});

	afterEach(() => {
		// Restore original ResizeObserver
		window.ResizeObserver = originalResizeObserver;
	});

	// Component to test the hook
	const TestComponent = () => {
		const [ref, dimensions] = useResizeObserver();
		return (
			<div ref={ref} data-testid="resize-element">
				Width: {dimensions.width}
				Height: {dimensions.height}
			</div>
		);
	};

	it('returns a ref and dimensions object', () => {
		const {result} = renderHook(() => useResizeObserver());

		expect(result.current[0]).toBeTruthy(); // ref exists
		expect(result.current[1]).toEqual({}); // initial dimensions are empty
	});

	it('handles undefined ref', () => {
		const {result} = renderHook(() => {
			const [ref] = useResizeObserver();
			return ref;
		});

		// Ensure no errors are thrown when ref is not set
		expect(result.current.current).toBeNull();
	});
});
