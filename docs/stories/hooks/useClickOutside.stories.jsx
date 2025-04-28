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
  const [isEnabled, setIsEnabled] = useState(true);

  const { ref, error, isSupported } = useClickOutside(
    () => {
      if (isOpen && isEnabled) setIsOpen(false);
    },
    { enabled: isEnabled }
  );

  return (
    <div style={{ padding: "20px" }}>
      <h3>Click Outside Demo</h3>

      <div
        style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}
      >
        <button onClick={() => setIsOpen(true)} style={{ marginRight: "10px" }}>
          {isOpen ? "Menu is Open" : "Open Menu"}
        </button>

        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            style={{ marginRight: "8px" }}
          />
          Enable click outside detection
        </label>
      </div>

      {!isSupported && (
        <div
          style={{
            backgroundColor: "#fff3cd",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          ⚠️ Click outside detection is not supported in this environment.
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          ❌ Error: {error.message}
        </div>
      )}

      {isOpen && (
        <div
          ref={ref}
          style={{
            position: "absolute",
            top: "150px",
            left: "20px",
            width: "250px",
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
          <p>
            Click outside to close it {isEnabled ? "" : "(currently disabled)"}
          </p>
        </div>
      )}

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        {isOpen
          ? `Click anywhere outside the gray box to close it${
              isEnabled ? "" : " (detection is currently disabled)"
            }`
          : "Click the button to open a menu, then click outside to close it"}
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
