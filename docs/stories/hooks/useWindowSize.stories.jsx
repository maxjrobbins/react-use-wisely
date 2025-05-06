import React from "react";
import useWindowSize from "../../../src/hooks/useWindowSize";

export default {
  title: "Hooks/useWindowSize",
  parameters: {
    componentSubtitle: "Hook that returns the current window dimensions",
    docs: {
      description: {
        component:
          "A React hook that tracks browser window dimensions and updates when the window is resized.",
      },
    },
  },
};

export const Default = () => {
  const { width, height, isSupported, error } = useWindowSize();

  if (error) {
    return (
      <div
        style={{
          padding: "20px",
          border: "1px solid #f44336",
          borderRadius: "4px",
          color: "#f44336",
        }}
      >
        <h3>Error</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Window Size Demo</h3>
      <div style={{ marginBottom: "15px" }}>
        <span
          style={{
            backgroundColor: isSupported ? "#4caf50" : "#f44336",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          {isSupported ? "✓ Supported" : "✗ Not Supported"}
        </span>
      </div>
      <p>
        Current window width: <strong>{width}px</strong>
      </p>
      <p>
        Current window height: <strong>{height}px</strong>
      </p>
      <p style={{ fontStyle: "italic", color: "#666" }}>
        Resize your browser window to see values update in real-time
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
