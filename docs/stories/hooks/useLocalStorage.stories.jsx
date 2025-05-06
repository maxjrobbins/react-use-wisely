import React, { useState } from "react";
import useLocalStorage from "../../../src/hooks/useLocalStorage";

export default {
  title: "Hooks/useLocalStorage",
  parameters: {
    componentSubtitle: "Hook for persistent local storage state",
    docs: {
      description: {
        component:
          "A React hook that syncs and persists state with localStorage, maintaining values between page refreshes with error handling.",
      },
    },
  },
};

export const Default = () => {
  // Use a unique key with timestamp to avoid conflicts between story renders
  const uniqueKey = `demoKey-${Date.now().toString().slice(-5)}`;
  const { value, setValue, error, isSupported } = useLocalStorage(
    uniqueKey,
    "Hello world!"
  );
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSave = () => {
    setValue(inputValue);
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Local Storage Demo</h3>
      <p>
        Current value in localStorage[{uniqueKey}]: <strong>{value}</strong>
      </p>
      <p>
        Local Storage supported: <strong>{isSupported ? "Yes" : "No"}</strong>
      </p>

      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <strong>Error:</strong> {error.message}
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button
          onClick={handleSave}
          style={{
            padding: "8px 12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Save to localStorage
        </button>
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        Try updating the value and clicking "Save". The value will persist in
        localStorage even if you refresh the page.
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";

// Function to create an error by attempting to store a recursive object
// const createCircularReference = () => {
//   const circularObj = {};
//   circularObj.self = circularObj; // Create circular reference that can't be JSON-serialized
//   return circularObj;
// };

export const WithErrorHandling = () => {
  // Use a unique key with timestamp to avoid conflicts between story renders
  const uniqueKey = `errorDemo-${Date.now().toString().slice(-5)}`;
  const { value, setValue, error, isSupported } = useLocalStorage(uniqueKey, {
    message: "This is a valid object",
  });
  const [inputValue, setInputValue] = useState(JSON.stringify(value, null, 2));
  const [showValid, setShowValid] = useState(true);
  const [triggerMessage, setTriggerMessage] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSave = () => {
    try {
      const parsedValue = JSON.parse(inputValue);
      setValue(parsedValue);
    } catch (e) {
      alert(`Invalid JSON: ${e.message}`);
    }
  };

  // Mock localStorage error by forcing the hook to handle a typical localStorage error
  const triggerError = () => {
    setTriggerMessage(
      "Error triggered! This is expected behavior demonstrating error handling."
    );

    // Force the hook to handle a storage error by:
    // 1. Making the hook throw an error during storage operations
    // 2. The error thrown simulates what happens when localStorage is full

    // Create a very large object that would typically cause storage issues
    const largeObject = {
      name: "Storage Error Demo",
      description: "This demonstrates how our hook handles storage errors",
      data: Array(10000).fill(
        "This string is repeated to simulate a large object that might exceed storage limits"
      ),
    };

    // Our hook should catch this error and handle it gracefully
    setValue(largeObject);
  };

  const saveValidObject = () => {
    setValue({
      message: "This is a valid object",
      timestamp: new Date().toISOString(),
    });
    setShowValid(true);
    setTriggerMessage("");
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Local Storage Error Handling Demo</h3>

      <div
        style={{
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          marginBottom: "15px",
        }}
      >
        <strong>Storage key:</strong> {uniqueKey}
        <div style={{ marginTop: "5px", fontSize: "0.9em" }}>
          <strong>Status:</strong> {error ? "Error detected" : "OK"}
        </div>
        <div style={{ marginTop: "5px", fontSize: "0.9em" }}>
          <strong>Local Storage supported:</strong> {isSupported ? "Yes" : "No"}
        </div>
      </div>

      {triggerMessage && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#fff3cd",
            color: "#856404",
            borderRadius: "4px",
            marginBottom: "15px",
            border: "1px solid #ffeeba",
          }}
        >
          <strong>Note:</strong> {triggerMessage}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "15px",
            border: "1px solid #f5c6cb",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0" }}>
            <span
              role="img"
              aria-label="warning"
              style={{ marginRight: "8px" }}
            >
              ⚠️
            </span>
            Storage Error:
          </h4>
          <div>
            <strong>Message:</strong> {error.message}
          </div>
          {error.originalError && (
            <div style={{ marginTop: "5px" }}>
              <strong>Original Error:</strong> {String(error.originalError)}
            </div>
          )}
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={saveValidObject}
              style={{
                padding: "6px 10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9em",
              }}
            >
              Save Valid Object Instead
            </button>
          </div>
        </div>
      )}

      <div>
        <h4>Current localStorage value:</h4>
        <pre
          style={{
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {showValid ? JSON.stringify(value, null, 2) : inputValue}
        </pre>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h4>Edit JSON:</h4>
        <textarea
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setShowValid(false)}
          style={{
            padding: "8px",
            width: "100%",
            height: "120px",
            fontFamily: "monospace",
            marginBottom: "10px",
          }}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleSave}
            style={{
              padding: "8px 12px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save Valid JSON
          </button>
          <button
            onClick={triggerError}
            style={{
              padding: "8px 12px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Trigger Storage Error
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#fff9c4",
          borderRadius: "4px",
          border: "1px solid #fff59d",
          color: "#664d03",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0" }}>About Storage Errors:</h4>
        <p style={{ margin: "0 0 10px 0" }}>
          The "Trigger Storage Error" button attempts to store an extremely
          large object that would typically exceed storage limits. This
          demonstrates how our hook gracefully handles storage errors.
        </p>
        <h4 style={{ margin: "0 0 8px 0" }}>How this demo works:</h4>
        <ul style={{ margin: "0", paddingLeft: "20px" }}>
          <li>
            Edit the JSON and click "Save Valid JSON" to update localStorage
          </li>
          <li>
            Click "Trigger Storage Error" to intentionally create a storage
            error
          </li>
          <li>
            The hook catches errors gracefully and maintains in-memory state
          </li>
          <li>Click "Save Valid Object Instead" to recover from error state</li>
        </ul>
      </div>
    </div>
  );
};

WithErrorHandling.storyName = "With Error Handling";
