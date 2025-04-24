import React, { useState } from "react";
import useWhyDidYouUpdate from "../../../src/hooks/useWhyDidYouUpdate";

export default {
  title: "Hooks/useWhyDidYouUpdate",
  parameters: {
    componentSubtitle: "Hook for debugging component updates",
    docs: {
      description: {
        component:
          "A React hook that logs which props or state caused a component to re-render, useful for debugging performance issues.",
      },
    },
  },
};

// Component that uses the useWhyDidYouUpdate hook
const DebugComponent = ({ label, count, color, obj }) => {
  useWhyDidYouUpdate("DebugComponent", { label, count, color, obj });

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: color,
        borderRadius: "4px",
        marginBottom: "20px",
      }}
    >
      <h4>{label}</h4>
      <p>Count: {count}</p>
      <p>Object value: {obj.value}</p>
    </div>
  );
};

export const Default = () => {
  const [count, setCount] = useState(0);
  const [label, setLabel] = useState("Debug Component");
  const [color, setColor] = useState("#f5f5f5");
  const [objValue, setObjValue] = useState(0);

  // This object will be recreated on every render
  const obj = { value: objValue };

  // Create a stable object reference that won't change unless objValue changes
  const stableObj = React.useMemo(() => ({ value: objValue }), [objValue]);

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Why Did You Update Demo</h3>

      <p style={{ marginBottom: "20px" }}>
        This hook logs when props or state change, causing re-renders. Open your
        browser's console to see these logs.
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setCount((c) => c + 1)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Increment Count
        </button>

        <button
          onClick={() =>
            setLabel((prev) =>
              prev === "Debug Component" ? "Updated Label" : "Debug Component"
            )
          }
          style={{
            padding: "8px 16px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Toggle Label
        </button>

        <button
          onClick={() =>
            setColor((prev) => (prev === "#f5f5f5" ? "#e0f7fa" : "#f5f5f5"))
          }
          style={{
            padding: "8px 16px",
            backgroundColor: "#9C27B0",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Toggle Color
        </button>

        <button
          onClick={() => setObjValue((v) => v + 1)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#FF5722",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Update Object Value
        </button>
      </div>

      <div
        style={{
          padding: "15px",
          backgroundColor: "#fffde7",
          borderRadius: "4px",
          marginBottom: "30px",
          border: "1px solid #fbc02d",
        }}
      >
        <p>
          <strong>Note:</strong> Look at your browser's console to see the debug
          output from the hook.
        </p>
        <p>
          You'll see that when only the count changes, only the count prop is
          logged as changed.
        </p>
        <p>
          However, <code>obj</code> will always appear as changed because it's
          recreated every render.
        </p>
        <p>
          <code>stableObj</code> only changes when the objValue changes due to
          useMemo.
        </p>
      </div>

      <div>
        <h4>Example 1: Unstable Object Reference</h4>
        <p>
          This component receives a new object reference on every render, even
          if the value inside hasn't changed.
        </p>
        <DebugComponent label={label} count={count} color={color} obj={obj} />

        <h4>Example 2: With useMemo</h4>
        <p>
          This component only gets a new object reference when the actual value
          changes.
        </p>
        <DebugComponent
          label={label}
          count={count}
          color={color}
          obj={stableObj}
        />
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        This hook is useful for finding unnecessary rerenders and optimizing
        performance.
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
