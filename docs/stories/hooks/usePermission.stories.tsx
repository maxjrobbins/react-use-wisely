import React, { useState, CSSProperties } from "react";
import { Meta, StoryObj } from "@storybook/react";
import usePermission from "../../../src/hooks/usePermission";
import { PermissionError } from "../../../src/hooks/errors";

const meta: Meta = {
  title: "Hooks/usePermission",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`usePermission\` is a hook for handling browser permission requests in a standardized way.
It provides an easy-to-use interface to check and request permissions with proper error handling.

## Features
- Handles common browser permissions (geolocation, camera, microphone, etc.)
- Provides standardized state information (granted, denied, prompt)
- Exposes loading state during async operations
- Handles errors with clean error messages
- Includes feature detection for different browsers

## Usage

\`\`\`jsx
import usePermission from './hooks/usePermission';

function MyComponent() {
  const {
    state,          // Current permission state: "granted", "denied", "prompt", or "unsupported"
    isGranted,      // Boolean: is permission granted
    isDenied,       // Boolean: is permission denied
    isPrompt,       // Boolean: is permission in prompt state
    isSupported,    // Boolean: is this permission supported in the browser
    isLoading,      // Boolean: true during async operations
    error,          // Error object or null
    request,        // Function to request permission
  } = usePermission("camera");

  const handleRequestAccess = async () => {
    try {
      const result = await request();
      console.log("Permission result:", result);
    } catch (err) {
      console.error("Error requesting permission:", err);
    }
  };
  
  return (
    <div>
      <div>Permission state: {state}</div>
      {isGranted && <div>✅ Permission granted</div>}
      {isDenied && <div>❌ Permission denied</div>}
      {isPrompt && <div>❓ Permission can be requested</div>}
      {!isSupported && <div>⚠️ Permission not supported</div>}
      {error && <div>🚨 Error: {error.message}</div>}
      <button 
        onClick={handleRequestAccess}
        disabled={isLoading || !isSupported}
      >
        {isLoading ? 'Requesting...' : 'Request Permission'}
      </button>
    </div>
  );
}
\`\`\`
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const styles: Record<string, CSSProperties> = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "sans-serif",
  },
  card: {
    border: "1px solid #e1e1e1",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  header: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  status: {
    display: "flex",
    flexDirection: "column" as "column",
    gap: "8px",
    margin: "15px 0",
  },
  statusItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  button: {
    backgroundColor: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    cursor: "not-allowed",
  },
  loadingButton: {
    backgroundColor: "#7fb1ec",
  },
  error: {
    color: "#e53935",
    marginTop: "10px",
    padding: "8px",
    backgroundColor: "#ffebee",
    borderRadius: "4px",
  },
  section: {
    marginBottom: "30px",
  },
  tabs: {
    display: "flex",
    gap: "2px",
    marginBottom: "20px",
  },
  tab: {
    padding: "8px 16px",
    border: "1px solid #e1e1e1",
    borderRadius: "4px 4px 0 0",
    cursor: "pointer",
  },
  activeTab: {
    backgroundColor: "#4a90e2",
    color: "white",
    borderColor: "#4a90e2",
  },
};

// Component to display permission status with consistent styling
const PermissionStatus = ({ status, value, icon }) => (
  <div style={styles.statusItem}>
    {icon}
    <span>
      <strong>{status}:</strong> {value.toString()}
    </span>
  </div>
);

const PermissionCard = ({ type, title, icon }) => {
  const {
    state,
    isGranted,
    isDenied,
    isPrompt,
    isSupported,
    isLoading,
    error,
    request,
  } = usePermission(type);

  const handleRequestAccess = async () => {
    try {
      await request();
    } catch (err) {
      // Error is already captured in the hook
      console.error("Error requesting permission:", err);
    }
  };

  const buttonStyle = {
    ...styles.button,
    ...(isLoading ? styles.loadingButton : {}),
    ...(!isSupported || isDenied ? styles.disabledButton : {}),
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span>
          {icon} {title}
        </span>
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            backgroundColor: isGranted
              ? "#e6f7e6"
              : isDenied
              ? "#ffe6e6"
              : isPrompt
              ? "#fff9e6"
              : "#f0f0f0",
            color: isGranted
              ? "#2e7d32"
              : isDenied
              ? "#c62828"
              : isPrompt
              ? "#f57c00"
              : "#757575",
          }}
        >
          {state}
        </span>
      </div>

      <div style={styles.status}>
        <PermissionStatus
          status="Granted"
          value={isGranted}
          icon={isGranted ? "✅" : "⬜"}
        />
        <PermissionStatus
          status="Denied"
          value={isDenied}
          icon={isDenied ? "❌" : "⬜"}
        />
        <PermissionStatus
          status="Prompt available"
          value={isPrompt}
          icon={isPrompt ? "❓" : "⬜"}
        />
        <PermissionStatus
          status="Supported"
          value={isSupported}
          icon={isSupported ? "✅" : "❌"}
        />
        <PermissionStatus
          status="Loading"
          value={isLoading}
          icon={isLoading ? "⏳" : "⬜"}
        />
      </div>

      <button
        onClick={handleRequestAccess}
        disabled={isLoading || !isSupported || isDenied}
        style={buttonStyle}
      >
        {isLoading
          ? "Requesting..."
          : isSupported
          ? "Request Permission"
          : "Not Supported"}
      </button>

      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error.message}
        </div>
      )}
    </div>
  );
};

// Main Example
const PermissionDemo = () => {
  const [activeTab, setActiveTab] = useState("common");

  const commonPermissions = [
    { type: "geolocation", title: "Geolocation", icon: "📍" },
    { type: "notifications", title: "Notifications", icon: "🔔" },
    { type: "camera", title: "Camera", icon: "📷" },
    { type: "microphone", title: "Microphone", icon: "🎤" },
  ];

  const clipboardPermissions = [
    { type: "clipboard-read", title: "Clipboard Read", icon: "📋" },
    { type: "clipboard-write", title: "Clipboard Write", icon: "✍️" },
  ];

  const otherPermissions = [
    { type: "push", title: "Push Notifications", icon: "📲" },
    { type: "midi", title: "MIDI Devices", icon: "🎹" },
    { type: "bluetooth", title: "Bluetooth", icon: "📶" },
    { type: "display-capture", title: "Screen Capture", icon: "🖥️" },
  ];

  const permissionsToShow =
    activeTab === "common"
      ? commonPermissions
      : activeTab === "clipboard"
      ? clipboardPermissions
      : otherPermissions;

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h2>Browser Permissions Demo</h2>
        <p>
          This demo shows how to use the usePermission hook to check and request
          various browser permissions. Click the buttons to request permission.
          Your browser may prompt you to allow or deny access.
        </p>
        <p>
          <strong>Note:</strong> Some permissions may not be supported in your
          browser or may require HTTPS.
        </p>
      </div>

      <div style={styles.tabs}>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "common" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("common")}
        >
          Common Permissions
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "clipboard" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("clipboard")}
        >
          Clipboard
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "other" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("other")}
        >
          Other Permissions
        </div>
      </div>

      {permissionsToShow.map((permission) => (
        <PermissionCard
          key={permission.type}
          type={permission.type as any}
          title={permission.title}
          icon={permission.icon}
        />
      ))}
    </div>
  );
};

/**
 * Default story showing multiple permission types
 */
export const Default: Story = {
  render: () => <PermissionDemo />,
};

/**
 * Standalone Geolocation permission example
 */
export const GeolocationPermission: Story = {
  render: () => (
    <div style={styles.container}>
      <h2>Geolocation Permission</h2>
      <p>Tests the browser's geolocation API permission.</p>
      <PermissionCard type="geolocation" title="Geolocation" icon="📍" />
    </div>
  ),
};

/**
 * Standalone Notifications permission example
 */
export const NotificationsPermission: Story = {
  render: () => (
    <div style={styles.container}>
      <h2>Notifications Permission</h2>
      <p>Tests the browser's notification API permission.</p>
      <PermissionCard type="notifications" title="Notifications" icon="🔔" />
    </div>
  ),
};

/**
 * Standalone Camera permission example
 */
export const CameraPermission: Story = {
  render: () => (
    <div style={styles.container}>
      <h2>Camera Permission</h2>
      <p>Tests the browser's camera API permission.</p>
      <PermissionCard type="camera" title="Camera" icon="📷" />
    </div>
  ),
};

/**
 * Standalone Microphone permission example
 */
export const MicrophonePermission: Story = {
  render: () => (
    <div style={styles.container}>
      <h2>Microphone Permission</h2>
      <p>Tests the browser's microphone API permission.</p>
      <PermissionCard type="microphone" title="Microphone" icon="🎤" />
    </div>
  ),
};

/**
 * Clipboard permissions example
 */
export const ClipboardPermissions: Story = {
  render: () => (
    <div style={styles.container}>
      <h2>Clipboard Permissions</h2>
      <p>Tests the browser's clipboard API permissions.</p>
      <PermissionCard type="clipboard-read" title="Clipboard Read" icon="📋" />
      <PermissionCard
        type="clipboard-write"
        title="Clipboard Write"
        icon="✍️"
      />
    </div>
  ),
};

/**
 * Custom error handling example
 */
export const ErrorHandlingExample: Story = {
  render: () => {
    // A demo component that shows how to handle errors from usePermission
    const ErrorHandlingDemo = () => {
      const { state, isSupported, isLoading, error, request } =
        usePermission("geolocation");

      const [customError, setCustomError] = useState<null | string>(null);

      const handleRequestWithCustomError = async () => {
        try {
          setCustomError(null);
          const result = await request();
          console.log("Permission result:", result);
        } catch (err) {
          if (err instanceof PermissionError) {
            setCustomError(`Custom handler caught: ${err.message}`);
          } else {
            setCustomError(
              `Unexpected error: ${
                err instanceof Error ? err.message : String(err)
              }`
            );
          }
        }
      };

      return (
        <div style={styles.card}>
          <h3>Custom Error Handling</h3>
          <p>
            This example shows how to implement custom error handling with the
            usePermission hook.
          </p>

          <div style={styles.status}>
            <div>Current state: {state}</div>
            <div>Is supported: {isSupported.toString()}</div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleRequestWithCustomError}
              disabled={isLoading || !isSupported}
              style={{
                ...styles.button,
                ...(isLoading ? styles.loadingButton : {}),
                ...(!isSupported ? styles.disabledButton : {}),
              }}
            >
              Request with Custom Error Handling
            </button>
          </div>

          {error && (
            <div style={styles.error}>
              <strong>Hook Error:</strong> {error.message}
            </div>
          )}

          {customError && (
            <div
              style={{
                ...styles.error,
                backgroundColor: "#fff3e0",
                color: "#e65100",
              }}
            >
              <strong>Custom Error Handler:</strong> {customError}
            </div>
          )}
        </div>
      );
    };

    return (
      <div style={styles.container}>
        <h2>Error Handling</h2>
        <p>Demonstrates error handling with the usePermission hook.</p>
        <ErrorHandlingDemo />
      </div>
    );
  },
};
