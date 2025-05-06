import React, { useState, FC } from "react";
import { render, screen, act } from "@testing-library/react";
import usePrevious from "../../hooks/usePrevious";

interface TestComponentProps {
  initialValue: number;
}

// A test component that uses the hook
const TestComponent: FC<TestComponentProps> = ({ initialValue }) => {
  const [value, setValue] = useState<number>(initialValue);
  const previousValue = usePrevious<number>(value);

  return (
    <div>
      <div data-testid="current">Current: {value}</div>
      <div data-testid="previous">
        Previous:{" "}
        {previousValue.value === undefined ? "undefined" : previousValue.value}
      </div>
      <div data-testid="error">
        Error: {previousValue.error === null ? "null" : "not-null"}
      </div>
      <button data-testid="increment" onClick={() => setValue((v) => v + 1)}>
        Increment
      </button>
      <button data-testid="decrement" onClick={() => setValue((v) => v - 1)}>
        Decrement
      </button>
      <button data-testid="reset" onClick={() => setValue(initialValue)}>
        Reset
      </button>
    </div>
  );
};

describe("usePrevious", () => {
  test("should return undefined on initial render", () => {
    render(<TestComponent initialValue={0} />);

    expect(screen.getByTestId("current").textContent).toBe("Current: 0");
    expect(screen.getByTestId("previous").textContent).toBe(
      "Previous: undefined"
    );
  });

  test("should return previous value after update", () => {
    render(<TestComponent initialValue={0} />);

    // Initial state
    expect(screen.getByTestId("current").textContent).toBe("Current: 0");
    expect(screen.getByTestId("previous").textContent).toBe(
      "Previous: undefined"
    );

    // Update state
    act(() => {
      screen.getByTestId("increment").click();
    });

    // Now previous should have the old value
    expect(screen.getByTestId("current").textContent).toBe("Current: 1");
    expect(screen.getByTestId("previous").textContent).toBe("Previous: 0");

    // Update again
    act(() => {
      screen.getByTestId("increment").click();
    });

    expect(screen.getByTestId("current").textContent).toBe("Current: 2");
    expect(screen.getByTestId("previous").textContent).toBe("Previous: 1");
  });

  test("should track value changes in both directions", () => {
    render(<TestComponent initialValue={5} />);

    // Initial state
    expect(screen.getByTestId("current").textContent).toBe("Current: 5");

    // Increment
    act(() => {
      screen.getByTestId("increment").click();
    });

    expect(screen.getByTestId("current").textContent).toBe("Current: 6");
    expect(screen.getByTestId("previous").textContent).toBe("Previous: 5");

    // Decrement
    act(() => {
      screen.getByTestId("decrement").click();
    });

    expect(screen.getByTestId("current").textContent).toBe("Current: 5");
    expect(screen.getByTestId("previous").textContent).toBe("Previous: 6");
  });

  test("should work with non-numeric values", () => {
    const StringTestComponent: FC = () => {
      const [value, setValue] = useState<string>("initial");
      const previousValue = usePrevious<string>(value);

      return (
        <div>
          <div data-testid="current">Current: {value}</div>
          <div data-testid="previous">
            Previous:{" "}
            {previousValue.value === undefined
              ? "undefined"
              : previousValue.value}
          </div>
          <button data-testid="update" onClick={() => setValue("updated")}>
            Update
          </button>
        </div>
      );
    };

    render(<StringTestComponent />);

    // Initial state
    expect(screen.getByTestId("current").textContent).toBe("Current: initial");
    expect(screen.getByTestId("previous").textContent).toBe(
      "Previous: undefined"
    );

    // Update state
    act(() => {
      screen.getByTestId("update").click();
    });

    expect(screen.getByTestId("current").textContent).toBe("Current: updated");
    expect(screen.getByTestId("previous").textContent).toBe(
      "Previous: initial"
    );
  });

  test("should work with objects", () => {
    interface TestObject {
      name: string;
      count: number;
    }

    const ObjectTestComponent: FC = () => {
      const [value, setValue] = useState<TestObject>({
        name: "initial",
        count: 0,
      });
      const previousValue = usePrevious<TestObject>(value);

      return (
        <div>
          <div data-testid="current">
            Current: {value.name}, {value.count}
          </div>
          <div data-testid="previous">
            Previous:{" "}
            {previousValue.value
              ? `${previousValue.value.name}, ${previousValue.value.count}`
              : "undefined"}
          </div>
          <button
            data-testid="update"
            onClick={() =>
              setValue({ name: "updated", count: value.count + 1 })
            }
          >
            Update
          </button>
        </div>
      );
    };

    render(<ObjectTestComponent />);

    // Initial state
    expect(screen.getByTestId("current").textContent).toBe(
      "Current: initial, 0"
    );
    expect(screen.getByTestId("previous").textContent).toBe(
      "Previous: undefined"
    );

    // Update state
    act(() => {
      screen.getByTestId("update").click();
    });

    expect(screen.getByTestId("current").textContent).toBe(
      "Current: updated, 1"
    );
    expect(screen.getByTestId("previous").textContent).toBe(
      "Previous: initial, 0"
    );
  });

  test("should have error property set to null", () => {
    render(<TestComponent initialValue={0} />);
    expect(screen.getByTestId("error").textContent).toBe("Error: null");
  });
});
