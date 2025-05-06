import React, { useEffect, useState } from "react";
import { Meta } from "@storybook/react";
import usePageVisibility from "../../../src/hooks/usePageVisibility";

export default {
  title: "Hooks/usePageVisibility",
  parameters: {
    componentSubtitle: "Hook to detect when users navigate away from the page",
    docs: {
      description: {
        component:
          "A React hook that detects when a user changes tabs or minimizes the browser window, making the current page hidden. This is useful for pausing animations, stopping videos, or reducing network requests when the user isn't actively viewing the page.",
      },
    },
  },
} as Meta;

export const Default = () => {
  const { isVisible, isSupported, error } = usePageVisibility();
  const [visibilityHistory, setVisibilityHistory] = useState<
    Array<{ timestamp: string; isVisible: boolean }>
  >([]);
  const [manuallyTriggered, setManuallyTriggered] = useState(false);

  // Add visibility changes to history
  useEffect(() => {
    if (!manuallyTriggered) {
      const timestamp = new Date().toLocaleTimeString();
      setVisibilityHistory((prev) => [
        { timestamp, isVisible },
        ...prev.slice(0, 9), // Keep only the last 10 entries
      ]);
    }
    setManuallyTriggered(false);
  }, [isVisible, manuallyTriggered]);

  // Simulate a visibility change event for demonstration purposes
  const simulateVisibilityChange = (visible: boolean) => {
    setManuallyTriggered(true);
    const timestamp = new Date().toLocaleTimeString();
    setVisibilityHistory((prev) => [
      { timestamp, isVisible: visible },
      ...prev.slice(0, 9),
    ]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Page Visibility Demo</h2>

      <div
        style={{
          padding: "15px",
          background: "#f9f9f9",
          border: "1px solid #ddd",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        <h3>Current Status</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: isVisible ? "#4CAF50" : "#F44336",
            }}
          ></div>
          <p style={{ margin: 0 }}>
            Page is currently{" "}
            <strong>{isVisible ? "visible" : "hidden"}</strong>
          </p>
        </div>
        <p style={{ marginTop: "10px" }}>
          API Support:{" "}
          <span
            style={{
              color: isSupported ? "#4CAF50" : "#F44336",
              fontWeight: "bold",
            }}
          >
            {isSupported ? "Supported" : "Not Supported"}
          </span>
        </p>
        {error && (
          <p style={{ marginTop: "10px", color: "#F44336" }}>
            Error: {error.message}
          </p>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Test with Real Browser Behavior</h3>
        <p>To see this hook in action, try the following:</p>
        <ul>
          <li>Switch to another tab or window</li>
          <li>Minimize your browser</li>
          <li>Use Alt+Tab to switch applications</li>
          <li>Return to this tab to see the page visibility history updated</li>
        </ul>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Simulation Buttons</h3>
        <p>
          These buttons simulate visibility changes in this demo, but do not
          affect the actual hook state which responds to real browser events.
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => simulateVisibilityChange(false)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#F44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Simulate Tab Hidden
          </button>
          <button
            onClick={() => simulateVisibilityChange(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Simulate Tab Visible
          </button>
        </div>
      </div>

      <div>
        <h3>Visibility Change History</h3>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "4px",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Time
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {visibilityHistory.length > 0 ? (
                visibilityHistory.map((entry, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {entry.timestamp}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: entry.isVisible
                            ? "#E8F5E9"
                            : "#FFEBEE",
                          color: entry.isVisible ? "#2E7D32" : "#C62828",
                        }}
                      >
                        {entry.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    style={{ padding: "20px", textAlign: "center" }}
                  >
                    No visibility changes recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Common Use Cases</h3>
        <ul>
          <li>Pause video/audio playback when tab is not visible</li>
          <li>Pause animations or CPU-intensive operations</li>
          <li>Delay non-critical network requests</li>
          <li>Show welcome back message when user returns</li>
          <li>Track user engagement more accurately</li>
        </ul>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Example Usage</h3>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "15px",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {`import usePageVisibility from 'react-use-wisely/usePageVisibility';

function VideoPlayer() {
  const { isVisible, isSupported, error } = usePageVisibility();
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (videoRef.current && !error) {
      if (isVisible) {
        // Resume video when tab becomes visible
        videoRef.current.play();
      } else {
        // Pause video when tab is hidden
        videoRef.current.pause();
      }
    }
  }, [isVisible, error]);
  
  // Error handling
  if (error) {
    return <div>Error detecting page visibility: {error.message}</div>;
  }
  
  // Fallback for unsupported browsers
  if (!isSupported) {
    return <video ref={videoRef} src="your-video.mp4" controls />;
  }
  
  return <video ref={videoRef} src="your-video.mp4" />;
}`}
        </pre>
      </div>
    </div>
  );
};

Default.storyName = "Basic Usage";
