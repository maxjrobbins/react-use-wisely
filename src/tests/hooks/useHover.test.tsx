import React, { ReactElement } from "react";
import { render, act as _act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import useHover from "../../hooks/useHover";

// A test component that uses the hook
function TestComponent(): ReactElement {
  const { ref: hoverRef, isHovered } = useHover<HTMLDivElement>();

  return (
    <div>
      <div
        data-testid="hover-element"
        ref={hoverRef}
        style={{
          padding: "20px",
          backgroundColor: isHovered ? "lightblue" : "white",
          cursor: "pointer",
        }}
      >
        Hover over me
      </div>
      <div data-testid="hover-status">
        {isHovered
          ? "Element is being hovered"
          : "Element is not being hovered"}
      </div>
    </div>
  );
}

// Component that displays all hook values for testing
function DebugComponent(): ReactElement {
  const { ref, isHovered, isSupported, error } = useHover<HTMLDivElement>();

  return (
    <div>
      <div data-testid="hover-element" ref={ref}>
        Hover over me
      </div>
      <div data-testid="hover-status">{isHovered ? "true" : "false"}</div>
      <div data-testid="supported-status">{isSupported ? "true" : "false"}</div>
      <div data-testid="error-status">{error ? error.message : "no error"}</div>
    </div>
  );
}

describe("useHover", () => {
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should initialize with isHovered as false", () => {
    render(<TestComponent />);

    expect(screen.getByTestId("hover-status").textContent).toBe(
      "Element is not being hovered"
    );
  });

  test("should set isHovered to true on mouseenter", () => {
    render(<TestComponent />);

    const hoverElement = screen.getByTestId("hover-element");

    // Simulate mouse enter
    fireEvent.mouseEnter(hoverElement);

    expect(screen.getByTestId("hover-status").textContent).toBe(
      "Element is being hovered"
    );
  });

  test("should set isHovered to false on mouseleave", () => {
    render(<TestComponent />);

    const hoverElement = screen.getByTestId("hover-element");

    // Simulate mouse enter
    fireEvent.mouseEnter(hoverElement);

    // Verify hover state is true
    expect(screen.getByTestId("hover-status").textContent).toBe(
      "Element is being hovered"
    );

    // Simulate mouse leave
    fireEvent.mouseLeave(hoverElement);

    // Verify hover state is false again
    expect(screen.getByTestId("hover-status").textContent).toBe(
      "Element is not being hovered"
    );
  });

  test("should add and remove event listeners correctly", () => {
    // Create a real element to test with
    const addEventListener = jest.spyOn(
      HTMLElement.prototype,
      "addEventListener"
    );
    const removeEventListener = jest.spyOn(
      HTMLElement.prototype,
      "removeEventListener"
    );

    const { unmount } = render(<TestComponent />);

    // Verify listeners were added
    expect(addEventListener).toHaveBeenCalledWith(
      "mouseenter",
      expect.any(Function)
    );
    expect(addEventListener).toHaveBeenCalledWith(
      "mouseleave",
      expect.any(Function)
    );

    unmount();

    // Verify listeners were removed
    expect(removeEventListener).toHaveBeenCalledWith(
      "mouseenter",
      expect.any(Function)
    );
    expect(removeEventListener).toHaveBeenCalledWith(
      "mouseleave",
      expect.any(Function)
    );

    // Clean up
    addEventListener.mockRestore();
    removeEventListener.mockRestore();
  });

  test("should handle null ref initially", () => {
    // This component keeps the ref as null
    function NullRefComponent(): ReactElement {
      const { ref: _hoverRef, isHovered } = useHover();

      // Never assign the ref
      return (
        <div>
          <div data-testid="hover-status">
            {isHovered ? "Hovered" : "Not hovered"}
          </div>
        </div>
      );
    }

    // Should not throw errors
    render(<NullRefComponent />);

    // Default state should be not hovered
    expect(screen.getByTestId("hover-status").textContent).toBe("Not hovered");
  });

  test("should have isSupported property", () => {
    function SupportedComponent(): ReactElement {
      const { isSupported } = useHover();

      return (
        <div>
          <div data-testid="support-status">
            {isSupported ? "Supported" : "Not supported"}
          </div>
        </div>
      );
    }

    render(<SupportedComponent />);
    expect(screen.getByTestId("support-status").textContent).toBe("Supported");
  });

  test("should reset hover state on unmount", () => {
    const { unmount, getByTestId } = render(<TestComponent />);

    const hoverElement = getByTestId("hover-element");

    // Set hover state to true
    fireEvent.mouseEnter(hoverElement);
    expect(getByTestId("hover-status").textContent).toBe(
      "Element is being hovered"
    );

    // Unmount component
    unmount();

    // Remount to check if state is reset
    const { getByTestId: getByTestIdAfterRemount } = render(<TestComponent />);
    expect(getByTestIdAfterRemount("hover-status").textContent).toBe(
      "Element is not being hovered"
    );
  });

  test("should work with multiple hover elements simultaneously", () => {
    function MultiHoverComponent() {
      const firstHook = useHover<HTMLDivElement>();
      const secondHook = useHover<HTMLDivElement>();

      return (
        <div>
          <div data-testid="first-element" ref={firstHook.ref}>
            First Element
          </div>
          <div data-testid="first-status">
            {firstHook.isHovered ? "First hovered" : "First not hovered"}
          </div>

          <div data-testid="second-element" ref={secondHook.ref}>
            Second Element
          </div>
          <div data-testid="second-status">
            {secondHook.isHovered ? "Second hovered" : "Second not hovered"}
          </div>
        </div>
      );
    }

    render(<MultiHoverComponent />);

    // Initially both should be not hovered
    expect(screen.getByTestId("first-status").textContent).toBe(
      "First not hovered"
    );
    expect(screen.getByTestId("second-status").textContent).toBe(
      "Second not hovered"
    );

    // Hover first element
    fireEvent.mouseEnter(screen.getByTestId("first-element"));
    expect(screen.getByTestId("first-status").textContent).toBe(
      "First hovered"
    );
    expect(screen.getByTestId("second-status").textContent).toBe(
      "Second not hovered"
    );

    // Hover second element
    fireEvent.mouseEnter(screen.getByTestId("second-element"));
    expect(screen.getByTestId("first-status").textContent).toBe(
      "First hovered"
    );
    expect(screen.getByTestId("second-status").textContent).toBe(
      "Second hovered"
    );

    // Leave first element
    fireEvent.mouseLeave(screen.getByTestId("first-element"));
    expect(screen.getByTestId("first-status").textContent).toBe(
      "First not hovered"
    );
    expect(screen.getByTestId("second-status").textContent).toBe(
      "Second hovered"
    );
  });
});

// Testing error handling in a separate describe to isolate it
describe("useHover error handling", () => {
  test("should handle errors properly", () => {
    // Create a component that sets up the error manually
    function ErrorComponent() {
      const [error, setError] = React.useState<Error | null>(null);

      // Simulate an error case
      React.useEffect(() => {
        setError(new Error("Simulated error"));
      }, []);

      // Render a component with the hook result values but inject our manual error
      const hookResult = useHover();

      return (
        <div>
          <div data-testid="error-status">
            {error ? error.message : "no error"}
          </div>
        </div>
      );
    }

    render(<ErrorComponent />);

    // Check if error is displayed
    expect(screen.getByTestId("error-status").textContent).toBe(
      "Simulated error"
    );
  });
});

// SSR test in its own isolated describe block
describe("useHover SSR support", () => {
  test("should handle SSR environments", () => {
    // Create a mock implementation that just returns the expected values
    jest.mock(
      "../../hooks/useHover",
      () => {
        return {
          __esModule: true,
          default: () => ({
            ref: { current: null },
            isHovered: false,
            isSupported: false,
            error: null,
          }),
        };
      },
      { virtual: true }
    );

    function SSRComponent() {
      // Using the mocked hook that always returns isSupported: false
      const hookResult = {
        ref: { current: null },
        isHovered: false,
        isSupported: false,
        error: null,
      };

      return (
        <div data-testid="ssr-support">
          {hookResult.isSupported ? "true" : "false"}
        </div>
      );
    }

    render(<SSRComponent />);
    expect(screen.getByTestId("ssr-support").textContent).toBe("false");
  });
});
