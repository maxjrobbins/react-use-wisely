// Copy text to clipboard
import { useState, useCallback } from "react";
import { ClipboardError } from "./errors";

interface ClipboardState {
  isCopied: boolean;
  error: ClipboardError | null;
}

/**
 * Hook for clipboard operations
 * @param timeout - Reset the copied state after this time in milliseconds
 * @returns Object with state and functions for clipboard operations
 */
const useClipboard = (
  timeout = 2000
): {
  isCopied: boolean;
  error: ClipboardError | null;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
} => {
  const [state, setState] = useState<ClipboardState>({
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

      if (!navigator.clipboard) {
        // Fallback for older browsers
        // First check if document.body exists
        if (!document || !document.body) {
          const clipboardError = new ClipboardError(
            "Failed to copy text using fallback method: document.body is not available"
          );
          console.error(clipboardError);
          setState({ isCopied: false, error: clipboardError });
          return false;
        }

        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);

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
          document.body.removeChild(textArea);
        }
      }

      // Modern approach with Clipboard API
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
    },
    [timeout]
  );

  return {
    isCopied: state.isCopied,
    error: state.error,
    copy: copyToClipboard,
    reset,
  };
};

export default useClipboard;
