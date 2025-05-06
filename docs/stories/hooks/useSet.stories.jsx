import React, { useState } from "react";
import useSet from "../../../src/hooks/useSet";

// Defining as a separate variable to ensure Storybook properly recognizes it
const meta = {
  title: "Hooks/useSet",
  parameters: {
    componentSubtitle:
      "A React hook for Set data structure with convenient methods",
    docs: {
      description: {
        component:
          "This hook provides a stateful Set with additional utility methods for adding, deleting, and checking elements.",
      },
    },
  },
};

// Export the meta object as default
export default meta;

export const Default = () => {
  const [inputValue, setInputValue] = useState("");
  const [checkValue, setCheckValue] = useState("");

  // Initialize with some default values
  const { value, add, remove, has, clear, toggle } = useSet([
    "apple",
    "banana",
    "orange",
  ]);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      add(inputValue.trim());
      setInputValue("");
    }
  };

  const handleCheck = (e) => {
    e.preventDefault();
    if (checkValue.trim()) {
      // The has function is already provided by the hook
    }
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>useSet Demo</h3>

      <p style={{ marginBottom: "20px" }}>
        This example demonstrates how to use the <code>useSet</code> hook to
        manage a Set of values.
      </p>

      <div style={{ display: "flex", marginBottom: "20px" }}>
        <form
          onSubmit={handleAddItem}
          style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter item"
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              flexGrow: 1,
              minWidth: "200px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add Item
          </button>
          <button
            type="button"
            onClick={() => clear()}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear All
          </button>
        </form>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>Check if item exists in set:</h4>
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <input
            type="text"
            value={checkValue}
            onChange={(e) => setCheckValue(e.target.value)}
            placeholder="Check item"
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              flexGrow: 1,
            }}
          />
          <div
            style={{
              padding: "8px 16px",
              backgroundColor: checkValue.trim()
                ? has(checkValue.trim())
                  ? "#e8f5e9"
                  : "#ffebee"
                : "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: "4px",
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            {checkValue.trim()
              ? has(checkValue.trim())
                ? "Exists"
                : "Not found"
              : "Enter item to check"}
          </div>
        </div>
      </div>

      <div>
        <h4>Current Set ({value.size} items):</h4>
        <div
          style={{
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            padding: "10px",
            minHeight: "100px",
          }}
        >
          {value.size > 0 ? (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {[...value].map((item) => (
                <li
                  key={item}
                  style={{
                    backgroundColor: "white",
                    padding: "8px 12px",
                    borderRadius: "30px",
                    border: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>{item}</span>
                  <button
                    onClick={() => remove(item)}
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "12px",
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
                fontStyle: "italic",
              }}
            >
              Set is empty
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          backgroundColor: "#e3f2fd",
          padding: "15px",
          borderRadius: "4px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>Hook API:</h4>
        <ul style={{ margin: "0", paddingLeft: "20px" }}>
          <li>
            <code>value</code> - The Set data structure
          </li>
          <li>
            <code>add(item)</code> - Adds an item to the set
          </li>
          <li>
            <code>remove(item)</code> - Removes an item from the set
          </li>
          <li>
            <code>clear()</code> - Removes all items from the set
          </li>
          <li>
            <code>has(item)</code> - Checks if an item exists in the set
          </li>
          <li>
            <code>toggle(item)</code> - Adds item if not present, removes if
            present
          </li>
        </ul>
      </div>
    </div>
  );
};

Default.storyName = "Basic Usage";
