import React, { useState, useEffect } from "react";
import useOnline from "../../../src/hooks/useOnline";

export default {
  title: "Hooks/useOnline",
  parameters: {
    componentSubtitle: "Hook that tracks online status",
    docs: {
      description: {
        component:
          "A React hook that provides the current online status of the browser with error handling and feature detection support.",
      },
    },
  },
};

export const Default = () => {
  const { isOnline, error, lastChanged, isSupported } = useOnline();

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

      <div
        style={{
          marginTop: "15px",
          padding: "10px",
          borderRadius: "4px",
          backgroundColor: "#e3f2fd",
          color: "#0d47a1",
        }}
      >
        <strong>API Support:</strong>{" "}
        {isSupported
          ? "This browser supports the online/offline API"
          : "This browser does not support the online/offline API"}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h4>How to test:</h4>
        <ul style={{ paddingLeft: "20px" }}>
          <li>Turn off your Wi-Fi or disconnect from the internet</li>
          <li>The status above will automatically update</li>
          <li>Reconnect to see it change back</li>
          <li>
            The hook will also periodically ping a server to verify connection
            status
          </li>
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
  const { isOnline, error, lastChanged, isSupported } = useOnline();

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
              <td
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                  fontWeight: "bold",
                }}
              >
                API Support:
              </td>
              <td
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                  color: isSupported ? "#2e7d32" : "#ff8f00",
                }}
              >
                {isSupported ? "Supported" : "Not Supported"}
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
          <li>The hook performs periodic connection checks every 30 seconds</li>
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

export const WithRefresh = () => {
  const { isOnline, error, lastChanged, isSupported, refresh } = useOnline();
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
      setLastRefreshed(new Date());
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Online Status with Manual Refresh</h3>

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

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: refreshing ? "not-allowed" : "pointer",
            opacity: refreshing ? 0.7 : 1,
          }}
        >
          {refreshing ? "Checking..." : "Check Connection Now"}
        </button>

        {lastRefreshed && (
          <div style={{ marginTop: "10px", fontSize: "0.9em", opacity: 0.8 }}>
            Last manual check: {lastRefreshed.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <p>
          This example demonstrates the <code>refresh()</code> method of the
          <code>useOnline</code> hook, which allows manual checking of the
          connection status.
        </p>
        <p>
          This is useful when you want to verify the connection before
          performing a critical network operation.
        </p>
      </div>
    </div>
  );
};

WithRefresh.storyName = "With Manual Refresh";

export const WithCustomOptions = () => {
  const [options, setOptions] = useState({
    pingEndpoint: "https://www.google.com/favicon.ico",
    pingInterval: 30000,
    pingTimeout: 5000,
    enablePing: true,
  });

  const { isOnline, refresh } = useOnline(options);

  const updateOption = (key, value) => {
    setOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Online Status with Custom Options</h3>

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
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>Configuration Options:</h4>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Ping Endpoint:
          </label>
          <select
            value={options.pingEndpoint}
            onChange={(e) => updateOption("pingEndpoint", e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <option value="https://www.google.com/favicon.ico">
              Google Favicon
            </option>
            <option value="https://www.microsoft.com/favicon.ico">
              Microsoft Favicon
            </option>
            <option value="https://www.apple.com/favicon.ico">
              Apple Favicon
            </option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Ping Interval (ms):
          </label>
          <input
            type="range"
            min="5000"
            max="60000"
            step="5000"
            value={options.pingInterval}
            onChange={(e) =>
              updateOption("pingInterval", parseInt(e.target.value))
            }
            style={{ width: "100%" }}
          />
          <div style={{ textAlign: "center" }}>{options.pingInterval}ms</div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Ping Timeout (ms):
          </label>
          <input
            type="range"
            min="1000"
            max="10000"
            step="1000"
            value={options.pingTimeout}
            onChange={(e) =>
              updateOption("pingTimeout", parseInt(e.target.value))
            }
            style={{ width: "100%" }}
          />
          <div style={{ textAlign: "center" }}>{options.pingTimeout}ms</div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={options.enablePing}
              onChange={(e) => updateOption("enablePing", e.target.checked)}
              style={{ marginRight: "10px" }}
            />
            <span style={{ fontWeight: "bold" }}>Enable Automatic Pinging</span>
          </label>
        </div>

        <button
          onClick={() => refresh()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
            marginTop: "10px",
          }}
        >
          Check Connection Now
        </button>
      </div>

      <div style={{ marginTop: "20px", fontSize: "0.9em", color: "#666" }}>
        <p>
          <strong>Note:</strong> Changing these options will cause the hook to
          reinitialize with the new settings. In a real application, you would
          typically set these options once when the component mounts.
        </p>
        <p>
          <strong>Available options:</strong>
        </p>
        <ul>
          <li>
            <code>pingEndpoint</code> - URL to ping to check connection
          </li>
          <li>
            <code>pingInterval</code> - Time between automatic checks (ms)
          </li>
          <li>
            <code>pingTimeout</code> - Timeout for each ping request (ms)
          </li>
          <li>
            <code>enablePing</code> - Whether to enable automatic pinging
          </li>
        </ul>
      </div>
    </div>
  );
};

WithCustomOptions.storyName = "With Custom Options";
