import React, { ReactElement } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import useClickOutside from "../../hooks/useClickOutside";

interface TestComponentProps {
  callback: () => void;
  enabled?: boolean;
}

// A test component that uses the hook
function TestComponent({
  callback,
  enabled,
}: TestComponentProps): ReactElement {
  const { ref, error, isSupported } = useClickOutside<HTMLDivElement>(
    callback,
    { enabled }
  );

  return (
    <div>
      <div data-testid="outside">Outside Element</div>
      <div data-testid="inside" ref={ref}>
        Inside Element
      </div>
      {error && <div data-testid="error">{error.message}</div>}
      <div data-testid="supported">
        {isSupported ? "Supported" : "Not Supported"}
      </div>
    </div>
  );
}

describe("useClickOutside", () => {
  let mockCallback: jest.Mock;

  beforeEach(() => {
    mockCallback = jest.fn();
  });

  test("should call callback when clicking outside", () => {
    render(<TestComponent callback={mockCallback} />);

    const outsideElement = screen.getByTestId("outside");

    // Click outside
    fireEvent.mouseDown(outsideElement);

    // Callback should be called
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test("should not call callback when clicking inside", () => {
    render(<TestComponent callback={mockCallback} />);

    const insideElement = screen.getByTestId("inside");

    // Click inside
    fireEvent.mouseDown(insideElement);

    // Callback should not be called
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test("should call callback when clicking on document body", () => {
    render(<TestComponent callback={mockCallback} />);

    // Click on document body
    fireEvent.mouseDown(document.body);

    // Callback should be called
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test("should add and remove event listener correctly", () => {
    const addEventListenerSpy = jest.spyOn(document, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(document, "removeEventListener");

    const { unmount } = render(<TestComponent callback={mockCallback} />);

    // Check that the event listener was added
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function)
    );

    // Unmount component
    unmount();

    // Check that the event listener was removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function)
    );

    // Clean up spies
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  test("should not call callback when ref is null", () => {
    // This component doesn't attach the ref to any element
    function NullRefComponent({ callback }: TestComponentProps): ReactElement {
      const { ref, isSupported } = useClickOutside(callback);

      return (
        <div>
          <div data-testid="outside">Outside Element</div>
          <div data-testid="supported">
            {isSupported ? "Supported" : "Not Supported"}
          </div>
          {/* No element with ref attached */}
        </div>
      );
    }

    render(<NullRefComponent callback={mockCallback} />);

    const outsideElement = screen.getByTestId("outside");

    // Click outside
    fireEvent.mouseDown(outsideElement);

    // With a null ref, the callback should NOT be called
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test("should not add event listeners when enabled is false", () => {
    const addEventListenerSpy = jest.spyOn(document, "addEventListener");

    render(<TestComponent callback={mockCallback} enabled={false} />);

    // Event listener should not be added when enabled is false
    expect(addEventListenerSpy).not.toHaveBeenCalled();

    const outsideElement = screen.getByTestId("outside");

    // Click outside
    fireEvent.mouseDown(outsideElement);

    // Callback should not be called
    expect(mockCallback).not.toHaveBeenCalled();

    // Clean up spies
    addEventListenerSpy.mockRestore();
  });

  test("should indicate browser support", () => {
    render(<TestComponent callback={mockCallback} />);

    // In test environment, document is available
    expect(screen.getByTestId("supported").textContent).toBe("Supported");
  });
});
