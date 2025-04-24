import React, { useState } from "react";
import useDebounce from "../../../src/hooks/useDebounce";

export default {
  title: "Hooks/useDebounce",
  parameters: {
    componentSubtitle: "Hook that debounces a value",
    docs: {
      description: {
        component:
          "A React hook that returns a debounced version of a value, updating only after a specified delay has passed without changes.",
      },
    },
  },
};

export const Default = () => {
  const [inputValue, setInputValue] = useState("");
  const debouncedValue = useDebounce(inputValue, 500); // 500ms delay

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Debounce Demo</h3>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="search"
          style={{ display: "block", marginBottom: "8px" }}
        >
          Type something (debounced value updates after 500ms):
        </label>
        <input
          id="search"
          type="text"
          value={inputValue}
          onChange={handleChange}
          style={{ padding: "8px", width: "100%", maxWidth: "300px" }}
          placeholder="Start typing..."
        />
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <h4>Immediate Value:</h4>
          <pre
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            {inputValue}
          </pre>
        </div>

        <div>
          <h4>Debounced Value (500ms):</h4>
          <pre
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            {debouncedValue}
          </pre>
        </div>
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        The debounced value will only update after you stop typing for 500ms.
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
