import { useState, useCallback } from "react";

interface ErrorBoundaryState {
  error: Error | null;
  isError: boolean;
}

interface ErrorBoundaryResult {
  error: Error | null;
  isError: boolean;
  setError: (error: Error) => void;
  reset: () => void;
}

/**
 * Hook for declarative error handling within functional components
 * @returns {ErrorBoundaryResult} Object containing error state and control methods
 */
function useErrorBoundary(): ErrorBoundaryResult {
  const [state, setState] = useState<ErrorBoundaryState>({
    error: null,
    isError: false,
  });

  // Function to set an error
  const setError = useCallback((error: Error) => {
    setState({
      error,
      isError: true,
    });
  }, []);

  // Function to reset the error state
  const reset = useCallback(() => {
    setState({
      error: null,
      isError: false,
    });
  }, []);

  return {
    error: state.error,
    isError: state.isError,
    setError,
    reset,
  };
}

export default useErrorBoundary;
