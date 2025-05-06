import { useState, useEffect, useRef, useCallback } from "react";
import { SpeechRecognitionError } from "./errors";
import type {
  SpeechRecognition as SpeechRecognitionType,
  SpeechRecognitionEvent as SpeechRecognitionEventType,
  SpeechRecognitionErrorEvent as SpeechRecognitionErrorEventType,
  SpeechRecognitionOptions,
  SpeechRecognitionHookResult,
} from "../types/speech";
import {
  getSpeechRecognition as getSpeechRecognitionAPI,
  getSpeechGrammarList as getSpeechGrammarListAPI,
} from "../utils/speech";
import { features } from "../utils/browser";

// Global SpeechRecognition type setup
interface SpeechGrammar {
  src: string;
  weight: number;
}

interface SpeechGrammarList {
  length: number;
  addFromString(string: string, weight?: number): void;
  addFromURI(src: string, weight?: number): void;
  item(index: number): SpeechGrammar;
  [index: number]: SpeechGrammar;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  grammars: SpeechGrammarList;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onnomatch: ((event: SpeechRecognitionEvent) => void) | null;
  onaudiostart: ((event: Event) => void) | null;
  onaudioend: ((event: Event) => void) | null;
  onsoundstart: ((event: Event) => void) | null;
  onsoundend: ((event: Event) => void) | null;
  onspeechstart: ((event: Event) => void) | null;
  onspeechend: ((event: Event) => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

// Extend Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechGrammarList?: { new (): SpeechGrammarList };
    webkitSpeechGrammarList?: { new (): SpeechGrammarList };
  }
}

/**
 * Simplified hook that just checks if speech recognition is supported.
 * Useful to conditionally render speech components.
 * @returns Whether speech recognition is supported
 */
export function useSpeechSupport(): boolean {
  return features.speechRecognition();
}

/**
 * Core hook for basic speech recognition without complex configuration
 * @param lang - Language to use for recognition
 * @returns Speech recognition state and controls
 */
export function useSpeechRecognitionBasic(
  lang: string = "en-US"
): Omit<SpeechRecognitionHookResult, "interimTranscript" | "finalTranscript"> {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<SpeechRecognitionError | null>(null);

  // Check if speech recognition is supported using the enhanced feature detection
  const isSupported = features.speechRecognition();

  // Create a ref to hold the recognition instance
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  // Initialize recognition on mount
  useEffect(() => {
    if (!isSupported) return;

    // Get the speech recognition constructor
    const SpeechRecognitionApi = getSpeechRecognitionAPI();
    if (!SpeechRecognitionApi) return;

    try {
      // Create a new recognition instance
      const recognition = new SpeechRecognitionApi();

      // Configure basic settings
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang;
      recognition.maxAlternatives = 1;

      // Save the instance to the ref
      recognitionRef.current = recognition;

      // Set up basic event handlers
      recognition.onresult = (event: SpeechRecognitionEventType) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventType) => {
        const speechError = new SpeechRecognitionError(
          `Speech recognition error: ${event.error}`,
          event,
          { errorCode: event.error === "aborted" ? 1 : 0 }
        );
        setError(speechError);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
      setError(
        new SpeechRecognitionError(
          "Failed to initialize speech recognition",
          error instanceof Error ? error : new Error(String(error)),
          { errorCode: 0 }
        )
      );
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // Silently handle stop error during cleanup
        }
        setIsListening(false);
      }
    };
  }, [lang, isSupported]);

  // Start recognition
  const start = useCallback(() => {
    if (!isSupported) {
      setError(
        new SpeechRecognitionError(
          "Speech recognition is not supported in this browser",
          null,
          { errorCode: 0 }
        )
      );
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        setTranscript("");
        recognitionRef.current.start();
      } catch (err) {
        // Common error: already started
        if (err instanceof Error && err.message.includes("already started")) {
          // Already started is actually fine, just update our state
          setIsListening(true);
          return;
        }

        setError(
          new SpeechRecognitionError(
            "Failed to start speech recognition",
            err instanceof Error ? err : new Error(String(err)),
            { errorCode: 0 }
          )
        );
      }
    }
  }, [isSupported, isListening]);

  // Stop recognition
  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // Common error: already stopped
        if (err instanceof Error && err.message.includes("not started")) {
          // Already stopped is fine, just update our state
          setIsListening(false);
          return;
        }

        setError(
          new SpeechRecognitionError(
            "Failed to stop speech recognition",
            err instanceof Error ? err : new Error(String(err)),
            { errorCode: 0 }
          )
        );
      }
    }
  }, [isListening]);

  // Reset transcript for basic version
  const reset = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  return {
    transcript,
    isListening,
    error,
    isSupported,
    start,
    stop,
    reset,
  };
}

/**
 * Full hook for advanced speech recognition with all features
 * @param options - Configuration options
 * @returns Speech recognition state and controls
 */
function useSpeechRecognition({
  continuous = false,
  interimResults = true,
  lang = "en-US",
  maxAlternatives = 1,
  grammars = [],
}: SpeechRecognitionOptions = {}): SpeechRecognitionHookResult {
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<SpeechRecognitionError | null>(null);

  // Check if speech recognition is supported
  const isSupported = features.speechRecognition();

  // Create a ref to hold the recognition instance
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  // Initialize recognition on mount
  useEffect(() => {
    if (!isSupported) return;

    // Get the speech recognition constructor
    const SpeechRecognitionApi = getSpeechRecognitionAPI();
    if (!SpeechRecognitionApi) return;

    try {
      // Create a new recognition instance
      const recognition = new SpeechRecognitionApi();

      // Configure settings
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = lang;
      recognition.maxAlternatives = maxAlternatives;

      // Add grammar if supported and provided
      const SpeechGrammarListApi = getSpeechGrammarListAPI();
      if (SpeechGrammarListApi && grammars.length > 0) {
        try {
          const grammarList = new SpeechGrammarListApi();
          grammars.forEach((grammar, index) => {
            // Use number for weight
            const weight = index + 1;
            grammarList.addFromString(grammar, weight);
          });
          recognition.grammars = grammarList;
        } catch (error) {
          console.warn("Failed to set up speech grammars:", error);
          // Continue without grammars
        }
      }

      // Save the instance to the ref
      recognitionRef.current = recognition;

      // Set up event handlers
      recognition.onresult = (event: SpeechRecognitionEventType) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        setInterimTranscript(interim);
        if (final !== "") {
          setFinalTranscript((prev) => prev + final);
        }

        // Update the complete transcript with both final and interim parts
        setTranscript(() => {
          const newFinalTranscript =
            final !== "" ? finalTranscript + final : finalTranscript;
          return newFinalTranscript + interim;
        });
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventType) => {
        const speechError = new SpeechRecognitionError(
          `Speech recognition error: ${event.error}`,
          event,
          { errorCode: event.error === "aborted" ? 1 : 0 }
        );
        setError(speechError);
        setIsListening(false);

        // For no-speech error, we might want to restart automatically if in continuous mode
        if (continuous && event.error === "no-speech") {
          setTimeout(() => {
            try {
              recognition.start();
              setIsListening(true);
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
              // Silent restart failure
            }
          }, 1000);
        }
      };

      recognition.onend = () => {
        setIsListening(false);

        // If continuous mode is enabled and no error occurred, restart
        if (continuous && !error && recognitionRef.current) {
          try {
            recognitionRef.current.start();
            setIsListening(true);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            // Restart silently failed, don't update error state
            // This might happen if the session has already ended due to inactivity
          }
        }
      };

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
      setError(
        new SpeechRecognitionError(
          "Failed to initialize speech recognition",
          error instanceof Error ? error : new Error(String(error)),
          { errorCode: 0 }
        )
      );
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // Silently handle stop error during cleanup
        }
        setIsListening(false);
      }
    };
  }, [continuous, interimResults, lang, maxAlternatives, isSupported, grammars, error, finalTranscript]);

  // Start recognition
  const start = useCallback(() => {
    if (!isSupported) {
      setError(
        new SpeechRecognitionError(
          "Speech recognition is not supported in this browser",
          null,
          { errorCode: 0 }
        )
      );
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        // Reset transcripts if not in continuous mode
        if (!continuous) {
          setInterimTranscript("");
          setFinalTranscript("");
          setTranscript("");
        }

        recognitionRef.current.start();
      } catch (err) {
        // Common error: already started
        if (err instanceof Error && err.message.includes("already started")) {
          // Already started is actually fine, just update our state
          setIsListening(true);
          return;
        }

        setError(
          new SpeechRecognitionError(
            "Failed to start speech recognition",
            err instanceof Error ? err : new Error(String(err)),
            { errorCode: 0 }
          )
        );
      }
    }
  }, [isSupported, isListening, continuous]);

  // Stop recognition
  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // Common error: already stopped
        if (err instanceof Error && err.message.includes("not started")) {
          // Already stopped is fine, just update our state
          setIsListening(false);
          return;
        }

        setError(
          new SpeechRecognitionError(
            "Failed to stop speech recognition",
            err instanceof Error ? err : new Error(String(err)),
            { errorCode: 0 }
          )
        );
      }
    }
  }, [isListening]);

  // Reset the transcripts for full version
  const reset = useCallback(() => {
    setInterimTranscript("");
    setFinalTranscript("");
    setTranscript("");
    setError(null);

    // Ensure these are properly reset by forcing a React state update
    setTimeout(() => {
      setInterimTranscript("");
      setFinalTranscript("");
      setTranscript("");
    }, 0);
  }, []);

  return {
    transcript,
    interimTranscript,
    finalTranscript,
    isListening,
    error,
    isSupported,
    start,
    stop,
    reset,
  };
}

export default useSpeechRecognition;
