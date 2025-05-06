import React, { useState } from "react";
import useErrorBoundary from "../../../src/hooks/useErrorBoundary";

const meta = {
  title: "Hooks/useErrorBoundary",
  parameters: {
    componentSubtitle: "A React hook for declarative error handling",
    docs: {
      description: {
        component:
          "A React hook that provides a simple way to handle errors in functional components. It allows you to set, track, and reset error states declaratively.",
      },
    },
  },
};

export default meta;

export const Default = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { error, isError, setError, reset } = useErrorBoundary();

  const handleTriggerError = () => {
    setError(new Error(errorMessage || "Test Error"));
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>useErrorBoundary Demo</h3>

      <p style={{ marginBottom: "20px" }}>
        This example demonstrates how to use the <code>useErrorBoundary</code>{" "}
        hook to handle errors in your components.
      </p>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label
            htmlFor="error-message"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Error Message:
          </label>
          <input
            id="error-message"
            type="text"
            value={errorMessage}
            onChange={(e) => setErrorMessage(e.target.value)}
            placeholder="Enter error message"
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "300px",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleTriggerError}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Trigger Error
          </button>

          <button
            onClick={reset}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reset Error
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: isError ? "#ffebee" : "#e8f5e9",
          padding: "15px",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>Current State:</h4>
        <div style={{ fontFamily: "monospace" }}>
          <div>isError: {isError.toString()}</div>
          <div>Error Message: {error?.message || "No error"}</div>
          <div>Error Type: {error?.constructor.name || "No error"}</div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#e3f2fd",
          padding: "15px",
          borderRadius: "4px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>Hook API:</h4>
        <ul style={{ margin: "0", paddingLeft: "20px" }}>
          <li>
            <code>error</code> - The current error object (null if no error)
          </li>
          <li>
            <code>isError</code> - Boolean indicating if there is an error
          </li>
          <li>
            <code>setError(error)</code> - Function to set a new error
          </li>
          <li>
            <code>reset()</code> - Function to reset the error state
          </li>
        </ul>
      </div>
    </div>
  );
};

Default.storyName = "Basic Usage";
