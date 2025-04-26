// Access device location
import { useState, useEffect, useCallback } from "react";
import { GeolocationError } from "./errors";

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
 * @returns Geolocation state and error
 */
const useGeolocation = (
  options: PositionOptions = {}
): GeolocationState & {
  retry: () => void;
} => {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null,
    error: null,
  });

  const [retryCount, setRetryCount] = useState(0);

  // Function to retry getting location after error
  const retry = useCallback(() => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));
    // Increment retry count to trigger useEffect
    setRetryCount((count) => count + 1);
  }, []);

  useEffect(() => {
    // Early return if geolocation is not supported
    if (!navigator.geolocation) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: new GeolocationError(
          "Geolocation is not supported by your browser"
        ),
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
    };

    try {
      // Start watching position
      watchId = navigator.geolocation.watchPosition(
        geoSuccess,
        geoError,
        options
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
  }, [options, retryCount]);

  return {
    ...state,
    retry,
  };
};

export default useGeolocation;
