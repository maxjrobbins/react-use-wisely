import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import useReducerWithMiddleware from '../../hooks/useReducerWithMiddleware';

// Counter reducer for testing
const counterReducer = (state, action) => {
	switch (action.type) {
		case 'INCREMENT':
			return { count: state.count + 1 };
		case 'DECREMENT':
			return { count: state.count - 1 };
		case 'SET':
			return { count: action.payload };
		case 'RESET':
			return { count: 0 };
		default:
			return state;
	}
};

// A test component that uses the hook
function TestComponent({ initialState = { count: 0 }, middleware }) {
	const [state, dispatch] = useReducerWithMiddleware(
		counterReducer,
		initialState,
		middleware
	);

	return (
		<div>
			<div data-testid="count">Count: {state.count}</div>
			<button
				data-testid="increment"
				onClick={() => dispatch({ type: 'INCREMENT' })}
			>
				Increment
			</button>
			<button
				data-testid="decrement"
				onClick={() => dispatch({ type: 'DECREMENT' })}
			>
				Decrement
			</button>
			<button
				data-testid="reset"
				onClick={() => dispatch({ type: 'RESET' })}
			>
				Reset
			</button>
			<button
				data-testid="set-10"
				onClick={() => dispatch({ type: 'SET', payload: 10 })}
			>
				Set to 10
			</button>
		</div>
	);
}

describe('useReducerWithMiddleware', () => {
	// Enable fake timers for all tests
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	test('should work like regular useReducer without middleware', () => {
		render(<TestComponent />);

		// Initial state
		expect(screen.getByTestId('count').textContent).toBe('Count: 0');

		// Increment
		fireEvent.click(screen.getByTestId('increment'));
		expect(screen.getByTestId('count').textContent).toBe('Count: 1');

		// Increment again
		fireEvent.click(screen.getByTestId('increment'));
		expect(screen.getByTestId('count').textContent).toBe('Count: 2');

		// Decrement
		fireEvent.click(screen.getByTestId('decrement'));
		expect(screen.getByTestId('count').textContent).toBe('Count: 1');

		// Reset
		fireEvent.click(screen.getByTestId('reset'));
		expect(screen.getByTestId('count').textContent).toBe('Count: 0');

		// Set to specific value
		fireEvent.click(screen.getByTestId('set-10'));
		expect(screen.getByTestId('count').textContent).toBe('Count: 10');
	});

	test('should apply middleware that can access state and action', () => {
		// Middleware that logs action and state
		const loggerMiddleware = jest.fn((state, action, next) => {
			// Call next to pass action to reducer
			next(action);
		});

		render(<TestComponent middleware={loggerMiddleware} />);

		// Dispatch an action
		fireEvent.click(screen.getByTestId('increment'));

		// Middleware should have been called with state and action
		expect(loggerMiddleware).toHaveBeenCalledWith(
			{ count: 0 }, // state before action
			{ type: 'INCREMENT' }, // action
			expect.any(Function) // next function
		);

		// State should have been updated
		expect(screen.getByTestId('count').textContent).toBe('Count: 1');
	});

	test('should allow middleware to modify actions', () => {
		// Middleware that doubles all increments and decrements
		const doubleMiddleware = (state, action, next) => {
			if (action.type === 'INCREMENT') {
				// Dispatch a SET action instead with double value
				next({ type: 'SET', payload: state.count + 2 });
			} else if (action.type === 'DECREMENT') {
				// Dispatch a SET action instead with double value
				next({ type: 'SET', payload: state.count - 2 });
			} else {
				// Pass through other actions
				next(action);
			}
		};

		render(<TestComponent middleware={doubleMiddleware} />);

		// Initial state
		expect(screen.getByTestId('count').textContent).toBe('Count: 0');

		// Increment (should increase by 2 instead of 1)
		fireEvent.click(screen.getByTestId('increment'));
		expect(screen.getByTestId('count').textContent).toBe('Count: 2');

		// Increment again
		fireEvent.click(screen.getByTestId('increment'));
		expect(screen.getByTestId('count').textContent).toBe('Count: 4');

		// Decrement (should decrease by 2 instead of 1)
		fireEvent.click(screen.getByTestId('decrement'));
		expect(screen.getByTestId('count').textContent).toBe('Count: 2');

		// Reset should work normally
		fireEvent.click(screen.getByTestId('reset'));
		expect(screen.getByTestId('count').textContent).toBe('Count: 0');
	});

	test('should allow middleware to block actions', () => {
		// Middleware that only allows count to go up to 5
		const maxCountMiddleware = (state, action, next) => {
			if (
				(action.type === 'INCREMENT' && state.count >= 5) ||
				(action.type === 'SET' && action.payload > 5)
			) {
				// Block the action
				return;
			}
			// Otherwise, pass through
			next(action);
		};

		render(<TestComponent middleware={maxCountMiddleware} />);

		// Increment to 5
		for (let i = 0; i < 5; i++) {
			fireEvent.click(screen.getByTestId('increment'));
		}

		expect(screen.getByTestId('count').textContent).toBe('Count: 5');

		// Try to increment past 5
		fireEvent.click(screen.getByTestId('increment'));

		// Count should still be 5
		expect(screen.getByTestId('count').textContent).toBe('Count: 5');

		// Decrement should work
		fireEvent.click(screen.getByTestId('decrement'));
		expect(screen.getByTestId('count').textContent).toBe('Count: 4');

		// Try to set to 10 (above 5)
		fireEvent.click(screen.getByTestId('set-10'));

		// Count should still be 4
		expect(screen.getByTestId('count').textContent).toBe('Count: 4');
	});

	test('should allow middleware to chain multiple actions', () => {
		// Create a middleware with closure to track state between actions
		const resetSequenceMiddleware = (state, action, next) => {
			if (action.type === 'RESET' && state.count > 0) {
				// Start by decrementing once
				next({ type: 'DECREMENT' });

				// Schedule the final reset to ensure we reach 0
				setTimeout(() => {
					next({ type: 'SET', payload: 0 });
				}, 10);
			} else {
				// Pass through other actions
				next(action);
			}
		};

		render(<TestComponent initialState={{ count: 2 }} middleware={resetSequenceMiddleware} />);

		// Initial state
		expect(screen.getByTestId('count').textContent).toBe('Count: 2');

		// Trigger reset sequence
		act(() => {
			fireEvent.click(screen.getByTestId('reset'));
		});

		// First decrement happens immediately
		expect(screen.getByTestId('count').textContent).toBe('Count: 1');

		// Run pending timers
		act(() => {
			jest.advanceTimersByTime(10);
		});

		// Should be fully reset to 0
		expect(screen.getByTestId('count').textContent).toBe('Count: 0');
	});

	test('should update stateRef when state changes', () => {
		// Custom reducer for state reference testing
		const checkpointReducer = (state, action) => {
			switch (action.type) {
				case 'INCREMENT':
					return { ...state, count: state.count + 1 };
				case 'SET_CHECKPOINT':
					return { ...state, count: state.count + 1, checkpoint: true };
				case 'CHECK_STATE_REF':
					return { ...state, checkpointVerified: state.checkpoint === true };
				default:
					return state;
			}
		};

		// This middleware uses setTimeout to check if state updates are reflected
		const checkStateRefMiddleware = (state, action, next) => {
			if (action.type === 'SET_CHECKPOINT') {
				// Pass the checkpoint action through
				next(action);

				// Schedule a check after the state should be updated
				setTimeout(() => {
					next({ type: 'CHECK_STATE_REF' });
				}, 10);
			} else {
				// Pass through other actions
				next(action);
			}
		};

		function StateRefComponent() {
			const [state, dispatch] = useReducerWithMiddleware(
				checkpointReducer,
				{ count: 0, checkpoint: false, checkpointVerified: false },
				checkStateRefMiddleware
			);

			return (
				<div>
					<div data-testid="count">Count: {state.count}</div>
					<div data-testid="checkpoint">
						Checkpoint: {state.checkpoint ? 'true' : 'false'}
					</div>
					<div data-testid="verified">
						Verified: {state.checkpointVerified ? 'true' : 'false'}
					</div>
					<button
						data-testid="increment"
						onClick={() => dispatch({ type: 'INCREMENT' })}
					>
						Increment
					</button>
					<button
						data-testid="set-checkpoint"
						onClick={() => dispatch({ type: 'SET_CHECKPOINT' })}
					>
						Set Checkpoint
					</button>
				</div>
			);
		}

		render(<StateRefComponent />);

		// Initial state
		expect(screen.getByTestId('count').textContent).toBe('Count: 0');
		expect(screen.getByTestId('checkpoint').textContent).toBe('Checkpoint: false');
		expect(screen.getByTestId('verified').textContent).toBe('Verified: false');

		// Set checkpoint
		act(() => {
			fireEvent.click(screen.getByTestId('set-checkpoint'));
		});

		// State after setting checkpoint
		expect(screen.getByTestId('count').textContent).toBe('Count: 1');
		expect(screen.getByTestId('checkpoint').textContent).toBe('Checkpoint: true');

		// Run any pending timers to trigger the CHECK_STATE_REF action
		act(() => {
			jest.advanceTimersByTime(10);
		});

		// Verification should now be true since stateRef should be updated
		expect(screen.getByTestId('verified').textContent).toBe('Verified: true');
	});
});
