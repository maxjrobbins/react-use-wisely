import { Status } from "../utils/types";

/**
 * Async hook result
 */
export interface AsyncResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  status: Status;
}

/**
 * Fetch options
 */
export interface FetchOptions extends RequestInit {
  cachePolicy?: "no-cache" | "cache-first" | "cache-only" | "network-only";
  retries?: number;
  retryDelay?: number;
  dedupingInterval?: number;
}

/**
 * Form validation and submission options
 */
export interface FormOptions<T extends Record<string, any>> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit?: (values: T) => void | Promise<void>;
}

/**
 * Form errors
 */
export type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Form touched fields
 */
export type FormTouched<T> = Partial<Record<keyof T, boolean>>;

export type { Status };
