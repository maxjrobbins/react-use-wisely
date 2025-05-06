import React, { useState, useEffect } from "react";
import useSpeechRecognition, {
  useSpeechRecognitionBasic,
  useSpeechSupport,
} from "../../../src/hooks/useSpeechRecognition";

export default {
  title: "Hooks/useSpeechRecognition",
  parameters: {
    componentSubtitle: "Hook for speech recognition functionality",
    docs: {
      description: {
        component:
          "A React hook that provides speech recognition capabilities using the Web Speech API.",
      },
    },
  },
};

export const Basic = () => {
  const { transcript, isListening, error, isSupported, start, stop, reset } =
    useSpeechRecognitionBasic();

  const handleStop = () => {
    stop();
    // Force isListening state to false after a short delay if needed
    setTimeout(() => {
      if (isListening) stop();
    }, 300);
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Basic Speech Recognition Demo</h3>

      {!isSupported && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          ⚠️ Speech Recognition is not supported in this browser.
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            marginBottom: "15px",
            minHeight: "100px",
            backgroundColor: "#fafafa",
          }}
        >
          {transcript ? (
            transcript
          ) : (
            <em>Start speaking to see transcription...</em>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={start}
            disabled={isListening || !isSupported}
            style={{
              padding: "8px 16px",
              backgroundColor: isListening ? "#ccc" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isSupported ? "pointer" : "not-allowed",
            }}
          >
            Start Listening
          </button>

          <button
            onClick={handleStop}
            disabled={!isListening || !isSupported}
            style={{
              padding: "8px 16px",
              backgroundColor: !isListening ? "#ccc" : "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isSupported && isListening ? "pointer" : "not-allowed",
            }}
          >
            Stop Listening
          </button>

          <button
            onClick={reset}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reset Transcript
          </button>
        </div>

        {isListening && (
          <div
            style={{
              marginTop: "10px",
              padding: "8px",
              backgroundColor: "#e8f5e9",
              color: "#2e7d32",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              role="img"
              aria-label="listening"
              style={{ marginRight: "8px", animation: "pulse 1.5s infinite" }}
            >
              🎤
            </span>
            Listening...
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: "10px",
              padding: "8px",
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: "4px",
            }}
          >
            <strong>Error:</strong> {error.message}
          </div>
        )}
      </div>

      <div style={{ marginTop: "30px", fontStyle: "italic", color: "#666" }}>
        Note: This example uses the simplified useSpeechRecognitionBasic hook.
      </div>
    </div>
  );
};

Basic.storyName = "Basic Usage";

export const Advanced = () => {
  const [lang, setLang] = useState("en-US");
  const [continuous, setContinuous] = useState(true);
  const [interimResults, setInterimResults] = useState(true);
  const [maxAlternatives, setMaxAlternatives] = useState(1);

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    isListening,
    error,
    isSupported,
    start,
    stop,
    reset,
  } = useSpeechRecognition({
    lang,
    continuous,
    interimResults,
    maxAlternatives,
  });

  const handleStop = () => {
    stop();
    // Force isListening state to false after a short delay if needed
    setTimeout(() => {
      if (isListening) stop();
    }, 300);
  };

  // Language options
  const languages = [
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "it-IT", name: "Italian" },
    { code: "ja-JP", name: "Japanese" },
    { code: "ko-KR", name: "Korean" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
  ];

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Advanced Speech Recognition Demo</h3>

      {!isSupported && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          ⚠️ Speech Recognition is not supported in this browser.
        </div>
      )}

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Language:
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={continuous}
                onChange={(e) => setContinuous(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              Continuous Mode
            </label>
            <small
              style={{ display: "block", marginTop: "4px", color: "#666" }}
            >
              When enabled, recognition will continue until explicitly stopped
            </small>
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={interimResults}
                onChange={(e) => setInterimResults(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              Show Interim Results
            </label>
            <small
              style={{ display: "block", marginTop: "4px", color: "#666" }}
            >
              Display partial results while speaking
            </small>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Max Alternatives:
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={maxAlternatives}
              onChange={(e) => setMaxAlternatives(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <small
              style={{ display: "block", marginTop: "4px", color: "#666" }}
            >
              Number of alternative transcriptions to return
            </small>
          </div>
        </div>

        <div style={{ flex: "1" }}>
          <div style={{ marginBottom: "10px" }}>
            <h4 style={{ marginBottom: "10px" }}>Current Transcript:</h4>
            <div
              style={{
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                minHeight: "80px",
                backgroundColor: "#fafafa",
                marginBottom: "10px",
              }}
            >
              {transcript ? (
                transcript
              ) : (
                <em>Start speaking to see transcription...</em>
              )}
            </div>
          </div>

          {interimResults && (
            <div style={{ marginBottom: "10px" }}>
              <h5 style={{ marginBottom: "5px" }}>Interim Results:</h5>
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  backgroundColor: "#f5f5f5",
                  color: "#666",
                  fontStyle: "italic",
                  minHeight: "40px",
                }}
              >
                {interimTranscript ? (
                  interimTranscript
                ) : (
                  <em>No interim results</em>
                )}
              </div>
            </div>
          )}

          <div>
            <h5 style={{ marginBottom: "5px" }}>Final Results:</h5>
            <div
              style={{
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                backgroundColor: "#f5f5f5",
                minHeight: "40px",
              }}
            >
              {finalTranscript ? (
                finalTranscript
              ) : (
                <em>No final results yet</em>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={start}
          disabled={isListening || !isSupported}
          style={{
            padding: "8px 16px",
            backgroundColor: isListening ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isSupported ? "pointer" : "not-allowed",
          }}
        >
          Start Listening
        </button>

        <button
          onClick={handleStop}
          disabled={!isListening || !isSupported}
          style={{
            padding: "8px 16px",
            backgroundColor: !isListening ? "#ccc" : "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isSupported && isListening ? "pointer" : "not-allowed",
          }}
        >
          Stop Listening
        </button>

        <button
          onClick={reset}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset Transcript
        </button>
      </div>

      {isListening && (
        <div
          style={{
            marginBottom: "15px",
            padding: "8px",
            backgroundColor: "#e8f5e9",
            color: "#2e7d32",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            role="img"
            aria-label="listening"
            style={{ marginRight: "8px" }}
          >
            🎤
          </span>
          Listening...
        </div>
      )}

      {error && (
        <div
          style={{
            marginBottom: "15px",
            padding: "8px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
          }}
        >
          <strong>Error:</strong> {error.message}
        </div>
      )}

      <div style={{ marginTop: "30px", fontStyle: "italic", color: "#666" }}>
        Note: Speech recognition accuracy may vary by browser, language, and
        environment.
      </div>
    </div>
  );
};

Advanced.storyName = "Advanced Configuration";

export const FeatureDetection = () => {
  const isSupported = useSpeechSupport();

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Speech Recognition Support Detection</h3>

      <div
        style={{
          padding: "15px",
          marginTop: "15px",
          border: "1px solid",
          borderColor: isSupported ? "#c8e6c9" : "#ffcdd2",
          borderRadius: "4px",
          backgroundColor: isSupported ? "#e8f5e9" : "#ffebee",
          color: isSupported ? "#2e7d32" : "#c62828",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
        }}
      >
        <span
          role="img"
          aria-hidden="true"
          style={{ marginRight: "10px", fontSize: "24px" }}
        >
          {isSupported ? "✅" : "❌"}
        </span>
        Speech Recognition is {isSupported ? "supported" : "not supported"} in
        this browser
      </div>

      <div style={{ marginTop: "30px" }}>
        <h4>Browser Compatibility</h4>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                Browser
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                Support
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                Chrome
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                ✅ Yes
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                Full support via SpeechRecognition
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>Edge</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                ✅ Yes
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                Full support (Chromium-based)
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                Firefox
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                ⚠️ Partial
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                Support behind flag in recent versions
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                Safari
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                ⚠️ Limited
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                Support varies by version and platform
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                iOS Safari
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                ❌ No
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                Not supported
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "30px", fontStyle: "italic", color: "#666" }}>
        Note: This component uses the useSpeechSupport hook to detect browser
        support for the Web Speech API.
      </div>
    </div>
  );
};

FeatureDetection.storyName = "Browser Support Detection";

export const Dictation = () => {
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const { transcript, isListening, error, isSupported, start, stop, reset } =
    useSpeechRecognition({
      continuous: true,
      interimResults: true,
    });

  const handleStart = () => {
    start();
  };

  const handleStop = () => {
    stop();
    // Force isListening state to false after a short delay if needed
    setTimeout(() => {
      if (isListening) stop();
    }, 300);
  };

  // Update notes when transcript changes
  useEffect(() => {
    if (transcript) {
      setNotes(transcript);
    }
  }, [transcript]);

  const handleSaveNote = () => {
    if (notes.trim()) {
      setSavedNotes([
        ...savedNotes,
        {
          id: Date.now(),
          text: notes.trim(),
          date: new Date().toLocaleString(),
        },
      ]);
      setNotes("");
      reset();
    }
  };

  const handleClearNote = () => {
    setNotes("");
    reset();
  };

  const handleDeleteNote = (id) => {
    setSavedNotes(savedNotes.filter((note) => note.id !== id));
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}
    >
      <h3>Voice Notes Demo</h3>

      {!isSupported && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          ⚠️ Speech Recognition is not supported in this browser.
        </div>
      )}

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ flex: "1" }}>
          <div style={{ marginBottom: "15px" }}>
            <h4
              style={{
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>Current Note</span>
              {isListening && (
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: "#e8f5e9",
                    color: "#2e7d32",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    marginLeft: "10px",
                  }}
                >
                  🎤 Recording
                </span>
              )}
            </h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Start speaking or type your notes here..."
              style={{
                width: "100%",
                height: "200px",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                fontSize: "16px",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={isListening ? handleStop : handleStart}
              style={{
                padding: "8px 16px",
                backgroundColor: isListening ? "#f44336" : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isSupported ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
              }}
              disabled={!isSupported}
            >
              <span
                role="img"
                aria-hidden="true"
                style={{ marginRight: "6px" }}
              >
                {isListening ? "⏹️" : "🎤"}
              </span>
              {isListening ? "Stop Recording" : "Start Recording"}
            </button>

            <button
              onClick={handleSaveNote}
              disabled={!notes.trim()}
              style={{
                padding: "8px 16px",
                backgroundColor: notes.trim() ? "#2196F3" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: notes.trim() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                role="img"
                aria-hidden="true"
                style={{ marginRight: "6px" }}
              >
                💾
              </span>
              Save Note
            </button>

            <button
              onClick={handleClearNote}
              disabled={!notes}
              style={{
                padding: "8px 16px",
                backgroundColor: notes ? "#ff9800" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: notes ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                role="img"
                aria-hidden="true"
                style={{ marginRight: "6px" }}
              >
                🗑️
              </span>
              Clear
            </button>
          </div>

          {error && (
            <div
              style={{
                marginTop: "15px",
                padding: "8px",
                backgroundColor: "#ffebee",
                color: "#c62828",
                borderRadius: "4px",
              }}
            >
              <strong>Error:</strong> {error.message}
            </div>
          )}
        </div>

        <div style={{ flex: "1" }}>
          <h4 style={{ marginBottom: "10px" }}>
            Saved Notes ({savedNotes.length})
          </h4>

          {savedNotes.length === 0 ? (
            <div
              style={{
                padding: "15px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
                textAlign: "center",
                color: "#666",
              }}
            >
              No saved notes yet. Record and save your first note!
            </div>
          ) : (
            <div style={{ maxHeight: "300px", overflow: "auto" }}>
              {savedNotes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    padding: "12px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                    marginBottom: "10px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "5px",
                    }}
                  >
                    {note.date}
                  </div>
                  <div
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  >
                    {note.text}
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "16px",
                      color: "#f44336",
                    }}
                    aria-label="Delete note"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "30px", fontStyle: "italic", color: "#666" }}>
        Note: For best results, speak clearly and in a moderate pace. The
        recognition quality may vary by browser and environment.
      </div>
    </div>
  );
};

Dictation.storyName = "Voice Notes Application";
