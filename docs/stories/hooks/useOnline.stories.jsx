import React from "react";
import useOnline from "../../../src/hooks/useOnline";

export default {
  title: "Hooks/useOnline",
  parameters: {
    componentSubtitle: "Hook that tracks online status",
    docs: {
      description: {
        component:
          "A React hook that provides the current online status of the browser.",
      },
    },
  },
};

export const Default = () => {
  const isOnline = useOnline();

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Online Status Demo</h3>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
          backgroundColor: isOnline ? "#e8f5e9" : "#ffebee",
          color: isOnline ? "#2e7d32" : "#c62828",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "10px" }}>
          {isOnline ? "🌐" : "📴"}
        </div>
        <h2 style={{ margin: "0" }}>
          {isOnline ? "You are online" : "You are offline"}
        </h2>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h4>How to test:</h4>
        <ul style={{ paddingLeft: "20px" }}>
          <li>Turn off your Wi-Fi or disconnect from the internet</li>
          <li>The status above will automatically update</li>
          <li>Reconnect to see it change back</li>
        </ul>
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        This hook is useful for building offline-first applications or
        displaying network status to users.
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
