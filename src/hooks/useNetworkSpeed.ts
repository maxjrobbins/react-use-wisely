import { useState, useEffect, useCallback, useRef } from "react";
import { NetworkSpeedError } from "./errors";
import { features, runInBrowser, isFeatureSupported } from "../utils/browser";
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
  isSupported: boolean; // Whether the Network Information API is supported
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
  isSupported: false,
};

/**
 * Check if Navigator Connection API is supported using our feature detection system
 * @returns Whether the Connection API is supported
 */
export const hasConnectionApi = (): boolean => {
  return isFeatureSupported(
    "connectionAPI",
    () => "connection" in navigator && navigator.connection !== undefined
  );
};

/**
 * Get current connection info from Navigator API
 * @returns Connection information
 */
export const getConnectionInfo = (): Partial<ConnectionSpeed> => {
  if (!hasConnectionApi()) {
    return { isSupported: false };
  }

  try {
    const connection = (navigator as any).connection;

    return {
      downlink: connection.downlink || null,
      rtt: connection.rtt || null,
      effectiveType:
        (connection.effectiveType as ConnectionEffectiveType) || null,
      saveData: connection.saveData || null,
      type: (connection.type as ConnectionType) || null,
      isSupported: true,
    };
  } catch (error) {
    console.warn("Error reading connection info:", error);
    return { isSupported: false };
  }
};

/**
 * Measure download speed
 * @param options - Speed test options
 * @returns Download speed in Mbps
 */
export const measureDownloadSpeed = async (
  options: SpeedTestOptions = {}
): Promise<number> => {
  if (!isFeatureSupported("fetch", () => "fetch" in window)) {
    throw new NetworkSpeedError(
      "Network speed test not supported - fetch API not available",
      null
    );
  }

  const {
    testUrl = "https://speed.cloudflare.com/__down?bytes=1048576", // 1MB file
    timeout = 10000, // 10 seconds
  } = options;

  try {
    // Record start time
    const startTime = Date.now();

    // Check for AbortSignal.timeout support (might not be available in all browsers)
    const signal =
      "AbortSignal" in window && "timeout" in AbortSignal
        ? AbortSignal.timeout(timeout)
        : new AbortController().signal;

    // Add manual timeout if AbortSignal.timeout is not supported
    let timeoutId: number | null = null;
    if (!("timeout" in AbortSignal)) {
      const controller = new AbortController();
      timeoutId = window.setTimeout(() => controller.abort(), timeout);
    }

    // Fetch the file
    const response = await fetch(testUrl, {
      method: "GET",
      cache: "no-store",
      signal,
    });

    // Clear manual timeout if it was set
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

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
  if (!isFeatureSupported("fetch", () => "fetch" in window)) {
    throw new NetworkSpeedError(
      "Network speed test not supported - fetch API not available",
      null
    );
  }

  const {
    testUrl = "https://speed.cloudflare.com/__up",
    uploadData = new Array(1048576).fill("X").join(""), // 1MB of data
    timeout = 10000, // 10 seconds
  } = options;

  try {
    // Record start time
    const startTime = Date.now();

    // Check for AbortSignal.timeout support
    const signal =
      "AbortSignal" in window && "timeout" in AbortSignal
        ? AbortSignal.timeout(timeout)
        : new AbortController().signal;

    // Add manual timeout if AbortSignal.timeout is not supported
    let timeoutId: number | null = null;
    if (!("timeout" in AbortSignal)) {
      const controller = new AbortController();
      timeoutId = window.setTimeout(() => controller.abort(), timeout);
    }

    // Upload the data
    const response = await fetch(testUrl, {
      method: "POST",
      body: uploadData,
      cache: "no-store",
      signal,
    });

    // Clear manual timeout if it was set
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

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
  const isSupported = hasConnectionApi();

  const [connectionInfo, setConnectionInfo] = useState<
    Partial<ConnectionSpeed>
  >(() =>
    runInBrowser(
      () => getConnectionInfo(),
      () => ({ isSupported: false })
    )
  );

  // Reference to connection object to prevent multiple instances
  const connectionRef = useRef<any>(null);

  useEffect(() => {
    if (!isSupported) return;

    // Store reference to connection object
    connectionRef.current = (navigator as any).connection;

    const updateConnectionInfo = () => {
      setConnectionInfo(getConnectionInfo());
    };

    // Initial update
    updateConnectionInfo();

    // Set up event listener for connection changes
    if (connectionRef.current) {
      connectionRef.current.addEventListener("change", updateConnectionInfo);
    }

    // Cleanup on unmount
    return () => {
      if (connectionRef.current) {
        connectionRef.current.removeEventListener(
          "change",
          updateConnectionInfo
        );
      }
    };
  }, [isSupported]);

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

  // Check if fetch is supported for speed tests
  const canRunSpeedTests = isFeatureSupported("fetch", () => "fetch" in window);

  // State for full connection speed data
  const [connectionSpeed, setConnectionSpeed] = useState<ConnectionSpeed>({
    ...initialNetworkState,
    ...connectionInfo,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<NetworkSpeedError | null>(null);

  // Run a complete network speed test
  const runSpeedTest = useCallback(async (): Promise<void> => {
    if (!canRunSpeedTests) {
      setError(
        new NetworkSpeedError(
          "Speed tests require fetch API which is not supported in this browser",
          null
        )
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get current connection info first
      const baseInfo = getConnectionInfo();

      // Run download and upload tests
      const [downloadSpeed, uploadSpeed] = await Promise.all([
        measureDownloadSpeed(speedTestOptions),
        measureUploadSpeed(speedTestOptions),
      ]);

      // Update the state with all information
      const newConnectionSpeed: ConnectionSpeed = {
        ...connectionSpeed,
        ...baseInfo,
        downloadSpeed,
        uploadSpeed,
        lastTested: Date.now(),
        isSupported: true,
      };

      setConnectionSpeed(newConnectionSpeed);

      // Call the change handler if provided
      if (onConnectionChange) {
        onConnectionChange(newConnectionSpeed);
      }

      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error("Speed test error:", err);
      setError(
        new NetworkSpeedError(
          err instanceof Error
            ? err.message
            : "Unknown error during speed test",
          err instanceof Error ? err : null
        )
      );
    } finally {
      setLoading(false);
    }
  }, [
    canRunSpeedTests,
    speedTestOptions,
    connectionInfo,
    connectionSpeed,
    onConnectionChange,
  ]);

  // Update connection info with latest basic info
  useEffect(() => {
    // Only update if we have basic connection info
    if (Object.keys(connectionInfo).length > 0) {
      setConnectionSpeed((prev) => ({
        ...prev,
        ...connectionInfo,
      }));

      // Call the change handler if provided
      if (onConnectionChange) {
        onConnectionChange({
          ...connectionSpeed,
          ...connectionInfo,
        });
      }
    }
  }, [connectionInfo, onConnectionChange, connectionSpeed]);

  // Set up polling for connection info
  useEffect(() => {
    if (!hasConnectionApi() || pollingInterval <= 0) return;

    const intervalId = setInterval(() => {
      const updatedInfo = getConnectionInfo();
      setConnectionSpeed((prev) => ({
        ...prev,
        ...updatedInfo,
      }));
    }, pollingInterval);

    return () => clearInterval(intervalId);
  }, [pollingInterval]);

  // Set up automated speed tests
  useEffect(() => {
    if (speedTestInterval <= 0) return;

    // Run initial test if requested
    if (testOnLoad) {
      runSpeedTest();
    }

    const intervalId = setInterval(() => {
      runSpeedTest();
    }, speedTestInterval);

    return () => clearInterval(intervalId);
  }, [speedTestInterval, testOnLoad, runSpeedTest]);

  return [connectionSpeed, runSpeedTest, loading, error];
}

export default useNetworkSpeed;
