import React, { useState } from "react";
import useIdle from "../../../src/hooks/useIdle";

export default {
  title: "Hooks/useIdle",
  parameters: {
    componentSubtitle: "Hook that detects when the user is idle",
    docs: {
      description: {
        component:
          "A React hook that tracks user activity and detects when the user has been idle for a specified duration.",
      },
    },
  },
};

export const Default = () => {
  const [idleTime, setIdleTime] = useState(3000);
  const isIdle = useIdle(idleTime);
  const [lastActivity, setLastActivity] = useState(new Date());
  const [idleEvents, setIdleEvents] = useState([]);

  React.useEffect(() => {
    const handleActivity = () => {
      setLastActivity(new Date());
    };

    // Add event listeners to track user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, []);

  // Log idle state changes
  React.useEffect(() => {
    setIdleEvents((prev) => [
      {
        timestamp: new Date().toLocaleTimeString(),
        state: isIdle ? "Became Idle" : "Became Active",
      },
      ...prev.slice(0, 4), // Keep only the 5 most recent events
    ]);
  }, [isIdle]);

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>User Idle Detection Demo</h3>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="idle-time"
          style={{ display: "block", marginBottom: "8px" }}
        >
          Idle Timeout: {idleTime / 1000} seconds
        </label>
        <input
          id="idle-time"
          type="range"
          min="1000"
          max="10000"
          step="1000"
          value={idleTime}
          onChange={(e) => setIdleTime(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          borderRadius: "8px",
          backgroundColor: isIdle ? "#ffebee" : "#e8f5e9",
          color: isIdle ? "#c62828" : "#2e7d32",
          marginBottom: "20px",
          transition: "all 0.5s ease",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>
            {isIdle ? "😴" : "👋"}
          </div>
          <h2 style={{ margin: "0", fontSize: "24px" }}>
            {isIdle ? "User is idle" : "User is active"}
          </h2>
          <p style={{ margin: "10px 0 0 0" }}>
            {isIdle
              ? `Move your mouse or press a key to become active`
              : `Stay inactive for ${idleTime / 1000} seconds to become idle`}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: "1", minWidth: "250px" }}>
          <h4>User Activity Info</h4>
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
                  Current Status
                </td>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    backgroundColor: isIdle ? "#fff8e1" : "#f1f8e9",
                  }}
                >
                  {isIdle ? "Idle" : "Active"}
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
                  Idle Timeout
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {idleTime / 1000} seconds
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
                  Last Activity
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {lastActivity.toLocaleTimeString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ flex: "1", minWidth: "250px" }}>
          <h4>Idle State Change Log</h4>
          {idleEvents.length > 0 ? (
            <ul
              style={{
                listStyle: "none",
                padding: "0",
                margin: "0",
                backgroundColor: "#f5f5f5",
                border: "1px solid #ddd",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {idleEvents.map((event, index) => (
                <li
                  key={index}
                  style={{
                    padding: "8px 12px",
                    borderBottom:
                      index < idleEvents.length - 1 ? "1px solid #ddd" : "none",
                    backgroundColor: index === 0 ? "#f5f5f5" : "transparent",
                  }}
                >
                  <span
                    style={{
                      color:
                        event.state === "Became Idle" ? "#c62828" : "#2e7d32",
                      fontWeight: "bold",
                      marginRight: "8px",
                    }}
                  >
                    {event.state}
                  </span>
                  <span style={{ color: "#666" }}>at {event.timestamp}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontStyle: "italic", color: "#666" }}>
              No state changes recorded yet
            </p>
          )}
        </div>
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        This hook is useful for building auto-logout features, screensavers, or
        any feature that needs to respond when users are inactive.
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
