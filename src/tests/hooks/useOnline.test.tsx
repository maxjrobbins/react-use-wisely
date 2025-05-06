import React, { FC } from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import useOnline from "../../hooks/useOnline";
import { features } from "../../utils/browser";

// Mock the browser utility module
jest.mock("../../utils/browser", () => ({
  features: {
    online: jest.fn().mockReturnValue(true),
  },
  runInBrowser: jest.fn((browserFn) => browserFn()),
}));

// A test component that uses the hook
const TestComponent: FC<{ options?: any }> = ({ options }) => {
  const { isOnline, error, lastChanged, isSupported, refresh } =
    useOnline(options);

  return (
    <div>
      <div data-testid="status">{isOnline ? "Online" : "Offline"}</div>
      {error && <div data-testid="error">{error.message}</div>}
      {lastChanged && (
        <div data-testid="last-changed">{lastChanged.toISOString()}</div>
      )}
      <div data-testid="supported">
        {isSupported ? "Supported" : "Not Supported"}
      </div>
      <button data-testid="refresh-btn" onClick={() => refresh()}>
        Refresh
      </button>
    </div>
  );
};

describe("useOnline - Basic Functionality", () => {
  // Mock navigator before all tests
  let originalDescriptor: PropertyDescriptor | undefined;

  beforeAll(() => {
    // Save original descriptor
    originalDescriptor = Object.getOwnPropertyDescriptor(
      window.navigator,
      "onLine"
    );

    // Set up mockable navigator.onLine
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      get: jest.fn().mockReturnValue(true),
    });
  });

  afterAll(() => {
    // Restore original navigator.onLine
    if (originalDescriptor) {
      Object.defineProperty(window.navigator, "onLine", originalDescriptor);
    }
  });

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Default to online
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      get: jest.fn().mockReturnValue(true),
    });

    // Reset event listeners to ensure they work correctly
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();

    // Mock setInterval to prevent actual timer setup
    const mockTimer = () => 123;
    mockTimer.__promisify__ = () => Promise.resolve();
    window.setInterval = jest.fn().mockReturnValue(123);
    window.clearInterval = jest.fn();
  });

  test("should return true when navigator.onLine is true", () => {
    // navigator.onLine is already mocked to return true in beforeEach
    render(<TestComponent />);
    expect(screen.getByTestId("status").textContent).toBe("Online");
  });

  test("should return false when navigator.onLine is false", () => {
    // Override the mock to return false
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      get: jest.fn().mockReturnValue(false),
    });

    render(<TestComponent />);
    expect(screen.getByTestId("status").textContent).toBe("Offline");
  });

  test("should update when online event is triggered", () => {
    // Start in offline state
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      get: jest.fn().mockReturnValue(false),
    });

    // Make addEventListener actually call the handler
    window.addEventListener = jest.fn((event, handler) => {
      if (event === "online") {
        // Store the handler to call it later
        (window as any).onlineHandler = handler;
      }
    });

    render(<TestComponent />);
    expect(screen.getByTestId("status").textContent).toBe("Offline");

    // Change to online
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      get: jest.fn().mockReturnValue(true),
    });

    // Trigger the handler directly
    act(() => {
      (window as any).onlineHandler();
    });

    expect(screen.getByTestId("status").textContent).toBe("Online");
    expect(screen.getByTestId("last-changed")).toBeInTheDocument();
  });

  test("should update when offline event is triggered", () => {
    // Make addEventListener actually call the handler
    window.addEventListener = jest.fn((event, handler) => {
      if (event === "offline") {
        // Store the handler to call it later
        (window as any).offlineHandler = handler;
      }
    });

    render(<TestComponent />);
    expect(screen.getByTestId("status").textContent).toBe("Online");

    // Change to offline
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      get: jest.fn().mockReturnValue(false),
    });

    // Trigger the handler directly
    act(() => {
      (window as any).offlineHandler();
    });

    expect(screen.getByTestId("status").textContent).toBe("Offline");
    expect(screen.getByTestId("last-changed")).toBeInTheDocument();
  });

  test("should add and remove event listeners correctly", () => {
    const { unmount } = render(<TestComponent />);

    // Check if event listeners were added
    expect(window.addEventListener).toHaveBeenCalledWith(
      "online",
      expect.any(Function)
    );
    expect(window.addEventListener).toHaveBeenCalledWith(
      "offline",
      expect.any(Function)
    );

    // Unmount component
    unmount();

    // Check if event listeners were removed
    expect(window.removeEventListener).toHaveBeenCalledWith(
      "online",
      expect.any(Function)
    );
    expect(window.removeEventListener).toHaveBeenCalledWith(
      "offline",
      expect.any(Function)
    );
  });

  test("should handle error when determining initial status", () => {
    // Mock navigator.onLine to throw an error
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      get: jest.fn(() => {
        throw new Error("Failed to determine initial online status");
      }),
    });

    // Suppress console errors
    console.error = jest.fn();

    render(<TestComponent />);

    // Should default to online
    expect(screen.getByTestId("status").textContent).toBe("Online");

    // Should display error
    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByTestId("error").textContent).toContain(
      "Failed to determine initial online status"
    );
  });

  test("should report network errors when setting up listeners", () => {
    // Make addEventListener throw an error
    window.addEventListener = jest.fn(() => {
      throw new Error("Failed to add event listener");
    });

    // Suppress console errors
    console.error = jest.fn();

    render(<TestComponent />);

    // Should have error
    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByTestId("error").textContent).toContain(
      "Failed to set up network status listeners"
    );
  });

  test("should indicate when API is not supported", () => {
    // Mock feature detection to return false
    (features.online as jest.Mock).mockReturnValueOnce(false);

    render(<TestComponent />);

    // Should show not supported
    expect(screen.getByTestId("supported").textContent).toBe("Not Supported");

    // Should default to online when not supported
    expect(screen.getByTestId("status").textContent).toBe("Online");
  });

  test("should expose a refresh method that can be called", async () => {
    // Mock fetch for the refresh call
    window.fetch = jest.fn().mockResolvedValueOnce({});

    render(<TestComponent />);

    // Call the refresh method
    await act(async () => {
      fireEvent.click(screen.getByTestId("refresh-btn"));
    });

    // Should have called fetch
    expect(window.fetch).toHaveBeenCalled();
  });
});

describe("useOnline - Ping Functionality", () => {
  // Store original values
  let originalNavigatorOnline: PropertyDescriptor | undefined;
  let originalSetInterval: typeof window.setInterval;
  let originalClearInterval: typeof window.clearInterval;
  let originalFetch: typeof window.fetch;
  let originalConsoleError: typeof console.error;
  let originalSetTimeout: typeof window.setTimeout;
  let originalClearTimeout: typeof window.clearTimeout;

  beforeAll(() => {
    // Save original values
    originalNavigatorOnline = Object.getOwnPropertyDescriptor(
      window.navigator,
      "onLine"
    );
    originalSetInterval = window.setInterval;
    originalClearInterval = window.clearInterval;
    originalFetch = window.fetch;
    originalConsoleError = console.error;
    originalSetTimeout = window.setTimeout;
    originalClearTimeout = window.clearTimeout;

    // Set up mockable navigator.onLine
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      get: jest.fn().mockReturnValue(true),
    });
  });

  afterAll(() => {
    // Restore original values
    if (originalNavigatorOnline) {
      Object.defineProperty(
        window.navigator,
        "onLine",
        originalNavigatorOnline
      );
    }
    window.setInterval = originalSetInterval;
    window.clearInterval = originalClearInterval;
    window.fetch = originalFetch;
    console.error = originalConsoleError;
    window.setTimeout = originalSetTimeout;
    window.clearTimeout = originalClearTimeout;
  });

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Default to online
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      get: jest.fn().mockReturnValue(true),
    });

    // Mock setInterval to return a consistent ID
    window.setInterval = jest.fn().mockReturnValue(123);

    // Mock clearInterval
    window.clearInterval = jest.fn();

    // Mock fetch
    window.fetch = jest.fn().mockResolvedValue({});

    // Mock console.error
    console.error = jest.fn();

    // Mock setTimeout
    window.setTimeout = jest
      .fn()
      .mockReturnValue(456) as unknown as typeof setTimeout;

    // Reset event listeners
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  test("should set up ping interval when hook mounts", () => {
    render(<TestComponent />);

    // Should set up interval for the ping
    expect(window.setInterval).toHaveBeenCalledWith(
      expect.any(Function),
      30000
    );
  });

  test("should clean up ping interval when component unmounts", () => {
    const { unmount } = render(<TestComponent />);

    // Unmount the component
    unmount();

    // Should clear the interval
    expect(window.clearInterval).toHaveBeenCalledWith(123);
  });

  test("should not set up ping when API is not supported", () => {
    // Mock feature detection to return false
    (features.online as jest.Mock).mockReturnValueOnce(false);

    render(<TestComponent />);

    // Should not set up interval
    expect(window.setInterval).not.toHaveBeenCalled();
  });

  test("should update to offline state if fetch fails", async () => {
    // Mock fetch to fail
    window.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    // Render the component
    render(<TestComponent />);

    // Call the refresh method directly
    await act(async () => {
      fireEvent.click(screen.getByTestId("refresh-btn"));
    });

    // Now check if the UI has updated
    expect(screen.getByTestId("status").textContent).toBe("Offline");
    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByTestId("error").textContent).toContain(
      "Connection check failed"
    );
  });

  test("should accept custom pingInterval option", () => {
    render(<TestComponent options={{ pingInterval: 60000 }} />);

    // Should set up interval with custom interval
    expect(window.setInterval).toHaveBeenCalledWith(
      expect.any(Function),
      60000
    );
  });

  test("should accept custom pingEndpoint option", async () => {
    render(
      <TestComponent options={{ pingEndpoint: "https://example.com/ping" }} />
    );

    // Call refresh to trigger fetch
    await act(async () => {
      fireEvent.click(screen.getByTestId("refresh-btn"));
    });

    // Should use custom endpoint
    expect(window.fetch).toHaveBeenCalledWith(
      "https://example.com/ping",
      expect.objectContaining({
        method: "HEAD",
        mode: "no-cors",
      })
    );
  });

  test("should disable ping when enablePing is false", () => {
    render(<TestComponent options={{ enablePing: false }} />);

    // Should not set up interval
    expect(window.setInterval).not.toHaveBeenCalled();
  });
});
