import { useState, useEffect, useRef, useCallback } from "react";
import { FetchError } from "./errors";

interface UseFetchOptions extends RequestInit {
  cachePolicy?: "no-cache" | "cache-first" | "cache-only" | "network-only";
  retries?: number;
  retryDelay?: number;
  dedupingInterval?: number;
}

interface FetchState<T> {
  data: T | null;
  error: FetchError | null;
  loading: boolean;
  status: number | null;
  timestamp: number | null;
}

type FetchResponse<T> = FetchState<T> & {
  refetch: (options?: Partial<UseFetchOptions>) => Promise<void>;
  abort: () => void;
};

/**
 * Hook for data fetching with loading/error states and caching
 * @template T The type of data returned by the API
 * @param {string} url - The URL to fetch
 * @param {UseFetchOptions} options - Fetch options including cache policy
 * @returns {FetchResponse<T>} - Fetch state and control functions
 */
function useFetch<T = any>(
  url: string,
  options: UseFetchOptions = {}
): FetchResponse<T> {
  // Extract options
  const {
    cachePolicy = "no-cache",
    retries = 0,
    retryDelay = 1000,
    dedupingInterval = 200,
    ...fetchOptions
  } = options;

  // State for the fetch operation
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    loading: false,
    status: null,
    timestamp: null,
  });

  // Cache storage
  const cache = useRef<Map<string, FetchState<T>>>(new Map());

  // AbortController reference
  const abortControllerRef = useRef<AbortController | null>(null);

  // Track last request timestamp to prevent race conditions
  const lastRequestTimestampRef = useRef<number>(0);

  // Track retry attempts
  const retryAttemptsRef = useRef<number>(0);

  // Unique key for this request (url + serialized body)
  const getCacheKey = useCallback(() => {
    const body = fetchOptions.body ? JSON.stringify(fetchOptions.body) : "";
    return `${url}:${body}`;
  }, [url, fetchOptions.body]);

  // Function to perform the fetch
  const fetchData = useCallback(
    async (overrideOptions: Partial<UseFetchOptions> = {}) => {
      const requestTimestamp = Date.now();
      lastRequestTimestampRef.current = requestTimestamp;

      // Combine original options with overrides
      const mergedOptions = {
        ...options,
        ...overrideOptions,
        ...fetchOptions,
        ...overrideOptions,
      };

      const cacheKey = getCacheKey();

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      // Check cache based on policy
      if (
        (mergedOptions.cachePolicy === "cache-first" ||
          mergedOptions.cachePolicy === "cache-only") &&
        cache.current.has(cacheKey)
      ) {
        const cachedData = cache.current.get(cacheKey)!;
        setState(cachedData);

        // If cache-only, don't fetch
        if (mergedOptions.cachePolicy === "cache-only") {
          return;
        }

        // If cache-first, check if we should re-fetch based on deduping interval
        if (
          mergedOptions.cachePolicy === "cache-first" &&
          cachedData.timestamp &&
          Date.now() - cachedData.timestamp <
            (mergedOptions.dedupingInterval || dedupingInterval)
        ) {
          return;
        }
      }

      // Skip fetch for cache-only policy if no cache exists
      if (
        mergedOptions.cachePolicy === "cache-only" &&
        !cache.current.has(cacheKey)
      ) {
        setState({
          data: null,
          error: new FetchError(
            "No cached data available and cache-only policy specified",
            null,
            {
              url,
              cachePolicy: mergedOptions.cachePolicy,
            }
          ),
          loading: false,
          status: null,
          timestamp: Date.now(),
        });
        return;
      }

      // Set loading state
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        // Perform the fetch
        const response = await fetch(url, {
          ...mergedOptions,
          signal,
        });

        // If this isn't the most recent request, ignore the result
        if (lastRequestTimestampRef.current !== requestTimestamp) {
          return;
        }

        if (!response.ok) {
          throw new FetchError(`HTTP error! Status: ${response.status}`, null, {
            status: response.status,
            statusText: response.statusText,
            url,
          });
        }

        // Parse the response
        let data: T;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          // Handle text or other response types
          const text = await response.text();
          try {
            data = JSON.parse(text) as T;
          } catch {
            data = text as unknown as T;
          }
        }

        const newState: FetchState<T> = {
          data,
          error: null,
          loading: false,
          status: response.status,
          timestamp: Date.now(),
        };

        // Update state
        setState(newState);

        // Update cache
        if (mergedOptions.cachePolicy !== "no-cache") {
          cache.current.set(cacheKey, newState);
        }

        // Reset retry counter on success
        retryAttemptsRef.current = 0;
      } catch (error) {
        // If this isn't the most recent request, ignore the error
        if (lastRequestTimestampRef.current !== requestTimestamp) {
          return;
        }

        // Don't handle aborted requests as errors
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        // Handle error and retry logic
        const fetchError =
          error instanceof FetchError
            ? error
            : new FetchError("Failed to fetch", error, { url });

        // Check if we should retry
        if (retryAttemptsRef.current < (mergedOptions.retries || retries)) {
          retryAttemptsRef.current++;
          setTimeout(() => {
            // Only retry if this is still the most recent request
            if (lastRequestTimestampRef.current === requestTimestamp) {
              fetchData(mergedOptions);
            }
          }, (mergedOptions.retryDelay || retryDelay) * retryAttemptsRef.current);
        } else {
          setState({
            data: null,
            error: fetchError,
            loading: false,
            status: fetchError.status || null,
            timestamp: Date.now(),
          });

          // Reset retry counter
          retryAttemptsRef.current = 0;
        }
      }
    },
    [
      url,
      options,
      fetchOptions,
      getCacheKey,
      dedupingInterval,
      retries,
      retryDelay,
    ]
  );

  // Abort function
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, []);

  // Effect to fetch data on mount or url/options change
  useEffect(() => {
    fetchData();
    return () => {
      // Clean up by aborting any in-flight requests
      abort();
    };
  }, [fetchData, abort]);

  // Return state and refetch function
  return {
    ...state,
    refetch: fetchData,
    abort,
  };
}

export default useFetch;
