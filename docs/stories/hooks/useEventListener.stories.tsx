import React, { useRef, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import useEventListener from "../../../src/hooks/useEventListener";

const meta: Meta = {
  title: "Hooks/useEventListener",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

// Basic window event example
const WindowEventExample = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEventListener("mousemove", (event: MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  });

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "4px" }}
    >
      <h3>Window Mouse Position</h3>
      <p>Move your mouse anywhere on the screen</p>
      <p>
        X: {mousePosition.x}, Y: {mousePosition.y}
      </p>
    </div>
  );
};

// Element-specific event example
const ElementEventExample = () => {
  const [clicks, setClicks] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { isSupported, error } = useEventListener<"click", HTMLButtonElement>(
    "click",
    () => setClicks((prev) => prev + 1),
    buttonRef
  );

  if (!isSupported) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "4px" }}
    >
      <h3>Element Click Counter</h3>
      <button ref={buttonRef} style={{ padding: "10px 20px" }}>
        Click me! ({clicks} clicks)
      </button>
    </div>
  );
};

// Keyboard event example
const KeyboardEventExample = () => {
  const [lastKey, setLastKey] = useState("");
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  useEventListener("keydown", (event: KeyboardEvent) => {
    setLastKey(event.key);
    setIsShiftPressed(event.shiftKey);
  });

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "4px" }}
    >
      <h3>Keyboard Events</h3>
      <p>Press any key (click here first)</p>
      <p>Last key pressed: {lastKey}</p>
      <p>Shift key {isShiftPressed ? "is" : "is not"} pressed</p>
    </div>
  );
};

// Document event example
const DocumentEventExample = () => {
  const [selection, setSelection] = useState("");

  useEventListener(
    "selectionchange",
    () => {
      const selected = document.getSelection()?.toString() || "";
      setSelection(selected);
    },
    document
  );

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "4px" }}
    >
      <h3>Text Selection</h3>
      <p>Select some text below:</p>
      <p style={{ userSelect: "all" }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <p>Selected text: {selection || "(none)"}</p>
    </div>
  );
};

// Stories
export const WindowMouseTracker: Story = {
  render: () => <WindowEventExample />,
};

export const ButtonClickCounter: Story = {
  render: () => <ElementEventExample />,
};

export const KeyboardEvents: Story = {
  render: () => <KeyboardEventExample />,
};

export const TextSelection: Story = {
  render: () => <DocumentEventExample />,
};

// Combined example showing all features
export const AllExamples: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "20px", maxWidth: "600px" }}>
      <WindowEventExample />
      <ElementEventExample />
      <KeyboardEventExample />
      <DocumentEventExample />
    </div>
  ),
};
