import React, { FC, useRef } from "react";
import { render, screen, act, renderHook } from "@testing-library/react";
import useScrollPosition from "../../hooks/useScrollPosition";

// Mock Date.now to return a stable value
const originalDateNow = Date.now;
Date.now = jest.fn(() => 1234567890);

// A test component that uses the hook
const TestComponent: FC<{ options?: any }> = ({ options = {} }) => {
  const { x, y, isSupported, error } = useScrollPosition(options);

  return (
    <div>
      <div data-testid="scroll-position">
        X: {x}, Y: {y}
      </div>
      <div data-testid="is-supported">
        Supported: {isSupported ? "true" : "false"}
      </div>
      <div data-testid="error">Error: {error ? error.message : "null"}</div>
    </div>
  );
};

// Component with element ref
const ElementComponent: FC = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { x, y } = useScrollPosition({ element: elementRef as any });

  return (
    <div>
      <div
        ref={elementRef}
        data-testid="scrollable"
        style={{ height: "100px", overflow: "auto" }}
      >
        <div style={{ height: "200px" }}>Scrollable content</div>
      </div>
      <div data-testid="scroll-position">
        X: {x}, Y: {y}
      </div>
    </div>
  );
};

describe("useScrollPosition", () => {
  // Mock console.error to avoid noise in test output
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
    // Restore Date.now
    Date.now = originalDateNow;
  });

  beforeEach(() => {
    // Simple mocks to prevent errors
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();

    // Define pageXOffset and pageYOffset for tests
    if (!("pageXOffset" in window)) {
      Object.defineProperty(window, "pageXOffset", {
        value: 0,
        configurable: true,
        writable: true,
      });
    }
    if (!("pageYOffset" in window)) {
      Object.defineProperty(window, "pageYOffset", {
        value: 0,
        configurable: true,
        writable: true,
      });
    }

    // Define document.hidden if needed
    if (!("hidden" in document)) {
      Object.defineProperty(document, "hidden", {
        value: false,
        configurable: true,
        writable: true,
      });
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return initial scroll position", () => {
    render(<TestComponent />);

    expect(screen.getByTestId("scroll-position").textContent).toBe(
      "X: 0, Y: 0"
    );
    expect(screen.getByTestId("is-supported").textContent).toBe(
      "Supported: true"
    );
    expect(screen.getByTestId("error").textContent).toBe("Error: null");
  });

  test("should setup scroll event listeners", () => {
    render(<TestComponent />);

    // We can just verify that addEventListener was called
    expect(window.addEventListener).toHaveBeenCalled();
  });

  test("should clean up event listeners on unmount", () => {
    const { unmount } = render(<TestComponent />);
    unmount();

    // Just verify removeEventListener was called
    expect(window.removeEventListener).toHaveBeenCalled();
  });

  test("should accept an element ref", () => {
    render(<ElementComponent />);

    // Just verify that the element renders and the hook doesn't throw
    expect(screen.getByTestId("scrollable")).toBeInTheDocument();
    expect(screen.getByTestId("scroll-position").textContent).toBe(
      "X: 0, Y: 0"
    );
  });

  test("should accept options like skipWhenHidden and wait", () => {
    // Renders with options to ensure they are accepted
    render(<TestComponent options={{ skipWhenHidden: true, wait: 200 }} />);

    // Verify basic rendering doesn't throw with options
    expect(screen.getByTestId("scroll-position").textContent).toBe(
      "X: 0, Y: 0"
    );
  });

  test("should handle errors gracefully", () => {
    // Save original getter
    const originalPageXOffset = Object.getOwnPropertyDescriptor(
      window,
      "pageXOffset"
    );

    // Mock pageXOffset to throw an error
    const errorMessage = "Failed to get scroll position";
    Object.defineProperty(window, "pageXOffset", {
      get: () => {
        throw new Error(errorMessage);
      },
      configurable: true,
    });

    render(<TestComponent />);

    // Error should be captured and returned
    expect(screen.getByTestId("error").textContent).toContain(errorMessage);

    // Restore original getter
    if (originalPageXOffset) {
      Object.defineProperty(window, "pageXOffset", originalPageXOffset);
    } else {
      // Delete the property if it didn't exist before
      delete (window as any).pageXOffset;
    }
  });


  it("reads scroll position from passed element", () => {
    const div = document.createElement("div");
    div.scrollTop = 150;
    div.scrollLeft = 75;

    const ref = { current: div };

    const { result } = renderHook(() => useScrollPosition({ element: ref }));

    expect(result.current.x).toBe(75);
    expect(result.current.y).toBe(150);
  });

  it("skips scroll updates when document is hidden", () => {
    Object.defineProperty(document, "hidden", { value: true, configurable: true });

    const { result } = renderHook(() =>
        useScrollPosition({ skipWhenHidden: true })
    );

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
  });

  jest.useFakeTimers();

  it("updates scroll position after wait time when scrolling", () => {
    window.scrollTo(0, 200);
    Object.defineProperty(window, "pageYOffset", { value: 200 });
    Object.defineProperty(window, "pageXOffset", { value: 50 });

    const { result } = renderHook(() =>
        useScrollPosition({ wait: 100 })
    );

    act(() => {
      window.dispatchEvent(new Event("scroll"));
      jest.advanceTimersByTime(100);
    });

    expect(result.current.x).toBe(50);
    expect(result.current.y).toBe(200);
  });

  it("sets error if getScrollPosition throws", () => {
    const brokenRef = {
      current: {
        get scrollLeft() {
          throw new Error("scrollLeft error");
        },
      },
    };

    const { result } = renderHook(() =>
        // @ts-ignore
        useScrollPosition({ element: brokenRef })
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
  });
});
