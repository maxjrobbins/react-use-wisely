import React from "react";
import useGeolocation from "../../../src/hooks/useGeolocation";

export default {
  title: "Hooks/useGeolocation",
  parameters: {
    componentSubtitle: "Hook that provides browser geolocation data",
    docs: {
      description: {
        component:
          "A React hook that provides access to the browser Geolocation API with status tracking.",
      },
    },
  },
};

export const Default = () => {
  const { loading, error, latitude, longitude, accuracy, timestamp } =
    useGeolocation();

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Geolocation Demo</h3>

      <div style={{ marginBottom: "20px" }}>
        <button
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
          {loading ? "Getting location..." : "Geolocation Status"}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#fff0f0",
            color: "#ff0000",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          <strong>Error:</strong> {error.message || "Unknown error occurred"}
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
        <p>
          No location data available. Allow location access in your browser for
          this demo to work.
        </p>
      )}

      <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
        Note: You will need to grant location permissions to your browser for
        this demo to work.
      </p>
    </div>
  );
};

Default.storyName = "Basic Usage";
