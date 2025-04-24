import { useEffect, useRef } from "react";

/**
 * Hook that helps debug which props are causing re-renders
 * @template T Props object type
 * @param {string} componentName - Name for logging
 * @param {T} props - Component props
 */
const useWhyDidYouUpdate = <T extends Record<string, any>>(
  componentName: string,
  props: T
): void => {
  // Store previous props - always declare refs unconditionally
  const prevProps = useRef<T | undefined>(undefined);
  // Use ref to track if we've already logged in this render cycle
  const didLog = useRef<boolean>(false);
  // Track if we're in production mode
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    // Skip if in production
    if (isProduction) {
      return;
    }

    // Skip first render
    if (!prevProps.current) {
      prevProps.current = { ...props };
      return;
    }

    // Reset logging flag at the start of effect
    didLog.current = false;

    // Get keys from current and previous props
    const allKeys = Object.keys({ ...prevProps.current, ...props });
    const changesObj: Record<string, { from: any; to: any }> = {};

    allKeys.forEach((key) => {
      // If previous is different from current
      if (prevProps.current![key] !== props[key]) {
        changesObj[key] = {
          from: prevProps.current![key],
          to: props[key],
        };
      }
    });

    // If there were changes and we haven't logged yet, log them
    if (Object.keys(changesObj).length && !didLog.current) {
      console.log("[why-did-you-update]", componentName, changesObj);
      didLog.current = true;
    }

    // Update previous props with a complete copy
    prevProps.current = { ...props };
  }, [props, componentName, isProduction]);
};

export default useWhyDidYouUpdate;
