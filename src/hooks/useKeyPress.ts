// Detect when a specific key is pressed
import { useState, useEffect } from "react";

/**
 * Hook that detects when a specific key is pressed
 * @param targetKey - The key to detect
 * @returns True if the key is pressed
 */
const useKeyPress = (targetKey: string): boolean => {
  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  useEffect(() => {
    const downHandler = ({ key }: KeyboardEvent): void => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = ({ key }: KeyboardEvent): void => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]);

  return keyPressed;
};

export default useKeyPress;
