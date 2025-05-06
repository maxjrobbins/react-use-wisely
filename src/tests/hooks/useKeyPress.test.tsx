import React, { FC } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import useKeyPress from "../../hooks/useKeyPress";

interface TestComponentProps {
  targetKey: string;
}

// A test component that uses the hook
const TestComponent: FC<TestComponentProps> = ({ targetKey }) => {
  const {
    isPressed: isKeyPressed,
    isSupported,
    error,
  } = useKeyPress(targetKey);

  return (
    <div>
      <div data-testid="status">
        {isKeyPressed
          ? `${targetKey} is pressed`
          : `${targetKey} is not pressed`}
      </div>
      <div data-testid="support">
        {isSupported ? "Supported" : "Not supported"}
      </div>
      <div data-testid="error">{error ? error.message : "No error"}</div>
    </div>
  );
};

describe("useKeyPress", () => {
  test("should detect when specified key is pressed", () => {
    render(<TestComponent targetKey="Enter" />);

    // Key is not pressed initially
    expect(screen.getByTestId("status").textContent).toBe(
      "Enter is not pressed"
    );

    // Press the key
    fireEvent.keyDown(window, { key: "Enter" });

    // Key should be detected as pressed
    expect(screen.getByTestId("status").textContent).toBe("Enter is pressed");

    // Release the key
    fireEvent.keyUp(window, { key: "Enter" });

    // Key should no longer be detected as pressed
    expect(screen.getByTestId("status").textContent).toBe(
      "Enter is not pressed"
    );
  });

  test("should not detect when different key is pressed", () => {
    render(<TestComponent targetKey="Enter" />);

    // Press a different key
    fireEvent.keyDown(window, { key: "Space" });

    // Target key should not be detected as pressed
    expect(screen.getByTestId("status").textContent).toBe(
      "Enter is not pressed"
    );
  });

  test("should handle multiple key presses correctly", () => {
    render(<TestComponent targetKey="Shift" />);

    // Press a different key first
    fireEvent.keyDown(window, { key: "Control" });

    // Target key should not be detected as pressed
    expect(screen.getByTestId("status").textContent).toBe(
      "Shift is not pressed"
    );

    // Now press the target key
    fireEvent.keyDown(window, { key: "Shift" });

    // Target key should be detected as pressed
    expect(screen.getByTestId("status").textContent).toBe("Shift is pressed");

    // Release the different key
    fireEvent.keyUp(window, { key: "Control" });

    // Target key should still be detected as pressed
    expect(screen.getByTestId("status").textContent).toBe("Shift is pressed");

    // Release the target key
    fireEvent.keyUp(window, { key: "Shift" });

    // Target key should no longer be detected as pressed
    expect(screen.getByTestId("status").textContent).toBe(
      "Shift is not pressed"
    );
  });

  test("should add and remove event listeners correctly", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = render(<TestComponent targetKey="Enter" />);

    // Check that event listeners were added
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "keyup",
      expect.any(Function)
    );

    // Unmount component
    unmount();

    // Check that event listeners were removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keyup",
      expect.any(Function)
    );

    // Clean up spies
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  test("should work with special keys", () => {
    render(<TestComponent targetKey="Escape" />);

    // Press the Escape key
    fireEvent.keyDown(window, { key: "Escape" });

    // Key should be detected as pressed
    expect(screen.getByTestId("status").textContent).toBe("Escape is pressed");
  });

  test("should indicate if the feature is supported", () => {
    render(<TestComponent targetKey="Enter" />);
    expect(screen.getByTestId("support").textContent).toBe("Supported");
  });

  test("should handle errors gracefully", () => {
    // Mock addEventListener to throw an error
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = jest.fn().mockImplementation(() => {
      throw new Error("Mock error");
    });

    render(<TestComponent targetKey="Enter" />);
    expect(screen.getByTestId("error").textContent).toBe("Mock error");

    // Restore original addEventListener
    window.addEventListener = originalAddEventListener;
  });
});
