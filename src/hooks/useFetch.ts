import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FetchError, NetworkError } from "./errors";

export interface UseFetchOptions extends RequestInit {
  cachePolicy?: "no-cache" | "cache-first" | "cache-only" | "network-only";
  retries?: number;
  retryDelay?: number;
  dedupingInterval?: number;
}

interface UseFetchResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  status: "idle" | "loading" | "success" | "error";
  timestamp: number | null;
  refetch: (overrideOptions?: Partial<UseFetchOptions>) => Promise<void>;
  abort: () => void;
}

const defaultCache = new Map<string, Omit<UseFetchResult<any>, 'refetch' | 'abort'>>();

function useFetch<T = any>(url: string, options: UseFetchOptions = {}): UseFetchResult<T> {
  const {
    cachePolicy = "no-cache",
    retries = 0,
    retryDelay = 1000,
    dedupingInterval = 200,
    method = "GET",
    ...rest
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [timestamp, setTimestamp] = useState<number | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const retryRef = useRef<number>(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const isMountedRef = useRef(true);

  const optionsRef = useRef({ cachePolicy, retries, retryDelay, dedupingInterval, method, ...rest });
  optionsRef.current = { cachePolicy, retries, retryDelay, dedupingInterval, method, ...rest };

  const cacheKey = useMemo(() => {
    const body = rest.body ? JSON.stringify(rest.body) : "";
    return `${method}:${url}:${body}`;
  }, [url, method, rest.body]);

  const refetch = useCallback(async (override: Partial<UseFetchOptions> = {}) => {
    const controller = new AbortController();
    abortRef.current = controller;
    const finalOpts: UseFetchOptions = {
      ...optionsRef.current,
      ...override,
      method: optionsRef.current.method,
      signal: controller.signal,
    };

    const now = Date.now();
    lastFetchTimeRef.current = now;

    const effectiveCachePolicy = override.cachePolicy ?? optionsRef.current.cachePolicy;
    const cached = defaultCache.get(cacheKey);

    if (effectiveCachePolicy !== "no-cache") {
      if (effectiveCachePolicy === "cache-only" && cached) {
        if (!controller.signal.aborted && isMountedRef.current) {
          setData(cached.data);
          setError(cached.error);
          setIsLoading(false);
          setStatus("success");
          setTimestamp(cached.timestamp);
        }
        return;
      }

      if (effectiveCachePolicy === "cache-first" && cached) {
        if (!controller.signal.aborted && isMountedRef.current) {
          setData(cached.data);
          setError(cached.error);
          setIsLoading(false);
          setStatus("success");
          setTimestamp(cached.timestamp);
        }

        if (
            cached.timestamp &&
            now - cached.timestamp < (override.dedupingInterval ?? optionsRef.current.dedupingInterval)
        ) {
          return;
        }
      }

      if (effectiveCachePolicy === "cache-only" && !cached) {
        if (!controller.signal.aborted && isMountedRef.current) {
          setError(new NetworkError("No cached data available", undefined, { url }));
          setData(null);
          setIsLoading(false);
          setStatus("error");
          setTimestamp(now);
        }
        return;
      }
    }

    if (!controller.signal.aborted && isMountedRef.current) {
      setIsLoading(true);
      setStatus("loading");
      setError(null);
    }

    try {
      const res = await fetch(url, finalOpts);
      if (!res.ok) {
        throw new FetchError(`HTTP ${res.status}`, undefined, {
          status: res.status,
          statusText: res.statusText,
          url,
        });
      }

      let parsedData: T;
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        parsedData = await res.json();
      } else {
        const text = await res.text();
        try {
          parsedData = JSON.parse(text);
        } catch {
          parsedData = text as unknown as T;
        }
      }

      if (!controller.signal.aborted && isMountedRef.current) {
        setData(parsedData);
        setIsLoading(false);
        setError(null);
        setStatus("success");
        setTimestamp(Date.now());

        if (effectiveCachePolicy !== "no-cache") {
          defaultCache.set(cacheKey, {
            data: parsedData,
            error: null,
            isLoading: false,
            status: "success",
            timestamp: Date.now(),
          });
        }

        retryRef.current = 0;
      }
    } catch (err: any) {
      if (controller.signal.aborted) return;

      const canRetry = retryRef.current < (override.retries ?? optionsRef.current.retries);
      if (canRetry) {
        retryRef.current++;
        retryTimeoutRef.current = setTimeout(() => {
          refetch(override);
        }, (override.retryDelay ?? optionsRef.current.retryDelay) * retryRef.current);
      } else if (isMountedRef.current) {
        const errorObj =
            err instanceof Error ? err : new NetworkError("Fetch failed", undefined, { cause: err, url });
        setData(null);
        setIsLoading(false);
        setError(errorObj);
        setStatus("error");
        setTimestamp(Date.now());
        retryRef.current = 0;
      }
    }
  }, [url, method, cacheKey]);

  const abort = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    refetch();
    return () => {
      isMountedRef.current = false;
      abort();
    };
  }, [refetch, abort]);

  return { data, error, isLoading, status, timestamp, refetch, abort };
}

export default useFetch;
