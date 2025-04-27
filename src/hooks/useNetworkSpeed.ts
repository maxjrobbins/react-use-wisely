import { useState, useEffect, useCallback, useRef } from "react";
import { NetworkSpeedError } from "./errors";
import { isBrowser, isApiSupported } from "../utils/browser";
import { ConnectionType, ConnectionEffectiveType } from "../utils/types";

// Connection Speed
export interface ConnectionSpeed {
  downlink: number | null; // Downlink speed in Mbps
  rtt: number | null; // Round-trip time in ms
  effectiveType: ConnectionEffectiveType | null;
  saveData: boolean | null; // Data saver enabled
  type: ConnectionType | null;
  lastTested: number | null; // Timestamp of last test
  // Download speed from speed test
  downloadSpeed: number | null; // in Mbps
  uploadSpeed: number | null; // in Mbps
}

export interface SpeedTestOptions {
  testUrl?: string; // URL to fetch for testing
  downloadSize?: number; // Size of file to download in bytes
  uploadData?: string; // Data to upload for test
  timeout?: number; // Timeout for test in ms
}

export interface UseNetworkSpeedOptions {
  pollingInterval?: number; // Interval to poll navigator.connection
  speedTestInterval?: number; // Interval for active speed tests
  onConnectionChange?: (speed: ConnectionSpeed) => void;
  testOnLoad?: boolean;
  speedTestOptions?: SpeedTestOptions;
}

/**
 * Default initial state for network speed tracking
 */
const initialNetworkState: ConnectionSpeed = {
  downlink: null,
  rtt: null,
  effectiveType: null,
  saveData: null,
  type: null,
  lastTested: null,
  downloadSpeed: null,
  uploadSpeed: null,
};

/**
 * Check if Navigator Connection API is supported
 * @returns Whether the Connection API is supported
 */
export const hasConnectionApi = (): boolean => {
  return isApiSupported("connection");
};

/**
 * Get current connection info from Navigator API
 * @returns Connection information
 */
export const getConnectionInfo = (): Partial<ConnectionSpeed> => {
  if (!hasConnectionApi()) {
    return {};
  }

  const connection = (navigator as any).connection;

  return {
    downlink: connection.downlink || null,
    rtt: connection.rtt || null,
    effectiveType:
      (connection.effectiveType as ConnectionEffectiveType) || null,
    saveData: connection.saveData || null,
    type: (connection.type as ConnectionType) || null,
  };
};

/**
 * Measure download speed
 * @param options - Speed test options
 * @returns Download speed in Mbps
 */
export const measureDownloadSpeed = async (
  options: SpeedTestOptions = {}
): Promise<number> => {
  const {
    testUrl = "https://speed.cloudflare.com/__down?bytes=1048576", // 1MB file
    timeout = 10000, // 10 seconds
  } = options;

  try {
    // Record start time
    const startTime = Date.now();

    // Fetch the file
    const response = await fetch(testUrl, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch test file: ${response.status} ${response.statusText}`
      );
    }

    // Get the response as an array buffer
    const data = await response.arrayBuffer();

    // Calculate time taken in seconds
    const endTime = Date.now();
    const durationInSeconds = (endTime - startTime) / 1000;

    // Calculate speed in Mbps (megabits per second)
    // 8 bits in a byte, 1 million bits in a megabit
    const fileSizeInMb = (data.byteLength * 8) / 1000000;
    const speedMbps = fileSizeInMb / durationInSeconds;

    return speedMbps;
  } catch (err) {
    throw err;
  }
};

/**
 * Measure upload speed
 * @param options - Speed test options
 * @returns Upload speed in Mbps
 */
export const measureUploadSpeed = async (
  options: SpeedTestOptions = {}
): Promise<number> => {
  const {
    testUrl = "https://speed.cloudflare.com/__up",
    uploadData = new Array(1048576).fill("X").join(""), // 1MB of data
    timeout = 10000, // 10 seconds
  } = options;

  try {
    // Record start time
    const startTime = Date.now();

    // Upload the data
    const response = await fetch(testUrl, {
      method: "POST",
      body: uploadData,
      cache: "no-store",
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to upload test data: ${response.status} ${response.statusText}`
      );
    }

    // Calculate time taken in seconds
    const endTime = Date.now();
    const durationInSeconds = (endTime - startTime) / 1000;

    // Calculate speed in Mbps (megabits per second)
    const dataSizeInMb = (uploadData.length * 2 * 8) / 1000000; // Unicode chars are 2 bytes
    const speedMbps = dataSizeInMb / durationInSeconds;

    return speedMbps;
  } catch (err) {
    throw err;
  }
};

/**
 * Base hook for detecting basic network information (no speed tests)
 * @returns Connection information
 */
export function useNetworkInfo(): Partial<ConnectionSpeed> {
  const [connectionInfo, setConnectionInfo] = useState<
    Partial<ConnectionSpeed>
  >(isBrowser ? getConnectionInfo() : {});

  // Reference to connection object to prevent multiple instances
  const connectionRef = useRef<any>(null);

  useEffect(() => {
    if (!isBrowser) return;

    // Store reference to connection object
    if (hasConnectionApi()) {
      connectionRef.current = (navigator as any).connection;
    }

    const updateConnectionInfo = () => {
      setConnectionInfo(getConnectionInfo());
    };

    // Initial update
    updateConnectionInfo();

    // Set up event listener for connection changes
    if (hasConnectionApi() && connectionRef.current) {
      connectionRef.current.addEventListener("change", updateConnectionInfo);
    }

    // Cleanup on unmount
    return () => {
      if (hasConnectionApi() && connectionRef.current) {
        connectionRef.current.removeEventListener(
          "change",
          updateConnectionInfo
        );
      }
    };
  }, []);

  return connectionInfo;
}

/**
 * Hook for detecting network speed and connection information
 * @param options - Configuration options
 * @returns Network speed info, test function, loading state, and error
 */
function useNetworkSpeed({
  pollingInterval = 5000,
  speedTestInterval = 0, // 0 means no automatic testing
  onConnectionChange,
  testOnLoad = false,
  speedTestOptions = {},
}: UseNetworkSpeedOptions = {}): [
  ConnectionSpeed,
  () => Promise<void>,
  boolean,
  NetworkSpeedError | null
] {
  // Get basic connection info
  const connectionInfo = useNetworkInfo();

  // State for full connection speed data
  const [connectionSpeed, setConnectionSpeed] = useState<ConnectionSpeed>({
    ...initialNetworkState,
    ...connectionInfo,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<NetworkSpeedError | null>(null);

  // Run a complete network speed test
  const runSpeedTest = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Get latest basic connection info
      const latestConnectionInfo = getConnectionInfo();

      // Run speed tests
      let downloadSpeed = null;
      let uploadSpeed = null;

      try {
        downloadSpeed = await measureDownloadSpeed(speedTestOptions);
      } catch (err) {
        console.warn("Download speed test failed:", err);
      }

      try {
        uploadSpeed = await measureUploadSpeed(speedTestOptions);
      } catch (err) {
        console.warn("Upload speed test failed:", err);
      }

      // Update the connection speed state
      const newConnectionSpeed: ConnectionSpeed = {
        ...initialNetworkState,
        ...latestConnectionInfo,
        downloadSpeed,
        uploadSpeed,
        lastTested: Date.now(),
      };

      setConnectionSpeed(newConnectionSpeed);

      // Call the callback if provided
      if (onConnectionChange) {
        onConnectionChange(newConnectionSpeed);
      }
    } catch (err) {
      setError(new NetworkSpeedError("Failed to run speed test", err));
    } finally {
      setLoading(false);
    }
  }, [speedTestOptions, onConnectionChange]);

  // Update connection info with latest basic info
  useEffect(() => {
    setConnectionSpeed((prev) => ({
      ...prev,
      ...connectionInfo,
    }));
  }, [connectionInfo]);

  // Set up polling for connection info and automatic speed tests
  useEffect(() => {
    // Run speed test on load if enabled
    if (testOnLoad) {
      runSpeedTest().catch((err) => {
        console.error("Initial speed test failed:", err);
      });
    }

    // Set up polling interval for connection info
    const pollingTimer = setInterval(() => {
      const updatedInfo = getConnectionInfo();

      setConnectionSpeed((prev) => ({
        ...prev,
        ...updatedInfo,
      }));

      // Call the callback if provided
      if (onConnectionChange) {
        onConnectionChange({
          ...connectionSpeed,
          ...updatedInfo,
        });
      }
    }, pollingInterval);

    // Set up automatic speed tests if interval is provided
    let speedTestTimer: NodeJS.Timeout | null = null;
    if (speedTestInterval > 0) {
      speedTestTimer = setInterval(() => {
        runSpeedTest().catch((err) => {
          console.error("Scheduled speed test failed:", err);
        });
      }, speedTestInterval);
    }

    // Cleanup on unmount
    return () => {
      clearInterval(pollingTimer);
      if (speedTestTimer) {
        clearInterval(speedTestTimer);
      }
    };
  }, [
    pollingInterval,
    speedTestInterval,
    runSpeedTest,
    testOnLoad,
    onConnectionChange,
    connectionSpeed,
  ]);

  return [connectionSpeed, runSpeedTest, loading, error];
}

export default useNetworkSpeed;
