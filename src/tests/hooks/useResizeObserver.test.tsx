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
    const [ref, dimensions] = useResizeObserver<HTMLDivElement>();
    return (
      <div ref={ref} data-testid="resize-element">
        Width: {dimensions.width}
        Height: {dimensions.height}
      </div>
    );
  };

  it("returns a ref and dimensions object", () => {
    const { result } = renderHook(() => useResizeObserver());

    expect(result.current[0]).toBeTruthy(); // ref exists
    expect(result.current[1]).toEqual({}); // initial dimensions are empty
  });

  it("handles undefined ref", () => {
    const { result } = renderHook(() => {
      const [ref] = useResizeObserver();
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
});
