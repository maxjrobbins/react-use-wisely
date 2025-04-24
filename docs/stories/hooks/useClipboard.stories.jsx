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
  const [isCopied, copyToClipboard] = useClipboard();

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
            onClick={() => copyToClipboard(textToCopy)}
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
      </div>

      <p style={{ marginTop: "30px", fontStyle: "italic", color: "#666" }}>
        Note: The useClipboard hook will automatically reset the copied state
        after 2 seconds (default timeout).
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
