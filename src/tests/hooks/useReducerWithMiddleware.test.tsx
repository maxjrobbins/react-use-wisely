import React, { FC } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import useReducerWithMiddleware from "../../hooks/useReducerWithMiddleware";

// Simple counter reducer for testing
const initialState = { count: 0 };

const reducer = (state: typeof initialState, action: any) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "ERROR":
      throw new Error("Simulated reducer error");
    default:
      return state;
  }
};

// Simple middleware for testing
const loggingMiddleware = jest.fn((state, action, next) => {
  next(action);
});

// Middleware that throws an error
const errorMiddleware = jest.fn((state, action, next) => {
  if (action.type === "MIDDLEWARE_ERROR") {
    throw new Error("Simulated middleware error");
  }
  next(action);
});

// Test component
const TestComponent: FC = () => {
  const { state, dispatch, error } = useReducerWithMiddleware(
    reducer,
    initialState,
    loggingMiddleware
  );

  return (
    <div>
      <div data-testid="count">{state.count}</div>
      {error && <div data-testid="error">{error.message}</div>}
      <button
        data-testid="increment"
        onClick={() => dispatch({ type: "INCREMENT" })}
      >
        Increment
      </button>
      <button
        data-testid="decrement"
        onClick={() => dispatch({ type: "DECREMENT" })}
      >
        Decrement
      </button>
      <button
        data-testid="error-btn"
        onClick={() => dispatch({ type: "ERROR" })}
      >
        Trigger Error
      </button>
    </div>
  );
};

// Test component with error middleware
const ErrorMiddlewareComponent: FC = () => {
  const { state, dispatch, error } = useReducerWithMiddleware(
    reducer,
    initialState,
    errorMiddleware
  );

  return (
    <div>
      <div data-testid="count">{state.count}</div>
      {error && <div data-testid="error">{error.message}</div>}
      <button
        data-testid="increment"
        onClick={() => dispatch({ type: "INCREMENT" })}
      >
        Increment
      </button>
      <button
        data-testid="middleware-error"
        onClick={() => dispatch({ type: "MIDDLEWARE_ERROR" })}
      >
        Trigger Middleware Error
      </button>
    </div>
  );
};

describe("useReducerWithMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize with initial state", () => {
    render(<TestComponent />);
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  test("should update state when actions are dispatched", () => {
    render(<TestComponent />);

    // Initial state
    expect(screen.getByTestId("count").textContent).toBe("0");

    // Increment
    fireEvent.click(screen.getByTestId("increment"));
    expect(screen.getByTestId("count").textContent).toBe("1");

    // Decrement
    fireEvent.click(screen.getByTestId("decrement"));
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  test("should call middleware with correct arguments", () => {
    render(<TestComponent />);

    // Dispatch an action
    fireEvent.click(screen.getByTestId("increment"));

    // Check middleware was called with correct arguments
    expect(loggingMiddleware).toHaveBeenCalledWith(
      expect.objectContaining({ count: 0 }), // Initial state
      { type: "INCREMENT" }, // Action
      expect.any(Function) // Next function
    );
  });

  test("should handle errors in reducer", () => {
    render(<TestComponent />);

    // No error initially
    expect(screen.queryByTestId("error")).toBeNull();

    // Trigger error
    fireEvent.click(screen.getByTestId("error-btn"));

    // Error should be displayed
    expect(screen.getByTestId("error").textContent).toBe(
      "Simulated reducer error"
    );

    // State should remain unchanged
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  test("should handle errors in middleware", () => {
    render(<ErrorMiddlewareComponent />);

    // No error initially
    expect(screen.queryByTestId("error")).toBeNull();

    // Trigger middleware error
    fireEvent.click(screen.getByTestId("middleware-error"));

    // Error should be displayed
    expect(screen.getByTestId("error").textContent).toBe(
      "Simulated middleware error"
    );
  });

  test("should work without middleware", () => {
    // Create a simpler test component without middleware
    const SimpleComponent: FC = () => {
      const { state, dispatch } = useReducerWithMiddleware(
        reducer,
        initialState
      );

      return (
        <div>
          <div data-testid="count">{state.count}</div>
          <button
            data-testid="increment"
            onClick={() => dispatch({ type: "INCREMENT" })}
          >
            Increment
          </button>
        </div>
      );
    };

    render(<SimpleComponent />);

    // Initial state
    expect(screen.getByTestId("count").textContent).toBe("0");

    // Increment
    fireEvent.click(screen.getByTestId("increment"));
    expect(screen.getByTestId("count").textContent).toBe("1");
  });
});
