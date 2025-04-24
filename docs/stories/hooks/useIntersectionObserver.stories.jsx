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
          "A React hook that utilizes the Intersection Observer API to detect when an element enters or leaves the viewport.",
      },
    },
  },
};

export const Default = () => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.5,
  });

  return (
    <div style={{ padding: "20px" }}>
      <h3>Intersection Observer Demo</h3>

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
