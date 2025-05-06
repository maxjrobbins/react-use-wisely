// Copy text to clipboard
import { useState, useCallback } from "react";
import { ClipboardError } from "./errors";
import { features, isFeatureSupported } from "../utils/browser";

/**
 * Options for the useClipboard hook
 */
export interface ClipboardOptions {
  /**
   * Reset the copied state after this time in milliseconds
   * @default 2000
   */
  timeout?: number;
}

/**
 * Hook result for clipboard operations
 */
export interface ClipboardResult {
  // State
  isCopied: boolean;
  // Error handling
  error: ClipboardError | null;
  // Support information
  isSupported: boolean;
  // Methods
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
}

/**
 * Check if the Clipboard API is supported
 */
const isClipboardApiSupported = (): boolean => {
  return features.clipboard.write();
};

/**
 * Check if the document.execCommand('copy') method is supported (fallback method)
 */
const isExecCommandSupported = (): boolean => {
  try {
    return isFeatureSupported("execCommand", () => {
      return (
        typeof document !== "undefined" &&
        typeof document.execCommand === "function" &&
        document.queryCommandSupported("copy")
      );
    });
  } catch (err) {
    return false;
  }
};

/**
 * Hook for clipboard operations
 * @param options - Configuration options
 * @returns Object with state and functions for clipboard operations
 */
const useClipboard = (options: ClipboardOptions = {}): ClipboardResult => {
  const { timeout = 2000 } = options;

  // Check feature support - safe for SSR and null document.body
  const clipboardApiSupported = isClipboardApiSupported();
  const fallbackSupported = isExecCommandSupported();
  const isSupported = clipboardApiSupported || fallbackSupported;

  const [state, setState] = useState<{
    isCopied: boolean;
    error: ClipboardError | null;
  }>({
    isCopied: false,
    error: null,
  });

  // Reset state
  const reset = useCallback(() => {
    setState({
      isCopied: false,
      error: null,
    });
  }, []);

  // Function to copy text to clipboard
  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      // Reset state first
      setState({
        isCopied: false,
        error: null,
      });

      // If no clipboard support at all, return error immediately
      if (!isSupported) {
        const clipboardError = new ClipboardError(
          "Clipboard operations are not supported in this browser"
        );
        console.error(clipboardError);
        setState({
          isCopied: false,
          error: clipboardError,
        });
        return false;
      }

      // For test environment, directly check if navigator.clipboard exists
      // rather than using the feature detection, which might be mocked
      const hasClipboardApi =
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function";

      // Safety check for document.body in tests
      const hasDocumentBody =
        typeof document !== "undefined" &&
        document.body !== null &&
        document.body !== undefined;

      // In tests, when navigator.clipboard is undefined, we should use the fallback method
      if (hasClipboardApi && clipboardApiSupported) {
        try {
          await navigator.clipboard.writeText(text);
          setState({ isCopied: true, error: null });

          setTimeout(() => {
            setState((prev) => ({ ...prev, isCopied: false }));
          }, timeout);

          return true;
        } catch (err) {
          // Handle possible errors:
          // - NotAllowedError: The request is not allowed
          // - SecurityError: Permission issues or insecure context
          let errorMessage = "Failed to copy text to clipboard";

          if (err instanceof Error) {
            if (err.name === "NotAllowedError") {
              errorMessage = "Permission to access clipboard was denied";
            } else if (err.name === "SecurityError") {
              errorMessage =
                "Clipboard access is only available in secure contexts (HTTPS)";
            }
          }

          const clipboardError = new ClipboardError(errorMessage, err);
          console.error(clipboardError);
          setState({ isCopied: false, error: clipboardError });
          return false;
        }
      } else {
        // Fallback for older browsers or when Clipboard API is unavailable in tests
        // First check if document.body exists
        if (!hasDocumentBody) {
          const clipboardError = new ClipboardError(
            "Failed to copy text using fallback method: document.body is not available",
            null
          );
          console.error(clipboardError);
          setState({
            isCopied: false,
            error: clipboardError,
          });
          return false;
        }

        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";

        // Safe append that checks for document.body existence again (could have changed between checks)
        try {
          document.body.appendChild(textArea);
        } catch (err) {
          const clipboardError = new ClipboardError(
            "Failed to copy text using fallback method: document.body is not available",
            err
          );
          console.error(clipboardError);
          setState({
            isCopied: false,
            error: clipboardError,
          });
          return false;
        }

        try {
          textArea.focus();

          // This ensures better compatibility across browsers
          try {
            const range = document.createRange();
            range.selectNodeContents(textArea);
            const selection = window.getSelection();
            if (selection) {
              selection.removeAllRanges();
              selection.addRange(range);
              textArea.setSelectionRange(0, textArea.value.length); // For mobile devices
            } else {
              // Fallback to the simpler approach
              textArea.select();
            }
          } catch (selectionError) {
            // Fallback to simple selection if the robust approach fails
            textArea.select();
          }

          // @ts-ignore: document.execCommand is deprecated but used for backward compatibility
          const successful = document.execCommand("copy");
          if (!successful) {
            throw new Error("Copy command was unsuccessful");
          }

          setState({ isCopied: true, error: null });

          setTimeout(() => {
            setState((prev) => ({ ...prev, isCopied: false }));
          }, timeout);

          return true;
        } catch (err) {
          const clipboardError = new ClipboardError(
            "Failed to copy text using fallback method",
            err
          );
          console.error(clipboardError);
          setState({ isCopied: false, error: clipboardError });
          return false;
        } finally {
          try {
            document.body.removeChild(textArea);
          } catch (err) {
            // If we can't remove the element, it's not critical
            console.error("Failed to clean up textarea element", err);
          }
        }
      }
    },
    [timeout, clipboardApiSupported, fallbackSupported, isSupported]
  );

  return {
    // State
    isCopied: state.isCopied,
    // Error handling
    error: state.error,
    // Support information
    isSupported,
    // Methods
    copy: copyToClipboard,
    reset,
  };
};

export default useClipboard;
