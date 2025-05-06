import { BaseError } from "../../../hooks/errors/BaseError";

describe("BaseError", () => {
  // Test the basic error construction
  test("should create an error with just a message", () => {
    const error = new BaseError("Test error message");

    expect(error.message).toBe("Test error message");
    expect(error.name).toBe("BaseError");
    expect(error.originalError).toBeUndefined();
    expect(error.context).toBeUndefined();
    expect(error instanceof Error).toBe(true);
  });

  // Test with an original error
  test("should create an error with a message and original error", () => {
    const originalError = new Error("Original error");
    const error = new BaseError("Wrapped error message", originalError);

    expect(error.message).toBe("Wrapped error message");
    expect(error.originalError).toBe(originalError);
    expect(error.context).toBeUndefined();
  });

  // Test with a message, original error, and context
  test("should create an error with message, original error, and context", () => {
    const originalError = new Error("Original error");
    const context = { userId: "123", operation: "fetch" };
    const error = new BaseError("Error with context", originalError, context);

    expect(error.message).toBe("Error with context");
    expect(error.originalError).toBe(originalError);
    expect(error.context).toEqual(context);
  });

  // Test with a message and context but no original error
  test("should create an error with message and context but no original error", () => {
    const context = { userId: "123", operation: "fetch" };
    const error = new BaseError("Error with context", undefined, context);

    expect(error.message).toBe("Error with context");
    expect(error.originalError).toBeUndefined();
    expect(error.context).toEqual(context);
  });

  // Test the Error.captureStackTrace branch
  test("should use Error.captureStackTrace when available", () => {
    // Store original captureStackTrace
    const originalCaptureStackTrace = Error.captureStackTrace;

    // Mock captureStackTrace
    const mockCaptureStackTrace = jest.fn();
    Error.captureStackTrace = mockCaptureStackTrace;

    try {
      const error = new BaseError("Test error");

      expect(mockCaptureStackTrace).toHaveBeenCalledWith(error, BaseError);
    } finally {
      // Restore original
      Error.captureStackTrace = originalCaptureStackTrace;
    }
  });

  // Test the case when Error.captureStackTrace is not available
  test("should not throw when Error.captureStackTrace is not available", () => {
    // Store original captureStackTrace
    const originalCaptureStackTrace = Error.captureStackTrace;

    // Remove captureStackTrace
    // @ts-ignore - Intentionally set to undefined for testing purposes
    Error.captureStackTrace = undefined;

    try {
      expect(() => {
        new BaseError("Test error without captureStackTrace");
      }).not.toThrow();
    } finally {
      // Restore original
      Error.captureStackTrace = originalCaptureStackTrace;
    }
  });
});
