import React from "react";
import useGeolocation from "../../../src/hooks/useGeolocation";

export default {
  title: "Hooks/useGeolocation",
  parameters: {
    componentSubtitle: "Hook that provides browser geolocation data",
    docs: {
      description: {
        component:
          "A React hook that provides access to the browser Geolocation API with status tracking and error handling.",
      },
    },
  },
};

export const Default = () => {
  const { loading, error, latitude, longitude, accuracy, timestamp, retry } =
    useGeolocation();

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Geolocation Demo</h3>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={retry}
          disabled={loading}
          style={{
            padding: "8px 12px",
            backgroundColor: loading ? "#cccccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading
            ? "Getting location..."
            : error
            ? "Retry Location"
            : "Refresh Location"}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#fff0f0",
            color: "#d32f2f",
            borderRadius: "4px",
            marginBottom: "20px",
            border: "1px solid #ffcdd2",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0" }}>
            <span
              role="img"
              aria-label="warning"
              style={{ marginRight: "8px" }}
            >
              ⚠️
            </span>
            Error Details:
          </h4>
          <div>
            <strong>Message:</strong>{" "}
            {error.message || "Unknown error occurred"}
          </div>
          {error.code !== undefined && (
            <div style={{ marginTop: "4px" }}>
              <strong>Error Code:</strong> {error.code}
            </div>
          )}
        </div>
      )}

      {latitude && longitude ? (
        <div>
          <h4>Location Data:</h4>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  Latitude
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {latitude}°
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  Longitude
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {longitude}°
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  Accuracy
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {accuracy ? `${Math.round(accuracy)} meters` : "N/A"}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  Timestamp
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {timestamp ? new Date(timestamp).toLocaleString() : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: "20px" }}>
            <a
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "8px 12px",
                backgroundColor: "#1a73e8",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
              }}
            >
              View on Google Maps
            </a>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "12px",
            marginTop: "15px",
            backgroundColor: error ? "#fff0f0" : "#f5f5f5",
            borderRadius: "4px",
            color: error ? "#d32f2f" : "#333",
          }}
        >
          <p style={{ margin: "0 0 8px 0" }}>
            No location data available.{" "}
            {error
              ? "An error occurred when trying to get your location."
              : "Allow location access in your browser for this demo to work."}
          </p>
          {!error && (
            <div style={{ fontSize: "0.9em" }}>
              <strong>Possible reasons:</strong>
              <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
                <li>Browser permission not yet granted</li>
                <li>Browser doesn't support geolocation</li>
                <li>Device has no GPS or location services</li>
              </ul>
            </div>
          )}
        </div>
      )}

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        Note: You will need to grant location permissions to your browser for
        this demo to work. Click the button above to request permissions.
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";

export const WithErrorInfo = () => {
  const geolocation = useGeolocation({
    enableHighAccuracy: true,
    timeout: 5000,
  });
  const {
    loading,
    error,
    latitude,
    longitude,
    accuracy,
    altitude,
    altitudeAccuracy,
    heading,
    speed,
    timestamp,
    retry,
  } = geolocation;

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Advanced Geolocation Demo with Error Handling</h3>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={retry}
          disabled={loading}
          style={{
            padding: "8px 12px",
            backgroundColor: loading ? "#cccccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading
            ? "Getting location..."
            : error
            ? "Retry Location"
            : "Refresh Location"}
        </button>
      </div>

      <div
        style={{
          marginBottom: "15px",
          padding: "10px",
          backgroundColor: loading ? "#e3f2fd" : "#f5f5f5",
          borderRadius: "4px",
          border: loading ? "1px solid #bbdefb" : "1px solid #e0e0e0",
        }}
      >
        <div>
          <strong>Status:</strong> {loading ? "Loading location..." : "Ready"}
        </div>
        {timestamp && (
          <div style={{ marginTop: "5px", fontSize: "0.9em" }}>
            <strong>Last updated:</strong>{" "}
            {new Date(timestamp).toLocaleString()}
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "20px",
            border: "1px solid #ffcdd2",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0" }}>
            <span
              role="img"
              aria-label="warning"
              style={{ marginRight: "8px" }}
            >
              ⚠️
            </span>
            Error Details:
          </h4>
          <div>
            <strong>Message:</strong>{" "}
            {error.message || "Unknown error occurred"}
          </div>
          {error.code !== undefined && (
            <div style={{ marginTop: "4px" }}>
              <strong>Error Code:</strong> {error.code}
              {error.code === 1 && " - Permission Denied"}
              {error.code === 2 && " - Position Unavailable"}
              {error.code === 3 && " - Timeout"}
            </div>
          )}
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={retry}
              style={{
                padding: "6px 10px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9em",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {latitude && longitude ? (
        <div>
          <h4>Location Data:</h4>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                    width: "140px",
                  }}
                >
                  Latitude
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {latitude}°
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  Longitude
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {longitude}°
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  Accuracy
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {accuracy ? `${Math.round(accuracy)} meters` : "N/A"}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  Altitude
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {altitude ? `${altitude.toFixed(2)} meters` : "N/A"}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  Altitude Accuracy
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {altitudeAccuracy
                    ? `${altitudeAccuracy.toFixed(2)} meters`
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  Heading
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {heading ? `${heading.toFixed(2)}°` : "N/A"}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  Speed
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {speed ? `${speed.toFixed(2)} m/s` : "N/A"}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  Timestamp
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {timestamp ? new Date(timestamp).toLocaleString() : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: "20px" }}>
            <a
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "8px 12px",
                backgroundColor: "#1a73e8",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
              }}
            >
              View on Google Maps
            </a>
          </div>
        </div>
      ) : (
        !error && (
          <div
            style={{
              padding: "12px",
              marginTop: "15px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              color: "#333",
            }}
          >
            <p style={{ margin: "0 0 8px 0" }}>
              Waiting for location data... Allow location access in your
              browser.
            </p>
            <div style={{ fontSize: "0.9em" }}>
              <strong>Possible issues:</strong>
              <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
                <li>Browser permission not yet granted</li>
                <li>Browser doesn't support geolocation</li>
                <li>Device has no GPS or location services</li>
              </ul>
            </div>
          </div>
        )
      )}

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        This example demonstrates the enhanced error handling capabilities in
        the useGeolocation hook. Try denying permission or testing in different
        environments to see error handling in action.
      </p>
    </div>
  );
};

WithErrorInfo.storyName = "With Error Handling";
