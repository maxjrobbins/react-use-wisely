// Access device location
import { useState, useEffect } from "react";

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
  error: Error | GeolocationPositionError | null;
}

/**
 * Hook that provides geolocation data
 * @param options - Geolocation API options
 * @returns Geolocation state and error
 */
const useGeolocation = (options: PositionOptions = {}): GeolocationState => {
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

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: new Error("Geolocation is not supported by your browser"),
      }));
      return;
    }

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
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error,
      }));
    };

    // Start watching position
    const watchId = navigator.geolocation.watchPosition(
      geoSuccess,
      geoError,
      options
    );

    // Clean up
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options]);

  return state;
};

export default useGeolocation;
