import React, { useState } from "react";
import useResizeObserver, {
  ResizeObserverNotSupportedError,
} from "../../../src/hooks/useResizeObserver";

export default {
  title: "Hooks/useResizeObserver",
  parameters: {
    componentSubtitle: "Hook to track element dimensions",
    docs: {
      description: {
        component:
          "A React hook that tracks the dimensions of an element with error handling for browser compatibility.",
      },
    },
  },
};

export const Default = () => {
  const { ref, dimensions, error, isSupported } = useResizeObserver();

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Resize Observer Demo</h3>

      {!isSupported && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#fff3cd",
            color: "#856404",
            borderRadius: "4px",
            marginBottom: "10px",
            border: "1px solid #ffeeba",
          }}
        >
          <strong>Warning:</strong> ResizeObserver is not supported in this
          browser.
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "10px",
            border: "1px solid #ef9a9a",
          }}
        >
          <strong>Error:</strong> {error.message}
        </div>
      )}

      <div>
        <p style={{ marginBottom: "10px" }}>
          Resize this box to see dimensions change:
        </p>
        <div
          ref={ref}
          style={{
            padding: "20px",
            border: "2px dashed #2196F3",
            backgroundColor: "#E3F2FD",
            resize: "both",
            overflow: "auto",
            minHeight: "100px",
            minWidth: "200px",
            maxWidth: "100%",
          }}
        >
          <div>Resize from bottom-right corner ↘</div>
          {dimensions.width && dimensions.height ? (
            <div style={{ marginTop: "10px" }}>
              Current dimensions: {Math.round(dimensions.width)}px x{" "}
              {Math.round(dimensions.height)}px
            </div>
          ) : (
            <div>Loading dimensions...</div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h4>Current dimensions:</h4>
        <pre
          style={{
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(dimensions, null, 2)}
        </pre>
      </div>
    </div>
  );
};

Default.storyName = "Basic Usage";

export const WithErrorHandling = () => {
  const { ref, dimensions, error, isSupported } = useResizeObserver();
  const [mockError, setMockError] = useState(false);
  const [browserSupport, setBrowserSupport] = useState(true);

  // Force a mock error for demonstration
  const triggerMockError = () => {
    setMockError(true);
    setBrowserSupport(false);
  };

  // Reset error state
  const resetError = () => {
    setMockError(false);
    setBrowserSupport(true);
  };

  // If we're showing a mock error, display that instead of the real error
  const displayError = mockError
    ? new ResizeObserverNotSupportedError()
    : error;

  // For demo purposes, override the actual support state with our mock state
  const displaySupported = mockError ? false : isSupported;

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Resize Observer with Error Handling</h3>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={triggerMockError}
          style={{
            padding: "8px 12px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Simulate Browser Incompatibility
        </button>
        <button
          onClick={resetError}
          style={{
            padding: "8px 12px",
            backgroundColor: "#4CAF50",
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
          padding: "15px",
          backgroundColor: "#e8f5e9",
          borderRadius: "4px",
          marginBottom: "20px",
          border: "1px solid #c8e6c9",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>Browser Compatibility:</h4>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: displaySupported ? "#4CAF50" : "#f44336",
              marginRight: "8px",
            }}
          ></div>
          <span>
            <strong>ResizeObserver:</strong>{" "}
            {displaySupported ? "Supported" : "Not supported"}
          </span>
        </div>
      </div>

      {displayError ? (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "20px",
            border: "1px solid #ffcdd2",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0" }}>
            <span
              role="img"
              aria-label="warning"
              style={{ marginRight: "8px" }}
            >
              ⚠️
            </span>
            Error Detected:
          </h4>
          <div>
            <strong>Message:</strong> {displayError.message}
          </div>
          <div style={{ marginTop: "15px" }}>
            <h5 style={{ margin: "0 0 8px 0" }}>Fallback Behavior:</h5>
            <p style={{ margin: "0" }}>
              When ResizeObserver is not supported, the hook will:
            </p>
            <ul style={{ marginTop: "5px" }}>
              <li>Return an empty dimensions object</li>
              <li>Provide an error with details about the issue</li>
              <li>Set isSupported to false</li>
              <li>Allow your app to implement fallback UI</li>
            </ul>
          </div>
        </div>
      ) : (
        <div
          ref={ref}
          style={{
            padding: "20px",
            border: "2px dashed #2196F3",
            backgroundColor: "#E3F2FD",
            resize: "both",
            overflow: "auto",
            minHeight: "100px",
            minWidth: "200px",
            maxWidth: "100%",
          }}
        >
          <div>Resize from bottom-right corner ↘</div>
          {dimensions.width && dimensions.height ? (
            <div style={{ marginTop: "10px" }}>
              Current dimensions: {Math.round(dimensions.width)}px x{" "}
              {Math.round(dimensions.height)}px
            </div>
          ) : (
            <div>Loading dimensions...</div>
          )}
        </div>
      )}

      {!displayError && (
        <div style={{ marginTop: "20px" }}>
          <h4>Current dimensions:</h4>
          <pre
            style={{
              padding: "10px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(dimensions, null, 2)}
          </pre>
        </div>
      )}

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#fff9c4",
          borderRadius: "4px",
          border: "1px solid #fff59d",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0" }}>About Error Handling:</h4>
        <p style={{ margin: "0" }}>
          This demo shows how the hook handles cases where ResizeObserver isn't
          supported or when other errors occur. Click "Simulate Browser
          Incompatibility" to see error handling in action.
        </p>
      </div>
    </div>
  );
};

WithErrorHandling.storyName = "With Error Handling";
