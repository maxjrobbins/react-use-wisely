import { useRef, useEffect } from "react";

/**
 * Hook that returns a ref indicating if the component is mounted
 * @returns {React.RefObject<boolean>} Ref containing the mounted state
 */
const useMountedRef = (): React.RefObject<boolean> => {
  const mountedRef = useRef<boolean>(true);

  // Set to false when the component unmounts
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef;
};

export default useMountedRef;
