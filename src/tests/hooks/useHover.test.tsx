import React, { ReactElement } from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import useHover from "../../hooks/useHover";

// A test component that uses the hook
function TestComponent(): ReactElement {
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

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

describe("useHover", () => {
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
      const [hoverRef, isHovered] = useHover();

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
});
