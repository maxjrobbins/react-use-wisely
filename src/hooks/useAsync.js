import { useState, useCallback } from 'react';

/**
 * Hook for managing async operations
 * @param {Function} asyncFunction - The async function to execute
 * @param {boolean} immediate - Whether to execute the function immediately
 * @returns {Object} - Status and control functions for the async operation
 */
const useAsync = (asyncFunction, immediate = false) => {
	const [status, setStatus] = useState('idle');
	const [value, setValue] = useState(null);
	const [error, setError] = useState(null);

	// The execute function wraps asyncFunction and
	// handles setting state for pending, value, and error.
	const execute = useCallback(
		async (...params) => {
			setStatus('pending');
			setValue(null);
			setError(null);

			try {
				const response = await asyncFunction(...params);
				setValue(response);
				setStatus('success');
				return response;
			} catch (error) {
				setError(error);
				setStatus('error');
				throw error;
			}
		},
		[asyncFunction]
	);

	// Call execute if immediate is true
	useState(() => {
		if (immediate) {
			execute();
		}
	}, [execute, immediate]);

	return { execute, status, value, error, isLoading: status === 'pending' };
};

export default useAsync;
