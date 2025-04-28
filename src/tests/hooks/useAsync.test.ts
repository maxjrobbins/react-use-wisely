import { renderHook, act } from "@testing-library/react";
import useAsync from "../../hooks/useAsync";
import { AsyncError } from "../../hooks/errors";

// Use fake timers for tests involving setTimeout
jest.useFakeTimers();

describe("useAsync", () => {
  // Mocked async functions for testing
  const mockSuccessFunction = jest.fn(async <T>(value: T): Promise<T> => value);
  const mockErrorFunction = jest.fn(async (): Promise<never> => {
    throw new Error("Test error");
  });

  beforeEach(() => {
    // Clear mock function calls before each test
    mockSuccessFunction.mockClear();
    mockErrorFunction.mockClear();
    jest.clearAllMocks();
  });

  it("initializes with correct default state", () => {
    const { result } = renderHook(() => useAsync(mockSuccessFunction));

    expect(result.current.status).toBe("idle");
    expect(result.current.value).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("executes async function successfully", async () => {
    const { result } = renderHook(() => useAsync(mockSuccessFunction));

    // Execute the async function
    let response;
    await act(async () => {
      response = await result.current.execute("test value");
    });

    expect(mockSuccessFunction).toHaveBeenCalledWith("test value");
    expect(response).toBe("test value");

    // State checks after act
    expect(result.current.status).toBe("success");
    expect(result.current.value).toBe("test value");
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("handles async function error", async () => {
    const { result } = renderHook(() => useAsync(mockErrorFunction));

    // Execute the async function and expect an error
    await act(async () => {
      try {
        await result.current.execute();
        fail("should have thrown");
      } catch (e) {
        // Expected error
      }
    });

    // State checks after act
    expect(mockErrorFunction).toHaveBeenCalled();
    expect(result.current.status).toBe("error");
    expect(result.current.value).toBeNull();
    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe("Test error");
    expect(result.current.isLoading).toBe(false);
  });

  it("sets loading state during async operation", async () => {
    // Use real timers for this test
    jest.useRealTimers();

    const delayedFunction = jest.fn(async (): Promise<string> => {
      return new Promise((resolve) => {
        setTimeout(() => resolve("delayed result"), 50);
      });
    });

    const { result } = renderHook(() => useAsync(delayedFunction));

    // Start execution and check loading state
    let executionPromise: Promise<string> | undefined;
    act(() => {
      executionPromise = result.current.execute();
    });

    // Make sure promise is defined
    if (!executionPromise) {
      throw new Error("executionPromise was not initialized properly");
    }

    // Verify loading state immediately
    expect(result.current.status).toBe("pending");
    expect(result.current.isLoading).toBe(true);

    // Wait for execution to complete
    await executionPromise;

    // Need to re-render to see the updated state
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    // Verify final state
    expect(result.current.status).toBe("success");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.value).toBe("delayed result");
  });

  it("executes immediately when immediate is true", async () => {
    let executed = false;
    const immediateFunction = jest.fn(async () => {
      executed = true;
      return "immediate";
    });

    await act(async () => {
      renderHook(() => useAsync(immediateFunction, { immediate: true }));
      // Wait a bit for the effect to run
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    // Verify the function was called
    expect(executed).toBe(true);
    expect(immediateFunction).toHaveBeenCalled();
  });

  it("handles errors in immediate execution", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Set up error function that will be called immediately
    await act(async () => {
      renderHook(() => useAsync(mockErrorFunction, { immediate: true }));
      // Wait a bit for the effect to run
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    // Verify the error function was called
    expect(mockErrorFunction).toHaveBeenCalled();

    // Clean up
    errorSpy.mockRestore();
  });

  it("does not execute immediately when immediate is false", () => {
    renderHook(() => useAsync(mockSuccessFunction, { immediate: false }));

    // Verify the function was not called
    expect(mockSuccessFunction).not.toHaveBeenCalled();
  });

  it("resets state before each execution", async () => {
    const { result } = renderHook(() => useAsync(mockSuccessFunction));

    // First successful execution
    await act(async () => {
      await result.current.execute("first value");
    });

    expect(result.current.value).toBe("first value");

    // Second execution
    await act(async () => {
      await result.current.execute("second value");
    });

    // Verify state is updated with second execution
    expect(result.current.status).toBe("success");
    expect(result.current.value).toBe("second value");
    expect(result.current.error).toBeNull();
  });

  it("should retry the specified number of times on error", async () => {
    // Use real timers for retry tests
    jest.useRealTimers();

    // Create a mockFn that fails twice then succeeds
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("Error 1"))
      .mockRejectedValueOnce(new Error("Error 2"))
      .mockResolvedValueOnce("Success");

    // Using a short retry delay for quicker tests
    const { result, rerender } = renderHook(() =>
      useAsync(mockFn, { retryCount: 2, retryDelay: 50 })
    );

    // Execute first (will fail)
    let executePromise: Promise<any>;
    act(() => {
      executePromise = result.current.execute();
    });

    // After the initial call, mockFn should be called once
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Wait for first retry to happen
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 60));
      // Re-render to get updated state
      rerender();
    });

    // After first retry, mockFn should be called again - total 2
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe("retrying");
    expect(result.current.isRetrying).toBe(true);

    // Wait for second retry to happen
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 60));
    });

    // Wait for the promise to resolve
    await act(async () => {
      await executePromise;
    });

    // After all retries, expect success
    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(result.current.status).toBe("success");
    expect(result.current.value).toBe("Success");
    expect(result.current.isLoading).toBe(false);
  });

  it("should stop retrying after reaching the max retry count", async () => {
    // Use real timers for retry tests
    jest.useRealTimers();

    // Create a mockFn that always fails
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("Error 1"))
      .mockRejectedValueOnce(new Error("Error 2"))
      .mockRejectedValueOnce(new Error("Error 3"));

    // Using a short retry delay for quicker tests
    const { result, rerender } = renderHook(() =>
      useAsync(mockFn, { retryCount: 2, retryDelay: 50 })
    );

    // Execute (will fail)
    let executePromise: Promise<any>;
    act(() => {
      executePromise = result.current.execute().catch((e) => e);
    });

    // After the initial call, mockFn should be called once
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Wait for first retry to happen
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 60));
      // Re-render to get updated state
      rerender();
    });

    // After first retry, mockFn should be called again - total 2
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe("retrying");

    // Wait for second retry to happen
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 60));
    });

    // Wait for the promise to resolve
    await act(async () => {
      await executePromise;
    });

    // After all retries, expect error
    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(result.current.status).toBe("error");
    expect(result.current.value).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).not.toBeNull();
  });

  it("handles non-Error objects thrown by the async function", async () => {
    // Create a function that throws a non-Error object
    const nonErrorFunction = jest.fn(async () => {
      throw "This is not an Error object";
    });

    const { result } = renderHook(() => useAsync(nonErrorFunction));

    // Execute the function and expect it to handle the non-Error object
    await act(async () => {
      try {
        await result.current.execute();
        fail("should have thrown");
      } catch (e) {
        // Expected error
        expect(e).toBeInstanceOf(AsyncError);
      }
    });

    // Check that the error is properly handled
    expect(result.current.status).toBe("error");
    expect(result.current.error).toBeInstanceOf(AsyncError);
    expect(result.current.error?.message).toBe("Unknown async error");
  });

  it("provides reset function that clears state", async () => {
    const { result } = renderHook(() => useAsync(mockSuccessFunction));

    // First execute to set some state
    await act(async () => {
      await result.current.execute("test value");
    });

    // Verify state is set
    expect(result.current.status).toBe("success");
    expect(result.current.value).toBe("test value");

    // Reset state
    act(() => {
      result.current.reset();
    });

    // Verify state is reset
    expect(result.current.status).toBe("idle");
    expect(result.current.value).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.attemptCount).toBe(0);
  });
});
