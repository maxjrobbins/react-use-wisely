import React, { useState } from "react";
import useAsync from "../../../src/hooks/useAsync";

export default {
  title: "Hooks/useAsync",
  parameters: {
    componentSubtitle: "Hook for handling async operations",
    docs: {
      description: {
        component:
          "A React hook that manages loading, error, and data states for asynchronous operations.",
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

  const { execute, status, value, error } = useAsync(
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
          disabled={status === "pending"}
          style={{
            padding: "8px 12px",
            backgroundColor: status === "pending" ? "#cccccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: status === "pending" ? "not-allowed" : "pointer",
          }}
        >
          {status === "pending" ? "Loading..." : "Fetch User Data"}
        </button>
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
            <h4>Error:</h4>
            <div
              style={{
                color: "#ff0000",
                padding: "10px",
                backgroundColor: "#fff0f0",
                borderRadius: "4px",
              }}
            >
              {error.message}
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
    case "success":
      return "#4CAF50";
    case "error":
      return "#FF0000";
    default:
      return "#000000";
  }
}

Default.storyName = "Basic Usage";
