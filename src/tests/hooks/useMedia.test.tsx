import React, { FC } from "react";
import { render, screen, act } from "@testing-library/react";
import useMedia from "../../hooks/useMedia";
import { MediaError } from "../../hooks/errors";

interface TestComponentProps {
  query: string;
  defaultState?: boolean;
}

// A test component that uses the hook
const TestComponent: FC<TestComponentProps> = ({ query, defaultState }) => {
  const { matches, error } = useMedia(query, defaultState);

  return (
    <div>
      <div data-testid="matches">
        {matches ? "Media query matches" : "Media query does not match"}
      </div>
      {error && <div data-testid="error">{error.message}</div>}
    </div>
  );
};

describe("useMedia", () => {
  // Store the original implementation
  const originalMatchMedia = window.matchMedia;

  // Mock implementation to use for tests
  let mockMatchMedia: jest.Mock;
  let listeners: Array<(event?: MediaQueryListEvent) => void> = [];

  beforeAll(() => {
    // Spy on the original implementation instead of replacing it
    jest.spyOn(window, "matchMedia");
  });

  afterAll(() => {
    // Restore all mocks when done
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    // Reset listeners for each test
    listeners = [];
  });

  afterEach(() => {
    // Clear mocks between tests
    (window.matchMedia as jest.Mock).mockReset();
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

    render(<TestComponent query="(min-width: 600px)" defaultState={false} />);

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

    render(<TestComponent query="(min-width: 600px)" defaultState={false} />);

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
    // Save original implementation
    const originalMatchMedia = window.matchMedia;

    // Mock implementation that returns undefined when accessed
    (window.matchMedia as jest.Mock).mockImplementation(() => {
      // This simulates matchMedia not being available - throws when used
      throw new Error("matchMedia is not implemented");
    });

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<TestComponent query="(min-width: 600px)" defaultState={false} />);

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

    render(<TestComponent query="(min-width: 600px)" defaultState={true} />);

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
      <TestComponent query="(min-width: 600px)" defaultState={false} />
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
      <TestComponent query="(min-width: 600px)" defaultState={false} />
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
});
