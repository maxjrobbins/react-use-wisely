import React, { useState } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import useThrottle from '../../hooks/useThrottle';

// Mock timer functions
jest.useFakeTimers();

// A test component that uses the hook
function TestComponent({ initialValue, limit }) {
	const [value, setValue] = useState(initialValue);
	const throttledValue = useThrottle(value, limit);

	return (
		<div>
			<div data-testid="current-value">Current: {value}</div>
			<div data-testid="throttled-value">Throttled: {throttledValue}</div>
			<button
				data-testid="increment"
				onClick={() => setValue(v => v + 1)}
			>
				Increment
			</button>
			<button
				data-testid="reset"
				onClick={() => setValue(initialValue)}
			>
				Reset
			</button>
		</div>
	);
}

describe('useThrottle', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.clearAllTimers();
	});

	test('should return initial value immediately', () => {
		render(<TestComponent initialValue={0} limit={500} />);

		expect(screen.getByTestId('current-value').textContent).toBe('Current: 0');
		expect(screen.getByTestId('throttled-value').textContent).toBe('Throttled: 0');
	});

	test('should not update throttled value before limit duration', () => {
		render(<TestComponent initialValue={0} limit={500} />);

		// Update value multiple times rapidly
		act(() => {
			fireEvent.click(screen.getByTestId('increment')); // value = 1
		});

		// Current value should update immediately
		expect(screen.getByTestId('current-value').textContent).toBe('Current: 1');

		// Throttled value should not change yet
		expect(screen.getByTestId('throttled-value').textContent).toBe('Throttled: 0');

		// Update a few more times
		act(() => {
			fireEvent.click(screen.getByTestId('increment')); // value = 2
			fireEvent.click(screen.getByTestId('increment')); // value = 3
		});

		// Current value should update immediately
		expect(screen.getByTestId('current-value').textContent).toBe('Current: 3');

		// But throttled value should still be the initial value
		expect(screen.getByTestId('throttled-value').textContent).toBe('Throttled: 0');

		// Fast-forward time, but not quite to the limit
		act(() => {
			jest.advanceTimersByTime(499);
		});

		// Throttled value should still not be updated
		expect(screen.getByTestId('throttled-value').textContent).toBe('Throttled: 0');
	});

	test('should update throttled value after limit duration', () => {
		render(<TestComponent initialValue={0} limit={500} />);

		// Update value
		act(() => {
			fireEvent.click(screen.getByTestId('increment')); // value = 1
		});

		// Fast-forward time just past the limit
		act(() => {
			jest.advanceTimersByTime(501);
		});

		// Throttled value should now match current value
		expect(screen.getByTestId('current-value').textContent).toBe('Current: 1');
		expect(screen.getByTestId('throttled-value').textContent).toBe('Throttled: 1');
	});

	test('should update throttled value at most once per limit period', () => {
		render(<TestComponent initialValue={0} limit={500} />);

		// Update value multiple times
		act(() => {
			fireEvent.click(screen.getByTestId('increment')); // value = 1
			jest.advanceTimersByTime(100);

			fireEvent.click(screen.getByTestId('increment')); // value = 2
			jest.advanceTimersByTime(100);

			fireEvent.click(screen.getByTestId('increment')); // value = 3
			jest.advanceTimersByTime(100);
		});

		// We're now 300ms in, throttled value should still be initial
		expect(screen.getByTestId('current-value').textContent).toBe('Current: 3');
		expect(screen.getByTestId('throttled-value').textContent).toBe('Throttled: 0');

		// Advance to 501ms (just after first threshold)
		act(() => {
			jest.advanceTimersByTime(201);
		});

		// Throttled value should update to the latest value at that point (3)
		expect(screen.getByTestId('throttled-value').textContent).toBe('Throttled: 3');

		// Make more updates
		act(() => {
			fireEvent.click(screen.getByTestId('increment')); // value = 4
			jest.advanceTimersByTime(100);

			fireEvent.click(screen.getByTestId('increment')); // value = 5
		});

		// Throttled value should still be 3 (not enough time has passed)
		expect(screen.getByTestId('current-value').textContent).toBe('Current: 5');
		expect(screen.getByTestId('throttled-value').textContent).toBe('Throttled: 3');

		// Advance time to just after next threshold (501ms + 500ms = 1001ms from start)
		act(() => {
			jest.advanceTimersByTime(400);
		});

		// Now throttled value should be updated to 5
		expect(screen.getByTestId('throttled-value').textContent).toBe('Throttled: 5');
	});

	test('should handle changes in the limit value', () => {
		function DynamicLimitComponent() {
			const [value, setValue] = useState(0);
			const [limit, setLimit] = useState(500);
			const throttledValue = useThrottle(value, limit);

			return (
				<div>
					<div data-testid="current-value">Current: {value}</div>
					<div data-testid="throttled-value">Throttled: {throttledValue}</div>
					<div data-testid="limit">Limit: {limit}</div>
					<button
						data-testid="increment"
						onClick={() => setValue(v => v + 1)}
					>
						Increment
					</button>
					<button
						data-testid="decrease-limit"
						onClick={() => setLimit(l => l / 2)}
					>
						Decrease Limit
					</button>
					<button
						data-testid="increase-limit"
						onClick={() => setLimit(l => l * 2)}
					>
						Increase Limit
					</button>
				</div>
			);
		}

		render(<DynamicLimitComponent />);

		// Initial values
		expect(screen.getByTestId('current-value').textContent).toBe('Current: 0');
		expect(screen.getByTestId('throttled-value').textContent).toBe('Throttled: 0');
		expect(screen.getByTestId('limit').textContent).toBe('Limit: 500');

		// Increment value
		act(() => {
			fireEvent.click(screen.getByTestId('increment')); // value = 1
		});

		// Decrease limit to 250ms
		act(() => {
			fireEvent.click(screen.getByTestId('decrease-limit'));
		});

		expect(screen.getByTestId('limit').textContent).toBe('Limit: 250');

		// Advance time past the new limit
		act(() => {
			jest.advanceTimersByTime(251);
		});

		// Throttled value should update with the new shorter limit
		expect(screen.getByTestId('throttled-value').textContent).toBe('Throttled: 1');

		// Increment again
		act(() => {
			fireEvent.click(screen.getByTestId('increment')); // value = 2
		});

		// Increase limit to 500ms
		act(() => {
			fireEvent.click(screen.getByTestId('increase-limit'));
		});

		expect(screen.getByTestId('limit').textContent).toBe('Limit: 500');

		// Advance time past the old limit but not the new one
		act(() => {
			jest.advanceTimersByTime(251);
		});

		// Throttled value should not update yet due to the increased limit
		expect(screen.getByTestId('throttled-value').textContent).toBe('Throttled: 1');

		// Advance to the new limit
		act(() => {
			jest.advanceTimersByTime(250);
		});

		// Now throttled value should update
		expect(screen.getByTestId('throttled-value').textContent).toBe('Throttled: 2');
	});
});
