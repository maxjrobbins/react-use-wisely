import React, { useState } from "react";
import useFetch from "../../../src/hooks/useFetch";

export default {
  title: "Hooks/useFetch",
  parameters: {
    componentSubtitle: "Hook for data fetching with caching and retries",
    docs: {
      description: {
        component:
          "A React hook that provides a standardized interface for async fetching with built-in caching, retry functionality, and request cancellation.",
      },
    },
  },
};

const API_ENDPOINTS = {
  users: "https://jsonplaceholder.typicode.com/users",
  posts: "https://jsonplaceholder.typicode.com/posts",
  error: "https://jsonplaceholder.typicode.com/error",
};

const ErrorDisplay = ({ error }) => {
  if (!error) return null;
  return (
    <div style={{ color: "#721c24", padding: "15px", backgroundColor: "#f8d7da", borderRadius: "4px", border: "1px solid #f5c6cb", marginTop: "10px", fontSize: "14px" }}>
      <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "16px" }}>Error: {error.message}</div>
    </div>
  );
};

const LoadingIndicator = () => (
  <div style={{ padding: "15px", backgroundColor: "#e3f2fd", borderRadius: "4px", border: "1px solid #bbdefb", marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
    <div style={{ width: "20px", height: "20px", border: "2px solid #2196f3", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    <span>Loading...</span>
  </div>
);

const DataDisplay = ({ data }) => {
  if (!data) return null;
  return (
    <div style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "4px", border: "1px solid #e9ecef", marginTop: "10px" }}>
      <pre style={{ margin: 0, padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "4px", overflow: "auto", maxHeight: "300px" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export const AdvancedControlsDemo = () => {
  const [endpoint, setEndpoint] = useState(API_ENDPOINTS.users);
  const [cachePolicy, setCachePolicy] = useState("no-cache");
  const [retries, setRetries] = useState(0);
  const [retryDelay, setRetryDelay] = useState(1000);

  const { data, error, isLoading, status, refetch, abort } = useFetch(endpoint, {
    method: "GET",
    cachePolicy,
    retries,
    retryDelay,
  });

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}>
      <h3>useFetch Demo</h3>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "4px" }}>Endpoint:</label>
            <select value={endpoint} onChange={(e) => setEndpoint(e.target.value)} style={{ padding: "8px", width: "100%" }}>
              <option value={API_ENDPOINTS.users}>Users</option>
              <option value={API_ENDPOINTS.posts}>Posts</option>
              <option value={API_ENDPOINTS.error}>Error Endpoint</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "4px" }}>Cache Policy:</label>
            <select value={cachePolicy} onChange={(e) => setCachePolicy(e.target.value)} style={{ padding: "8px", width: "100%" }}>
              <option value="no-cache">No Cache</option>
              <option value="cache-first">Cache First</option>
              <option value="cache-only">Cache Only</option>
              <option value="network-only">Network Only</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "4px" }}>Retries:</label>
            <input type="number" min="0" max="5" value={retries} onChange={(e) => setRetries(Number(e.target.value))} style={{ padding: "8px", width: "100%" }} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "4px" }}>Retry Delay (ms):</label>
            <input type="number" min="500" step="500" max="5000" value={retryDelay} onChange={(e) => setRetryDelay(Number(e.target.value))} style={{ padding: "8px", width: "100%" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => refetch()} disabled={isLoading} style={{ padding: "8px 12px", backgroundColor: isLoading ? "#cccccc" : "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: isLoading ? "not-allowed" : "pointer" }}>
            {isLoading ? "Loading..." : "Fetch Data"}
          </button>

          <button onClick={abort} disabled={!isLoading} style={{ padding: "8px 12px", backgroundColor: !isLoading ? "#cccccc" : "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: !isLoading ? "not-allowed" : "pointer" }}>
            Abort Request
          </button>
        </div>
      </div>

      <div>
        {isLoading && <LoadingIndicator />}
        {error && <ErrorDisplay error={error} />}
        {data && <DataDisplay data={data} />}
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        Status: <strong>{status}</strong>
      </p>
    </div>
  );
};

AdvancedControlsDemo.storyName = "Advanced Controls (Interactive)";
