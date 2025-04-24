import React, { useState } from "react";
import useClipboard from "../../../src/hooks/useClipboard";

export default {
  title: "Hooks/useClipboard",
  parameters: {
    componentSubtitle: "Hook for clipboard interactions",
    docs: {
      description: {
        component:
          "A React hook that provides utilities for copying text to the clipboard.",
      },
    },
  },
};

export const Default = () => {
  const [textToCopy, setTextToCopy] = useState("Hello, clipboard!");
  const { isCopied, error, copy, reset } = useClipboard();

  const handleCopy = async () => {
    await copy(textToCopy);
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Clipboard Interaction Demo</h3>

      <div style={{ marginBottom: "30px" }}>
        <h4>Copy to Clipboard</h4>
        <div style={{ display: "flex", marginBottom: "10px" }}>
          <input
            type="text"
            value={textToCopy}
            onChange={(e) => setTextToCopy(e.target.value)}
            style={{
              padding: "8px",
              marginRight: "10px",
              flexGrow: 1,
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            placeholder="Enter text to copy..."
          />
          <button
            onClick={handleCopy}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Copy Text
          </button>
        </div>

        {isCopied && (
          <div
            style={{
              padding: "8px",
              backgroundColor: "#e8f5e9",
              color: "#2e7d32",
              borderRadius: "4px",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              role="img"
              aria-label="success"
              style={{ marginRight: "8px" }}
            >
              ✅
            </span>
            Text copied to clipboard!
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "8px",
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: "4px",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span role="img" aria-label="error" style={{ marginRight: "8px" }}>
              ⚠️
            </span>
            {error.message}
          </div>
        )}
      </div>

      <p style={{ marginTop: "30px", fontStyle: "italic", color: "#666" }}>
        Note: The useClipboard hook will automatically reset the copied state
        after 2 seconds (default timeout).
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";

export const WithErrorHandling = () => {
  const [textToCopy, setTextToCopy] = useState("Hello, clipboard!");
  const { isCopied, error, copy, reset } = useClipboard();

  const handleCopy = async () => {
    const success = await copy(textToCopy);
    console.log(`Copy successful: ${success}`);
  };

  const handleReset = () => {
    reset();
    setTextToCopy("");
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Advanced Clipboard Demo with Error Handling</h3>

      <div style={{ marginBottom: "30px" }}>
        <h4>Copy to Clipboard</h4>
        <div style={{ display: "flex", marginBottom: "10px" }}>
          <input
            type="text"
            value={textToCopy}
            onChange={(e) => setTextToCopy(e.target.value)}
            style={{
              padding: "8px",
              marginRight: "10px",
              flexGrow: 1,
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            placeholder="Enter text to copy..."
          />
          <button
            onClick={handleCopy}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "8px",
            }}
          >
            Copy Text
          </button>
          <button
            onClick={handleReset}
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

        {isCopied && (
          <div
            style={{
              padding: "8px",
              backgroundColor: "#e8f5e9",
              color: "#2e7d32",
              borderRadius: "4px",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              role="img"
              aria-label="success"
              style={{ marginRight: "8px" }}
            >
              ✅
            </span>
            Text copied to clipboard!
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: "4px",
              marginTop: "10px",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
              <span
                role="img"
                aria-label="error"
                style={{ marginRight: "8px" }}
              >
                ⚠️
              </span>
              Clipboard Error:
            </div>
            <div>{error.message}</div>
            {error.originalError && (
              <div style={{ marginTop: "4px", fontSize: "0.9em" }}>
                Original error: {String(error.originalError)}
              </div>
            )}
          </div>
        )}
      </div>

      <p style={{ marginTop: "30px", fontStyle: "italic", color: "#666" }}>
        Note: This example shows detailed error information and provides a reset
        button to clear the state.
      </p>
    </div>
  );
};

WithErrorHandling.storyName = "With Error Handling";
