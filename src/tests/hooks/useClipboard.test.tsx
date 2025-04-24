import React, { ReactElement } from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import useClipboard from "../../hooks/useClipboard";

// Mock timer functions
jest.useFakeTimers();

interface TestComponentProps {
  text?: string;
  timeout?: number;
}

// A test component that uses the hook
function TestComponent({
  text = "Test text",
  timeout = 2000,
}: TestComponentProps): ReactElement {
  const [isCopied, copyToClipboard] = useClipboard(timeout);

  return (
    <div>
      <div data-testid="status">{isCopied ? "Copied!" : "Not copied"}</div>
      <button data-testid="copy-button" onClick={() => copyToClipboard(text)}>
        Copy to Clipboard
      </button>
    </div>
  );
}

describe("useClipboard", () => {
  // Mock Clipboard API
  const originalNavigator = { ...global.navigator };

  beforeEach(() => {
    // Reset mocks and timers
    jest.clearAllMocks();
    jest.clearAllTimers();

    // Mock modern clipboard API
    Object.defineProperty(global.navigator, "clipboard", {
      value: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
      configurable: true,
    });

    // Mock document.execCommand for fallback
    document.execCommand = jest.fn().mockReturnValue(true);
  });

  afterEach(() => {
    // Restore original navigator
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      configurable: true,
    });
  });

  test("should set isCopied to true when copy is successful using Clipboard API", async () => {
    render(<TestComponent />);

    // Initial state
    expect(screen.getByTestId("status").textContent).toBe("Not copied");

    // Click the copy button
    await act(async () => {
      fireEvent.click(screen.getByTestId("copy-button"));
    });

    // State should reflect copied status
    expect(screen.getByTestId("status").textContent).toBe("Copied!");
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Test text");
  });

  test("should reset isCopied after timeout", async () => {
    render(<TestComponent timeout={1000} />);

    // Click the copy button
    await act(async () => {
      fireEvent.click(screen.getByTestId("copy-button"));
    });

    // State should reflect copied status
    expect(screen.getByTestId("status").textContent).toBe("Copied!");

    // Fast-forward time past the timeout
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Should reset to not copied
    expect(screen.getByTestId("status").textContent).toBe("Not copied");
  });

  test("should use document.execCommand fallback when Clipboard API is not available", async () => {
    // Remove clipboard API to force fallback
    Object.defineProperty(global.navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });

    render(<TestComponent />);

    // Mock document.body functions for the textarea
    const appendChildSpy = jest.spyOn(document.body, "appendChild");
    const removeChildSpy = jest.spyOn(document.body, "removeChild");

    // Click the copy button
    await act(async () => {
      fireEvent.click(screen.getByTestId("copy-button"));
    });

    // Verify fallback method was used
    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(screen.getByTestId("status").textContent).toBe("Copied!");

    // Should have added and removed a textarea element
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    // Clean up spies
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  test("should handle execCommand failure", async () => {
    // Remove clipboard API to force fallback
    Object.defineProperty(global.navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });

    // Make execCommand fail
    document.execCommand = jest.fn().mockImplementation(() => {
      throw new Error("execCommand failed");
    });

    // Mock console.error to prevent test output noise
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<TestComponent />);

    // Click the copy button
    await act(async () => {
      fireEvent.click(screen.getByTestId("copy-button"));
    });

    // Should have logged the error
    expect(consoleErrorSpy).toHaveBeenCalled();

    // Status should not change on error
    expect(screen.getByTestId("status").textContent).toBe("Not copied");

    // Clean up spy
    consoleErrorSpy.mockRestore();
  });

  test("should handle Clipboard API rejection", async () => {
    // Make clipboard.writeText reject
    navigator.clipboard.writeText = jest
      .fn()
      .mockRejectedValue(new Error("Clipboard API failed"));

    // Mock console.error to prevent test output noise
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<TestComponent />);

    // Click the copy button
    await act(async () => {
      fireEvent.click(screen.getByTestId("copy-button"));
    });

    // Should have logged the error
    expect(consoleErrorSpy).toHaveBeenCalled();

    // Status should not change on error
    expect(screen.getByTestId("status").textContent).toBe("Not copied");

    // Clean up spy
    consoleErrorSpy.mockRestore();
  });

  test("should copy different text when provided", async () => {
    render(<TestComponent text="Different text" />);

    // Click the copy button
    await act(async () => {
      fireEvent.click(screen.getByTestId("copy-button"));
    });

    // Should have called clipboard with the provided text
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "Different text"
    );
  });
});
