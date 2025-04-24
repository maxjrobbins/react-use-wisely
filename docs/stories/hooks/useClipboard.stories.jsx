import React, { useState } from "react";
import useClipboard from "../../../src/hooks/useClipboard";

export default {
  title: "Hooks/useClipboard",
  parameters: {
    componentSubtitle: "Hook for clipboard interactions",
    docs: {
      description: {
        component:
          "A React hook that provides utilities for copying text to and reading text from the clipboard.",
      },
    },
  },
};

export const Default = () => {
  const [textToCopy, setTextToCopy] = useState("Hello, clipboard!");
  const { copied, copyToClipboard, clipboardContents, getClipboardContents } =
    useClipboard();

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

        {copied && (
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

      <div>
        <h4>Read from Clipboard</h4>
        <div style={{ marginBottom: "10px" }}>
          <button
            onClick={getClipboardContents}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Read Clipboard
          </button>
        </div>

        {clipboardContents && (
          <div style={{ marginTop: "10px" }}>
            <p>
              <strong>Clipboard contents:</strong>
            </p>
            <pre
              style={{
                padding: "10px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
                maxHeight: "100px",
                overflow: "auto",
                wordBreak: "break-word",
              }}
            >
              {clipboardContents}
            </pre>
          </div>
        )}
      </div>

      <p style={{ marginTop: "30px", fontStyle: "italic", color: "#666" }}>
        Note: Reading from clipboard may require user permission in some
        browsers. Try copying some text first, then click "Read Clipboard".
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
