import React, { useState } from "react";
import usePrevious from "../../../src/hooks/usePrevious";

export default {
  title: "Hooks/usePrevious",
  parameters: {
    componentSubtitle: "Hook that returns the previous value of a variable",
    docs: {
      description: {
        component:
          "A React hook that stores and returns the previous value of a variable from the last render.",
      },
    },
  },
};

export const Default = () => {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Previous Value Demo</h3>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setCount(count - 1)}
          style={{ padding: "8px 12px" }}
        >
          -
        </button>

        <button
          onClick={() => setCount(count + 1)}
          style={{ padding: "8px 12px" }}
        >
          +
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <h4>Current Value:</h4>
          <pre
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            {count}
          </pre>
        </div>

        <div>
          <h4>Previous Value:</h4>
          <pre
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            {previousCount === undefined ? "undefined" : previousCount}
          </pre>
        </div>
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        Click the buttons to change the count. The previous value will always be
        one step behind.
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
