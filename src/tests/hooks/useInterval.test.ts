import { renderHook, act } from "@testing-library/react";
import { useState } from "react";
import useInterval from "../../hooks/useInterval";
import { BrowserAPIError } from "../../hooks/errors";

describe("useInterval", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("calls the callback at specified intervals", () => {
    const callback = jest.fn();
    renderHook(() => useInterval(callback, 1000));

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(4);
  });

  it("does not call callback when delay is null", () => {
    const callback = jest.fn();
    renderHook(() => useInterval(callback, null));

    jest.advanceTimersByTime(5000);
    expect(callback).not.toHaveBeenCalled();
  });

  it("clears previous interval on delay change", () => {
    const callback = jest.fn();
    const { rerender } = renderHook(
      ({ delay }) => useInterval(callback, delay),
      {
        initialProps: { delay: 1000 },
      }
    );

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    rerender({ delay: 2000 });
    jest.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("cleans up interval on unmount", () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useInterval(callback, 1000));
    jest.advanceTimersByTime(1000);
    unmount();
    jest.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not update callback if not changed", () => {
    const callback = jest.fn();
    const { rerender } = renderHook(({ cb }) => useInterval(cb, 1000), {
      initialProps: { cb: callback },
    });

    jest.advanceTimersByTime(1000);
    rerender({ cb: callback });
    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("respects a dynamically replaced callback", () => {
    const cb1 = jest.fn();
    const cb2 = jest.fn();
    const { rerender } = renderHook(({ cb }) => useInterval(cb, 1000), {
      initialProps: { cb: cb1 },
    });

    jest.advanceTimersByTime(1000);
    expect(cb1).toHaveBeenCalledTimes(1);

    rerender({ cb: cb2 });
    jest.advanceTimersByTime(1000);

    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledTimes(1);
  });

  it("clears interval when delay becomes null, then sets new one when delay is redefined", () => {
    const callback = jest.fn();
    const { rerender } = renderHook(
      ({ delay }) => useInterval(callback, delay),
      {
        initialProps: { delay: 1000 },
      }
    );

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    // @ts-ignore
    rerender({ delay: null });
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    rerender({ delay: 500 });
    jest.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("does not clear interval if none is set", () => {
    const callback = jest.fn();
    const { rerender } = renderHook(
      ({ delay }) => useInterval(callback, delay),
      {
        initialProps: { delay: null },
      }
    );

    // should skip clearInterval branch
    rerender({ delay: null });
    jest.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it("stops interval when clear method is called", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback, 1000));

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.clear();
    });

    jest.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("restarts interval when reset method is called", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback, 1000));

    jest.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.reset();
    });

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("works with very small delay", () => {
    const callback = jest.fn();
    renderHook(() => useInterval(callback, 10));

    jest.advanceTimersByTime(50);
    expect(callback).toHaveBeenCalledTimes(5);
  });

  it("supports callback that updates component state", () => {
    const { result } = renderHook(() => {
      const [count, setCount] = useState(0);
      const interval = useInterval(() => {
        setCount((c) => c + 1);
      }, 1000);
      return { count, interval };
    });

    expect(result.current.count).toBe(0);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.count).toBe(1);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.count).toBe(3);
  });

  it("reset does nothing if delay is null", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => {
      // @ts-ignore - null is handled in the hook implementation
      return useInterval(callback, null);
    });

    act(() => {
      result.current.reset();
    });

    jest.advanceTimersByTime(2000);
    expect(callback).not.toHaveBeenCalled();
  });

  // New tests for the standardized hook properties
  it("returns isSupported as true", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback, 1000));

    expect(result.current.isSupported).toBe(true);
  });

  it("initially returns error as null", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback, 1000));

    expect(result.current.error).toBeNull();
  });

  it("sets error when callback throws", () => {
    const errorCallback = jest.fn(() => {
      throw new Error("Test error");
    });

    const { result } = renderHook(() => useInterval(errorCallback, 100));

    // Use act to properly handle state updates
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Check if callback was called
    expect(errorCallback).toHaveBeenCalledTimes(1);

    // Force a re-render to ensure error state is updated
    act(() => {
      jest.advanceTimersByTime(0);
    });

    // Now check the error state
    expect(result.current.error).not.toBeNull();
    expect(result.current.error instanceof BrowserAPIError).toBe(true);
    expect(result.current.error?.message).toBe("Error in interval callback");
  });
});
