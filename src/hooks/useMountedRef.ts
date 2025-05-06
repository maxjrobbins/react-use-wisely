import { useRef, useEffect } from "react";

interface MountedRefResult {
  isMounted: boolean;
  error: Error | null;
}

/**
 * Hook that tracks if the component is mounted
 * @returns An object with the component's mounted state
 */
function useMountedRef(): MountedRefResult {
  // Track if component is mounted with a ref
  const mounted = useRef(true);

  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  // Create a new object on each render that reads the current ref value
  return {
    get isMounted() {
      return mounted.current;
    },
    error: null,
  };
}

export default useMountedRef;
