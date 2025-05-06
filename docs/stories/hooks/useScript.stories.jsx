import React, { useState } from "react";
import useScript from "../../../src/hooks/useScript";

export default {
  title: "Hooks/useScript",
  parameters: {
    componentSubtitle: "Hook for dynamically loading external JavaScript",
    docs: {
      description: {
        component: `
A hook that allows you to dynamically load external JavaScript files into your application.

- Handles script loading, error reporting, and cleanup
- Supports all script attributes (async, defer, crossOrigin, etc.)
- Detects and reuses existing script tags to prevent duplicate loading
- Gracefully handles loading in non-browser environments
- Follows the library's hook standard with boolean state indicators
        `,
      },
    },
  },
};

// Demo component to showcase the hook
const ScriptLoaderDemo = ({ src, options }) => {
  const { status, isLoading, isReady, isError, isIdle, error, isSupported } =
    useScript(src, options);
  const [scriptOutput, setScriptOutput] = useState("No output yet");

  // Reset output when status changes or src is empty
  React.useEffect(() => {
    if (isIdle || !src) {
      setScriptOutput("No script selected");
    } else if (isError && error) {
      setScriptOutput(`Error: ${error.message}`);
    }
  }, [isIdle, isError, error, src]);

  // Function to expose to loaded scripts
  React.useEffect(() => {
    // Clear the output when src changes
    if (!src) {
      setScriptOutput("No script selected");
    } else {
      setScriptOutput(isIdle ? "No script selected" : "Loading script...");
    }

    // Create handler for script communication
    const callbackHandler = (message) => {
      setScriptOutput(message);
    };

    // Setup script communication
    if (typeof window !== "undefined") {
      // Cleanup any existing handlers
      if (window.counterCleanup) {
        try {
          window.counterCleanup();
          delete window.counterCleanup;
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
      }

      // Set up new callback only if we have a script
      if (src) {
        window.demoCallback = callbackHandler;
      } else {
        // Remove callback for "No Script" case
        delete window.demoCallback;
      }
    }

    // Cleanup on unmount or when src changes
    return () => {
      if (typeof window !== "undefined") {
        // Run script-specific cleanup if available
        if (window.counterCleanup) {
          try {
            window.counterCleanup();
            delete window.counterCleanup;
          } catch (e) {
            console.error("Error during cleanup:", e);
          }
        }

        // Remove global callback
        delete window.demoCallback;
      }
    };
  }, [src, isIdle]); // Clean up when src changes or idle state changes

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "20px" }}>
        <h3>Script Source:</h3>
        <code>{src || "None"}</code>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div
          style={{
            padding: "15px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "180px",
          }}
        >
          <h3>Status: {status}</h3>
          <div>
            Is Loading:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: isLoading ? "blue" : "inherit",
              }}
            >
              {isLoading ? "Yes" : "No"}
            </span>
          </div>
          <div>
            Is Ready:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: isReady ? "green" : "inherit",
              }}
            >
              {isReady ? "Yes" : "No"}
            </span>
          </div>
          <div>
            Is Error:{" "}
            <span
              style={{ fontWeight: "bold", color: isError ? "red" : "inherit" }}
            >
              {isError ? "Yes" : "No"}
            </span>
          </div>
          <div>
            Is Idle:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: isIdle ? "orange" : "inherit",
              }}
            >
              {isIdle ? "Yes" : "No"}
            </span>
          </div>
          <div>
            Is Supported:{" "}
            <span style={{ fontWeight: "bold" }}>
              {isSupported ? "Yes" : "No"}
            </span>
          </div>
        </div>

        <div
          style={{
            padding: "15px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            flex: "1",
            backgroundColor: "#f5f5f5",
          }}
        >
          <h3>Script Output:</h3>
          <div style={{ marginBottom: "10px" }}>{scriptOutput}</div>

          {error && (
            <div
              style={{
                color: "red",
                marginTop: "10px",
                border: "1px solid #ffcccc",
                padding: "10px",
                borderRadius: "4px",
                backgroundColor: "#fff8f8",
              }}
            >
              <h4 style={{ margin: "0 0 5px 0" }}>Error Details:</h4>
              <p style={{ margin: "0" }}>{error.message}</p>
              {error.stack && (
                <pre
                  style={{
                    fontSize: "0.9em",
                    marginTop: "10px",
                    overflow: "auto",
                    maxHeight: "150px",
                  }}
                >
                  {error.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>

      {options && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Options:</h3>
          <pre>{JSON.stringify(options, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

// Simple "Hello World" script case
export const BasicUsage = () => {
  // Use local script within the Storybook public folder
  const helloWorldScriptUrl = "/scripts/hello-world.js";

  return (
    <div>
      <p>
        This example loads a simple script that logs a message to the console
        and calls <code>demoCallback()</code>.
      </p>
      <ScriptLoaderDemo src={helloWorldScriptUrl} />
    </div>
  );
};

BasicUsage.storyName = "Basic Usage";
BasicUsage.parameters = {
  docs: {
    description: {
      story: "Load an external script that outputs a simple message.",
    },
  },
};

// Example with script loading options
export const WithScriptOptions = () => {
  // Use local script within the Storybook public folder
  const scriptUrl = "/scripts/hello-world.js";
  const options = {
    id: "hello-script",
    async: true,
    defer: false,
    crossOrigin: "anonymous",
    type: "text/javascript",
  };

  return (
    <div>
      <p>This example loads a script with additional options specified.</p>
      <ScriptLoaderDemo src={scriptUrl} options={options} />
    </div>
  );
};

WithScriptOptions.storyName = "With Script Options";
WithScriptOptions.parameters = {
  docs: {
    description: {
      story:
        "Load a script with specific attributes like `async`, `defer`, `crossOrigin`, etc.",
    },
  },
};

// Error handling example
export const ErrorHandling = () => {
  const invalidScriptUrl = "/scripts/non-existent-script.js";

  return (
    <div>
      <p>
        This example demonstrates error handling when a script fails to load.
      </p>
      <ScriptLoaderDemo src={invalidScriptUrl} />
    </div>
  );
};

ErrorHandling.storyName = "Error Handling";
ErrorHandling.parameters = {
  docs: {
    description: {
      story:
        "Demonstrates how the hook handles errors when a script fails to load.",
    },
  },
};

// External API example
export const ExternalAPI = () => {
  // Use a public CDN for demonstration
  const cdnScriptUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js";

  return (
    <div>
      <p>This example demonstrates loading an external library (Moment.js).</p>
      <p>
        <strong>Note:</strong> After loading, check your browser console - the
        library should be available globally.
      </p>
      <ScriptLoaderDemo src={cdnScriptUrl} />
    </div>
  );
};

ExternalAPI.storyName = "External Library Loading";
ExternalAPI.parameters = {
  docs: {
    description: {
      story: "Example showing how to load a third-party library from a CDN.",
    },
  },
};

// Dynamic loading example
export const DynamicLoading = () => {
  const [scriptUrl, setScriptUrl] = useState("");
  const [key, setKey] = useState(0); // Key to force remount of ScriptLoaderDemo

  const scripts = [
    {
      name: "Hello World",
      url: "/scripts/hello-world.js",
    },
    {
      name: "Counter Script",
      url: "/scripts/counter.js",
    },
    {
      name: "Error Script",
      url: "/scripts/non-existent-script.js",
    },
    { name: "No Script", url: "" },
  ];

  // Ensure cleanup runs when changing scripts
  const handleScriptChange = (url) => {
    // Force cleanup of any existing scripts
    if (typeof window !== "undefined") {
      // Remove all script-related global variables
      if (window.counterCleanup) {
        try {
          window.counterCleanup();
          delete window.counterCleanup;
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
      }

      // Remove any lingering callbacks
      if (window.demoCallback) {
        delete window.demoCallback;
      }

      // Clear any error handlers
      window.onerror = null;
    }

    // Force remount the component to ensure clean state
    setKey((prev) => prev + 1);

    // Set new script URL (empty string for "No Script")
    setScriptUrl(url);
  };

  // Add global error handler for uncaught script errors
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const originalErrorHandler = window.onerror;

      // Add custom error handler
      window.onerror = function (message, source, lineno, colno, error) {
        console.log("Caught global error:", message);

        // Update UI through callback if available
        if (window.demoCallback) {
          window.demoCallback(`Error caught: ${message}`);
        }

        // Let the original handler run if it exists
        if (originalErrorHandler) {
          return originalErrorHandler(message, source, lineno, colno, error);
        }
        return true; // Prevent default error handling
      };

      // Cleanup
      return () => {
        window.onerror = originalErrorHandler;
      };
    }
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h3>Select a script to load:</h3>
        {scripts.map((script, index) => (
          <button
            key={index}
            onClick={() => handleScriptChange(script.url)}
            style={{
              margin: "0 10px 10px 0",
              padding: "8px 16px",
              backgroundColor: scriptUrl === script.url ? "#007bff" : "#f0f0f0",
              color: scriptUrl === script.url ? "white" : "black",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {script.name}
          </button>
        ))}
      </div>

      <ScriptLoaderDemo key={key} src={scriptUrl} />
    </div>
  );
};

DynamicLoading.storyName = "Dynamic Script Loading";
DynamicLoading.parameters = {
  docs: {
    description: {
      story: "Demonstrates changing the script source dynamically.",
    },
  },
};

// API Documentation
export const APIReference = () => {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h2>useScript API Reference</h2>

      <h3>Parameters</h3>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f3f3" }}>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Name
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Type
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Description
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Required
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>src</td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>string</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              URL of the script to load
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>Yes</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              options
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>ScriptOptions</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              Additional script tag attributes
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>No</td>
          </tr>
        </tbody>
      </table>

      <h3>ScriptOptions</h3>
      <table
        style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f3f3f3" }}>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Property
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Type
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>id</td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>string</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              Script ID attribute
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>async</td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>boolean</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              Whether the script should load asynchronously
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>defer</td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>boolean</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              Whether to defer loading until the page is parsed
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              crossOrigin
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>"anonymous" | "use-credentials"</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              CORS settings for the script
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              integrity
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>string</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              Subresource integrity hash
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              noModule
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>boolean</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              Whether the script should not be executed in browsers supporting
              ES modules
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>nonce</td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>string</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              Cryptographic nonce for CSP
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>type</td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>string</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              Script MIME type
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              referrerPolicy
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>string</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              Referrer policy for the script
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Return Value</h3>
      <table
        style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f3f3f3" }}>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Property
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Type
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              status
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>
                "idle" | "loading" | "ready" | "error" | "unsupported"
              </code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              Current status of the script loading process
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              isLoading
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>boolean</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              Whether the script is currently loading
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              isReady
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>boolean</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              Whether the script has successfully loaded
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              isError
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>boolean</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              Whether there was an error loading the script
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              isIdle
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>boolean</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              Whether the hook is in idle state (no script src provided)
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>error</td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>ScriptError | null</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              Error object if loading failed, null otherwise
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              isSupported
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              <code>boolean</code>
            </td>
            <td style={{ border: "1px solid #ddd", padding: "12px" }}>
              Whether script loading is supported in current environment
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Usage Example</h3>
      <pre
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          borderRadius: "4px",
          overflow: "auto",
        }}
      >
        {`import { useScript } from 'react-use-wisely';

function MyComponent() {
  const { 
    status, 
    isLoading, 
    isReady, 
    isError, 
    error, 
    isSupported 
  } = useScript('https://example.com/script.js', {
    async: true,
    id: 'my-script',
    crossOrigin: 'anonymous'
  });

  // Render different UI based on loading status
  if (isLoading) return <div>Loading script...</div>;
  if (isError) return <div>Error loading script: {error.message}</div>;
  if (!isSupported) return <div>Script loading not supported in this environment</div>;
  if (isReady) return <div>Script loaded successfully!</div>;
  return <div>Idle - no script loaded</div>;
}`}
      </pre>
    </div>
  );
};

APIReference.storyName = "API Reference";
APIReference.parameters = {
  docs: {
    description: {
      story: "Complete API reference for the useScript hook.",
    },
  },
};
