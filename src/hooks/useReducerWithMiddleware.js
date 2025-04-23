// Enhanced useReducer with middleware support
import { useReducer, useRef, useCallback, useEffect } from 'react';

/**
 * Hook that enhances useReducer with middleware
 * @param {Function} reducer - The reducer function
 * @param {any} initialState - Initial state
 * @param {Function} middlewareFn - Middleware function
 * @returns {Array} - [state, dispatch]
 */
const useReducerWithMiddleware = (reducer, initialState, middlewareFn) => {
	// Create a memoized version of the reducer that updates our ref
	const reducerWithRef = useCallback((state, action) => {
		const newState = reducer(state, action);
		return newState;
	}, [reducer]);

	const [state, originalDispatch] = useReducer(reducerWithRef, initialState);

	// Store the latest state in a ref
	const stateRef = useRef(state);

	// Update stateRef when state changes
	useEffect(() => {
		stateRef.current = state;
	}, [state]);

	// Create a stable dispatch function that doesn't change on rerenders
	const dispatch = useCallback((action) => {
		if (middlewareFn) {
			// Always use the most up-to-date state from the ref
			const next = (nextAction) => {
				originalDispatch(nextAction);
			};

			middlewareFn(stateRef.current, action, next);
		} else {
			originalDispatch(action);
		}
	}, [middlewareFn, originalDispatch]);

	return [state, dispatch];
};

export default useReducerWithMiddleware;
