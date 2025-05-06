import React, { useState } from "react";
import usePrefersReducedMotion from "../../../src/hooks/usePrefersReducedMotion";

export default {
  title: "Hooks/usePrefersReducedMotion",
  parameters: {
    componentSubtitle: "Hook for detecting user motion preferences",
    docs: {
      description: {
        component:
          "A React hook that detects if a user has requested reduced motion in their system preferences.",
      },
    },
  },
};

export const Default = () => {
  const {
    value: prefersReducedMotion,
    isSupported,
    error,
  } = usePrefersReducedMotion();
  const [isAnimating, setIsAnimating] = useState(false);

  // Function to toggle animation state
  const toggleAnimation = () => {
    setIsAnimating((prev) => !prev);
  };

  // Respect user's motion preferences
  const shouldAnimate = !prefersReducedMotion && isAnimating;

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Reduced Motion Preference Demo</h3>

      <div
        style={{
          padding: "15px",
          backgroundColor: prefersReducedMotion ? "#fff3e0" : "#f5f5f5",
          borderRadius: "8px",
          marginBottom: "20px",
          border: prefersReducedMotion ? "1px solid #ffb74d" : "1px solid #ddd",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>User Preference Detected:</h4>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
            backgroundColor: prefersReducedMotion ? "#ffe0b2" : "#e8f5e9",
            borderRadius: "4px",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              color: prefersReducedMotion ? "#e65100" : "#2e7d32",
            }}
          >
            {prefersReducedMotion
              ? "🚫 User prefers reduced motion"
              : "✅ User allows animations"}
          </span>
        </div>
        <p style={{ marginTop: "10px", color: "#666", fontStyle: "italic" }}>
          {prefersReducedMotion
            ? "Animations will be minimized or disabled for better accessibility."
            : "Animations will be shown as intended."}
        </p>
      </div>

      {/* Display API support status */}
      <div
        style={{
          padding: "10px",
          backgroundColor: isSupported ? "#e8f5e9" : "#ffebee",
          borderRadius: "4px",
          marginBottom: "20px",
          border: isSupported ? "1px solid #81c784" : "1px solid #ef9a9a",
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            color: isSupported ? "#2e7d32" : "#c62828",
          }}
        >
          {isSupported
            ? "✅ MediaQuery API is supported in your browser"
            : "⚠️ MediaQuery API is not supported in your browser"}
        </span>
      </div>

      {/* Display any errors */}
      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#ffebee",
            borderRadius: "4px",
            marginBottom: "20px",
            border: "1px solid #ef9a9a",
          }}
        >
          <span style={{ fontWeight: "bold", color: "#c62828" }}>
            ⚠️ Error: {error.message}
          </span>
        </div>
      )}

      <div style={{ marginBottom: "30px" }}>
        <button
          onClick={toggleAnimation}
          style={{
            padding: "10px 20px",
            backgroundColor: isAnimating ? "#673ab7" : "#9e9e9e",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          {isAnimating ? "Stop Animation" : "Start Animation"}
        </button>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h4>Animation Example:</h4>
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#673ab7",
              borderRadius: shouldAnimate ? "4px" : "50%",
              animation: shouldAnimate
                ? "spin 3s linear infinite, move 5s ease-in-out infinite alternate"
                : "none",
              // Use inline keyframes for the demo
              ...getAnimationStyle(shouldAnimate),
              transition: "border-radius 0.5s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {shouldAnimate ? "🎬" : "⏹️"}
          </div>
        </div>

        {prefersReducedMotion && isAnimating && (
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#fff3e0",
              borderRadius: "4px",
              textAlign: "center",
              color: "#e65100",
              fontWeight: "bold",
            }}
          >
            Animation suppressed due to reduced motion preference
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: "#e8f5e9",
          padding: "15px",
          borderRadius: "4px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>How to Test:</h4>
        <ol style={{ margin: "0", paddingLeft: "20px" }}>
          <li>
            <strong>On macOS:</strong> System Preferences → Accessibility →
            Display → Check "Reduce motion"
          </li>
          <li>
            <strong>On Windows:</strong> Settings → Ease of Access → Display →
            Turn on "Show animations in Windows"
          </li>
          <li>
            <strong>On iOS:</strong> Settings → Accessibility → Motion → Enable
            "Reduce Motion"
          </li>
          <li>
            <strong>On Android:</strong> Settings → Accessibility → Remove
            animations
          </li>
        </ol>
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        This hook allows you to respect user preferences for reduced motion,
        which is important for accessibility and to avoid triggering vestibular
        disorders or motion sickness.
      </p>
    </div>
  );
};

// Helper function to generate the animation style object
function getAnimationStyle(shouldAnimate) {
  if (!shouldAnimate) return {};

  return {
    position: "relative",
    transform: "translateX(0)",
    "@keyframes spin": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
    "@keyframes move": {
      "0%": { transform: "translateX(-50px)" },
      "100%": { transform: "translateX(50px)" },
    },
  };
}

Default.storyName = "Basic Usage";
