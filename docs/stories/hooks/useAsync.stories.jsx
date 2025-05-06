import React, { useState, useEffect } from "react";
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

// Error Display Component
const ErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <div
      style={{
        color: "#721c24",
        padding: "15px",
        backgroundColor: "#f8d7da",
        borderRadius: "4px",
        border: "1px solid #f5c6cb",
        marginTop: "10px",
        fontSize: "14px",
      }}
    >
      <div
        style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "16px" }}
      >
        Error: {error.message}
      </div>

      {error.originalError && (
        <div style={{ marginTop: "10px" }}>
          <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
            Original Error:
          </div>
          <div
            style={{
              padding: "8px",
              backgroundColor: "rgba(0,0,0,0.05)",
              borderRadius: "3px",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {String(error.originalError)}
          </div>
        </div>
      )}

      {error.context && (
        <div style={{ marginTop: "10px" }}>
          <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
            Context:
          </div>
          <pre
            style={{
              margin: "0",
              padding: "8px",
              backgroundColor: "rgba(0,0,0,0.05)",
              borderRadius: "3px",
              maxHeight: "150px",
              overflow: "auto",
              fontFamily: "monospace",
            }}
          >
            {JSON.stringify(error.context, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// Retry Progress Display Component
const RetryProgress = ({
  isRetrying,
  attemptCount,
  maxRetries,
  retryDelay,
}) => {
  const [countdown, setCountdown] = useState(retryDelay);

  useEffect(() => {
    if (!isRetrying) {
      setCountdown(retryDelay);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 100));
    }, 100);

    return () => clearInterval(timer);
  }, [isRetrying, retryDelay]);

  if (!isRetrying) return null;

  const progressPercent = ((retryDelay - countdown) / retryDelay) * 100;

  return (
    <div
      style={{
        backgroundColor: "#fff3cd",
        border: "1px solid #ffeeba",
        color: "#856404",
        padding: "12px",
        borderRadius: "4px",
        marginTop: "10px",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        <span role="img" aria-label="warning" style={{ marginRight: "8px" }}>
          ⚠️
        </span>
        <span style={{ fontWeight: "bold" }}>
          Retry in progress: Attempt {attemptCount} of {maxRetries}
        </span>
      </div>

      <div
        style={{
          height: "10px",
          width: "100%",
          backgroundColor: "#ffeeba",
          borderRadius: "5px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressPercent}%`,
            backgroundColor: "#ff9800",
            borderRadius: "5px",
            transition: "width 0.1s linear",
          }}
        ></div>
      </div>

      <div style={{ textAlign: "right", fontSize: "12px", marginTop: "4px" }}>
        {Math.ceil(countdown / 1000)}s until next attempt
      </div>
    </div>
  );
};

export const Default = () => {
  const [userId, setUserId] = useState("1234");
  const [shouldFail, setShouldFail] = useState(false);

  const { execute, reset, status, value, error, isRetrying, attemptCount } =
    useAsync(
      () => fetchUserData(userId, shouldFail),
      { immediate: false } // don't run immediately
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
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f8f9fa",
            borderRadius: "4px",
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: "bold", marginRight: "8px" }}>Status:</div>
          <div
            style={{
              display: "inline-block",
              padding: "4px 8px",
              backgroundColor: getStatusBgColor(status),
              color: getStatusColor(status),
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            {status.toUpperCase()}
          </div>
        </div>

        {isRetrying && (
          <RetryProgress
            isRetrying={isRetrying}
            attemptCount={attemptCount}
            maxRetries={1}
            retryDelay={1000}
          />
        )}

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

        {status === "error" && <ErrorDisplay error={error} />}
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
      return "#6c757d";
    case "pending":
      return "#0056b3";
    case "retrying":
      return "#856404";
    case "success":
      return "#155724";
    case "error":
      return "#721c24";
    default:
      return "#000000";
  }
}

function getStatusBgColor(status) {
  switch (status) {
    case "idle":
      return "#e9ecef";
    case "pending":
      return "#cce5ff";
    case "retrying":
      return "#fff3cd";
    case "success":
      return "#d4edda";
    case "error":
      return "#f8d7da";
    default:
      return "#ffffff";
  }
}

Default.storyName = "Basic Usage";

export const WithRetry = () => {
  const [userId, setUserId] = useState("1234");
  const [shouldFail, setShouldFail] = useState(true);
  const [retryCount, setRetryCount] = useState(2);
  const [retryDelay, setRetryDelay] = useState(1000);

  const { execute, reset, status, value, error, isRetrying, attemptCount } =
    useAsync(() => fetchUserData(userId, shouldFail), {
      immediate: false, // don't run immediately
      retryCount,
      retryDelay,
    });

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
              ? `Retrying...`
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
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: "bold", marginRight: "8px" }}>Status:</div>
          <div
            style={{
              display: "inline-block",
              padding: "4px 8px",
              backgroundColor: getStatusBgColor(status),
              color: getStatusColor(status),
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            {status.toUpperCase()}
          </div>
        </div>

        {isRetrying && (
          <RetryProgress
            isRetrying={isRetrying}
            attemptCount={attemptCount}
            maxRetries={retryCount}
            retryDelay={retryDelay}
          />
        )}

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

        {status === "error" && <ErrorDisplay error={error} />}

        {status === "error" && attemptCount > 0 && (
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              border: "1px solid #e0e0e0",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Retry Summary:
            </div>
            <div>
              Made {attemptCount} attempt{attemptCount !== 1 ? "s" : ""} with{" "}
              {retryDelay}ms delay between attempts
            </div>
            <div style={{ marginTop: "5px" }}>
              Maximum retry count: {retryCount}
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
