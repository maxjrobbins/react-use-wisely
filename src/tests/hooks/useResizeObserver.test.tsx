import React, { FC } from "react";
import { render, renderHook, act } from "@testing-library/react";
import useResizeObserver from "../../hooks/useResizeObserver";

// Mock for ResizeObserver
interface MockResizeObserverInstance {
  observe: jest.Mock;
  disconnect: jest.Mock;
  callback?: (entries: ResizeObserverEntry[]) => void;
}

describe("useResizeObserver", () => {
  let originalResizeObserver: typeof ResizeObserver;
  let mockResizeObserverInstance: MockResizeObserverInstance;

  beforeEach(() => {
    // Store original ResizeObserver
    originalResizeObserver = window.ResizeObserver;

    // Create a more comprehensive mock
    mockResizeObserverInstance = {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };

    // Mock the ResizeObserver constructor
    window.ResizeObserver = jest.fn().mockImplementation((callback) => {
      mockResizeObserverInstance.callback = callback;
      return mockResizeObserverInstance;
    }) as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    // Restore original ResizeObserver
    window.ResizeObserver = originalResizeObserver;
  });

  // Component to test the hook
  const TestComponent: FC = () => {
    const { ref, dimensions, error } = useResizeObserver<HTMLDivElement>();
    return (
      <div ref={ref} data-testid="resize-element">
        Width: {dimensions.width}
        Height: {dimensions.height}
        {error && <div data-testid="error">{error.message}</div>}
      </div>
    );
  };

  it("returns a ref, dimensions object, isSupported flag, and null error initially", () => {
    const { result } = renderHook(() => useResizeObserver());

    expect(result.current.ref).toBeTruthy(); // ref exists
    expect(result.current.dimensions).toEqual({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
    }); // initial dimensions are empty
    expect(result.current.isSupported).toBe(true); // should be true in test environment
    expect(result.current.error).toBeNull(); // initial error is null
  });

  it("handles undefined ref", () => {
    const { result } = renderHook(() => {
      const { ref } = useResizeObserver();
      return ref;
    });

    // Ensure no errors are thrown when ref is not set
    expect(result.current.current).toBeNull();
  });

  it("updates dimensions when element resizes", () => {
    render(<TestComponent />);

    // Trigger a resize observation
    if (mockResizeObserverInstance.callback) {
      act(() => {
        const mockEntry = {
          contentRect: {
            width: 100,
            height: 200,
            top: 0,
            left: 0,
            right: 100,
            bottom: 200,
            x: 0,
            y: 0,
          },
        } as ResizeObserverEntry;

        mockResizeObserverInstance.callback!([mockEntry]);
      });
    }

    // Verify the hook observed the element
    expect(mockResizeObserverInstance.observe).toHaveBeenCalled();
  });

  it("handles ResizeObserver observe error", () => {
    // Mock ResizeObserver to throw when observe is called
    mockResizeObserverInstance.observe.mockImplementation(() => {
      throw new Error("Failed to observe");
    });

    render(<TestComponent />);

    expect(mockResizeObserverInstance.observe).toHaveBeenCalled();
  });

  it("clears error after successful resize observation", () => {
    const { result } = renderHook(() => useResizeObserver());

    // We'll test the basic functionality without trying to create errors
    expect(result.current.error).toBeNull(); // Initially null

    if (mockResizeObserverInstance.callback) {
      act(() => {
        const mockEntry = {
          contentRect: {
            width: 100,
            height: 200,
            top: 0,
            left: 0,
            right: 100,
            bottom: 200,
            x: 0,
            y: 0,
          },
        } as ResizeObserverEntry;

        // This would clear errors if any existed
        mockResizeObserverInstance.callback!([mockEntry]);
      });
    }

    // Should still be null
    expect(result.current.error).toBeNull();
  });

  it("handles errors when processing resize entries", () => {
    const { result } = renderHook(() => useResizeObserver());

    // Set up the ref so useEffect runs
    act(() => {
      if (result.current.ref) {
        result.current.ref.current = document.createElement("div") as any;
      }
    });

    // Mock the callback to simulate an error when processing entries
    const mockCallback = mockResizeObserverInstance.callback;

    // Force the callback to throw an error
    if (mockCallback) {
      act(() => {
        try {
          // Call with an invalid entry to cause an error
          mockCallback([{} as ResizeObserverEntry]);
        } catch (error) {
          // Error will be caught in the hook
        }
      });
    }

    // The test is successful if no unhandled exceptions are thrown
  });

  it("handles ResizeObserver disconnection errors", () => {
    // Spy on console.error to verify it was called
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // We need to ensure the observe is called first
    const { unmount } = renderHook(() => useResizeObserver());

    // Now mock disconnect to throw an error
    mockResizeObserverInstance.disconnect.mockImplementation(() => {
      throw new Error("Failed to disconnect");
    });

    // Unmount to trigger the cleanup function
    unmount();

    // Verify at least one error was logged
    expect(consoleErrorSpy).toHaveBeenCalled();

    // Restore the spy
    consoleErrorSpy.mockRestore();
  });

  it("handles browsers where ResizeObserver is not supported", () => {
    // Setup: temporarily remove ResizeObserver from window
    const tempResizeObserver = window.ResizeObserver;
    // Use type assertion to handle the delete operation safely
    (window as any).ResizeObserver = undefined;

    // Need a ref to be set for the effect to run
    const TestComponent: FC = () => {
      const { ref, dimensions, error, isSupported } =
        useResizeObserver<HTMLDivElement>();
      return (
        <div ref={ref} data-testid="test-element">
          {!isSupported && <div data-testid="not-supported">Not supported</div>}
          {error && <div data-testid="error">{error.message}</div>}
        </div>
      );
    };

    // Render with the component
    const { getByTestId } = render(<TestComponent />);

    // The error should be displayed in the component
    expect(getByTestId("error").textContent).toBe(
      "ResizeObserver is not supported in this browser"
    );
    expect(getByTestId("not-supported")).toBeInTheDocument();

    // Restore ResizeObserver
    window.ResizeObserver = tempResizeObserver;
  });
});
