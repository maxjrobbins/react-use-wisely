import { useState, useEffect, useRef, useCallback } from "react";
import { SpeechRecognitionError } from "./errors";
import type {
  SpeechRecognition as SpeechRecognitionType,
  SpeechGrammarList as SpeechGrammarListType,
  SpeechRecognitionEvent as SpeechRecognitionEventType,
  SpeechRecognitionErrorEvent as SpeechRecognitionErrorEventType,
  SpeechRecognitionOptions,
  SpeechRecognitionHookResult,
  SpeechRecognitionConstructor as SpeechRecognitionConstructorType,
} from "../types/speech";
import {
  getSpeechRecognition as getSpeechRecognitionAPI,
  getSpeechGrammarList as getSpeechGrammarListAPI,
  isSpeechRecognitionSupported,
} from "../utils/speech";

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

// Get the browser's speech recognition implementation
const getSpeechRecognition = (): SpeechRecognitionConstructor | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

// Get the browser's speech grammar list implementation
const getSpeechGrammarList = (): { new (): SpeechGrammarList } | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.SpeechGrammarList || window.webkitSpeechGrammarList || null;
};

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
  grammars?: string[];
}

interface UseSpeechRecognitionResult {
  transcript: string;
  interimTranscript: string;
  finalTranscript: string;
  listening: boolean;
  error: SpeechRecognitionError | null;
  isSupported: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

/**
 * Simplified hook that just checks if speech recognition is supported.
 * Useful to conditionally render speech components.
 * @returns Whether speech recognition is supported
 */
export function useSpeechSupport(): boolean {
  return isSpeechRecognitionSupported();
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
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<SpeechRecognitionError | null>(null);

  // Check if speech recognition is supported
  const isSupported = isSpeechRecognitionSupported();

  // Create a ref to hold the recognition instance
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  // Initialize recognition on mount
  useEffect(() => {
    if (!isSupported) return;

    // Get the speech recognition constructor
    const SpeechRecognitionApi = getSpeechRecognitionAPI();
    if (!SpeechRecognitionApi) return;

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
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onstart = () => {
      setListening(true);
      setError(null);
    };

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setListening(false);
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

    if (recognitionRef.current && !listening) {
      try {
        setTranscript("");
        recognitionRef.current.start();
      } catch (err) {
        setError(
          new SpeechRecognitionError(
            "Failed to start speech recognition",
            err instanceof Error ? err : new Error(String(err)),
            { errorCode: 0 }
          )
        );
      }
    }
  }, [isSupported, listening]);

  // Stop recognition
  const stop = useCallback(() => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
    }
  }, [listening]);

  // Reset transcript
  const reset = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    transcript,
    listening,
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
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<SpeechRecognitionError | null>(null);

  // Check if speech recognition is supported
  const isSupported = isSpeechRecognitionSupported();

  // Create a ref to hold the recognition instance
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  // Initialize recognition on mount
  useEffect(() => {
    if (!isSupported) return;

    // Get the speech recognition constructor
    const SpeechRecognitionApi = getSpeechRecognitionAPI();
    if (!SpeechRecognitionApi) return;

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
      const grammarList = new SpeechGrammarListApi();
      grammars.forEach((grammar, index) => {
        // Use number for weight
        const weight = index + 1;
        grammarList.addFromString(grammar, weight);
      });
      recognition.grammars = grammarList;
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
      setTranscript(final + interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventType) => {
      const speechError = new SpeechRecognitionError(
        `Speech recognition error: ${event.error}`,
        event,
        { errorCode: event.error === "aborted" ? 1 : 0 }
      );
      setError(speechError);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);

      // If continuous mode is enabled and no error occurred, restart
      if (continuous && !error && recognitionRef.current) {
        recognitionRef.current.start();
        setListening(true);
      }
    };

    recognition.onstart = () => {
      setListening(true);
      setError(null);
    };

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setListening(false);
      }
    };
  }, [
    continuous,
    interimResults,
    lang,
    maxAlternatives,
    isSupported,
    grammars,
    error,
  ]);

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

    if (recognitionRef.current && !listening) {
      try {
        // Reset transcripts if not in continuous mode
        if (!continuous) {
          setInterimTranscript("");
          setFinalTranscript("");
          setTranscript("");
        }

        recognitionRef.current.start();
      } catch (err) {
        setError(
          new SpeechRecognitionError(
            "Failed to start speech recognition",
            err instanceof Error ? err : new Error(String(err)),
            { errorCode: 0 }
          )
        );
      }
    }
  }, [isSupported, listening, continuous]);

  // Stop recognition
  const stop = useCallback(() => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
    }
  }, [listening]);

  // Reset the transcripts
  const reset = useCallback(() => {
    setInterimTranscript("");
    setFinalTranscript("");
    setTranscript("");
  }, []);

  return {
    transcript,
    interimTranscript,
    finalTranscript,
    listening,
    error,
    isSupported,
    start,
    stop,
    reset,
  };
}

export default useSpeechRecognition;
