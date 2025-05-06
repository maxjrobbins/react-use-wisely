import React, { FC, CSSProperties } from "react";
import { render, screen, act } from "@testing-library/react";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

// Mock the browser utilities module for specific tests
jest.mock("../../utils/browser", () => {
  const originalModule = jest.requireActual("../../utils/browser");
  return {
    ...originalModule,
    features: {
      ...originalModule.features,
      mediaQueries: jest.fn().mockReturnValue(true), // Default to supported
    },
  };
});

// A test component that uses the hook
const TestComponent: FC = () => {
  const {
    value: prefersReducedMotion,
    isSupported,
    error,
  } = usePrefersReducedMotion();

  const animationStyle: CSSProperties = {
    padding: "10px",
    transition: prefersReducedMotion ? "none" : "all 0.5s ease-in-out",
    backgroundColor: "lightblue",
  };

  return (
    <div>
      <div data-testid="preference">
        {prefersReducedMotion
          ? "Prefers reduced motion"
          : "No preference for reduced motion"}
      </div>
      <div data-testid="support-status">
        {isSupported
          ? "MediaQuery API is supported"
          : "MediaQuery API is not supported"}
      </div>
      {error && <div data-testid="error-message">{error.message}</div>}
      <div data-testid="animation-example" style={animationStyle}>
        Animation Example
      </div>
    </div>
  );
};

interface MediaQueryListMock {
  matches: boolean;
  media: string;
  listeners?: {
    change: Array<(event: MediaQueryListEvent) => void>;
  };
  addEventListener?: jest.Mock;
  removeEventListener?: jest.Mock;
  addListener?: jest.Mock;
  removeListener?: jest.Mock;
}

describe("usePrefersReducedMotion", () => {
  // Save original implementation and create spy
  let matchMediaSpy: jest.SpyInstance;

  // Import the mocked features for manipulation in tests
  const browserUtils = require("../../utils/browser");

  beforeEach(() => {
    // Reset mock to default behavior
    browserUtils.features.mediaQueries.mockReturnValue(true);

    // Create a spy on window.matchMedia
    matchMediaSpy = jest.spyOn(window, "matchMedia");
  });

  afterEach(() => {
    // Restore original implementation
    matchMediaSpy.mockRestore();
    jest.clearAllMocks();
  });

  test("should return false when prefers-reduced-motion is not set", () => {
    // Mock implementation for this test
    matchMediaSpy.mockImplementation((query) => {
      return {
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      };
    });

    render(<TestComponent />);

    expect(screen.getByTestId("preference").textContent).toBe(
      "No preference for reduced motion"
    );
    expect(screen.getByTestId("support-status").textContent).toBe(
      "MediaQuery API is supported"
    );
    expect(screen.getByTestId("animation-example").style.transition).toBe(
      "all 0.5s ease-in-out"
    );
  });

  test("should respond to changes in the media query", () => {
    // Create a mockMatchMedia with event handlers
    const mediaQueryListMock: MediaQueryListMock = {
      matches: false,
      media: "(prefers-reduced-motion: reduce)",
      listeners: {
        change: [],
      },
      addEventListener: jest.fn((event, listener) => {
        if (event === "change" && mediaQueryListMock.listeners) {
          mediaQueryListMock.listeners.change.push(listener);
        }
      }),
      removeEventListener: jest.fn((event, listener) => {
        if (event === "change" && mediaQueryListMock.listeners) {
          mediaQueryListMock.listeners.change =
            mediaQueryListMock.listeners.change.filter((l) => l !== listener);
        }
      }),
      // For older browsers
      addListener: jest.fn((listener) => {
        if (mediaQueryListMock.listeners) {
          mediaQueryListMock.listeners.change.push(listener);
        }
      }),
      removeListener: jest.fn((listener) => {
        if (mediaQueryListMock.listeners) {
          mediaQueryListMock.listeners.change =
            mediaQueryListMock.listeners.change.filter((l) => l !== listener);
        }
      }),
    };

    // Use the spy approach instead of direct assignment
    matchMediaSpy.mockImplementation(() => mediaQueryListMock);

    render(<TestComponent />);

    // Initial state
    expect(screen.getByTestId("preference").textContent).toBe(
      "No preference for reduced motion"
    );

    // Simulate a change in the preference
    act(() => {
      // Change the mock's matches property
      mediaQueryListMock.matches = true;

      // Call all change listeners
      if (mediaQueryListMock.listeners) {
        mediaQueryListMock.listeners.change.forEach((listener) => {
          // Create a mock event object
          const mockEvent = { matches: true } as MediaQueryListEvent;
          listener(mockEvent);
        });
      }
    });

    // Preference should be updated
    expect(screen.getByTestId("preference").textContent).toBe(
      "Prefers reduced motion"
    );
  });

  test("should handle older browsers with addListener/removeListener", () => {
    // Mock matchMedia with only the older API
    const mediaQueryListMock: MediaQueryListMock = {
      matches: false,
      media: "(prefers-reduced-motion: reduce)",
      listeners: {
        change: [],
      },
      addListener: jest.fn((listener) => {
        if (mediaQueryListMock.listeners) {
          mediaQueryListMock.listeners.change.push(listener);
        }
      }),
      removeListener: jest.fn((listener) => {
        if (mediaQueryListMock.listeners) {
          mediaQueryListMock.listeners.change =
            mediaQueryListMock.listeners.change.filter((l) => l !== listener);
        }
      }),
    };

    // Use mockImplementation correctly
    matchMediaSpy.mockImplementation(() => mediaQueryListMock);

    const { unmount } = render(<TestComponent />);

    // Verify addListener was called
    expect(mediaQueryListMock.addListener).toHaveBeenCalled();

    // Simulate a change
    act(() => {
      mediaQueryListMock.matches = true;
      if (mediaQueryListMock.listeners) {
        mediaQueryListMock.listeners.change.forEach((listener) => {
          // Create a mock event object
          const mockEvent = { matches: true } as MediaQueryListEvent;
          listener(mockEvent);
        });
      }
    });

    expect(screen.getByTestId("preference").textContent).toBe(
      "Prefers reduced motion"
    );

    // Unmount
    unmount();

    // Verify removeListener was called
    expect(mediaQueryListMock.removeListener).toHaveBeenCalled();
  });

  test("should handle browser without matchMedia", () => {
    // Mock that feature detection returns false (unsupported)
    browserUtils.features.mediaQueries.mockReturnValue(false);

    // Even with this mock, the component should render with default values
    matchMediaSpy.mockImplementation(() => ({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    render(<TestComponent />);

    // Should show that the API is not supported
    expect(screen.getByTestId("support-status").textContent).toBe(
      "MediaQuery API is not supported"
    );

    // Default to false when matchMedia is not available
    expect(screen.getByTestId("preference").textContent).toBe(
      "No preference for reduced motion"
    );
  });

  test("should clean up event listeners on unmount", () => {
    // Mock modern matchMedia
    const removeEventListenerMock = jest.fn();

    // Use mockImplementation correctly
    matchMediaSpy.mockImplementation(() => ({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: removeEventListenerMock,
    }));

    const { unmount } = render(<TestComponent />);

    // Unmount component
    unmount();

    // Event listener should be removed
    expect(removeEventListenerMock).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  test("should handle API errors gracefully", () => {
    // Mock matchMedia to throw an error
    matchMediaSpy.mockImplementation(() => {
      throw new Error("MediaQuery API error");
    });

    render(<TestComponent />);

    // Should show error message - check if it exists in the document
    const errorElement = screen.queryByTestId("error-message");
    expect(errorElement).not.toBeNull();

    // Should still provide a default value
    expect(screen.getByTestId("preference").textContent).toBe(
      "No preference for reduced motion"
    );
  });
});
