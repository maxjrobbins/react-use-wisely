import React from "react";
import useHover from "../../../src/hooks/useHover";

export default {
  title: "Hooks/useHover",
  parameters: {
    componentSubtitle: "Hook that tracks hover state",
    docs: {
      description: {
        component:
          "A React hook that detects when the mouse is hovering over a referenced element.",
      },
    },
  },
};

export const Default = () => {
  const [ref, isHovering] = useHover();

  return (
    <div style={{ padding: "20px" }}>
      <h3>Hover Detection Demo</h3>

      <div
        ref={ref}
        style={{
          marginTop: "20px",
          padding: "40px",
          textAlign: "center",
          backgroundColor: isHovering ? "#e0f7fa" : "#f5f5f5",
          border: "2px solid",
          borderColor: isHovering ? "#00bcd4" : "#ddd",
          borderRadius: "8px",
          transition: "all 0.3s ease",
          transform: isHovering ? "scale(1.05)" : "scale(1)",
          cursor: "pointer",
        }}
      >
        <h4 style={{ margin: "0", color: isHovering ? "#00838f" : "#333" }}>
          {isHovering ? "You are hovering over me! 👋" : "Hover over me"}
        </h4>
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
          textAlign: "center",
        }}
      >
        <p>
          <strong>Hover Status:</strong>{" "}
          {isHovering ? "Hovering" : "Not hovering"}
        </p>
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        The useHover hook provides a simple way to track hover state on any
        element.
      </p>

      <div style={{ marginTop: "30px" }}>
        <h4>Additional Examples:</h4>
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "10px",
            flexWrap: "wrap",
          }}
        >
          <HoverCard color="#4CAF50" />
          <HoverCard color="#2196F3" />
          <HoverCard color="#FFC107" />
        </div>
      </div>
    </div>
  );
};

// Example component using the hover hook
const HoverCard = ({ color }) => {
  const [cardRef, isCardHovering] = useHover();

  return (
    <div
      ref={cardRef}
      style={{
        width: "120px",
        height: "120px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isCardHovering ? color : "#f5f5f5",
        color: isCardHovering ? "white" : "#333",
        borderRadius: "8px",
        boxShadow: isCardHovering
          ? "0 4px 8px rgba(0,0,0,0.2)"
          : "0 1px 3px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
      }}
    >
      {isCardHovering ? "😊" : "😐"}
    </div>
  );
};

Default.storyName = "Basic Usage";
