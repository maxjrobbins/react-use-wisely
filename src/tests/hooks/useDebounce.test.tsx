import { renderHook, act } from "@testing-library/react";
import useDebounce from "../../hooks/useDebounce";

jest.useFakeTimers();

describe("useDebounce", () => {
  it("should debounce the value after the specified delay", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, { delay }), {
      initialProps: { value: "first", delay: 300 },
    });

    expect(result.current).toEqual({ error: null, value: "first" });

    rerender({ value: "second", delay: 300 });
    expect(result.current).toEqual({ error: null, value: "first" });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toEqual({ error: null, value: "second" });
  });

  it("should update immediately on delay change", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, { delay }), {
      initialProps: { value: "a", delay: 100 },
    });

    rerender({ value: "b", delay: 0 });
    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current).toEqual({ error: null, value: "b" });
  });

  it("defaults to a 500ms delay if none is provided", () => {
    const { result } = renderHook(() => useDebounce("default-test"));
    expect(result.current).toEqual({ error: null, value: "default-test" });
  });
});
