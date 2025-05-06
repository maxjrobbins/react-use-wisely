import React, { useRef } from "react";
// Import the specific hook directly from its file rather than the index
import useScrollPosition from "../../../src/hooks/useScrollPosition";

export default {
  title: "Hooks/useScrollPosition",
  parameters: {
    componentSubtitle: "Hook for tracking scroll position",
    docs: {
      description: {
        component: `
The useScrollPosition hook tracks the scroll position of the window or a specific element.

## Features

- Tracks scroll position (x and y coordinates)
- Supports tracking window scroll or a specific element's scroll
- Throttles updates for performance
- Can skip updates when document is hidden
- Includes browser support detection
- Reports errors when they occur
`,
      },
    },
  },
};

// Creates large scrollable content
const ScrollableContent = ({ height = "200vh", width = "100%" }) => (
  <div
    style={{
      height,
      width,
      background: "linear-gradient(180deg, #f0f0f0 0%, #c0c0c0 100%)",
    }}
  >
    <div
      style={{
        position: "sticky",
        top: "20px",
        padding: "20px",
        background: "rgba(255,255,255,0.8)",
        margin: "0 20px",
        borderRadius: "8px",
      }}
    >
      Try scrolling to see the values update
    </div>
  </div>
);

// Displays scroll position data from the hook
const ScrollPositionDisplay = ({ x, y, isSupported, error }) => (
  <div style={{ fontFamily: "monospace", marginBottom: "20px" }}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          padding: "12px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          background: "#f5f5f5",
        }}
      >
        <div>
          <strong>X Position:</strong> {x}px
        </div>
        <div>
          <strong>Y Position:</strong> {y}px
        </div>
      </div>
      <div
        style={{
          padding: "12px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          background: "#f5f5f5",
        }}
      >
        <div>
          <strong>Supported:</strong> {isSupported ? "Yes" : "No"}
        </div>
        <div>
          <strong>Error:</strong> {error ? error.message : "None"}
        </div>
      </div>
    </div>
  </div>
);

// Window scrolling demo using the actual hook
export const WindowScrolling = () => {
  // Use the actual hook
  const scrollPosition = useScrollPosition();

  return (
    <div>
      <h3>Window Scrolling</h3>
      <p>
        This example tracks the scroll position of the window using the actual
        hook.
      </p>
      <ScrollPositionDisplay {...scrollPosition} />
      <ScrollableContent />
    </div>
  );
};

// Element scrolling demo using the actual hook
export const ElementScrolling = () => {
  const elementRef = useRef(null);

  // Use the actual hook with element reference
  const scrollPosition = useScrollPosition({
    element: elementRef,
  });

  return (
    <div>
      <h3>Element Scrolling</h3>
      <p>
        This example tracks the scroll position of a specific element using the
        actual hook.
      </p>
      <ScrollPositionDisplay {...scrollPosition} />

      <div
        ref={elementRef}
        style={{
          height: "300px",
          overflow: "auto",
          border: "1px solid #ddd",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        <div style={{ height: "1000px", padding: "20px" }}>
          <div
            style={{
              position: "sticky",
              top: "20px",
              padding: "10px",
              background: "rgba(255,255,255,0.8)",
              borderRadius: "4px",
            }}
          >
            Scroll inside this box to see values update
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo with throttling using the actual hook
export const ThrottledUpdates = () => {
  // Use the actual hook with a longer throttle time (500ms)
  const scrollPosition = useScrollPosition({
    wait: 500,
  });

  return (
    <div>
      <h3>Throttled Updates (500ms)</h3>
      <p>
        This example shows how updates can be throttled to reduce performance
        impact.
      </p>
      <p>
        Notice the updates happen less frequently than in the basic example.
      </p>
      <ScrollPositionDisplay {...scrollPosition} />
      <ScrollableContent />
    </div>
  );
};

// Demo with skipWhenHidden using the actual hook
export const SkipWhenHidden = () => {
  // Use the actual hook with skipWhenHidden explicitly set to true
  const scrollPosition = useScrollPosition({
    skipWhenHidden: true,
  });

  return (
    <div>
      <h3>Skip Updates When Document Hidden</h3>
      <p>
        This example demonstrates the hook's ability to skip updates when the
        document is hidden.
      </p>
      <p>
        Try switching to another tab and back - scroll updates will be paused
        while hidden.
      </p>
      <ScrollPositionDisplay {...scrollPosition} />
      <ScrollableContent />
    </div>
  );
};

// Demo with all options using the actual hook
export const WithAllOptions = () => {
  const elementRef = useRef(null);

  // Use the actual hook with all options configured
  const scrollPosition = useScrollPosition({
    element: elementRef,
    wait: 300,
    skipWhenHidden: true,
  });

  return (
    <div>
      <h3>All Options Combined</h3>
      <p>The hook supports multiple options that can be combined:</p>
      <ul>
        <li>
          <code>element</code>: Tracks the element referenced by elementRef
        </li>
        <li>
          <code>wait</code>: Throttles updates to once every 300ms
        </li>
        <li>
          <code>skipWhenHidden</code>: Skips updates when document is hidden
        </li>
      </ul>
      <ScrollPositionDisplay {...scrollPosition} />

      <div
        ref={elementRef}
        style={{
          height: "300px",
          overflow: "auto",
          border: "1px solid #ddd",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        <div style={{ height: "1000px", padding: "20px" }}>
          <div
            style={{
              position: "sticky",
              top: "20px",
              padding: "10px",
              background: "rgba(255,255,255,0.8)",
              borderRadius: "4px",
            }}
          >
            Scroll inside this box to see throttled updates (300ms)
          </div>
        </div>
      </div>
    </div>
  );
};
