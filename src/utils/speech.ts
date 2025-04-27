import { isBrowser } from "./browser";
import {
  SpeechRecognitionConstructor,
  SpeechGrammarList,
} from "../types/speech";

/**
 * Get the browser's speech recognition implementation
 * @returns SpeechRecognition constructor or null
 */
export const getSpeechRecognition = (): SpeechRecognitionConstructor | null => {
  if (!isBrowser) return null;

  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

/**
 * Get the browser's speech grammar list implementation
 * @returns SpeechGrammarList constructor or null
 */
export const getSpeechGrammarList = (): {
  new (): SpeechGrammarList;
} | null => {
  if (!isBrowser) return null;

  return window.SpeechGrammarList || window.webkitSpeechGrammarList || null;
};

/**
 * Check if speech recognition is supported in the browser
 * @returns Whether speech recognition is supported
 */
export const isSpeechRecognitionSupported = (): boolean => {
  return getSpeechRecognition() !== null;
};
