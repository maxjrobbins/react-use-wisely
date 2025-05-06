import { renderHook } from "@testing-library/react";
import useMountedRef from "../../hooks/useMountedRef";

describe("useMountedRef", () => {
  it("should initialize with isMounted true and no error", () => {
    const { result } = renderHook(() => useMountedRef());
    expect(result.current.isMounted).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should set isMounted to false after unmount", () => {
    const { result, unmount } = renderHook(() => useMountedRef());
    expect(result.current.isMounted).toBe(true);

    unmount();
    expect(result.current.isMounted).toBe(false);
  });

  it("should not change isMounted value during renders", () => {
    const { result, rerender } = renderHook(() => useMountedRef());

    expect(result.current.isMounted).toBe(true);

    rerender();
    expect(result.current.isMounted).toBe(true);

    rerender();
    expect(result.current.isMounted).toBe(true);
  });

  it("returns the same object shape on every render with stable values", () => {
    const { result, rerender } = renderHook(() => useMountedRef());

    const firstResult = result.current;
    rerender();
    const secondResult = result.current;

    // Expect different object references but same values
    expect(firstResult).not.toBe(secondResult);
    expect(firstResult.isMounted).toBe(secondResult.isMounted);
    expect(firstResult.error).toBe(secondResult.error);
  });
});
