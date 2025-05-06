// Detect when a specific key is pressed
import { useState, useEffect } from "react";

/**
 * Hook that detects when a specific key is pressed
 * @param targetKey - The key to detect
 * @returns Object with isPressed state, isSupported flag, and error
 */
const useKeyPress = (targetKey: string) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const isSupported =
    typeof window !== "undefined" && "addEventListener" in window;

  useEffect(() => {
    if (!isSupported) return;

    try {
      const downHandler = ({ key }: KeyboardEvent): void => {
        if (key === targetKey) {
          setIsPressed(true);
        }
      };

      const upHandler = ({ key }: KeyboardEvent): void => {
        if (key === targetKey) {
          setIsPressed(false);
        }
      };

      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);

      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error in useKeyPress")
      );
    }
  }, [targetKey, isSupported]);

  return {
    isPressed,
    isSupported,
    error,
  };
};

export default useKeyPress;
