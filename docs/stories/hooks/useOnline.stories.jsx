import React from "react";
import useOnline from "../../../src/hooks/useOnline";

export default {
  title: "Hooks/useOnline",
  parameters: {
    componentSubtitle: "Hook that tracks online status",
    docs: {
      description: {
        component:
          "A React hook that provides the current online status of the browser with error handling.",
      },
    },
  },
};

export const Default = () => {
  const { isOnline, error, lastChanged } = useOnline();

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Online Status Demo</h3>

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            border: "1px solid #ffcdd2",
          }}
        >
          <strong>Error:</strong> {error.message}
        </div>
      )}

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
        <h2 style={{ margin: "0 0 10px 0" }}>
          {isOnline ? "You are online" : "You are offline"}
        </h2>
        {lastChanged && (
          <div style={{ fontSize: "0.9em", opacity: 0.8 }}>
            Status changed: {lastChanged.toLocaleTimeString()}
          </div>
        )}
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

export const WithErrorDetails = () => {
  const { isOnline, error, lastChanged } = useOnline();

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    return timestamp.toLocaleString();
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Online Status with Error Handling</h3>

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            border: "1px solid #ffcdd2",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0" }}>
            <span
              role="img"
              aria-label="warning"
              style={{ marginRight: "8px" }}
            >
              ⚠️
            </span>
            Network Error:
          </h4>
          <div>
            <strong>Message:</strong> {error.message}
          </div>
          {error.originalError && (
            <div style={{ marginTop: "5px" }}>
              <strong>Original Error:</strong> {String(error.originalError)}
            </div>
          )}
        </div>
      )}

      <div
        style={{
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
          backgroundColor: isOnline ? "#e8f5e9" : "#ffebee",
          color: isOnline ? "#2e7d32" : "#c62828",
          border: isOnline ? "1px solid #c8e6c9" : "1px solid #ffcdd2",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "10px" }}>
          {isOnline ? "🌐" : "📴"}
        </div>
        <h2 style={{ margin: "0 0 10px 0" }}>
          {isOnline ? "You are online" : "You are offline"}
        </h2>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>Network Status Details:</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                  fontWeight: "bold",
                }}
              >
                Status:
              </td>
              <td
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                  color: isOnline ? "#2e7d32" : "#c62828",
                }}
              >
                {isOnline ? "Connected" : "Disconnected"}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                  fontWeight: "bold",
                }}
              >
                Last Changed:
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {formatTimestamp(lastChanged)}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                  fontWeight: "bold",
                }}
              >
                Error State:
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {error ? "Error Detected" : "No Errors"}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px", fontWeight: "bold" }}>
                Navigator Info:
              </td>
              <td style={{ padding: "8px" }}>
                {typeof navigator !== "undefined" &&
                navigator.onLine !== undefined
                  ? "Browser supports online detection"
                  : "Browser may not support online detection"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h4>How to test:</h4>
        <ol style={{ paddingLeft: "20px" }}>
          <li>Open your browser's developer tools (F12)</li>
          <li>
            Go to Network tab and enable "Offline" mode to simulate
            disconnection
          </li>
          <li>Or disconnect your device from the internet</li>
          <li>Watch the status and timestamp update automatically</li>
        </ol>
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        This example demonstrates error handling for network status monitoring.
        The hook will recover automatically if the browser API becomes available
        again.
      </p>
    </div>
  );
};

WithErrorDetails.storyName = "With Error Handling";
