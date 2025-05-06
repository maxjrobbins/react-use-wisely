import React, { useState, useCallback } from "react";
import useInterval from "../../../src/hooks/useInterval";

export default {
  title: "Hooks/useInterval",
  parameters: {
    componentSubtitle: "Hook that manages setInterval in React components",
    docs: {
      description: {
        component:
          "A React hook that safely manages setInterval, providing controls to reset and clear the interval. Following the hook standardization pattern, it also provides feature support status and error tracking.",
      },
    },
  },
};

export const Default = () => {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [isRunning, setIsRunning] = useState(true);
  const [willThrowError, setWillThrowError] = useState(false);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
    if (willThrowError) {
      throw new Error("Demo error for testing error handling");
    }
  }, [willThrowError]);

  const { reset, clear, isSupported, error } = useInterval(
    increment,
    isRunning ? delay : null
  );

  const handleDelayChange = (e) => {
    setDelay(Number(e.target.value));
  };

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setCount(0);
    reset();
  };

  const handleErrorToggle = () => {
    setWillThrowError(!willThrowError);
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Interval Counter Demo</h3>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <h2 style={{ fontSize: "48px", margin: "20px 0" }}>{count}</h2>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="delay"
            style={{ display: "block", marginBottom: "8px" }}
          >
            Interval Delay (ms):
          </label>
          <input
            id="delay"
            type="range"
            min="100"
            max="2000"
            step="100"
            value={delay}
            onChange={handleDelayChange}
            style={{ width: "100%", maxWidth: "300px" }}
          />
          <span style={{ marginLeft: "10px" }}>{delay}ms</span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "15px",
          }}
        >
          <button
            onClick={handleToggle}
            style={{
              padding: "8px 16px",
              backgroundColor: isRunning ? "#ff4444" : "#44aa44",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {isRunning ? "Stop" : "Start"}
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4444ff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
          <button
            onClick={clear}
            style={{
              padding: "8px 16px",
              backgroundColor: "#666666",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
          <button
            onClick={handleErrorToggle}
            style={{
              padding: "8px 16px",
              backgroundColor: willThrowError ? "#ff9900" : "#aaaaaa",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {willThrowError ? "Disable Error" : "Trigger Error"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h4>Current Status:</h4>
        <pre
          style={{
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          {`{
  count: ${count}
  delay: ${delay}ms
  isRunning: ${isRunning}
  isSupported: ${isSupported}
  willThrowError: ${willThrowError}
  error: ${error ? `"${error.message}"` : "null"}
}`}
        </pre>
      </div>

      {error && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#fff0f0",
            borderRadius: "4px",
            border: "1px solid #ffcccc",
          }}
        >
          <h4 style={{ color: "#cc0000", margin: "0 0 8px 0" }}>Error:</h4>
          <p>{error.message}</p>
        </div>
      )}

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        The counter will increment every {delay}ms while running. Use the
        controls to start/stop the interval, reset the counter, or clear the
        interval completely. The "Trigger Error" button will cause the callback
        to throw an error to demonstrate error handling.
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
