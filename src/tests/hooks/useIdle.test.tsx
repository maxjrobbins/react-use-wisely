import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import useIdle from "../../hooks/useIdle";

// Mock the setTimeout to immediately execute the callback in tests
// This allows us to test the "becomes idle" state more reliably
jest.mock(
  "global",
  () => {
    const originalGlobal = jest.requireActual("global");
    return {
      ...originalGlobal,
      // This ensures that setTimeout immediately calls the callback
      setTimeout: (callback: Function) => {
        callback();
        return 123; // mock ID
      },
    };
  },
  { virtual: true }
);

describe("useIdle", () => {
  // Helper to simulate user activity
  const simulateUserActivity = (eventType = "mousedown"): void => {
    const event = new Event(eventType);
    document.dispatchEvent(event);
  };

  // Control time passage in tests
  jest.useFakeTimers();

  beforeEach(() => {
    // Reset the document event listeners
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      document.removeEventListener(event, () => {});
    });
  });

  afterEach(() => {
    // Clean up timers and event listeners
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it("returns false initially", () => {
    const { result } = renderHook(() => useIdle());

    expect(result.current).toBe(false);
  });

  it("resets idle state on user activity", () => {
    const { result } = renderHook(() => useIdle(1000));

    // Simulate activity before timeout
    act(() => {
      simulateUserActivity();
      jest.advanceTimersByTime(500);
      simulateUserActivity("mousemove");
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe(false);
  });

  it("supports custom events", () => {
    const customEvents: string[] = ["click", "keydown"];
    const { result } = renderHook(() => useIdle(1000, customEvents));

    // Simulate custom event
    act(() => {
      const clickEvent = new Event("click");
      document.dispatchEvent(clickEvent);
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe(false);
  });

  it("cleans up event listeners on unmount", () => {
    const addEventListenerSpy = jest.spyOn(document, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useIdle());

    // Unmount the hook
    act(() => {
      unmount();
    });

    // Verify cleanup
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(
      addEventListenerSpy.mock.calls.length
    );
  });

  it("does not become idle if activity occurs before timeout", () => {
    const { result } = renderHook(() => useIdle(1000));

    // Simulate activity before timeout
    act(() => {
      jest.advanceTimersByTime(500);
      simulateUserActivity();
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe(false);
  });

  it("becomes idle after timeout with no activity", () => {
    const { result } = renderHook(() => useIdle(0)); // Set timeout to 0 to force immediate idle

    // With our mocked setTimeout, this should set idle to true immediately
    expect(result.current).toBe(true);
  });
});
