import React, { useState } from "react";
import useLocalStorage from "../../../src/hooks/useLocalStorage";

export default {
  title: "Hooks/useLocalStorage",
  parameters: {
    componentSubtitle: "Hook for persistent local storage state",
    docs: {
      description: {
        component:
          "A React hook that syncs and persists state with localStorage, maintaining values between page refreshes.",
      },
    },
  },
};

export const Default = () => {
  // Use a unique key with timestamp to avoid conflicts between story renders
  const uniqueKey = `demoKey-${Date.now().toString().slice(-5)}`;
  const [storedValue, setStoredValue] = useLocalStorage(
    uniqueKey,
    "Hello world!"
  );
  const [inputValue, setInputValue] = useState(storedValue);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSave = () => {
    setStoredValue(inputValue);
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Local Storage Demo</h3>
      <p>
        Current value in localStorage[{uniqueKey}]:{" "}
        <strong>{storedValue}</strong>
      </p>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button onClick={handleSave}>Save to localStorage</button>
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        Try updating the value and clicking "Save". The value will persist in
        localStorage even if you refresh the page.
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
