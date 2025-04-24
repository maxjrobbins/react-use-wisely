// Copy text to clipboard
import { useState, useCallback } from "react";

/**
 * Hook for clipboard operations
 * @param timeout - Reset the copied state after this time in milliseconds
 * @returns Tuple with copied state and copy function
 */
const useClipboard = (timeout = 2000): [boolean, (text: string) => void] => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = useCallback(
    (text: string): void => {
      if (!navigator.clipboard) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        try {
          // @ts-ignore: document.execCommand is deprecated but used for backward compatibility
          document.execCommand("copy");
          setIsCopied(true);

          setTimeout(() => {
            setIsCopied(false);
          }, timeout);
        } catch (err) {
          console.error("Failed to copy text: ", err);
        }

        document.body.removeChild(textArea);
        return;
      }

      // Modern approach with Clipboard API
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setIsCopied(true);

          setTimeout(() => {
            setIsCopied(false);
          }, timeout);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    },
    [timeout]
  );

  return [isCopied, copyToClipboard];
};

export default useClipboard;
