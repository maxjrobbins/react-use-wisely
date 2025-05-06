import React, { useState } from "react";
import useMap from "../../../src/hooks/useMap";

// Defining as a separate variable to ensure Storybook properly recognizes it
const meta = {
  title: "Hooks/useMap",
  parameters: {
    componentSubtitle: "A React hook for Map data structure management",
    docs: {
      description: {
        component:
          "A React hook that provides a convenient wrapper around the native JavaScript Map with state management.",
      },
    },
  },
};

// Export the meta object as default
export default meta;

export const Default = () => {
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [lookupKey, setLookupKey] = useState("");

  const initialMap = new Map([
    ["name", "John Doe"],
    ["age", "30"],
    ["location", "New York"],
  ]);

  const {
    value: map,
    set,
    get,
    remove,
    clear,
    has,
    reset,
  } = useMap(initialMap);

  const handleAdd = (e) => {
    e.preventDefault();
    if (keyInput.trim()) {
      set(keyInput.trim(), valueInput);
      setKeyInput("");
      setValueInput("");
    }
  };

  const handleRemove = (key) => {
    remove(key);
  };

  const mapEntries = Array.from(map.entries());

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>useMap Demo</h3>

      <p style={{ marginBottom: "20px" }}>
        This example demonstrates how to use the <code>useMap</code> hook to
        manage a Map of key-value pairs.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <form
          onSubmit={handleAdd}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label htmlFor="key-input">Key:</label>
            <input
              id="key-input"
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Enter key"
              style={{
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "150px",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label htmlFor="value-input">Value:</label>
            <input
              id="value-input"
              type="text"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              placeholder="Enter value"
              style={{
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "200px",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                height: "40px",
              }}
            >
              Add Entry
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
                height: "40px",
              }}
            >
              Clear All
            </button>

            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "8px 16px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                height: "40px",
              }}
            >
              Reset to Initial
            </button>
          </div>
        </form>

        <div style={{ marginTop: "20px" }}>
          <h4>Lookup Value by Key:</h4>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              value={lookupKey}
              onChange={(e) => setLookupKey(e.target.value)}
              placeholder="Enter key to lookup"
              style={{
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "200px",
              }}
            />
            <div
              style={{
                padding: "8px 16px",
                backgroundColor: lookupKey.trim()
                  ? has(lookupKey.trim())
                    ? "#e8f5e9"
                    : "#ffebee"
                  : "#f5f5f5",
                border: "1px solid #ddd",
                borderRadius: "4px",
                minWidth: "150px",
              }}
            >
              {lookupKey.trim() ? (
                has(lookupKey.trim()) ? (
                  <>
                    Value: <strong>{get(lookupKey.trim())}</strong>
                  </>
                ) : (
                  "Key not found"
                )
              ) : (
                "Enter key to lookup"
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4>Current Map ({mapEntries.length} entries):</h4>
        <div
          style={{
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            padding: "10px",
            minHeight: "100px",
          }}
        >
          {mapEntries.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Key
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Value
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {mapEntries.map(([key, value]) => (
                  <tr key={key} style={{ backgroundColor: "white" }}>
                    <td
                      style={{ padding: "8px", borderBottom: "1px solid #eee" }}
                    >
                      <code>{key}</code>
                    </td>
                    <td
                      style={{ padding: "8px", borderBottom: "1px solid #eee" }}
                    >
                      {value}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #eee",
                        textAlign: "center",
                      }}
                    >
                      <button
                        onClick={() => handleRemove(key)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
                fontStyle: "italic",
                padding: "20px 0",
              }}
            >
              Map is empty
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
            <code>value</code> - The Map instance
          </li>
          <li>
            <code>set(key, value)</code> - Sets a key-value pair in the map
          </li>
          <li>
            <code>get(key)</code> - Gets the value for a key
          </li>
          <li>
            <code>remove(key)</code> - Removes a key-value pair by key
          </li>
          <li>
            <code>clear()</code> - Removes all entries from the map
          </li>
          <li>
            <code>has(key)</code> - Checks if a key exists in the map
          </li>
          <li>
            <code>reset()</code> - Resets the map to its initial state
          </li>
          <li>
            <code>error</code> - Error information (null if no error)
          </li>
        </ul>
      </div>
    </div>
  );
};

Default.storyName = "Basic Usage";
