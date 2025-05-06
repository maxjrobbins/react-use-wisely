import React, { useState, useEffect, useCallback } from "react";
import { Meta, StoryObj } from "@storybook/react";
import useMountedRef from "../../../src/hooks/useMountedRef";

const meta: Meta = {
  title: "Hooks/useMountedRef",
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        component:
          "A hook that provides information about whether the component is currently mounted. Useful for avoiding memory leaks in async operations.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * This component demonstrates the use of the useMountedRef hook
 */
const MountedRefDemo = () => {
  const { isMounted, error } = useMountedRef();
  const [showChild, setShowChild] = useState(true);
  const [count, setCount] = useState(0);

  // Increment counter to force rerenders
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h2>useMountedRef Demo</h2>
      <p>
        This component is <strong>mounted</strong> and the hook shows:{" "}
        <code>{String(isMounted)}</code>
      </p>
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      <p>
        Re-render count: {count} (the mounted state stays stable during
        re-renders)
      </p>

      <div style={{ marginTop: "20px" }}>
        <h3>Child Component Example</h3>
        <p>
          Toggle the child component to see how unmounting affects its mounted
          state:
        </p>
        <button onClick={() => setShowChild(!showChild)}>
          {showChild ? "Unmount Child" : "Mount Child"}
        </button>

        {showChild && <ChildComponent />}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Usage Notes</h3>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "15px",
            borderRadius: "4px",
          }}
        >
          {`// Example usage in an async operation
const { isMounted } = useMountedRef();

const fetchData = async () => {
  try {
    const data = await api.fetchSomething();
    
    // Prevent state updates if component is unmounted
    if (isMounted) {
      setData(data);
    }
  } catch (error) {
    if (isMounted) {
      setError(error);
    }
  }
};`}
        </pre>
      </div>
    </div>
  );
};

/**
 * A child component that also uses the mounted ref
 */
const ChildComponent = () => {
  const { isMounted } = useMountedRef();
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // This logs the mounted state when unmounting
    return () => {
      console.log("Child unmounted, isMounted =", isMounted);
    };
  }, [isMounted]);

  return (
    <div
      style={{
        background: "#f0f0f0",
        padding: "15px",
        borderRadius: "4px",
        marginTop: "10px",
      }}
    >
      <p>
        Child component's isMounted = <code>{String(isMounted)}</code>
      </p>
      <p>
        <small>
          When this component unmounts, its isMounted will be set to false, but
          you won't see it here. Check the console for a log message when
          unmounting.
        </small>
      </p>
    </div>
  );
};

/**
 * Component demonstrating async operations with useMountedRef
 */
const AsyncDemo = () => {
  const [showComponent, setShowComponent] = useState(true);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h2>Async Operation Example</h2>
      <p>
        This example demonstrates how useMountedRef helps prevent memory leaks
        in async operations
      </p>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setShowComponent(!showComponent)}
          style={{
            padding: "8px 16px",
            background: showComponent ? "#ffdddd" : "#ddffdd",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showComponent ? "Unmount Component" : "Mount Component"}
        </button>
      </div>

      {showComponent && <DataFetchingComponent />}

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Instructions:</strong> Click "Start Fetch" and then
          immediately click "Unmount Component" to see how useMountedRef
          prevents state updates on unmounted components.
        </p>
        <p>
          Without useMountedRef, this would cause React memory leak warnings in
          the console when the async operation completes after unmounting.
        </p>
      </div>
    </div>
  );
};

/**
 * Example component that fetches data with a simulated delay
 */
const DataFetchingComponent = () => {
  const { isMounted, error: mountError } = useMountedRef();
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate API fetch with delay
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Generate random success/failure
      const success = Math.random() > 0.3;

      if (!success) {
        throw new Error("Random fetch error");
      }

      // Check if component is still mounted before updating state
      if (isMounted) {
        console.log("Component is mounted, updating state");
        setData(`Data fetched at ${new Date().toLocaleTimeString()}`);
        setLoading(false);
      } else {
        console.log("Component was unmounted, state update prevented");
      }
    } catch (err) {
      // Check if component is still mounted before updating state
      if (isMounted) {
        console.log("Component is mounted, updating error state");
        setError((err as Error).message);
        setLoading(false);
      } else {
        console.log("Component was unmounted, error state update prevented");
      }
    }
  }, [isMounted]);

  useEffect(() => {
    return () => {
      console.log("DataFetchingComponent unmounted");
    };
  }, []);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "20px",
        background: "#f9f9f9",
      }}
    >
      <h3>Data Fetching Component</h3>
      <p>
        Component mounted: <code>{String(isMounted)}</code>
      </p>
      {mountError && (
        <p style={{ color: "red" }}>Mount Error: {mountError.message}</p>
      )}

      <button
        onClick={fetchData}
        disabled={loading}
        style={{
          padding: "8px 16px",
          background: loading ? "#cccccc" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: "16px",
        }}
      >
        {loading ? "Loading..." : "Start Fetch"}
      </button>

      {data && (
        <div style={{ marginTop: "10px" }}>
          <strong>Data:</strong> {data}
        </div>
      )}

      {error && (
        <div style={{ marginTop: "10px", color: "red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <p>
        <small>
          This component uses useMountedRef to prevent setState calls after it
          unmounts.
        </small>
      </p>
    </div>
  );
};

export const Default: Story = {
  render: () => <MountedRefDemo />,
  name: "Basic Usage",
};

export const AsyncExample: Story = {
  render: () => <AsyncDemo />,
  name: "Async Operations",
  parameters: {
    docs: {
      description: {
        story:
          "Example showing how useMountedRef prevents memory leaks in async operations.",
      },
    },
  },
};
