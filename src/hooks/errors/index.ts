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
 * Error class for fetch-related errors
 */
export class FetchError extends BaseError {
  status?: number;
  statusText?: string;

  constructor(
    message: string,
    originalError?: unknown,
    context?: Record<string, unknown> & { status?: number; statusText?: string }
  ) {
    super(message, originalError, context);

    if (context) {
      this.status = context.status;
      this.statusText = context.statusText as string;
    }
  }
}

/**
 * Error class for script loading errors
 */
export class ScriptError extends BaseError {
  src?: string;

  constructor(
    message: string,
    originalError?: unknown,
    context?: Record<string, unknown> & { src?: string }
  ) {
    super(message, originalError, context);

    if (context) {
      this.src = context.src as string;
    }
  }
}

/**
 * Error class for permission-related errors
 */
export class PermissionError extends BaseError {
  permissionName?: string;
  state?: PermissionState;

  constructor(
    message: string,
    originalError?: unknown,
    context?: Record<string, unknown> & {
      permissionName?: string;
      state?: PermissionState;
    }
  ) {
    super(message, originalError, context);

    if (context) {
      this.permissionName = context.permissionName as string;
      this.state = context.state as PermissionState;
    }
  }
}

/**
 * Error class for speech recognition errors
 */
export class SpeechRecognitionError extends BaseError {
  errorCode?: number;

  constructor(
    message: string,
    originalError?: unknown,
    context?: Record<string, unknown> & { errorCode?: number }
  ) {
    super(message, originalError, context);

    if (context) {
      this.errorCode = context.errorCode as number;
    }
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
 * Error class for DOM-related errors
 */
export class DOMError extends BaseError {
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

/**
 * Error class for network speed detection errors
 */
export class NetworkSpeedError extends BaseError {
  constructor(
    message: string,
    originalError?: unknown,
    context?: Record<string, unknown>
  ) {
    super(message, originalError, context);
  }
}

/**
 * Error class for Idle hook errors
 */
export class IdleError extends BaseError {
  constructor(
    message: string,
    originalError?: unknown,
    context?: Record<string, any>
  ) {
    super(message, originalError, context);
    this.name = "IdleError";
  }
}

/**
 * Error class for browser API-related errors
 */
export class BrowserAPIError extends BaseError {
  constructor(
    message: string,
    originalError?: unknown,
    context?: Record<string, unknown>
  ) {
    super(message, originalError, context);
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
  DOMError,
  IntersectionObserverError,
  NetworkError,
  ResizeObserverError,
  ResizeObserverNotSupportedError,
  FetchError,
  ScriptError,
  PermissionError,
  SpeechRecognitionError,
  NetworkSpeedError,
  IdleError,
  BrowserAPIError,
};
