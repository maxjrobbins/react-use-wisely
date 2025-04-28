import React, { useState, useEffect as _useEffect, ReactElement } from "react";
import { render, screen, act } from "@testing-library/react";
import useDebounce from "../../hooks/useDebounce";

// Mock timers for debounce testing
jest.useFakeTimers();

interface TestComponentProps {
  initialValue: string;
  delay?: number;
}

function TestComponent({
  initialValue,
  delay = 500,
}: TestComponentProps): ReactElement {
  const [value, setValue] = useState<string>(initialValue);
  const { value: debouncedValue } = useDebounce<string>(value, { delay });

  return (
    <div>
      <div data-testid="debounced-value">{debouncedValue}</div>
      <div data-testid="current-value">{value}</div>
      <button data-testid="button" onClick={() => setValue("updated value")}>
        Update Value
      </button>
    </div>
  );
}

describe("useDebounce", () => {
  test("should initially return the provided value", () => {
    render(<TestComponent initialValue="initial value" />);

    expect(screen.getByTestId("debounced-value").textContent).toBe(
      "initial value"
    );
  });

  test("should update debounced value after delay", () => {
    render(<TestComponent initialValue="initial value" delay={500} />);

    // Update the value
    act(() => {
      screen.getByTestId("button").click();
    });

    // Value should be updated immediately
    expect(screen.getByTestId("current-value").textContent).toBe(
      "updated value"
    );

    // But debounced value should not change yet
    expect(screen.getByTestId("debounced-value").textContent).toBe(
      "initial value"
    );

    // Fast-forward time by 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now the debounced value should be updated
    expect(screen.getByTestId("debounced-value").textContent).toBe(
      "updated value"
    );
  });

  test("should use default delay when not specified", () => {
    render(<TestComponent initialValue="initial value" />);

    // Update the value
    act(() => {
      screen.getByTestId("button").click();
    });

    // Value should be updated immediately
    expect(screen.getByTestId("current-value").textContent).toBe(
      "updated value"
    );

    // But debounced value should not change yet
    expect(screen.getByTestId("debounced-value").textContent).toBe(
      "initial value"
    );

    // Fast-forward time by default delay (500ms)
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now the debounced value should be updated
    expect(screen.getByTestId("debounced-value").textContent).toBe(
      "updated value"
    );
  });
});
