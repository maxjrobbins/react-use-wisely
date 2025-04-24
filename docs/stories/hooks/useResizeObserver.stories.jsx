import React, { useRef, useState } from "react";
import useResizeObserver from "../../../src/hooks/useResizeObserver";

export default {
  title: "Hooks/useResizeObserver",
  parameters: {
    componentSubtitle: "Hook that tracks element size changes",
    docs: {
      description: {
        component:
          "A React hook that observes and reports size changes of a DOM element using ResizeObserver API.",
      },
    },
  },
};

export const Default = () => {
  const ref = useRef(null);
  const { width, height } = useResizeObserver(ref);
  const [containerWidth, setContainerWidth] = useState(400);

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Resize Observer Demo</h3>

      <p style={{ marginBottom: "20px" }}>
        This hook detects when an element changes size. Drag the slider below to
        change the container's width and observe the measurements updating in
        real-time.
      </p>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="width-control"
          style={{ display: "block", marginBottom: "8px" }}
        >
          Container Width: {containerWidth}px
        </label>
        <input
          id="width-control"
          type="range"
          min="200"
          max="600"
          value={containerWidth}
          onChange={(e) => setContainerWidth(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      <div
        style={{
          width: `${containerWidth}px`,
          border: "2px dashed #2196F3",
          padding: "20px",
          marginBottom: "20px",
          transition: "all 0.3s ease",
        }}
      >
        <div
          ref={ref}
          style={{
            backgroundColor: "#e3f2fd",
            padding: "20px",
            borderRadius: "4px",
            border: "1px solid #bbdefb",
            height: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0" }}>Observed Element</h4>
          <p>My size is being tracked</p>

          {width && height && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "rgba(33, 150, 243, 0.8)",
                color: "white",
                padding: "6px 10px",
                fontSize: "14px",
                borderTopLeftRadius: "4px",
              }}
            >
              {Math.round(width)}px × {Math.round(height)}px
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        <h4 style={{ marginTop: "0" }}>Element Dimensions</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  fontWeight: "bold",
                }}
              >
                Width
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {width ? `${Math.round(width)}px` : "Not measured yet"}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  fontWeight: "bold",
                }}
              >
                Height
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {height ? `${Math.round(height)}px` : "Not measured yet"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={{ fontStyle: "italic", color: "#666" }}>
        The ResizeObserver API allows you to respond to changes in an element's
        size without causing layout thrashing or using polling. This is useful
        for responsive components that need to adapt their behavior based on
        their container's size rather than just the viewport.
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
