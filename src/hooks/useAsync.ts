import { useState, useCallback, useEffect } from "react";
import { AsyncError } from "./errors";
import { safeStringify } from "../utils/helpers";

/**
 * Options for the useAsync hook
 */
export interface AsyncOptions {
  immediate?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

/**
 * Hook result for async operations
 */
export interface AsyncResult<T, P extends unknown[]> {
  // Methods
  execute: (...params: P) => Promise<T>;
  reset: () => void;
  // State
  value: T | null;
  status: "idle" | "pending" | "success" | "error" | "retrying";
  // Error handling
  error: AsyncError | null;
  // Status indicators
  isLoading: boolean;
  isRetrying: boolean;
  attemptCount: number;
}

/**
 * Hook for managing async operations
 * @template T The type of the value returned by the async function
 * @template P The type of parameters for the async function
 * @param {(...params: P) => Promise<T>} asyncFunction - The async function to execute
 * @param {AsyncOptions} options - Configuration options
 * @returns {AsyncResult<T, P>} - Status and control functions for the async operation
 */
const useAsync = <T, P extends unknown[] = unknown[]>(
  asyncFunction: (...params: P) => Promise<T>,
  options: AsyncOptions = {}
): AsyncResult<T, P> => {
  const { immediate = false, retryCount = 0, retryDelay = 1000 } = options;

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

      let currentAttempt = 0;

      // Create a retry function
      const executeWithRetry = async (): Promise<T> => {
        try {
          const response = await asyncFunction(...params);
          setValue(response);
          setStatus("success");
          return response;
        } catch (error) {
          // Create a safe params representation for error context
          const safeParams = params.map((param) => safeStringify(param));

          const asyncError = new AsyncError(
            error instanceof Error ? error.message : "Unknown async error",
            error,
            { params: safeParams, attempt: currentAttempt }
          );

          // Check if we should retry
          if (currentAttempt < retryCount) {
            currentAttempt++;
            setStatus("retrying");
            setError(asyncError);
            setAttemptCount(currentAttempt);

            return new Promise<T>((resolve, reject) => {
              setTimeout(() => {
                executeWithRetry().then(resolve).catch(reject);
              }, retryDelay);
            });
          }

          // No more retries, set final error
          setError(asyncError);
          setStatus("error");
          throw asyncError;
        }
      };

      return executeWithRetry();
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
