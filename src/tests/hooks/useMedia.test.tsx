import React, { FC } from "react";
import { act, render, screen } from "@testing-library/react";
import useMedia from "../../hooks/useMedia";

interface TestComponentProps {
  query: string;
  defaultValue?: boolean;
}

// A test component that uses the hook
const TestComponent: FC<TestComponentProps> = ({ query, defaultValue }) => {
  const { isMatching, error } = useMedia(query, { defaultValue });

  return (
    <div>
      <div data-testid="matches">
        {isMatching ? "Media query matches" : "Media query does not match"}
      </div>
      <div data-testid="query">Current query: {query}</div>
      {error && <div data-testid="error">{error.message}</div>}
    </div>
  );
};

describe("useMedia", () => {
  // Store the original implementation
  const _originalMatchMedia = window.matchMedia;
  let originalWindow: Window | undefined;

  // Mock implementation to use for tests
  let _mockMatchMedia: jest.Mock;
  let listeners: Array<() => void> = [];

  beforeAll(() => {
    // Spy on the original implementation instead of replacing it
    jest.spyOn(window, "matchMedia");
  });

  afterAll(() => {
    // Restore all mocks when done
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    // Store original window
    originalWindow = global.window;
    listeners = [];
  });

  afterEach(() => {
    // Only try to reset matchMedia if window exists (handles SSR test)
    if (typeof window !== "undefined" && window.matchMedia) {
      try {
        (window.matchMedia as jest.Mock).mockReset();
      } catch (_) {
        // Ignore errors during cleanup
      }
    }

    // Instead of directly assigning, use Object.defineProperty
    if (originalWindow) {
      Object.defineProperty(global, "window", {
        value: originalWindow,
        writable: true,
        configurable: true,
      });
    }
  });

  test("should use matchMedia result when available", () => {
    // Mock matchMedia to return true
    (window.matchMedia as jest.Mock).mockImplementation(() => ({
      matches: true,
      media: "(min-width: 600px)",
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<TestComponent query="(min-width: 600px)" defaultValue={false} />);

    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query matches"
    );
    // No error should be present
    expect(screen.queryByTestId("error")).toBeNull();
  });

  test("should update when media query changes", () => {
    // Create a media query list mock
    const mockMql = {
      matches: false,
      media: "(min-width: 600px)",
      addEventListener: jest.fn((event, listener) => {
        listeners.push(listener);
      }),
      removeEventListener: jest.fn(),
    };

    (window.matchMedia as jest.Mock).mockImplementation(() => mockMql);

    render(<TestComponent query="(min-width: 600px)" defaultValue={false} />);

    // Initial state should be false
    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query does not match"
    );

    // Simulate media query change
    mockMql.matches = true;

    // Call all listeners to simulate the change event
    act(() => {
      listeners.forEach((listener) => listener());
    });

    // State should be updated
    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query matches"
    );
  });

  test("should handle matchMedia API not being available", () => {
    // Mock implementation that returns undefined when accessed
    (window.matchMedia as jest.Mock).mockImplementation(() => {
      // This simulates matchMedia not being available - throws when used
      throw new Error("matchMedia is not implemented");
    });

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<TestComponent query="(min-width: 600px)" defaultValue={false} />);

    // Should use default state
    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query does not match"
    );

    // Should have an error
    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByTestId("error").textContent).toContain(
      "Error setting up media query"
    );

    consoleErrorSpy.mockRestore();
  });

  test("should handle errors in matchMedia", () => {
    // Mock matchMedia to throw an error
    (window.matchMedia as jest.Mock).mockImplementation(() => {
      throw new Error("Failed to initialize matchMedia");
    });

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<TestComponent query="(min-width: 600px)" defaultValue={true} />);

    // Should use default state
    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query matches"
    );

    // Should have an error
    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByTestId("error").textContent).toContain(
      "Error setting up media query"
    );

    consoleErrorSpy.mockRestore();
  });

  test("should support older browsers with addListener/removeListener", () => {
    // Mock matchMedia to use older API
    const mockMql = {
      matches: false,
      media: "(min-width: 600px)",
      addListener: jest.fn((listener) => {
        listeners.push(listener);
      }),
      removeListener: jest.fn(),
    };

    (window.matchMedia as jest.Mock).mockImplementation(() => mockMql);

    const { unmount } = render(
      <TestComponent query="(min-width: 600px)" defaultValue={false} />
    );

    // Check that listeners are added with the old API
    expect(mockMql.addListener).toHaveBeenCalled();

    // Unmount to check cleanup
    unmount();

    // Check that listeners are removed with the old API
    expect(mockMql.removeListener).toHaveBeenCalled();
  });

  test("should clean up event listeners on unmount", () => {
    // Mock matchMedia with modern API
    const mockMql = {
      matches: false,
      media: "(min-width: 600px)",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    (window.matchMedia as jest.Mock).mockImplementation(() => mockMql);

    const { unmount } = render(
      <TestComponent query="(min-width: 600px)" defaultValue={false} />
    );

    // Check that listeners are added
    expect(mockMql.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );

    // Unmount component
    unmount();

    // Check that listeners are removed
    expect(mockMql.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  test("should handle when media query prop changes", () => {
    let shouldMatch = false;

    (window.matchMedia as jest.Mock).mockImplementation(() => {
      // Return an object with a getter for matches that uses our current control value
      return {
        get matches() {
          return shouldMatch;
        },
        media: "(min-width: 600px)",
        addEventListener: jest.fn((event, listener) => {
          listeners.push(listener);
        }),
        removeEventListener: jest.fn(),
      };
    });

    // Initial render with shouldMatch = false
    const { rerender } = render(
      <TestComponent query="(min-width: 600px)" defaultValue={false} />
    );

    // First render should not match
    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query does not match"
    );

    shouldMatch = true;

    rerender(
      <TestComponent query="(min-width: 1200px)" defaultValue={false} />
    );

    // Force update via listeners to ensure state is refreshed
    act(() => {
      listeners.forEach((listener) => listener());
    });

    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query matches"
    );
  });

  test("should handle invalid media queries", () => {
    // Mock matchMedia to throw a specific error for invalid queries
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => {
      if (query === "invalid-query") {
        throw new Error("Invalid media query");
      }

      return {
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
    });

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<TestComponent query="invalid-query" defaultValue={true} />);

    // Should use default state
    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query matches"
    );

    // Should show error
    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByTestId("error").textContent).toContain(
      "Error setting up media query"
    );

    consoleErrorSpy.mockRestore();
  });

  test("should handle defaultValue correctly when it changes", () => {
    // Mock matchMedia to always throw an error so we rely on defaultValue
    (window.matchMedia as jest.Mock).mockImplementation(() => {
      throw new Error("matchMedia error");
    });

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Initial render with defaultValue=false
    const { unmount } = render(
      <TestComponent query="(min-width: 600px)" defaultValue={false} />
    );

    // Should use initial default state (false)
    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query does not match"
    );

    // Clean up and start fresh for next render
    unmount();

    // Render again with defaultValue=true
    render(<TestComponent query="(min-width: 600px)" defaultValue={true} />);

    // Should use new default state (true)
    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query matches"
    );

    consoleErrorSpy.mockRestore();
  });

  test("should handle server-side rendering by using defaultValue", () => {
    // Mock matchMedia to throw an error when accessed (which tests the SSR path indirectly)
    (window.matchMedia as jest.Mock).mockImplementation(() => {
      throw new Error("matchMedia not available (simulating SSR)");
    });

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Render with defaultValue=true, which should be used when matchMedia is not available
    render(<TestComponent query="(min-width: 600px)" defaultValue={true} />);

    // In "SSR-like" environment (no matchMedia), the component should still render with defaultValue
    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query matches"
    );

    consoleErrorSpy.mockRestore();
  });

  test("should handle errors when adding event listeners", () => {
    // Mock matchMedia to return an object that throws when addEventListener is called
    const mockMql = {
      matches: false, // Initial match state is false
      media: "(min-width: 600px)",
      addEventListener: jest.fn().mockImplementation(() => {
        throw new Error("Failed to add listener");
      }),
      removeEventListener: jest.fn(),
    };

    (window.matchMedia as jest.Mock).mockImplementation(() => mockMql);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<TestComponent query="(min-width: 600px)" defaultValue={false} />);

    expect(screen.getByTestId("matches")).toBeInTheDocument();

    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByTestId("error").textContent).toContain(
      "Failed to add media query listener"
    );

    consoleErrorSpy.mockRestore();
  });

  test("should handle nested errors and preserve matches state", () => {
    // First test the initial state without error
    let mockMqlRef = {
      matches: true, // Set initial matches to true
      media: "(min-width: 600px)",
      addEventListener: jest.fn((event, listener) => {
        listeners.push(listener);
      }),
      removeEventListener: jest.fn(),
    };

    // First return a working mock, then on second call return one that throws
    (window.matchMedia as jest.Mock).mockImplementation(() => mockMqlRef);

    const { rerender } = render(
      <TestComponent query="(min-width: 600px)" defaultValue={false} />
    );

    // Initial state should be true based on the mockMql
    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query matches"
    );

    // Now change the mock to one that fails when adding a listener
    mockMqlRef = {
      matches: true, // Keep matches as true
      media: "(min-width: 1200px)",
      addEventListener: jest.fn().mockImplementation(() => {
        throw new Error("Failed to add listener for second query");
      }),
      removeEventListener: jest.fn(),
    };

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Rerender with a different query to trigger the effect
    rerender(
      <TestComponent query="(min-width: 1200px)" defaultValue={false} />
    );

    // Verify the matches state is preserved (should still be true)
    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query matches"
    );

    // And error should be present
    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByTestId("error").textContent).toContain(
      "Failed to add media query listener"
    );

    consoleErrorSpy.mockRestore();
  });

  // Additional test for branch coverage - matchMedia exists but returns null
  test("should handle initial state when matchMedia exists but returns null", () => {
    // Mock matchMedia to return null instead of redefining the property
    (window.matchMedia as jest.Mock).mockImplementation(() => null);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<TestComponent query="(min-width: 600px)" defaultValue={true} />);

    // Should use the default state
    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query matches"
    );

    // Should have an error
    expect(screen.getByTestId("error")).toBeInTheDocument();
    // The error message might vary, just check that there is an error

    consoleErrorSpy.mockRestore();
  });

  // Test for the branch where neither addEventListener nor addListener is available
  test("should handle when neither addEventListener nor addListener is available", () => {
    // Mock matchMedia to return an object without addEventListener or addListener
    const mockMql = {
      matches: true,
      media: "(min-width: 600px)",
      // No addEventListener or addListener methods
    };

    (window.matchMedia as jest.Mock).mockImplementation(() => mockMql);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<TestComponent query="(min-width: 600px)" defaultValue={false} />);

    // The match state should be based on the initial match value
    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query matches"
    );

    // No error should be shown since we just silently don't add listeners
    // This tests the code path where neither listener method exists
    expect(screen.queryByTestId("error")).toBeNull();

    consoleErrorSpy.mockRestore();
  });

  test("should handle cleanup when effect runs but no event listeners are added", () => {
    // Mock matchMedia to return a minimal object that doesn't have addEventListener or addListener
    // This will test the cleanup function that sets mounted = false
    const mockMql = {
      matches: true,
      media: "(min-width: 600px)",
      // Intentionally not adding addEventListener or addListener
    };

    (window.matchMedia as jest.Mock).mockImplementation(() => mockMql);

    // Mount and immediately unmount to test the cleanup function
    const { unmount } = render(
      <TestComponent query="(min-width: 600px)" defaultValue={false} />
    );

    // The initial state should reflect mockMql.matches
    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query matches"
    );

    // No error should be shown
    expect(screen.queryByTestId("error")).toBeNull();

    // Unmount to trigger cleanup
    unmount();

    // There's nothing to assert after unmount, we're just ensuring the cleanup code runs
    // This test is successful if it doesn't throw any errors
  });

  test("should use defaultValue when window is undefined during initialization", () => {
    // Create a mock for useState that captures the initializer function
    const useStateMock = jest.fn().mockImplementation((initializer) => {
      // Execute the initializer function with a mocked window context
      const originalWindow = window;
      const getWindowValue = Object.getOwnPropertyDescriptor(
        global,
        "window"
      )?.get;

      // Mock that window is undefined only during initializer execution
      Object.defineProperty(global, "window", {
        get: () => undefined,
        configurable: true,
      });

      // Call the initializer function in the context where window is undefined
      const initialState =
        typeof initializer === "function" ? initializer() : initializer;

      // Restore the original window
      if (getWindowValue) {
        Object.defineProperty(global, "window", {
          get: getWindowValue,
          configurable: true,
        });
      } else {
        Object.defineProperty(global, "window", {
          value: originalWindow,
          configurable: true,
          writable: true,
        });
      }

      // Return the state and a mock setState function
      return [initialState, jest.fn()];
    });

    // Apply the mock for this test only
    const originalUseState = React.useState;
    React.useState = useStateMock;

    try {
      // Create test components that use the hook
      const TestDefaultTrue = () => {
        const { isMatching } = useMedia("(min-width: 600px)", {
          defaultValue: true,
        });
        return <div data-testid="result">{isMatching ? "true" : "false"}</div>;
      };

      const TestDefaultFalse = () => {
        const { isMatching } = useMedia("(min-width: 600px)", {
          defaultValue: false,
        });
        return <div data-testid="result">{isMatching ? "true" : "false"}</div>;
      };

      // Render with defaultValue=true
      const { unmount: unmount1 } = render(<TestDefaultTrue />);

      // First call's initializer should return using defaultValue=true
      const firstInitializer = useStateMock.mock.calls[0][0];
      const firstInitialValue = firstInitializer();
      expect(firstInitialValue.isMatching).toBe(true);

      unmount1();

      // Render with defaultValue=false
      const { unmount: unmount2 } = render(<TestDefaultFalse />);

      // Second call's initializer should return using defaultValue=false
      const secondInitializer = useStateMock.mock.calls[1][0];
      const secondInitialValue = secondInitializer();
      expect(secondInitialValue.isMatching).toBe(false);

      unmount2();
    } finally {
      // Restore the original useState
      React.useState = originalUseState;
    }
  });

  test("should handle useEffect when window is undefined", () => {
    // Store original useEffect
    const originalUseEffect = React.useEffect;

    // Define extended mock type for useEffect
    type UseEffectMock = jest.Mock & {
      effectFunction: (...args: any[]) => any;
      effectDeps: any[];
    };

    // Mock useEffect to capture the effect function
    const useEffectMock = jest.fn().mockImplementation((effect, deps) => {
      // Store the effect function for later execution
      (useEffectMock as UseEffectMock).effectFunction = effect;
      (useEffectMock as UseEffectMock).effectDeps = deps;

      // Return a mock cleanup function
      return () => {};
    }) as UseEffectMock;

    // Replace useEffect with our mock
    React.useEffect = useEffectMock as unknown as typeof React.useEffect;

    try {
      // Create a test component
      const TestComponent = () => {
        const { isMatching } = useMedia("(min-width: 600px)", {
          defaultValue: false,
        });
        return <div>{isMatching ? "true" : "false"}</div>;
      };

      // Render the component
      const { unmount } = render(<TestComponent />);

      // Get the effect function that was captured
      const effectFn = useEffectMock.effectFunction;

      // Check that it was called
      expect(useEffectMock).toHaveBeenCalled();

      // Store the original window
      const originalWindow = global.window;

      // Mock window as undefined
      Object.defineProperty(global, "window", {
        get: () => undefined,
        configurable: true,
      });

      // Execute the effect function in a context where window is undefined
      const cleanup = effectFn();

      // The effect should return early with undefined
      expect(cleanup).toBeUndefined();

      // Restore the original window
      Object.defineProperty(global, "window", {
        value: originalWindow,
        configurable: true,
        writable: true,
      });

      // Clean up
      unmount();
    } finally {
      // Restore original useEffect
      React.useEffect = originalUseEffect;
    }
  });

  test("should return a cleanup function that sets mounted to false", () => {
    // Store original useEffect
    const originalUseEffect = React.useEffect;

    // Define extended mock type for useEffect
    type UseEffectMock = jest.Mock & {
      effectFunction: (...args: any[]) => any;
      effectDeps: any[];
    };

    // Mock useEffect to capture the effect function
    const useEffectMock = jest.fn().mockImplementation((effect, deps) => {
      // Store the effect function for later execution
      (useEffectMock as UseEffectMock).effectFunction = effect;
      (useEffectMock as UseEffectMock).effectDeps = deps;

      // Return a mock cleanup function
      return () => {};
    }) as UseEffectMock;

    // Replace useEffect with our mock
    React.useEffect = useEffectMock as unknown as typeof React.useEffect;

    try {
      // Create a test component
      const TestComponent = () => {
        const { isMatching } = useMedia("(min-width: 600px)", {
          defaultValue: false,
        });
        return <div>{isMatching ? "true" : "false"}</div>;
      };

      // Render the component
      const { unmount } = render(<TestComponent />);

      // Get the effect function that was captured
      const effectFn = useEffectMock.effectFunction;

      // Check that it was called
      expect(useEffectMock).toHaveBeenCalled();

      // Execute the effect function
      const cleanup = effectFn();

      // If there are no listeners or the code in between doesn't run,
      // it should still return a function that sets mounted = false
      expect(typeof cleanup).toBe("function");

      // Execute the cleanup function - this would set mounted = false
      // We can't directly test that it was set, but we can verify it executes
      cleanup();

      // Clean up
      unmount();
    } finally {
      // Restore original useEffect
      React.useEffect = originalUseEffect;
    }
  });

  test("should handle the final cleanup function path", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Mock matchMedia to return an object without listener methods
    const mockMql = {
      matches: true,
      media: "(min-width: 600px)",
      // Intentionally not including addEventListener or addListener
    };

    (window.matchMedia as jest.Mock).mockImplementation(() => mockMql);

    // Render with the mock object that has no listeners
    const { unmount } = render(
      <TestComponent query="(min-width: 600px)" defaultValue={false} />
    );

    // Initial state should reflect mockMql.matches
    expect(screen.getByTestId("matches").textContent).toBe(
      "Media query matches"
    );

    // No error should be shown when there are no listener methods
    expect(screen.queryByTestId("error")).toBeNull();

    // Unmount to trigger cleanup
    unmount();

    // Clean up spy
    consoleErrorSpy.mockRestore();
  });
});
