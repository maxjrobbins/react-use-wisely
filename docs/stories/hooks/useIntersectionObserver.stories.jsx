import React from "react";
import useIntersectionObserver from "../../../src/hooks/useIntersectionObserver";

export default {
  title: "Hooks/useIntersectionObserver",
  parameters: {
    componentSubtitle:
      "Hook that detects when an element is visible in the viewport",
    docs: {
      description: {
        component:
          "A React hook that utilizes the Intersection Observer API to detect when an element enters or leaves the viewport, with error handling.",
      },
    },
  },
};

export const Default = () => {
  const {
    ref,
    isIntersecting: isVisible,
    isSupported,
    error,
  } = useIntersectionObserver({
    threshold: 0.5,
  });

  return (
    <div style={{ padding: "20px" }}>
      <h3>Intersection Observer Demo</h3>

      <div
        style={{
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          marginBottom: "15px",
        }}
      >
        <strong>Browser Support:</strong>{" "}
        {isSupported
          ? "Intersection Observer API is supported ✅"
          : "Intersection Observer API is not supported ❌"}
      </div>

      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "15px",
            border: "1px solid #ffcdd2",
          }}
        >
          <strong>Error:</strong> {error.message}
        </div>
      )}

      <div
        style={{
          position: "sticky",
          top: "0px",
          backgroundColor: "#fff",
          padding: "10px",
          zIndex: 10,
          borderBottom: "1px solid #ddd",
        }}
      >
        <div
          style={{
            padding: "10px",
            backgroundColor: isVisible ? "#e8f5e9" : "#f5f5f5",
            color: isVisible ? "#2e7d32" : "#666",
            borderRadius: "4px",
            textAlign: "center",
            transition: "all 0.3s ease",
          }}
        >
          <strong>Status:</strong> The target element is{" "}
          {isVisible ? "visible" : "not visible"} in the viewport
        </div>
        <p style={{ marginTop: "10px", color: "#666" }}>
          Scroll down to see the target element. When it's at least 50% visible,
          the status will change.
        </p>
      </div>

      <div
        style={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "18px", color: "#666" }}>
          👇 Scroll down to see the target element 👇
        </p>
      </div>

      <div
        ref={ref}
        style={{
          height: "300px",
          margin: "20px 0",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isVisible ? "#bbdefb" : "#e0e0e0",
          color: "#333",
          borderRadius: "8px",
          border: `3px solid ${isVisible ? "#1976d2" : "#bdbdbd"}`,
          boxShadow: isVisible ? "0 0 20px rgba(25, 118, 210, 0.5)" : "none",
          transition: "all 0.5s ease",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>👋 Target Element</h2>
        <p style={{ textAlign: "center", maxWidth: "80%" }}>
          This is the element being observed with the Intersection Observer.
          When it's at least 50% visible in the viewport, the status will
          change.
        </p>
        <div
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: isVisible ? "#1976d2" : "#9e9e9e",
            color: "white",
            borderRadius: "30px",
            fontWeight: "bold",
            transform: isVisible ? "scale(1.1)" : "scale(1)",
            transition: "all 0.3s ease",
          }}
        >
          {isVisible ? "I am visible! 🎉" : "Waiting to be seen..."}
        </div>
      </div>

      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "18px", color: "#666" }}>
          👆 Scroll back up to see the target element again 👆
        </p>
      </div>
    </div>
  );
};

Default.storyName = "Basic Usage";

export const WithErrorHandling = () => {
  // Using complex options to demonstrate error handling
  const {
    ref,
    isIntersecting: isVisible,
    isSupported,
    error,
  } = useIntersectionObserver({
    threshold: [0, 0.25, 0.5, 0.75, 1],
    rootMargin: "10px",
  });

  return (
    <div style={{ padding: "20px" }}>
      <h3>Intersection Observer with Error Handling</h3>

      <div
        style={{
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          marginBottom: "15px",
        }}
      >
        <strong>Browser Support:</strong>{" "}
        {isSupported
          ? "Intersection Observer API is supported ✅"
          : "Intersection Observer API is not supported ❌"}
      </div>

      {error ? (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "15px",
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
            Intersection Observer Error:
          </h4>
          <div>
            <strong>Message:</strong> {error.message}
          </div>
          {error.originalError && (
            <div style={{ marginTop: "5px" }}>
              <strong>Original Error:</strong> {String(error.originalError)}
            </div>
          )}
          <div style={{ marginTop: "15px", fontSize: "0.9em" }}>
            <p style={{ margin: "0 0 5px 0" }}>
              <strong>Fallback behavior:</strong>
            </p>
            <ul style={{ margin: "0", paddingLeft: "20px" }}>
              <li>
                Element will still function but without intersection detection
              </li>
              <li>In production, you would implement a fallback mechanism</li>
              <li>For example: use scroll events or position calculations</li>
            </ul>
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "sticky",
            top: "0px",
            backgroundColor: "#fff",
            padding: "10px",
            zIndex: 10,
            borderBottom: "1px solid #ddd",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              padding: "10px",
              backgroundColor: isVisible ? "#e8f5e9" : "#f5f5f5",
              color: isVisible ? "#2e7d32" : "#666",
              borderRadius: "4px",
              textAlign: "center",
              transition: "all 0.3s ease",
            }}
          >
            <strong>Status:</strong> The target element is{" "}
            {isVisible ? "visible" : "not visible"} in the viewport
          </div>
        </div>
      )}

      <div
        ref={ref}
        style={{
          height: "300px",
          margin: "20px 0",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isVisible ? "#bbdefb" : "#e0e0e0",
          color: "#333",
          borderRadius: "8px",
          border: `3px solid ${isVisible ? "#1976d2" : "#bdbdbd"}`,
          boxShadow: isVisible ? "0 0 20px rgba(25, 118, 210, 0.5)" : "none",
          transition: "all 0.5s ease",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>Target Element</h2>
        <p style={{ textAlign: "center", maxWidth: "80%" }}>
          This element demonstrates error handling for the Intersection
          Observer.
          {error
            ? " An error occurred, but the component still renders."
            : " Scroll to see visibility changes."}
        </p>
        <div
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: isVisible ? "#1976d2" : "#9e9e9e",
            color: "white",
            borderRadius: "30px",
            fontWeight: "bold",
          }}
        >
          {error
            ? "Error mode - fallback behavior"
            : isVisible
            ? "I am visible! 🎉"
            : "Waiting to be seen..."}
        </div>
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#fff3cd",
          borderRadius: "4px",
          border: "1px solid #ffeeba",
          color: "#856404",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>About Error Handling:</h4>
        <p style={{ margin: "0 0 10px 0" }}>
          This example demonstrates how the hook gracefully handles errors with
          the Intersection Observer API:
        </p>
        <ul style={{ margin: "0", paddingLeft: "20px" }}>
          <li>Browser compatibility issues are detected</li>
          <li>Invalid configuration parameters are handled</li>
          <li>Useful error information is provided for debugging</li>
          <li>The component continues to work even when errors occur</li>
        </ul>
      </div>
    </div>
  );
};

WithErrorHandling.storyName = "With Error Handling";
