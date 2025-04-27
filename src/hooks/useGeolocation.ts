// Access device location
import { useState, useEffect, useCallback } from "react";
import { GeolocationError } from "./errors";
import { features } from "../utils/browser";

// Type definitions
export interface GeolocationState {
  loading: boolean;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  timestamp: number | null;
  error: GeolocationError | null;
  isSupported: boolean;
}

/**
 * Get human-readable error message from GeolocationPositionError
 */
export const getGeolocationErrorMessage = (
  error: GeolocationPositionError
): string => {
  switch (error.code) {
    case 1:
      return "Geolocation permission denied";
    case 2:
      return "Position unavailable. The network is down or the positioning satellites cannot be contacted";
    case 3:
      return "Geolocation request timed out";
    default:
      return `Geolocation error: ${error.message}`;
  }
};

/**
 * Hook that provides geolocation data
 * @param options - Geolocation API options
 * @returns Geolocation state, error and retry function
 */
const useGeolocation = (
  options: PositionOptions = {}
): GeolocationState & {
  retry: () => void;
} => {
  // Check if the geolocation API is supported
  const isSupported = features.geolocation();

  const [state, setState] = useState<GeolocationState>({
    loading: isSupported, // Only show loading if the API is supported
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null,
    error: null,
    isSupported,
  });

  const [retryCount, setRetryCount] = useState(0);

  // Function to retry getting location after error
  const retry = useCallback(() => {
    if (!isSupported) {
      setState((prev) => ({
        ...prev,
        error: new GeolocationError(
          "Geolocation is not supported by your browser"
        ),
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));
    // Increment retry count to trigger useEffect
    setRetryCount((count) => count + 1);
  }, [isSupported]);

  useEffect(() => {
    // Early return if geolocation is not supported
    if (!isSupported) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: new GeolocationError(
          "Geolocation is not supported by your browser"
        ),
        isSupported: false,
      }));
      return;
    }

    let watchId: number;

    const geoSuccess = (position: GeolocationPosition) => {
      const {
        coords: {
          accuracy,
          altitude,
          altitudeAccuracy,
          heading,
          latitude,
          longitude,
          speed,
        },
        timestamp,
      } = position;

      setState({
        loading: false,
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        latitude,
        longitude,
        speed,
        timestamp,
        error: null,
        isSupported,
      });
    };

    const geoError = (error: GeolocationPositionError) => {
      const errorMessage = getGeolocationErrorMessage(error);
      console.warn(`Geolocation error (${error.code}): ${errorMessage}`);

      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: new GeolocationError(errorMessage, error),
      }));

      // If it's a timeout error (code 3), we could automatically retry
      if (error.code === 3 && options.timeout) {
        // Calculate a new timeout that's slightly longer
        const extendedOptions = {
          ...options,
          timeout: Math.min(options.timeout * 1.5, 60000), // Increase timeout, max 60s
        };

        // Wait a moment, then retry with extended timeout
        setTimeout(() => {
          try {
            watchId = navigator.geolocation.watchPosition(
              geoSuccess,
              geoError,
              extendedOptions
            );
          } catch (error) {
            // Silently fail on retry
          }
        }, 1000);
      }
    };

    try {
      // Apply sensible defaults if not provided in options
      const enhancedOptions: PositionOptions = {
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: options.timeout ?? 10000, // 10 second default timeout
        maximumAge: options.maximumAge ?? 0, // Default to fresh position
        ...options,
      };

      // Start watching position
      watchId = navigator.geolocation.watchPosition(
        geoSuccess,
        geoError,
        enhancedOptions
      );
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: new GeolocationError(
          error instanceof Error ? error.message : "Unknown geolocation error",
          error instanceof Error ? error : undefined
        ),
      }));
    }

    // Clean up
    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [options, retryCount, isSupported]);

  return {
    ...state,
    retry,
  };
};

export default useGeolocation;
