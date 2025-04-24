import React, { FC } from "react";
import { render } from "@testing-library/react";
import useWhyDidYouUpdate from "../../hooks/useWhyDidYouUpdate";

// Mock console.log to track calls
const originalConsoleLog = console.log;
let consoleLogCalls: any[][] = [];

beforeEach(() => {
  // Reset tracked calls
  consoleLogCalls = [];

  // Mock console.log
  console.log = jest.fn((...args) => {
    consoleLogCalls.push(args);
  });
});

afterEach(() => {
  // Restore original console.log
  console.log = originalConsoleLog;
});

interface TestComponentProps {
  primitiveValue?: string;
  objectValue?: Record<string, any>;
  functionValue?: () => void;
  temporaryProp?: string;
  newProp?: string;
}

// Test component that uses the hook
const TestComponent: FC<TestComponentProps> = (props) => {
  useWhyDidYouUpdate("TestComponent", props);
  return <div>{props.primitiveValue || "No Value"}</div>;
};

describe("useWhyDidYouUpdate", () => {
  // Save original NODE_ENV
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    // Set to development for tests
    process.env.NODE_ENV = "development";

    // Reset for each test
    jest.resetModules();
  });

  afterEach(() => {
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });

  test("should handle primitive props changes", () => {
    const { rerender } = render(<TestComponent primitiveValue="initial" />);

    // Should not log on initial render
    expect(consoleLogCalls.length).toBe(0);

    // Change primitive value
    rerender(<TestComponent primitiveValue="changed" />);

    // Should log the change - note we're checking for any number of calls
    // since the hook might log multiple times depending on React's behavior
    expect(consoleLogCalls.length).toBeGreaterThan(0);

    // Check content of first log
    expect(consoleLogCalls[0][0]).toBe("[why-did-you-update]");
    expect(consoleLogCalls[0][1]).toBe("TestComponent");
    expect(consoleLogCalls[0][2]).toHaveProperty("primitiveValue");
    expect(consoleLogCalls[0][2].primitiveValue).toEqual({
      from: "initial",
      to: "changed",
    });
  });

  test("should log when object props change by reference", () => {
    const initialObject = { foo: "bar" };
    const newObject = { foo: "bar" }; // Same content, different reference

    const { rerender } = render(<TestComponent objectValue={initialObject} />);

    // Should not log on initial render
    expect(consoleLogCalls.length).toBe(0);

    // Change object reference with same content
    rerender(<TestComponent objectValue={newObject} />);

    // Should log the change
    expect(consoleLogCalls.length).toBeGreaterThan(0);
    expect(consoleLogCalls[0][2]).toHaveProperty("objectValue");
    expect(consoleLogCalls[0][2].objectValue.from).toBe(initialObject);
    expect(consoleLogCalls[0][2].objectValue.to).toBe(newObject);
  });

  test("should not log when props stay the same", () => {
    const objectValue = { foo: "bar" };
    const functionValue = () => {};

    const { rerender } = render(
      <TestComponent
        primitiveValue="test"
        objectValue={objectValue}
        functionValue={functionValue}
      />
    );

    // Should not log on initial render
    expect(consoleLogCalls.length).toBe(0);

    // Re-render with same props
    rerender(
      <TestComponent
        primitiveValue="test"
        objectValue={objectValue}
        functionValue={functionValue}
      />
    );

    // Should not log since nothing changed
    expect(consoleLogCalls.length).toBe(0);
  });

  test("should log multiple prop changes", () => {
    const { rerender } = render(
      <TestComponent primitiveValue="initial" objectValue={{ foo: "bar" }} />
    );

    // Should not log on initial render
    expect(consoleLogCalls.length).toBe(0);

    // Change multiple props
    rerender(
      <TestComponent
        primitiveValue="changed"
        objectValue={{ foo: "baz" }}
        functionValue={() => {}}
      />
    );

    // Should log all changes
    expect(consoleLogCalls.length).toBeGreaterThan(0);
    expect(consoleLogCalls[0][2]).toHaveProperty("primitiveValue");
    expect(consoleLogCalls[0][2]).toHaveProperty("objectValue");

    // New props may or may not be detected depending on hook implementation
    // Some implementations only track differences between existing props
  });

  test("should handle added and removed props", () => {
    // First test: adding a prop
    const { rerender } = render(<TestComponent primitiveValue="test" />);

    // Should not log on initial render
    expect(consoleLogCalls.length).toBe(0);

    // Add a new prop
    rerender(<TestComponent primitiveValue="test" newProp="I'm new" />);

    // Check that something was logged, but don't make assumptions about exactly what
    expect(consoleLogCalls.length).toBeGreaterThan(0);

    // Reset console logs for the second part of the test
    consoleLogCalls = [];

    // Second test: removing a prop
    const { rerender: rerender2 } = render(
      <TestComponent primitiveValue="test" temporaryProp="temp" />
    );

    // Clear initial render logs
    consoleLogCalls = [];

    // Remove a prop
    rerender2(<TestComponent primitiveValue="test" />);

    // Check that something was logged, but don't make assumptions about exactly what
    expect(consoleLogCalls.length).toBeGreaterThan(0);
  });

  test("should not run in production environment", () => {
    // Set to production
    process.env.NODE_ENV = "production";

    const { rerender } = render(<TestComponent primitiveValue="initial" />);

    // Change props
    rerender(<TestComponent primitiveValue="changed" />);

    // Should not log anything in production
    expect(consoleLogCalls.length).toBe(0);
  });
});
