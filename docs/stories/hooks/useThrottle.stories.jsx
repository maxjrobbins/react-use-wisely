import React, { useState, useEffect } from "react";
import useThrottle from "../../../src/hooks/useThrottle";

export default {
  title: "Hooks/useThrottle",
  parameters: {
    componentSubtitle: "Hook that throttles a value",
    docs: {
      description: {
        component:
          "A React hook that returns a throttled version of a value, limiting updates to a specified interval.",
      },
    },
  },
};

export const Default = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const throttledPosition = useThrottle(mousePosition, 300); // 300ms throttle
  const [positionLog, setPositionLog] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // Log throttled position changes
    setPositionLog((prev) => {
      const newLog = [
        ...prev,
        {
          ...throttledPosition,
          time: new Date().toLocaleTimeString([], { hour12: false }),
        },
      ];
      return newLog.slice(-5); // Keep only last 5 entries
    });
  }, [throttledPosition]);

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        height: "300px",
      }}
    >
      <h3>Throttle Demo</h3>
      <p>Move your mouse around this container</p>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div>
          <h4>Real-time Position:</h4>
          <pre
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            X: {mousePosition.x}, Y: {mousePosition.y}
          </pre>
        </div>

        <div>
          <h4>Throttled Position (300ms):</h4>
          <pre
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            X: {throttledPosition.x}, Y: {throttledPosition.y}
          </pre>
        </div>
      </div>

      <div>
        <h4>Throttled Position Log:</h4>
        <ul style={{ listStyle: "none", padding: "0" }}>
          {positionLog.map((entry, index) => (
            <li key={index} style={{ marginBottom: "4px" }}>
              [{entry.time}] X: {entry.x}, Y: {entry.y}
            </li>
          ))}
        </ul>
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        Notice how the throttled position updates at most once every 300ms,
        while the real-time position updates continuously.
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
