import BaseError from "./BaseError";

/**
 * Error class for localStorage-related errors
 */
export class LocalStorageError extends BaseError {
  constructor(
    message: string,
    originalError?: unknown,
    context?: Record<string, unknown>
  ) {
    super(message, originalError, context);
  }
}

/**
 * Error class for async operation errors
 */
export class AsyncError extends BaseError {
  constructor(
    message: string,
    originalError?: unknown,
    context?: Record<string, unknown>
  ) {
    super(message, originalError, context);
  }
}

/**
 * Error class for geolocation-related errors
 */
export class GeolocationError extends BaseError {
  code?: number;

  constructor(
    message: string,
    error?: GeolocationPositionError | Error,
    context?: Record<string, unknown>
  ) {
    super(message, error, context);

    if (error && "code" in error) {
      this.code = error.code;
    }
  }
}

/**
 * Error class for clipboard-related errors
 */
export class ClipboardError extends BaseError {
  constructor(
    message: string,
    originalError?: unknown,
    context?: Record<string, unknown>
  ) {
    super(message, originalError, context);
  }
}

/**
 * Error class for media query-related errors
 */
export class MediaError extends BaseError {
  constructor(
    message: string,
    originalError?: unknown,
    context?: Record<string, unknown>
  ) {
    super(message, originalError, context);
  }
}

/**
 * Error class for form-related errors
 */
export class FormError extends BaseError {
  constructor(
    message: string,
    originalError?: unknown,
    context?: Record<string, unknown>
  ) {
    super(message, originalError, context);
  }
}

/**
 * Error class for IntersectionObserver-related errors
 */
export class IntersectionObserverError extends BaseError {
  constructor(
    message: string,
    originalError?: unknown,
    context?: Record<string, unknown>
  ) {
    super(message, originalError, context);
  }
}

/**
 * Error class for network connectivity-related errors
 */
export class NetworkError extends BaseError {
  constructor(
    message: string,
    originalError?: unknown,
    context?: Record<string, unknown>
  ) {
    super(message, originalError, context);
  }
}

/**
 * Error class for ResizeObserver-related errors
 */
export class ResizeObserverError extends BaseError {
  constructor(
    message: string,
    originalError?: unknown,
    context?: Record<string, unknown>
  ) {
    super(message, originalError, context);
  }
}

/**
 * Error for when ResizeObserver is not supported in the browser
 */
export class ResizeObserverNotSupportedError extends ResizeObserverError {
  constructor() {
    super("ResizeObserver is not supported in this browser");
  }
}

export { BaseError };
export default {
  BaseError,
  LocalStorageError,
  AsyncError,
  GeolocationError,
  ClipboardError,
  MediaError,
  FormError,
  IntersectionObserverError,
  NetworkError,
  ResizeObserverError,
  ResizeObserverNotSupportedError,
};
