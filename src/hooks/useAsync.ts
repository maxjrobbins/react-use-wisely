import { useState, useCallback, useEffect } from "react";
import { AsyncError } from "./errors";

/**
 * Hook for managing async operations
 * @template T The type of the value returned by the async function
 * @template P The type of parameters for the async function
 * @param {(...params: P) => Promise<T>} asyncFunction - The async function to execute
 * @param {boolean} immediate - Whether to execute the function immediately
 * @param {number} retryCount - Number of retry attempts (default: 0)
 * @param {number} retryDelay - Delay between retries in ms (default: 1000)
 * @returns {Object} - Status and control functions for the async operation
 */
const useAsync = <T, P extends unknown[] = unknown[]>(
  asyncFunction: (...params: P) => Promise<T>,
  immediate = false,
  retryCount = 0,
  retryDelay = 1000
) => {
  type StatusType = "idle" | "pending" | "success" | "error" | "retrying";

  const [status, setStatus] = useState<StatusType>("idle");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<AsyncError | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  const execute = useCallback(
    async (...params: P): Promise<T> => {
      setStatus("pending");
      setValue(null);
      setError(null);
      setAttemptCount(0);

      // Create a retry function
      const executeWithRetry = async (attempt: number): Promise<T> => {
        try {
          const response = await asyncFunction(...params);
          setValue(response);
          setStatus("success");
          return response;
        } catch (error) {
          const asyncError = new AsyncError(
            error instanceof Error ? error.message : "Unknown async error",
            error,
            { params: JSON.stringify(params), attempt }
          );

          // Check if we should retry
          if (attempt < retryCount) {
            setStatus("retrying");
            setError(asyncError);
            setAttemptCount(attempt + 1);

            // Wait before retry
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            return executeWithRetry(attempt + 1);
          }

          // No more retries, set final error
          setError(asyncError);
          setStatus("error");
          throw asyncError;
        }
      };

      return executeWithRetry(0);
    },
    [asyncFunction, retryCount, retryDelay]
  );

  // Reset function to clear state
  const reset = useCallback(() => {
    setStatus("idle");
    setValue(null);
    setError(null);
    setAttemptCount(0);
  }, []);

  // Call execute if immediate is true
  useEffect(() => {
    if (immediate) {
      execute(...([] as unknown as P)).catch(() => {
        // Error is already handled in execute
      });
    }
  }, [execute, immediate]);

  return {
    execute,
    reset,
    status,
    value,
    error,
    isLoading: status === "pending" || status === "retrying",
    isRetrying: status === "retrying",
    attemptCount,
  };
};

export default useAsync;
