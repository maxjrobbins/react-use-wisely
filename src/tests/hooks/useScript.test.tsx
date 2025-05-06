import React from "react";
import { render, screen, act, cleanup } from "@testing-library/react";
import useScript from "../../hooks/useScript";
import { ScriptError } from "../../hooks/errors";
import * as browser from "../../utils/browser";

// Mock the browser utility module
jest.mock("../../utils/browser", () => ({
  runInBrowser: jest.fn((browserFn, ssrFn) => browserFn()),
}));

// Test component that uses the hook
interface TestComponentProps {
  src: string;
  options?: {
    id?: string;
    async?: boolean;
    defer?: boolean;
    crossOrigin?: "anonymous" | "use-credentials";
    integrity?: string;
    noModule?: boolean;
    nonce?: string;
    type?: string;
    referrerPolicy?: string;
  };
}

function TestComponent({ src, options }: TestComponentProps) {
  const { status, isLoading, isReady, isError, isIdle, error, isSupported } =
    useScript(src, options);

  return (
    <div>
      <div data-testid="status">{status}</div>
      <div data-testid="loading">{isLoading ? "true" : "false"}</div>
      <div data-testid="ready">{isReady ? "true" : "false"}</div>
      <div data-testid="error">{isError ? "true" : "false"}</div>
      <div data-testid="idle">{isIdle ? "true" : "false"}</div>
      <div data-testid="supported">{isSupported ? "true" : "false"}</div>
      {error && <div data-testid="error-message">{error.message}</div>}
    </div>
  );
}

describe("useScript", () => {
  let scriptEventHandlers: Record<string, (event?: any) => void>;
  let mockScriptAttributes: Map<string, string>;
  let originalCreateElement: typeof document.createElement;
  let originalQuerySelector: typeof document.querySelector;
  let mockAppendChild: jest.Mock;
  // For tracking created script elements
  let mockScriptElement: any;

  beforeEach(() => {
    cleanup();

    // Reset the event handlers
    scriptEventHandlers = {};
    mockScriptAttributes = new Map();

    // Save original methods
    originalCreateElement = document.createElement;
    originalQuerySelector = document.querySelector;

    // Create a mock appendChild function
    mockAppendChild = jest.fn((node) => node);

    // Mock document.createElement for script element
    document.createElement = jest.fn((tagName) => {
      if (tagName === "script") {
        // Create a fresh script element for each test
        mockScriptElement = {
          src: "",
          id: "",
          async: true,
          defer: false,
          crossOrigin: null,
          integrity: null,
          noModule: false,
          nonce: null,
          type: null,
          referrerPolicy: null,
          setAttribute: jest.fn((name, value) => {
            mockScriptAttributes.set(name, value);
          }),
          getAttribute: jest.fn((name) => mockScriptAttributes.get(name)),
          parentNode: {
            removeChild: jest.fn(),
          },
          // These setters capture the event handlers to call them later
          set onload(handler) {
            scriptEventHandlers.load = handler;
          },
          set onerror(handler) {
            scriptEventHandlers.error = handler;
          },
        };
        return mockScriptElement;
      }
      return originalCreateElement.call(document, tagName);
    });

    // Mock document.querySelector
    document.querySelector = jest.fn((selector) => null);

    // Mock document.head.appendChild directly using defineProperty
    // This is safer than trying to replace document.head which is read-only
    Object.defineProperty(document.head, "appendChild", {
      configurable: true,
      value: mockAppendChild,
    });
  });

  afterEach(() => {
    // Restore original methods
    document.createElement = originalCreateElement;
    document.querySelector = originalQuerySelector;

    // Restore original document.head.appendChild
    if (document.head) {
      Object.defineProperty(document.head, "appendChild", {
        configurable: true,
        value: HTMLElement.prototype.appendChild,
      });
    }
  });

  test("initializes with loading state when src is provided", () => {
    render(<TestComponent src="https://example.com/script.js" />);

    expect(screen.getByTestId("status").textContent).toBe("loading");
    expect(screen.getByTestId("loading").textContent).toBe("true");
    expect(screen.getByTestId("ready").textContent).toBe("false");
    expect(screen.getByTestId("error").textContent).toBe("false");
    expect(screen.getByTestId("idle").textContent).toBe("false");
  });

  test("initializes with idle state when no src is provided", () => {
    render(<TestComponent src="" />);

    expect(screen.getByTestId("status").textContent).toBe("idle");
    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("ready").textContent).toBe("false");
    expect(screen.getByTestId("error").textContent).toBe("false");
    expect(screen.getByTestId("idle").textContent).toBe("true");
  });

  test("creates script element when src is provided", () => {
    render(<TestComponent src="https://example.com/script.js" />);

    expect(document.createElement).toHaveBeenCalledWith("script");
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockScriptAttributes.get("data-status")).toBe("loading");
  });

  test("sets script to ready state on load", () => {
    render(<TestComponent src="https://example.com/script.js" />);

    // Trigger the load handler
    act(() => {
      scriptEventHandlers.load();
    });

    expect(screen.getByTestId("status").textContent).toBe("ready");
    expect(screen.getByTestId("ready").textContent).toBe("true");
    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(mockScriptAttributes.get("data-status")).toBe("ready");
  });

  test("sets script to error state on error", () => {
    render(<TestComponent src="https://example.com/script.js" />);

    // Set parentNode for script to properly test removal
    const removeChildMock = jest.fn();
    mockScriptElement.parentNode = {
      removeChild: removeChildMock,
    };

    // Trigger the error handler
    act(() => {
      scriptEventHandlers.error({ type: "error" });
    });

    expect(screen.getByTestId("status").textContent).toBe("error");
    expect(screen.getByTestId("error").textContent).toBe("true");
    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(mockScriptAttributes.get("data-status")).toBe("error");
    expect(removeChildMock).toHaveBeenCalledWith(mockScriptElement);
  });

  test("uses existing script if already in document", () => {
    // Mock existing script with ready status
    const existingScript = {
      getAttribute: jest.fn((attr) =>
        attr === "data-status" ? "ready" : null
      ),
    };
    (document.querySelector as jest.Mock).mockReturnValueOnce(existingScript);

    render(<TestComponent src="https://example.com/script.js" />);

    // Should not create a new script as one already exists
    expect(mockAppendChild).not.toHaveBeenCalled();
    expect(screen.getByTestId("status").textContent).toBe("ready");
    expect(screen.getByTestId("ready").textContent).toBe("true");
  });

  test("applies script options correctly", () => {
    const options = {
      id: "test-script",
      async: false,
      defer: true,
      crossOrigin: "anonymous" as const,
      integrity: "sha384-test",
      noModule: true,
      nonce: "test-nonce",
      type: "module",
      referrerPolicy: "no-referrer",
    };

    // Special handling to ensure options are applied to script element
    document.createElement = jest.fn((tagName) => {
      if (tagName === "script") {
        // Create mock script with properties that can be set
        mockScriptElement = {
          src: "",
          id: "",
          async: true,
          defer: false,
          crossOrigin: null,
          integrity: null,
          noModule: false,
          nonce: null,
          type: null,
          referrerPolicy: null,
          setAttribute: jest.fn((name, value) => {
            mockScriptAttributes.set(name, value);
          }),
          getAttribute: jest.fn((name) => mockScriptAttributes.get(name)),
          parentNode: { removeChild: jest.fn() },
          set onload(handler) {
            scriptEventHandlers.load = handler;
          },
          set onerror(handler) {
            scriptEventHandlers.error = handler;
          },
        };

        // This hook will be used by our component to update script properties
        Object.defineProperties(mockScriptElement, {
          id: {
            set(value) {
              this._id = value;
            },
            get() {
              return this._id || "";
            },
          },
          async: {
            set(value) {
              this._async = value;
            },
            get() {
              return this._async;
            },
          },
          defer: {
            set(value) {
              this._defer = value;
            },
            get() {
              return this._defer;
            },
          },
          crossOrigin: {
            set(value) {
              this._crossOrigin = value;
            },
            get() {
              return this._crossOrigin;
            },
          },
          integrity: {
            set(value) {
              this._integrity = value;
            },
            get() {
              return this._integrity;
            },
          },
          noModule: {
            set(value) {
              this._noModule = value;
            },
            get() {
              return this._noModule;
            },
          },
          nonce: {
            set(value) {
              this._nonce = value;
            },
            get() {
              return this._nonce;
            },
          },
          type: {
            set(value) {
              this._type = value;
            },
            get() {
              return this._type;
            },
          },
          referrerPolicy: {
            set(value) {
              this._referrerPolicy = value;
            },
            get() {
              return this._referrerPolicy;
            },
          },
        });

        return mockScriptElement;
      }
      return originalCreateElement.call(document, tagName);
    });

    render(
      <TestComponent src="https://example.com/script.js" options={options} />
    );

    // Check script properties were set correctly
    expect(mockScriptElement.id).toBe(options.id);
    expect(mockScriptElement.async).toBe(options.async);
    expect(mockScriptElement.defer).toBe(options.defer);
    expect(mockScriptElement.crossOrigin).toBe(options.crossOrigin);
    expect(mockScriptElement.integrity).toBe(options.integrity);
    expect(mockScriptElement.noModule).toBe(options.noModule);
    expect(mockScriptElement.nonce).toBe(options.nonce);
    expect(mockScriptElement.type).toBe(options.type);
    expect(mockScriptElement.referrerPolicy).toBe(options.referrerPolicy);
  });

  test("handles unsupported environment", () => {
    // Mock runInBrowser to return SSR result
    (browser.runInBrowser as jest.Mock).mockImplementationOnce((_, ssrFn) =>
      ssrFn()
    );

    render(<TestComponent src="https://example.com/script.js" />);

    expect(screen.getByTestId("status").textContent).toBe("unsupported");
    expect(screen.getByTestId("supported").textContent).toBe("false");
    expect(screen.getByTestId("error-message").textContent).toBe(
      "Script loading is not supported in this environment"
    );
  });
});
