import React, { useState } from "react";
import useReducerWithMiddleware from "../../../src/hooks/useReducerWithMiddleware";

// Defining as a separate variable to ensure Storybook properly recognizes it
const meta = {
  title: "Hooks/useReducerWithMiddleware",
  parameters: {
    componentSubtitle:
      "A React hook that extends useReducer with middleware support",
    docs: {
      description: {
        component:
          "This hook adds middleware capabilities to React's useReducer, allowing you to intercept actions before they reach the reducer.",
      },
    },
  },
};

// Export the meta object as default
export default meta;

// Define a simple counter reducer
const initialState = { count: 0, history: [] };

const reducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        count: state.count + 1,
        history: [
          ...state.history,
          { type: action.type, timestamp: Date.now() },
        ],
      };
    case "DECREMENT":
      return {
        ...state,
        count: state.count - 1,
        history: [
          ...state.history,
          { type: action.type, timestamp: Date.now() },
        ],
      };
    case "RESET":
      return {
        ...initialState,
        history: [
          ...state.history,
          { type: action.type, timestamp: Date.now() },
        ],
      };
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "INCREMENT_BY_STEP":
      return { ...state, count: state.count + state.step };
    case "DECREMENT_BY_STEP":
      return { ...state, count: state.count - state.step };
    default:
      return state;
  }
};

// Define middleware
const loggingMiddleware = (state, action, next) => {
  console.log("Action:", JSON.stringify(action, null, 2));
  console.log("State before:", JSON.stringify(state, null, 2));

  // Call the next function to continue the chain
  next(action);

  // Note: We can't log the state after because the middleware
  // doesn't receive the updated state in this implementation
};

const analyticsMiddleware = () => (next) => (action) => {
  // Simulate sending analytics data
  if (action.type !== "INTERNAL_ACTION") {
    console.log(`Analytics: User performed ${action.type} action`);
  }
  return next(action);
};

export const Default = () => {
  // Log to show console output for debugging
  const [logMessages, setLogMessages] = useState([]);

  // Override console.log to capture middleware logs
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    originalConsoleLog(...args);

    // Format objects properly
    const formattedArgs = args.map((arg) =>
      typeof arg === "object" && arg !== null
        ? JSON.stringify(arg, null, 2)
        : String(arg)
    );

    setLogMessages((prev) => [...prev, formattedArgs.join(" ")].slice(-5));
  };

  const [state, dispatch] = useReducerWithMiddleware(
    reducer,
    initialState,
    loggingMiddleware
  );

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>useReducerWithMiddleware Demo</h3>

      <p style={{ marginBottom: "20px" }}>
        This example demonstrates how to use the{" "}
        <code>useReducerWithMiddleware</code> hook to add middleware support to
        React's useReducer.
      </p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => dispatch({ type: "INCREMENT" })}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Increment
        </button>

        <button
          onClick={() => dispatch({ type: "DECREMENT" })}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Decrement
        </button>

        <button
          onClick={() => dispatch({ type: "RESET" })}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "20px",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>Current State:</h4>
        <div
          style={{
            backgroundColor: "white",
            padding: "15px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            fontSize: "16px",
          }}
        >
          Count: <strong>{state.count}</strong>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "20px",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>Action History:</h4>
        {state.history.length > 0 ? (
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Action
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...state.history].reverse().map((action, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                    }}
                  >
                    <td
                      style={{ padding: "8px", borderBottom: "1px solid #eee" }}
                    >
                      <code>{action.type}</code>
                    </td>
                    <td
                      style={{ padding: "8px", borderBottom: "1px solid #eee" }}
                    >
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "4px",
              textAlign: "center",
              color: "#666",
              fontStyle: "italic",
              border: "1px solid #ddd",
            }}
          >
            No actions dispatched yet
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "20px",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>Middleware Console Output:</h4>
        {logMessages.length > 0 ? (
          <div
            style={{
              backgroundColor: "#272822",
              color: "#f8f8f2",
              padding: "15px",
              borderRadius: "4px",
              fontFamily: "monospace",
              maxHeight: "200px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              fontSize: "13px",
              lineHeight: "1.4",
            }}
          >
            {logMessages.map((msg, index) => (
              <div key={index} style={{ margin: "8px 0" }}>
                {msg}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "4px",
              textAlign: "center",
              color: "#666",
              fontStyle: "italic",
              border: "1px solid #ddd",
            }}
          >
            No console output yet. Try dispatching an action.
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "20px",
          backgroundColor: "#e3f2fd",
          padding: "15px",
          borderRadius: "4px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>How It Works:</h4>
        <p style={{ margin: "0 0 10px 0" }}>
          This hook adds middleware support to React's <code>useReducer</code>:
        </p>
        <ul style={{ margin: "0", paddingLeft: "20px" }}>
          <li>
            Middleware functions can intercept actions before they reach the
            reducer
          </li>
          <li>
            The middleware receives the current state, the action, and a next
            function
          </li>
          <li>Middleware must call next(action) to continue processing</li>
        </ul>
      </div>
    </div>
  );
};

Default.storyName = "Basic Usage";
