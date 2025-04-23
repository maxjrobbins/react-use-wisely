// Enhanced useReducer with middleware support
import { useReducer, useRef, useEffect } from 'react';

/**
 * Hook that enhances useReducer with middleware
 * @param {Function} reducer - The reducer function
 * @param {any} initialState - Initial state
 * @param {Function} middlewareFn - Middleware function
 * @returns {Array} - [state, dispatch]
 */
const useReducerWithMiddleware = (reducer, initialState, middlewareFn) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	// Store the latest state in a ref
	const stateRef = useRef(state);

	// Update stateRef when state changes
	useEffect(() => {
		stateRef.current = state;
	}, [state]);

	// Create a custom dispatch function that applies middleware
	const dispatchWithMiddleware = (action) => {
		// Allow middleware to inspect action and current state
		if (middlewareFn) {
			middlewareFn(stateRef.current, action, dispatch);
		} else {
			dispatch(action);
		}
	};

	return [state, dispatchWithMiddleware];
};

export default useReducerWithMiddleware;
