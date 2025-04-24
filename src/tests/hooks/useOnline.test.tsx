import React, { FC } from "react";
import { render, screen, act } from "@testing-library/react";
import useOnline from "../../hooks/useOnline";

// A test component that uses the hook
const TestComponent: FC = () => {
  const isOnline = useOnline();

  return (
    <div>
      <div data-testid="status">{isOnline ? "Online" : "Offline"}</div>
    </div>
  );
};

describe("useOnline", () => {
  // Store original navigator.onLine
  const originalOnLine = window.navigator.onLine;

  // Reset navigator.onLine after each test
  afterEach(() => {
    // Set navigator.onLine back to its original value
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: originalOnLine,
      writable: true,
    });
  });

  test("should return true when navigator.onLine is true", () => {
    // Mock navigator.onLine to be true
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
      writable: true,
    });

    render(<TestComponent />);

    expect(screen.getByTestId("status").textContent).toBe("Online");
  });

  test("should return false when navigator.onLine is false", () => {
    // Mock navigator.onLine to be false
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false,
      writable: true,
    });

    render(<TestComponent />);

    expect(screen.getByTestId("status").textContent).toBe("Offline");
  });

  test("should update when online event is triggered", () => {
    // Start offline
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false,
      writable: true,
    });

    render(<TestComponent />);

    expect(screen.getByTestId("status").textContent).toBe("Offline");

    // Change to online and dispatch event
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
      writable: true,
    });

    act(() => {
      window.dispatchEvent(new Event("online"));
    });

    expect(screen.getByTestId("status").textContent).toBe("Online");
  });

  test("should update when offline event is triggered", () => {
    // Start online
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
      writable: true,
    });

    render(<TestComponent />);

    expect(screen.getByTestId("status").textContent).toBe("Online");

    // Change to offline and dispatch event
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false,
      writable: true,
    });

    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    expect(screen.getByTestId("status").textContent).toBe("Offline");
  });

  test("should add and remove event listeners correctly", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = render(<TestComponent />);

    // Should add both online and offline event listeners
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "online",
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "offline",
      expect.any(Function)
    );

    // Unmount component
    unmount();

    // Should remove both event listeners
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "online",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "offline",
      expect.any(Function)
    );

    // Clean up spies
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  test("should handle undefined navigator", () => {
    // Store the original navigator
    const originalNavigator = window.navigator;
    const navigatorDescriptor = Object.getOwnPropertyDescriptor(
      window,
      "navigator"
    );

    // Mock missing navigator
    Object.defineProperty(window, "navigator", {
      configurable: true,
      value: undefined,
      writable: true,
    });

    // Suppress console errors for this test
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // This should not throw an error, but default to true
    const { unmount } = render(<TestComponent />);

    // Should default to online
    expect(screen.getByTestId("status").textContent).toBe("Online");

    // Clean up
    unmount();

    // Restore original navigator
    if (navigatorDescriptor) {
      Object.defineProperty(window, "navigator", navigatorDescriptor);
    } else {
      // Fallback if descriptor isn't available
      (window as any).navigator = originalNavigator;
    }

    console.error = originalConsoleError;
  });
});
