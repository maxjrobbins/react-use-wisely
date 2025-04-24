import { useState, useCallback, useEffect } from "react";

/**
 * Hook for managing async operations
 * @template T The type of the value returned by the async function
 * @template P The type of parameters for the async function
 * @param {(...params: P) => Promise<T>} asyncFunction - The async function to execute
 * @param {boolean} immediate - Whether to execute the function immediately
 * @returns {Object} - Status and control functions for the async operation
 */
const useAsync = <T, P extends unknown[] = unknown[]>(
  asyncFunction: (...params: P) => Promise<T>,
  immediate = false
) => {
  type StatusType = "idle" | "pending" | "success" | "error";

  const [status, setStatus] = useState<StatusType>("idle");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  const execute = useCallback(
    async (...params: P): Promise<T> => {
      setStatus("pending");
      setValue(null);
      setError(null);

      try {
        const response = await asyncFunction(...params);
        setValue(response);
        setStatus("success");
        return response;
      } catch (error) {
        setError(error as Error);
        setStatus("error");
        throw error;
      }
    },
    [asyncFunction]
  );

  // Call execute if immediate is true
  useEffect(() => {
    if (immediate) {
      execute([] as unknown as P);
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    value,
    error,
    isLoading: status === "pending",
  };
};

export default useAsync;
