import { renderHook, act } from "@testing-library/react";
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
      expect.any(Function),
      undefined
    );

    // Test manual removal
    act(() => {
      result.current.remove();
    });

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      undefined
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
      expect.any(Function),
      undefined
    );

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      undefined
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
      expect.any(Function),
      undefined
    );

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      undefined
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

  it("should handle different event types", () => {
    const clickHandler = jest.fn();
    const keydownHandler = jest.fn();
    const { result: clickResult } = renderHook(() =>
      useEventListener("click", clickHandler)
    );
    const { result: keydownResult } = renderHook(() =>
      useEventListener("keydown", keydownHandler)
    );

    act(() => {
      window.dispatchEvent(new Event("click"));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });

    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(keydownHandler).toHaveBeenCalledTimes(1);
    expect(keydownHandler).toHaveBeenCalledWith(
      expect.objectContaining({ key: "Enter" })
    );
    expect(clickResult.current.isSupported).toBe(true);
    expect(keydownResult.current.isSupported).toBe(true);
  });

  it("should handle multiple event listeners on the same element", () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const div = document.createElement("div");
    const ref = { current: div };
    const addEventListenerSpy = jest.spyOn(div, "addEventListener");

    const { result: result1 } = renderHook(() =>
      useEventListener("click", handler1, ref)
    );
    const { result: result2 } = renderHook(() =>
      useEventListener("click", handler2, ref)
    );

    act(() => {
      div.dispatchEvent(new Event("click"));
    });

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
    expect(result1.current.isSupported).toBe(true);
    expect(result2.current.isSupported).toBe(true);
  });

  it("should handle event propagation", () => {
    const parentHandler = jest.fn();
    const childHandler = jest.fn();
    const parent = document.createElement("div");
    const child = document.createElement("div");
    parent.appendChild(child);
    const parentRef = { current: parent };
    const childRef = { current: child };

    const { result: parentResult } = renderHook(() =>
      useEventListener("click", parentHandler, parentRef)
    );
    const { result: childResult } = renderHook(() =>
      useEventListener("click", childHandler, childRef)
    );

    act(() => {
      child.dispatchEvent(new Event("click", { bubbles: true }));
    });

    expect(childHandler).toHaveBeenCalledTimes(1);
    expect(parentHandler).toHaveBeenCalledTimes(1);
    expect(parentResult.current.isSupported).toBe(true);
    expect(childResult.current.isSupported).toBe(true);
  });

  it("should handle custom event objects", () => {
    const handler = jest.fn();
    const customEvent = new CustomEvent("message", { detail: { foo: "bar" } });

    const { result } = renderHook(() => useEventListener("message", handler));

    act(() => {
      window.dispatchEvent(customEvent);
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "message",
        detail: { foo: "bar" },
      })
    );
    expect(result.current.isSupported).toBe(true);
  });

  it("should handle different element types", () => {
    const buttonHandler = jest.fn();
    const inputHandler = jest.fn();
    const button = document.createElement("button");
    const input = document.createElement("input");
    const buttonRef = { current: button };
    const inputRef = { current: input };

    const { result: buttonResult } = renderHook(() =>
      useEventListener("click", buttonHandler, buttonRef)
    );
    const { result: inputResult } = renderHook(() =>
      useEventListener("input", inputHandler, inputRef)
    );

    act(() => {
      button.dispatchEvent(new Event("click"));
      input.dispatchEvent(new Event("input"));
    });

    expect(buttonHandler).toHaveBeenCalledTimes(1);
    expect(inputHandler).toHaveBeenCalledTimes(1);
    expect(buttonResult.current.isSupported).toBe(true);
    expect(inputResult.current.isSupported).toBe(true);
  });

  it("should handle SSR environment", () => {
    const handler = jest.fn();
    const originalAddEventListener = window.addEventListener;

    // Mock addEventListener to simulate SSR environment
    window.addEventListener = undefined as any;

    const { result } = renderHook(() => useEventListener("click", handler));

    expect(result.current.isSupported).toBe(false);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain(
      "does not support event listeners"
    );

    // Restore original addEventListener
    window.addEventListener = originalAddEventListener;
  });

  it("should handle event listener options", () => {
    const handler = jest.fn();
    const div = document.createElement("div");
    const ref = { current: div };
    const options = { once: true };
    const addEventListenerSpy = jest.spyOn(div, "addEventListener");

    const { result } = renderHook(() =>
      useEventListener("click", handler, ref, options)
    );

    act(() => {
      div.dispatchEvent(new Event("click"));
      div.dispatchEvent(new Event("click"));
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      options
    );
    expect(result.current.isSupported).toBe(true);
  });

  it("should handle remove with window target", () => {
    const handler = jest.fn();
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { result } = renderHook(() => useEventListener("click", handler));

    act(() => {
      result.current.remove();
    });

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      undefined
    );
  });

  it("should handle remove with document target", () => {
    const handler = jest.fn();
    const removeEventListenerSpy = jest.spyOn(document, "removeEventListener");
    const ref = { current: document };

    const { result } = renderHook(() =>
      useEventListener("click", handler, ref)
    );

    act(() => {
      result.current.remove();
    });

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      undefined
    );
  });

  it("should handle remove with unsupported element", () => {
    const handler = jest.fn();
    const unsupportedElement = {} as HTMLElement;
    const ref = { current: unsupportedElement };

    const { result } = renderHook(() =>
      useEventListener("click", handler, ref)
    );

    // This should not throw an error
    act(() => {
      result.current.remove();
    });

    expect(result.current.isSupported).toBe(false);
  });

  it("should handle remove with null element", () => {
    const handler = jest.fn();
    const mockElement = {
      addEventListener: undefined,
      removeEventListener: undefined,
    } as unknown as HTMLElement;
    const ref = { current: mockElement };

    const { result } = renderHook(() =>
      useEventListener("click", handler, ref)
    );

    // This should not throw an error
    act(() => {
      result.current.remove();
    });

    expect(result.current.isSupported).toBe(false);
  });
});
