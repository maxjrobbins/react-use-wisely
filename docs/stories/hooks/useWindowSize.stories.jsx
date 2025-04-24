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
  const size = useWindowSize();

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Window Size Demo</h3>
      <p>
        Current window width: <strong>{size.width}px</strong>
      </p>
      <p>
        Current window height: <strong>{size.height}px</strong>
      </p>
      <p style={{ fontStyle: "italic", color: "#666" }}>
        Resize your browser window to see values update in real-time
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
