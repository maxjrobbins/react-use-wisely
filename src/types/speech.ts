/**
 * Speech Grammar interface
 */
export interface SpeechGrammar {
  src: string;
  weight: number;
}

/**
 * Speech Grammar List interface
 */
export interface SpeechGrammarList {
  length: number;
  addFromString(string: string, weight?: number): void;
  addFromURI(src: string, weight?: number): void;
  item(index: number): SpeechGrammar;
  [index: number]: SpeechGrammar;
}

/**
 * Speech Recognition Error Event interface
 */
export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

/**
 * Speech Recognition Event interface
 */
export interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

/**
 * Speech Recognition Result List interface
 */
export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

/**
 * Speech Recognition Result interface
 */
export interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

/**
 * Speech Recognition Alternative interface
 */
export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

/**
 * Speech Recognition interface
 */
export interface SpeechRecognition extends EventTarget {
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

/**
 * Speech Recognition Constructor interface
 */
export interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

/**
 * Speech Recognition Options
 */
export interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
  grammars?: string[];
}

/**
 * Speech Recognition Result
 */
export interface SpeechRecognitionHookResult {
  transcript: string;
  interimTranscript: string;
  finalTranscript: string;
  isListening: boolean;
  error: Error | null;
  isSupported: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

// Add SpeechRecognition to Window interface
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechGrammarList?: { new (): SpeechGrammarList };
    webkitSpeechGrammarList?: { new (): SpeechGrammarList };
  }
}
