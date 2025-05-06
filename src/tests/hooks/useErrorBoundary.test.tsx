import React, { FC } from "react";
import { render, screen, act } from "@testing-library/react";
import useErrorBoundary from "../../hooks/useErrorBoundary";

// A test component that uses the hook
const TestComponent: FC = () => {
  const { error, isError, setError, reset } = useErrorBoundary();

  return (
    <div>
      <div data-testid="error-state">{isError ? "Error" : "No Error"}</div>
      <div data-testid="error-message">
        {error?.message || "No Error Message"}
      </div>
      <button
        data-testid="trigger-error"
        onClick={() => setError(new Error("Test Error"))}
      >
        Trigger Error
      </button>
      <button data-testid="reset-error" onClick={reset}>
        Reset Error
      </button>
    </div>
  );
};

describe("useErrorBoundary", () => {
  test("should initialize with no error", () => {
    render(<TestComponent />);

    expect(screen.getByTestId("error-state").textContent).toBe("No Error");
    expect(screen.getByTestId("error-message").textContent).toBe(
      "No Error Message"
    );
  });

  test("should set error when triggered", () => {
    render(<TestComponent />);

    act(() => {
      screen.getByTestId("trigger-error").click();
    });

    expect(screen.getByTestId("error-state").textContent).toBe("Error");
    expect(screen.getByTestId("error-message").textContent).toBe("Test Error");
  });

  test("should reset error state", () => {
    render(<TestComponent />);

    // First trigger an error
    act(() => {
      screen.getByTestId("trigger-error").click();
    });

    // Verify error is set
    expect(screen.getByTestId("error-state").textContent).toBe("Error");
    expect(screen.getByTestId("error-message").textContent).toBe("Test Error");

    // Reset the error
    act(() => {
      screen.getByTestId("reset-error").click();
    });

    // Verify error is reset
    expect(screen.getByTestId("error-state").textContent).toBe("No Error");
    expect(screen.getByTestId("error-message").textContent).toBe(
      "No Error Message"
    );
  });

  test("should handle multiple error states", () => {
    render(<TestComponent />);

    // Set first error
    act(() => {
      screen.getByTestId("trigger-error").click();
    });

    expect(screen.getByTestId("error-state").textContent).toBe("Error");
    expect(screen.getByTestId("error-message").textContent).toBe("Test Error");

    // Reset
    act(() => {
      screen.getByTestId("reset-error").click();
    });

    // Set second error
    act(() => {
      screen.getByTestId("trigger-error").click();
    });

    expect(screen.getByTestId("error-state").textContent).toBe("Error");
    expect(screen.getByTestId("error-message").textContent).toBe("Test Error");
  });

  test("should handle different error types", () => {
    const ErrorTypeTestComponent: FC = () => {
      const { error, isError, setError, reset } = useErrorBoundary();

      return (
        <div>
          <div data-testid="error-type">
            {error?.constructor.name || "No Error"}
          </div>
          <button
            data-testid="trigger-custom-error"
            onClick={() => setError(new TypeError("Type Error"))}
          >
            Trigger Type Error
          </button>
          <button data-testid="reset-error" onClick={reset}>
            Reset Error
          </button>
        </div>
      );
    };

    render(<ErrorTypeTestComponent />);

    act(() => {
      screen.getByTestId("trigger-custom-error").click();
    });

    expect(screen.getByTestId("error-type").textContent).toBe("TypeError");
  });
});
