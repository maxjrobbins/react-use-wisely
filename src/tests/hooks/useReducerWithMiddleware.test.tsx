import React, { FC } from "react";
import { render, screen, act } from "@testing-library/react";
import useReducerWithMiddleware, {
  Middleware,
} from "../../hooks/useReducerWithMiddleware";

// Define types for our test
interface CounterState {
  count: number;
  lastAction?: string;
}

type CounterAction =
  | { type: "INCREMENT"; payload?: number }
  | { type: "DECREMENT"; payload?: number }
  | { type: "RESET" };

// A simple counter reducer
const counterReducer = (
  state: CounterState,
  action: CounterAction
): CounterState => {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        count: state.count + (action.payload || 1),
        lastAction: "INCREMENT",
      };
    case "DECREMENT":
      return {
        ...state,
        count: state.count - (action.payload || 1),
        lastAction: "DECREMENT",
      };
    case "RESET":
      return {
        ...state,
        count: 0,
        lastAction: "RESET",
      };
    default:
      return state;
  }
};

// Logger middleware for testing
const loggerMiddleware: Middleware<CounterState, CounterAction> = (
  state,
  action,
  next
) => {
  console.log(`Action: ${action.type}`);
  console.log(`Before: ${JSON.stringify(state)}`);
  next(action);
};

// Middleware that blocks DECREMENT when count is 0
const blockDecrementMiddleware: Middleware<CounterState, CounterAction> = (
  state,
  action,
  next
) => {
  if (action.type === "DECREMENT" && state.count <= 0) {
    console.log("Blocked DECREMENT action because count is 0");
    return;
  }
  next(action);
};

// Test component that uses the hook
interface TestComponentProps {
  middleware?: Middleware<CounterState, CounterAction>;
  initialState?: CounterState;
}

const TestComponent: FC<TestComponentProps> = ({
  middleware,
  initialState = { count: 0 },
}) => {
  const [state, dispatch] = useReducerWithMiddleware(
    counterReducer,
    initialState,
    middleware
  );

  return (
    <div>
      <div data-testid="count">Count: {state.count}</div>
      <div data-testid="lastAction">
        Last Action: {state.lastAction || "None"}
      </div>
      <button
        data-testid="increment"
        onClick={() => dispatch({ type: "INCREMENT" })}
      >
        Increment
      </button>
      <button
        data-testid="increment-by-5"
        onClick={() => dispatch({ type: "INCREMENT", payload: 5 })}
      >
        Increment by 5
      </button>
      <button
        data-testid="decrement"
        onClick={() => dispatch({ type: "DECREMENT" })}
      >
        Decrement
      </button>
      <button data-testid="reset" onClick={() => dispatch({ type: "RESET" })}>
        Reset
      </button>
    </div>
  );
};

describe("useReducerWithMiddleware", () => {
  // Set up fake timers for all tests
  beforeEach(() => {
    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, "log").mockImplementation(() => {});
    // Set up fake timers for setTimeout
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test("should work like normal useReducer when no middleware is provided", () => {
    render(<TestComponent />);

    // Initial state
    expect(screen.getByTestId("count").textContent).toBe("Count: 0");

    // Increment
    act(() => {
      screen.getByTestId("increment").click();
    });

    expect(screen.getByTestId("count").textContent).toBe("Count: 1");
    expect(screen.getByTestId("lastAction").textContent).toBe(
      "Last Action: INCREMENT"
    );

    // Decrement
    act(() => {
      screen.getByTestId("decrement").click();
    });

    expect(screen.getByTestId("count").textContent).toBe("Count: 0");
    expect(screen.getByTestId("lastAction").textContent).toBe(
      "Last Action: DECREMENT"
    );

    // Reset
    act(() => {
      screen.getByTestId("increment").click();
      screen.getByTestId("increment").click();
      screen.getByTestId("reset").click();
    });

    expect(screen.getByTestId("count").textContent).toBe("Count: 0");
    expect(screen.getByTestId("lastAction").textContent).toBe(
      "Last Action: RESET"
    );
  });

  test("should call logger middleware for each action", () => {
    const spy = jest.spyOn(console, "log");
    render(<TestComponent middleware={loggerMiddleware} />);

    act(() => {
      screen.getByTestId("increment").click();
    });

    // Middleware should log before action
    expect(spy).toHaveBeenCalledWith("Action: INCREMENT");
    expect(spy).toHaveBeenCalledWith('Before: {"count":0}');

    // Action should be processed
    expect(screen.getByTestId("count").textContent).toBe("Count: 1");
  });

  test("should support blocking actions with middleware", () => {
    render(<TestComponent middleware={blockDecrementMiddleware} />);

    // Try to decrement at 0, should be blocked
    act(() => {
      screen.getByTestId("decrement").click();
    });

    // Count should still be 0 because the decrement was blocked
    expect(screen.getByTestId("count").textContent).toBe("Count: 0");
    // Last action should not have changed
    expect(screen.getByTestId("lastAction").textContent).toBe(
      "Last Action: None"
    );

    // First increment to 1
    act(() => {
      screen.getByTestId("increment").click();
    });

    expect(screen.getByTestId("count").textContent).toBe("Count: 1");

    // Then decrement back to 0
    act(() => {
      screen.getByTestId("decrement").click();
    });

    // Count should be back to 0 now
    expect(screen.getByTestId("count").textContent).toBe("Count: 0");
    // And last action should be DECREMENT
    expect(screen.getByTestId("lastAction").textContent).toBe(
      "Last Action: DECREMENT"
    );
  });

  test("should support actions with payload", () => {
    render(<TestComponent />);

    // Increment by 5
    act(() => {
      screen.getByTestId("increment-by-5").click();
    });

    expect(screen.getByTestId("count").textContent).toBe("Count: 5");
  });

  test("should work with custom initial state", () => {
    render(<TestComponent initialState={{ count: 10 }} />);

    // Initial state should be 10
    expect(screen.getByTestId("count").textContent).toBe("Count: 10");

    // Increment
    act(() => {
      screen.getByTestId("increment").click();
    });

    expect(screen.getByTestId("count").textContent).toBe("Count: 11");
  });

  test("should not re-create middleware function on re-renders", () => {
    // Create a component that forces re-renders
    const TestWithRerender: FC = () => {
      const [, setForceUpdate] = React.useState(0);
      const middlewareCalls = React.useRef(0);

      // Create a middleware that increments a counter
      const countMiddleware: Middleware<CounterState, CounterAction> =
        React.useCallback((state, action, next) => {
          middlewareCalls.current += 1;
          // Apply the action so the state changes
          next(action);
          // Force update to display the current value of middlewareCalls.current
          setForceUpdate((prev) => prev + 1);
        }, []);

      return (
        <>
          <TestComponent middleware={countMiddleware} />
          <div data-testid="calls">
            Middleware Calls: {middlewareCalls.current}
          </div>
          <button
            data-testid="rerender"
            onClick={() => setForceUpdate((prev) => prev + 1)}
          >
            Force Rerender
          </button>
        </>
      );
    };

    render(<TestWithRerender />);

    // Initial state
    expect(screen.getByTestId("calls").textContent).toBe("Middleware Calls: 0");

    // Dispatch an action
    act(() => {
      screen.getByTestId("increment").click();
    });

    // After the action, middlewareCalls should be updated
    expect(screen.getByTestId("count").textContent).toBe("Count: 1");
    expect(screen.getByTestId("calls").textContent).toBe("Middleware Calls: 1");

    // Force a re-render
    act(() => {
      screen.getByTestId("rerender").click();
    });

    // Dispatch another action
    act(() => {
      screen.getByTestId("increment").click();
    });

    // Middleware should be called again
    expect(screen.getByTestId("count").textContent).toBe("Count: 2");
    expect(screen.getByTestId("calls").textContent).toBe("Middleware Calls: 2");
  });
});
