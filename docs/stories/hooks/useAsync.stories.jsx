import React, { useState } from "react";
import useAsync from "../../../src/hooks/useAsync";

export default {
  title: "Hooks/useAsync",
  parameters: {
    componentSubtitle: "Hook for handling async operations",
    docs: {
      description: {
        component:
          "A React hook that manages loading, error, and data states for asynchronous operations with retry functionality.",
      },
    },
  },
};

// Mock API function with artificial delay
const fetchUserData = (userId, shouldFail = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Failed to fetch user data"));
      } else {
        resolve({
          id: userId,
          name: "John Doe",
          email: "john.doe@example.com",
          createdAt: new Date().toISOString(),
        });
      }
    }, 1500); // 1.5 second delay
  });
};

export const Default = () => {
  const [userId, setUserId] = useState("1234");
  const [shouldFail, setShouldFail] = useState(false);

  const { execute, reset, status, value, error, isRetrying, attemptCount } =
    useAsync(
      () => fetchUserData(userId, shouldFail),
      false // don't run immediately
    );

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Async Operation Demo</h3>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label
            htmlFor="userId"
            style={{ display: "block", marginBottom: "4px" }}
          >
            User ID:
          </label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ padding: "8px", width: "200px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={shouldFail}
              onChange={(e) => setShouldFail(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            Simulate API failure
          </label>
        </div>

        <button
          onClick={execute}
          disabled={status === "pending" || status === "retrying"}
          style={{
            padding: "8px 12px",
            backgroundColor:
              status === "pending" || status === "retrying"
                ? "#cccccc"
                : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor:
              status === "pending" || status === "retrying"
                ? "not-allowed"
                : "pointer",
            marginRight: "8px",
          }}
        >
          {status === "pending"
            ? "Loading..."
            : status === "retrying"
            ? `Retrying (${attemptCount})...`
            : "Fetch User Data"}
        </button>

        {(status === "error" || status === "success") && (
          <button
            onClick={reset}
            style={{
              padding: "8px 12px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        )}
      </div>

      <div>
        <h4>
          Status:{" "}
          <span style={{ color: getStatusColor(status) }}>{status}</span>
        </h4>

        {status === "success" && (
          <div>
            <h4>User Data:</h4>
            <pre
              style={{
                padding: "10px",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                overflow: "auto",
              }}
            >
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        )}

        {status === "error" && (
          <div>
            <h4>Error Details:</h4>
            <div
              style={{
                color: "#ff0000",
                padding: "10px",
                backgroundColor: "#fff0f0",
                borderRadius: "4px",
              }}
            >
              <div>
                <strong>Message:</strong> {error.message}
              </div>
              {error.originalError && (
                <div style={{ marginTop: "5px" }}>
                  <strong>Original Error:</strong> {String(error.originalError)}
                </div>
              )}
              {error.context && (
                <div style={{ marginTop: "5px" }}>
                  <strong>Context:</strong>
                  <pre style={{ margin: "5px 0 0 0" }}>
                    {JSON.stringify(error.context, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        This hook simplifies managing async operations by tracking loading
        state, success data, and errors.
      </p>
    </div>
  );
};

function getStatusColor(status) {
  switch (status) {
    case "idle":
      return "#888888";
    case "pending":
      return "#FFA500";
    case "retrying":
      return "#FF9800";
    case "success":
      return "#4CAF50";
    case "error":
      return "#FF0000";
    default:
      return "#000000";
  }
}

Default.storyName = "Basic Usage";

export const WithRetry = () => {
  const [userId, setUserId] = useState("1234");
  const [shouldFail, setShouldFail] = useState(true);
  const [retryCount, setRetryCount] = useState(2);
  const [retryDelay, setRetryDelay] = useState(1000);

  const { execute, reset, status, value, error, isRetrying, attemptCount } =
    useAsync(
      () => fetchUserData(userId, shouldFail),
      false, // don't run immediately
      retryCount,
      retryDelay
    );

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Async Operation with Retry Demo</h3>

      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <div>
            <label
              htmlFor="userId"
              style={{ display: "block", marginBottom: "4px" }}
            >
              User ID:
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={{ padding: "8px", width: "100%" }}
            />
          </div>

          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <input
                type="checkbox"
                checked={shouldFail}
                onChange={(e) => setShouldFail(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              Simulate API failure
            </label>
          </div>

          <div>
            <label
              htmlFor="retryCount"
              style={{ display: "block", marginBottom: "4px" }}
            >
              Retry Count:
            </label>
            <input
              id="retryCount"
              type="number"
              min="0"
              max="5"
              value={retryCount}
              onChange={(e) => setRetryCount(Number(e.target.value))}
              style={{ padding: "8px", width: "100%" }}
            />
          </div>

          <div>
            <label
              htmlFor="retryDelay"
              style={{ display: "block", marginBottom: "4px" }}
            >
              Retry Delay (ms):
            </label>
            <input
              id="retryDelay"
              type="number"
              min="500"
              step="500"
              max="5000"
              value={retryDelay}
              onChange={(e) => setRetryDelay(Number(e.target.value))}
              style={{ padding: "8px", width: "100%" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button
            onClick={execute}
            disabled={status === "pending" || status === "retrying"}
            style={{
              padding: "8px 12px",
              backgroundColor:
                status === "pending" || status === "retrying"
                  ? "#cccccc"
                  : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor:
                status === "pending" || status === "retrying"
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {status === "pending"
              ? "Loading..."
              : status === "retrying"
              ? `Retrying (${attemptCount}/${retryCount})...`
              : "Execute with Retry"}
          </button>

          <button
            onClick={reset}
            disabled={status === "idle"}
            style={{
              padding: "8px 12px",
              backgroundColor: status === "idle" ? "#cccccc" : "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: status === "idle" ? "not-allowed" : "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div>
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f8f9fa",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0" }}>
            Status:{" "}
            <span style={{ color: getStatusColor(status) }}>{status}</span>
          </h4>
          {isRetrying && (
            <div
              style={{
                backgroundColor: "#fff3cd",
                border: "1px solid #ffeeba",
                color: "#856404",
                padding: "10px",
                borderRadius: "4px",
                marginTop: "10px",
              }}
            >
              <span style={{ marginRight: "8px" }}>⚠️</span>
              Retrying attempt {attemptCount} of {retryCount}...
            </div>
          )}
        </div>

        {status === "success" && (
          <div>
            <h4>User Data:</h4>
            <pre
              style={{
                padding: "10px",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                overflow: "auto",
              }}
            >
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        )}

        {status === "error" && (
          <div>
            <h4>Error Details (after {attemptCount} attempts):</h4>
            <div
              style={{
                color: "#721c24",
                padding: "10px",
                backgroundColor: "#f8d7da",
                borderRadius: "4px",
                border: "1px solid #f5c6cb",
              }}
            >
              <div>
                <strong>Message:</strong> {error.message}
              </div>
              {error.originalError && (
                <div style={{ marginTop: "5px" }}>
                  <strong>Original Error:</strong> {String(error.originalError)}
                </div>
              )}
              {error.context && (
                <div style={{ marginTop: "5px" }}>
                  <strong>Context:</strong>
                  <pre style={{ margin: "5px 0 0 0" }}>
                    {JSON.stringify(error.context, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        This example demonstrates the retry functionality built into the
        useAsync hook. When an operation fails, it will automatically retry
        according to the specified count and delay.
      </p>
    </div>
  );
};

WithRetry.storyName = "With Retry Functionality";
