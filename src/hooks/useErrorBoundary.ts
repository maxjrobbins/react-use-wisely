import { useState, useCallback } from "react";

interface ErrorBoundaryState {
  error: Error | null;
  hasError: boolean;
}

/**
 * Hook for declarative error handling within functional components
 * @returns {[ErrorBoundaryState, (error: Error) => void, () => void]} Error state, error setter, and reset function
 */
function useErrorBoundary(): [
  ErrorBoundaryState,
  (error: Error) => void,
  () => void
] {
  const [state, setState] = useState<ErrorBoundaryState>({
    error: null,
    hasError: false,
  });

  // Function to set an error
  const handleError = useCallback((error: Error) => {
    setState({
      error,
      hasError: true,
    });
  }, []);

  // Function to reset the error state
  const reset = useCallback(() => {
    setState({
      error: null,
      hasError: false,
    });
  }, []);

  return [state, handleError, reset];
}

export default useErrorBoundary;
