/**
 * Base error class for all hook-related errors
 */
export class BaseError extends Error {
  constructor(
    message: string,
    public originalError?: unknown,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown (only available in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default BaseError;
