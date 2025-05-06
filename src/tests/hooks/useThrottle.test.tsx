import React, { useState, FC } from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import useThrottle from "../../hooks/useThrottle";

// Mock timer functions
jest.useFakeTimers();

interface TestComponentProps {
  initialValue: number;
  limit: number;
}

// A test component that uses the hook
const TestComponent: FC<TestComponentProps> = ({ initialValue, limit }) => {
  const [value, setValue] = useState<number>(initialValue);
  const throttled = useThrottle<number>(value, limit);

  return (
    <div>
      <div data-testid="current-value">Current: {value}</div>
      <div data-testid="throttled-value">Throttled: {throttled.value}</div>
      <div data-testid="error">{throttled.error?.message || "No error"}</div>
      <button data-testid="increment" onClick={() => setValue((v) => v + 1)}>
        Increment
      </button>
      <button data-testid="reset" onClick={() => setValue(initialValue)}>
        Reset
      </button>
    </div>
  );
};

describe("useThrottle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test("should return initial value immediately", () => {
    render(<TestComponent initialValue={0} limit={500} />);

    expect(screen.getByTestId("current-value").textContent).toBe("Current: 0");
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 0"
    );
    expect(screen.getByTestId("error").textContent).toBe("No error");
  });

  test("should not update throttled value before limit duration", () => {
    render(<TestComponent initialValue={0} limit={500} />);

    // Update value multiple times rapidly
    act(() => {
      fireEvent.click(screen.getByTestId("increment")); // value = 1
    });

    // Current value should update immediately
    expect(screen.getByTestId("current-value").textContent).toBe("Current: 1");

    // Throttled value should not change yet
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 0"
    );

    // Update a few more times
    act(() => {
      fireEvent.click(screen.getByTestId("increment")); // value = 2
      fireEvent.click(screen.getByTestId("increment")); // value = 3
    });

    // Current value should update immediately
    expect(screen.getByTestId("current-value").textContent).toBe("Current: 3");

    // But throttled value should still be the initial value
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 0"
    );

    // Fast-forward time, but not quite to the limit
    act(() => {
      jest.advanceTimersByTime(499);
    });

    // Throttled value should still not be updated
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 0"
    );
  });

  test("should update throttled value after limit duration", () => {
    render(<TestComponent initialValue={0} limit={500} />);

    // Update value
    act(() => {
      fireEvent.click(screen.getByTestId("increment")); // value = 1
    });

    // Fast-forward time just past the limit
    act(() => {
      jest.advanceTimersByTime(501);
    });

    // Throttled value should now match current value
    expect(screen.getByTestId("current-value").textContent).toBe("Current: 1");
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 1"
    );
  });

  test("should update throttled value at most once per limit period", () => {
    render(<TestComponent initialValue={0} limit={500} />);

    // Update value multiple times
    act(() => {
      fireEvent.click(screen.getByTestId("increment")); // value = 1
      jest.advanceTimersByTime(100);

      fireEvent.click(screen.getByTestId("increment")); // value = 2
      jest.advanceTimersByTime(100);

      fireEvent.click(screen.getByTestId("increment")); // value = 3
      jest.advanceTimersByTime(100);
    });

    // We're now 300ms in, throttled value should still be initial
    expect(screen.getByTestId("current-value").textContent).toBe("Current: 3");
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 0"
    );

    // Advance to 501ms (just after first threshold)
    act(() => {
      jest.advanceTimersByTime(201);
    });

    // Throttled value should update to the latest value at that point (3)
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 3"
    );

    // Make more updates
    act(() => {
      fireEvent.click(screen.getByTestId("increment")); // value = 4
      jest.advanceTimersByTime(100);

      fireEvent.click(screen.getByTestId("increment")); // value = 5
    });

    // Throttled value should still be 3 (not enough time has passed)
    expect(screen.getByTestId("current-value").textContent).toBe("Current: 5");
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 3"
    );

    // Advance time to just after next threshold (501ms + 500ms = 1001ms from start)
    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Now throttled value should be updated to 5
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 5"
    );
  });

  test("should handle changes in the limit value", () => {
    const DynamicLimitComponent: FC = () => {
      const [value, setValue] = useState<number>(0);
      const [limit, setLimit] = useState<number>(500);
      const throttled = useThrottle<number>(value, limit);

      return (
        <div>
          <div data-testid="current-value">Current: {value}</div>
          <div data-testid="throttled-value">Throttled: {throttled.value}</div>
          <div data-testid="limit">Limit: {limit}</div>
          <button
            data-testid="increment"
            onClick={() => setValue((v) => v + 1)}
          >
            Increment
          </button>
          <button
            data-testid="decrease-limit"
            onClick={() => setLimit((l) => l / 2)}
          >
            Decrease Limit
          </button>
          <button
            data-testid="increase-limit"
            onClick={() => setLimit((l) => l * 2)}
          >
            Increase Limit
          </button>
        </div>
      );
    };

    render(<DynamicLimitComponent />);

    // Initial values
    expect(screen.getByTestId("current-value").textContent).toBe("Current: 0");
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 0"
    );
    expect(screen.getByTestId("limit").textContent).toBe("Limit: 500");

    // Increment value
    act(() => {
      fireEvent.click(screen.getByTestId("increment")); // value = 1
    });

    // Decrease limit to 250ms
    act(() => {
      fireEvent.click(screen.getByTestId("decrease-limit"));
    });

    expect(screen.getByTestId("limit").textContent).toBe("Limit: 250");

    // Advance time past the new limit
    act(() => {
      jest.advanceTimersByTime(251);
    });

    // Throttled value should update with the new shorter limit
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 1"
    );

    // Increment again
    act(() => {
      fireEvent.click(screen.getByTestId("increment")); // value = 2
    });

    // Increase limit to 500ms
    act(() => {
      fireEvent.click(screen.getByTestId("increase-limit"));
    });

    expect(screen.getByTestId("limit").textContent).toBe("Limit: 500");

    // Advance time past the old limit but not the new one
    act(() => {
      jest.advanceTimersByTime(251);
    });

    // Throttled value should not update yet due to the increased limit
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 1"
    );

    // Advance to the new limit
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // Now throttled value should update
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 2"
    );
  });

  test("should use the default limit value when no limit is provided", () => {
    const DefaultLimitComponent: FC = () => {
      const [value, setValue] = useState<number>(0);
      // Using default limit (500ms)
      const throttled = useThrottle<number>(value);

      return (
        <div>
          <div data-testid="current-value">Current: {value}</div>
          <div data-testid="throttled-value">Throttled: {throttled.value}</div>
          <button
            data-testid="increment"
            onClick={() => setValue((v) => v + 1)}
          >
            Increment
          </button>
        </div>
      );
    };

    render(<DefaultLimitComponent />);

    // Increment value
    act(() => {
      fireEvent.click(screen.getByTestId("increment")); // value = 1
    });

    // Current value should update immediately
    expect(screen.getByTestId("current-value").textContent).toBe("Current: 1");
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 0"
    );

    // Advance time just past the default limit (500ms)
    act(() => {
      jest.advanceTimersByTime(501);
    });

    // Throttled value should now be updated
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 1"
    );
  });

  test("should clean up timeout on unmount", () => {
    const { unmount } = render(<TestComponent initialValue={0} limit={500} />);

    // Spy on clearTimeout
    const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");

    // Increment value to trigger the effect
    act(() => {
      fireEvent.click(screen.getByTestId("increment"));
    });

    // Unmount component
    unmount();

    // Should have called clearTimeout
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  test("should not update throttled value if the input value doesn't change", () => {
    render(<TestComponent initialValue={5} limit={500} />);

    // Initial values
    expect(screen.getByTestId("current-value").textContent).toBe("Current: 5");
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 5"
    );

    // Reset to same value
    act(() => {
      fireEvent.click(screen.getByTestId("reset")); // resets to 5
    });

    // Advance time past the limit
    act(() => {
      jest.advanceTimersByTime(501);
    });

    // Values should remain the same
    expect(screen.getByTestId("current-value").textContent).toBe("Current: 5");
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 5"
    );
  });

  test("should handle updates at exact limit boundaries", () => {
    render(<TestComponent initialValue={0} limit={500} />);

    // Update value
    act(() => {
      fireEvent.click(screen.getByTestId("increment")); // value = 1
    });

    // Advance time exactly to the limit
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Throttled value should now be updated
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 1"
    );

    // Update value again
    act(() => {
      fireEvent.click(screen.getByTestId("increment")); // value = 2
    });

    // Advance time exactly to the limit again
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Throttled value should be updated again
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 2"
    );
  });

  test("should update throttled value when time elapsed is exactly equal to limit", () => {
    // Mock Date.now to have precise control
    const originalDateNow = Date.now;
    let currentTime = 1000;
    Date.now = jest.fn(() => currentTime);

    render(<TestComponent initialValue={0} limit={500} />);

    // Initial time is 1000, lastRan is also initialized to 1000
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 0"
    );

    // Update value
    act(() => {
      fireEvent.click(screen.getByTestId("increment")); // value = 1
    });

    // Set current time to exactly limit milliseconds after initial
    currentTime = 1500; // 1000 + 500 (limit)

    // Advance timer
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Throttled value should update since exactly 500ms has passed
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 1"
    );

    // Restore original Date.now
    Date.now = originalDateNow;
  });

  test("should cover both branches of the timing condition", () => {
    // Mock Date.now to have precise control
    const originalDateNow = Date.now;
    let currentTime = 1000;
    Date.now = jest.fn(() => currentTime);

    render(<TestComponent initialValue={0} limit={500} />);

    // Initial value
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 0"
    );

    // Update value
    act(() => {
      fireEvent.click(screen.getByTestId("increment")); // value = 1
    });

    // Case 1: Time elapsed is LESS than limit (should NOT update throttled value)
    currentTime = 1499; // Just 1ms less than limit

    // Advance timer
    act(() => {
      jest.advanceTimersByTime(499);
    });

    // Throttled value should NOT update
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 0"
    );

    // Case 2: Time elapsed is MORE than limit (should update throttled value)
    currentTime = 1501; // Just 1ms more than limit

    // Advance timer slightly more
    act(() => {
      jest.advanceTimersByTime(2);
    });

    // Throttled value should now update
    expect(screen.getByTestId("throttled-value").textContent).toBe(
      "Throttled: 1"
    );

    // Restore original Date.now
    Date.now = originalDateNow;
  });

  // Approach with manual timer control
  test("should specifically test the condition boundary", () => {
    jest.useFakeTimers();

    // Create a component with controlled props
    const ThrottleTestComponent = () => {
      const [count, setCount] = useState(0);
      const throttled = useThrottle(count, 500);

      return (
        <div>
          <div data-testid="original">{count}</div>
          <div data-testid="throttled">{throttled.value}</div>
          <button
            data-testid="increment"
            onClick={() => setCount((c) => c + 1)}
          >
            Increment
          </button>
        </div>
      );
    };

    // Render component
    render(<ThrottleTestComponent />);

    // Initial state
    expect(screen.getByTestId("original").textContent).toBe("0");
    expect(screen.getByTestId("throttled").textContent).toBe("0");

    // Click to increment count
    act(() => {
      fireEvent.click(screen.getByTestId("increment"));
    });

    // Original updates, throttled doesn't
    expect(screen.getByTestId("original").textContent).toBe("1");
    expect(screen.getByTestId("throttled").textContent).toBe("0");

    // Advance time to JUST BEFORE the limit (499ms)
    act(() => {
      jest.advanceTimersByTime(499);
    });

    // Throttled still doesn't update
    expect(screen.getByTestId("throttled").textContent).toBe("0");

    // Advance time by just 1ms more to hit the 500ms limit
    act(() => {
      jest.advanceTimersByTime(1);
    });

    // Now the throttled value should update
    expect(screen.getByTestId("throttled").textContent).toBe("1");

    // Reset timers
    jest.useRealTimers();
  });

  test("should specifically cover the false branch of the time condition", () => {
    // Mock Date.now for precise control
    const realDateNow = Date.now;
    let mockTime = 1000;

    // Mock implementation that returns controlled values
    Date.now = jest
      .fn()
      .mockImplementationOnce(() => 1000) // Initial setup
      .mockImplementationOnce(() => 1000) // For useRef initialization
      .mockImplementationOnce(() => 1100) // First check - should be < limit
      .mockImplementationOnce(() => 1100) // For calculating timeout
      .mockImplementationOnce(() => 1100); // Inside the timeout callback

    // Create test component that will trigger the useThrottle hook
    const TimeConditionComponent = () => {
      const [value, setValue] = useState(1);
      const throttled = useThrottle(value, 500);

      return (
        <div>
          <div data-testid="value">{value}</div>
          <div data-testid="throttled">{throttled.value}</div>
          <button
            data-testid="increment"
            onClick={() => setValue((v) => v + 1)}
          >
            Increment
          </button>
        </div>
      );
    };

    try {
      // Render and verify initial state
      render(<TimeConditionComponent />);

      // Verify initial values
      expect(screen.getByTestId("value").textContent).toBe("1");
      expect(screen.getByTestId("throttled").textContent).toBe("1");

      // Update the value, which will trigger the effect
      act(() => {
        fireEvent.click(screen.getByTestId("increment"));
      });

      // Fast-forward a small amount of time (less than limit)
      act(() => {
        jest.advanceTimersByTime(100); // Only 100ms, less than 500ms limit
      });

      // Value should update, but throttled value should not
      expect(screen.getByTestId("value").textContent).toBe("2");
      expect(screen.getByTestId("throttled").textContent).toBe("1");
    } finally {
      // Clean up mocks
      Date.now = realDateNow;
    }
  });

  test("should handle errors gracefully", () => {
    // Mock Date.now to throw error only once, then return a normal value
    const originalDateNow = Date.now;
    let callCount = 0;

    Date.now = jest.fn().mockImplementation(() => {
      if (callCount === 0) {
        callCount++;
        throw new Error("Simulated error");
      }
      return 1000; // Return a stable timestamp for subsequent calls
    });

    // Create a component that uses the hook
    const ErrorComponent: FC = () => {
      const [value, setValue] = useState(0);
      const throttled = useThrottle(value, 500);

      return (
        <div>
          <div data-testid="value">{value}</div>
          <div data-testid="throttled">{throttled.value}</div>
          <div data-testid="error">
            {throttled.error?.message || "No error"}
          </div>
          <button
            data-testid="increment"
            onClick={() => setValue((v) => v + 1)}
          >
            Increment
          </button>
        </div>
      );
    };

    try {
      // Render and check for error
      render(<ErrorComponent />);

      // Should have an error and still provide a value
      expect(screen.getByTestId("error").textContent).toBe("Simulated error");
      expect(screen.getByTestId("throttled").textContent).toBe("0");
    } finally {
      // Restore original Date.now
      Date.now = originalDateNow;
    }
  });

  test("should handle errors during effect execution", () => {
    // First let the component render normally
    const EffectErrorComponent: FC = () => {
      const [value, setValue] = useState(0);
      const throttled = useThrottle(value, 500);

      return (
        <div>
          <div data-testid="value">{value}</div>
          <div data-testid="throttled">{throttled.value}</div>
          <div data-testid="error">
            {throttled.error?.message || "No error"}
          </div>
          <button
            data-testid="increment"
            onClick={() => {
              // Set up Date.now to throw on the next few calls
              const originalDateNow = Date.now;
              let errorCallCount = 0;

              Date.now = jest.fn().mockImplementation(() => {
                if (errorCallCount < 2) {
                  // Only throw for the first two calls
                  errorCallCount++;
                  throw new Error("Effect execution error");
                }
                return originalDateNow();
              });

              // Increment to trigger effect
              setValue((v) => v + 1);

              // Schedule restoration of Date.now to avoid affecting other tests
              setTimeout(() => {
                Date.now = originalDateNow;
              }, 0);
            }}
          >
            Increment
          </button>
        </div>
      );
    };

    render(<EffectErrorComponent />);

    // Initially no error
    expect(screen.getByTestId("error").textContent).toBe("No error");

    // Click to cause Date.now to throw during effect
    act(() => {
      fireEvent.click(screen.getByTestId("increment"));
    });

    // Fast-forward timers to execute effect
    act(() => {
      jest.advanceTimersByTime(10);
    });

    // Should show the error
    expect(screen.getByTestId("error").textContent).toBe(
      "Effect execution error"
    );
  });
});
