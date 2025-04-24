import React, { useState } from "react";
import useKeyPress from "../../../src/hooks/useKeyPress";

export default {
  title: "Hooks/useKeyPress",
  parameters: {
    componentSubtitle: "Hook that detects when a key is pressed",
    docs: {
      description: {
        component:
          "A React hook that detects when a specific key or set of keys are pressed.",
      },
    },
  },
};

export const Default = () => {
  const arrowUpPressed = useKeyPress("ArrowUp");
  const arrowDownPressed = useKeyPress("ArrowDown");
  const arrowLeftPressed = useKeyPress("ArrowLeft");
  const arrowRightPressed = useKeyPress("ArrowRight");
  const spacePressed = useKeyPress(" ");

  // Keep track of pressed keys for demo
  const [keyHistory, setKeyHistory] = useState([]);

  React.useEffect(() => {
    const checkKeyPress = () => {
      const pressedKeys = [
        { key: "ArrowUp", pressed: arrowUpPressed },
        { key: "ArrowDown", pressed: arrowDownPressed },
        { key: "ArrowLeft", pressed: arrowLeftPressed },
        { key: "ArrowRight", pressed: arrowRightPressed },
        { key: "Space", pressed: spacePressed },
      ].filter((k) => k.pressed);

      if (pressedKeys.length > 0) {
        const newEntry = {
          keys: pressedKeys.map((k) => k.key).join(" + "),
          timestamp: new Date().toLocaleTimeString(),
        };

        setKeyHistory((prev) => [newEntry, ...prev].slice(0, 5));
      }
    };

    checkKeyPress();
  }, [
    arrowUpPressed,
    arrowDownPressed,
    arrowLeftPressed,
    arrowRightPressed,
    spacePressed,
  ]);

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Key Press Detection Demo</h3>

      <p style={{ marginBottom: "20px" }}>
        Press the keys on your keyboard to see them detected below. Try Arrow
        keys (Up, Down, Left, Right) and Space.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: "10px",
          width: "180px",
          height: "180px",
          margin: "0 auto",
          marginBottom: "30px",
        }}
      >
        {/* Empty top-left */}
        <div></div>

        {/* Up arrow */}
        <div
          style={{
            backgroundColor: arrowUpPressed ? "#e3f2fd" : "#f5f5f5",
            border: `2px solid ${arrowUpPressed ? "#2196F3" : "#ddd"}`,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            boxShadow: arrowUpPressed
              ? "0 0 8px rgba(33, 150, 243, 0.5)"
              : "none",
            transform: arrowUpPressed ? "scale(0.95)" : "scale(1)",
            transition: "all 0.1s ease",
          }}
        >
          ↑
        </div>

        {/* Empty top-right */}
        <div></div>

        {/* Left arrow */}
        <div
          style={{
            backgroundColor: arrowLeftPressed ? "#e3f2fd" : "#f5f5f5",
            border: `2px solid ${arrowLeftPressed ? "#2196F3" : "#ddd"}`,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            boxShadow: arrowLeftPressed
              ? "0 0 8px rgba(33, 150, 243, 0.5)"
              : "none",
            transform: arrowLeftPressed ? "scale(0.95)" : "scale(1)",
            transition: "all 0.1s ease",
          }}
        >
          ←
        </div>

        {/* Space */}
        <div
          style={{
            backgroundColor: spacePressed ? "#e8f5e9" : "#f5f5f5",
            border: `2px solid ${spacePressed ? "#4CAF50" : "#ddd"}`,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            boxShadow: spacePressed ? "0 0 8px rgba(76, 175, 80, 0.5)" : "none",
            transform: spacePressed ? "scale(0.95)" : "scale(1)",
            transition: "all 0.1s ease",
          }}
        >
          Space
        </div>

        {/* Right arrow */}
        <div
          style={{
            backgroundColor: arrowRightPressed ? "#e3f2fd" : "#f5f5f5",
            border: `2px solid ${arrowRightPressed ? "#2196F3" : "#ddd"}`,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            boxShadow: arrowRightPressed
              ? "0 0 8px rgba(33, 150, 243, 0.5)"
              : "none",
            transform: arrowRightPressed ? "scale(0.95)" : "scale(1)",
            transition: "all 0.1s ease",
          }}
        >
          →
        </div>

        {/* Empty bottom-left */}
        <div></div>

        {/* Down arrow */}
        <div
          style={{
            backgroundColor: arrowDownPressed ? "#e3f2fd" : "#f5f5f5",
            border: `2px solid ${arrowDownPressed ? "#2196F3" : "#ddd"}`,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            boxShadow: arrowDownPressed
              ? "0 0 8px rgba(33, 150, 243, 0.5)"
              : "none",
            transform: arrowDownPressed ? "scale(0.95)" : "scale(1)",
            transition: "all 0.1s ease",
          }}
        >
          ↓
        </div>

        {/* Empty bottom-right */}
        <div></div>
      </div>

      <div>
        <h4>Key Press History:</h4>
        {keyHistory.length > 0 ? (
          <ul style={{ listStyle: "none", padding: "0" }}>
            {keyHistory.map((entry, index) => (
              <li
                key={index}
                style={{
                  padding: "8px",
                  marginBottom: "8px",
                  backgroundColor: index === 0 ? "#f0f7ff" : "#f5f5f5",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  <strong>{entry.keys}</strong>
                </span>
                <span style={{ color: "#666" }}>{entry.timestamp}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontStyle: "italic", color: "#666" }}>
            No keys pressed yet. Press any of the monitored keys to see them
            appear here.
          </p>
        )}
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        Note: Make sure this demo has focus by clicking on it first.
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
