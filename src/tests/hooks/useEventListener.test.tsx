import { renderHook, act } from "@testing-library/react";
import { useRef } from "react";
import useEventListener from "../../hooks/useEventListener";

describe("useEventListener", () => {
  // Mock window event listeners
  const addEventListenerSpy = jest.spyOn(window, "addEventListener");
  const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add and remove event listener on window by default", () => {
    const handler = jest.fn();
    const { result, unmount } = renderHook(() =>
      useEventListener("click", handler)
    );

    // Verify initial state
    expect(result.current.isSupported).toBe(true);
    expect(result.current.error).toBeNull();

    // Simulate event
    act(() => {
      window.dispatchEvent(new Event("click"));
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );

    // Test manual removal
    act(() => {
      result.current.remove();
    });

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );

    // Cleanup
    unmount();
  });

  it("should work with element refs", () => {
    const handler = jest.fn();
    const div = document.createElement("div");
    const ref = { current: div };
    const addEventListenerSpy = jest.spyOn(div, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(div, "removeEventListener");

    const { result, unmount } = renderHook(() =>
      useEventListener("click", handler, ref)
    );

    expect(result.current.isSupported).toBe(true);
    expect(result.current.error).toBeNull();

    act(() => {
      div.dispatchEvent(new Event("click"));
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );
  });

  it("should handle unsupported elements", () => {
    const handler = jest.fn();
    // Create a plain object that doesn't support event listeners
    const unsupportedElement = {} as HTMLElement;
    const ref = { current: unsupportedElement };

    const { result } = renderHook(() =>
      useEventListener("click", handler, ref)
    );

    expect(result.current.isSupported).toBe(false);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain(
      "does not support event listeners"
    );
  });

  it("should update handler when it changes", () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const { rerender } = renderHook(
      ({ handler }) => useEventListener("click", handler),
      { initialProps: { handler: handler1 } }
    );

    act(() => {
      window.dispatchEvent(new Event("click"));
    });

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).not.toHaveBeenCalled();

    rerender({ handler: handler2 });

    act(() => {
      window.dispatchEvent(new Event("click"));
    });

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it("should handle document as target", () => {
    const handler = jest.fn();
    const addEventListenerSpy = jest.spyOn(document, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(document, "removeEventListener");

    const { result, unmount } = renderHook(() =>
      useEventListener("click", handler, document)
    );

    expect(result.current.isSupported).toBe(true);
    expect(result.current.error).toBeNull();

    act(() => {
      document.dispatchEvent(new Event("click"));
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );
  });

  it("should handle errors during event listener setup", () => {
    const handler = jest.fn();
    const error = new Error("Test error");
    const addEventListenerSpy = jest
      .spyOn(window, "addEventListener")
      .mockImplementation(() => {
        throw error;
      });

    const { result } = renderHook(() => useEventListener("click", handler));

    expect(result.current.isSupported).toBe(false);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain(
      "Failed to add event listener"
    );

    addEventListenerSpy.mockRestore();
  });
});
