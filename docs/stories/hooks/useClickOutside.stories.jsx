import React, { useState } from "react";
import useClickOutside from "../../../src/hooks/useClickOutside";

export default {
  title: "Hooks/useClickOutside",
  parameters: {
    componentSubtitle:
      "Hook that detects clicks outside of a specified element",
    docs: {
      description: {
        component:
          "A React hook that triggers a callback when a user clicks outside of the referenced element.",
      },
    },
  },
};

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => {
    if (isOpen) setIsOpen(false);
  });

  return (
    <div style={{ padding: "20px" }}>
      <h3>Click Outside Demo</h3>
      <button onClick={() => setIsOpen(true)}>
        {isOpen ? "Menu is Open" : "Open Menu"}
      </button>

      {isOpen && (
        <div
          ref={ref}
          style={{
            position: "absolute",
            top: "100px",
            left: "20px",
            width: "200px",
            padding: "10px",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <p>
            <strong>This is a dropdown menu</strong>
          </p>
          <p>Click outside to close it</p>
        </div>
      )}

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        {isOpen
          ? "Click anywhere outside the gray box to close it"
          : "Click the button to open a menu, then click outside to close it"}
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
