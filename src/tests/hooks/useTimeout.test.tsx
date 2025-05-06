import { act, renderHook } from "@testing-library/react";
import useTimeout from "../../hooks/useTimeout";

describe("useTimeout", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should call the callback after the specified delay", () => {
    const callback = jest.fn();
    renderHook(() => useTimeout(callback, 1000));

    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call the callback if delay is null", () => {
    const callback = jest.fn();
    // @ts-ignore - null is handled in the hook implementation
    renderHook(() => useTimeout(callback, null));

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should call the latest callback function", () => {
    const callbackA = jest.fn();
    const callbackB = jest.fn();

    const { rerender } = renderHook(
      ({ callback, delay }) => useTimeout(callback, delay),
      {
        initialProps: { callback: callbackA, delay: 1000 },
      }
    );

    // Change the callback before the timer fires
    rerender({ callback: callbackB, delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callbackA).not.toHaveBeenCalled();
    expect(callbackB).toHaveBeenCalledTimes(1);
  });

  it("should reset the timeout when delay changes", () => {
    const callback = jest.fn();

    const { rerender } = renderHook(
      ({ callback, delay }) => useTimeout(callback, delay),
      {
        initialProps: { callback: callback, delay: 1000 },
      }
    );

    // Advance time but not enough to trigger callback
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();

    // Change the delay
    rerender({ callback: callback, delay: 2000 });

    // Advance time past original delay
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();

    // Advance time to reach the new delay
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should clear the timeout on unmount", () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useTimeout(callback, 1000));

    unmount();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should reset the timeout when reset is called", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useTimeout(callback, 1000));

    // Advance time but not enough to trigger callback
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();

    // Reset the timeout
    act(() => {
      result.current.reset();
    });

    // Advance time to reach original delay from the start
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // The callback shouldn't be called yet since we reset
    expect(callback).not.toHaveBeenCalled();

    // Advance the remaining time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now the callback should be called
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should clear the timeout when clear is called", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useTimeout(callback, 1000));

    // Clear the timeout
    act(() => {
      result.current.clear();
    });

    // Advance time past the delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // The callback shouldn't be called since we cleared the timeout
    expect(callback).not.toHaveBeenCalled();
  });

  it("should not set a new timeout after clear if delay is null", () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(
      ({ callback, delay }) => useTimeout(callback, delay),
      {
        initialProps: { callback: callback, delay: 1000 },
      }
    );

    // Clear the timeout
    act(() => {
      result.current.clear();
    });

    // Change the delay to null
    // @ts-ignore - null is handled in the hook implementation
    rerender({ callback: callback, delay: null });

    // Reset the timeout
    act(() => {
      result.current.reset();
    });

    // Advance time
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // The callback shouldn't be called
    expect(callback).not.toHaveBeenCalled();
  });
});
