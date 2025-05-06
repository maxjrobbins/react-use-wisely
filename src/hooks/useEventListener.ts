import { useRef, useEffect, RefObject, useState, useCallback } from "react";
import { DOMError } from "./errors";

interface EventListenerResult {
  isSupported: boolean;
  error: Error | null;
  remove: () => void;
}

/**
 * Hook for adding event listeners with proper cleanup
 * @template K Type of event
 * @template T Type of element
 * @param {K} eventName - Name of the event to listen for
 * @param {(event: any) => void} handler - Event handler function
 * @param {RefObject<T> | Window | Document} element - Element to attach the event to (defaults to window)
 * @param {AddEventListenerOptions} options - Options for the event listener
 * @returns {EventListenerResult} Object containing support status, error state, and remove method
 */
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: AddEventListenerOptions
): EventListenerResult;

function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: RefObject<T | null>,
  options?: AddEventListenerOptions
): EventListenerResult;

function useEventListener<
  K extends keyof DocumentEventMap,
  T extends Document = Document
>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: RefObject<T> | Document,
  options?: AddEventListenerOptions
): EventListenerResult;

function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  KD extends keyof DocumentEventMap,
  T extends HTMLElement | Document = HTMLElement
>(
  eventName: KW | KH | KD,
  handler: (
    event:
      | WindowEventMap[KW]
      | HTMLElementEventMap[KH]
      | DocumentEventMap[KD]
      | Event
  ) => void,
  element?: RefObject<T> | Window | Document,
  options?: AddEventListenerOptions
): EventListenerResult {
  const savedHandler = useRef(handler);
  const [error, setError] = useState<Error | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    try {
      const targetElement: T | Window | Document =
        element instanceof Window
          ? window
          : element instanceof Document
          ? document
          : element?.current || window;

      if (!targetElement || !targetElement.addEventListener) {
        setIsSupported(false);
        setError(
          new DOMError("Target element does not support event listeners")
        );
        return;
      }

      setIsSupported(true);
      setError(null);

      const eventListener: typeof handler = (event) =>
        savedHandler.current(event);
      targetElement.addEventListener(eventName, eventListener, options);

      return () => {
        targetElement.removeEventListener(eventName, eventListener, options);
      };
    } catch (err) {
      setIsSupported(false);
      setError(new DOMError("Failed to add event listener", err));
    }
  }, [eventName, element, options]);

  const remove = useCallback(() => {
    const targetElement: T | Window | Document =
      element instanceof Window
        ? window
        : element instanceof Document
        ? document
        : element?.current || window;

    if (targetElement && targetElement.removeEventListener) {
      const eventListener: typeof handler = (event) =>
        savedHandler.current(event);
      targetElement.removeEventListener(eventName, eventListener, options);
    }
  }, [eventName, element, options]);

  return {
    isSupported,
    error,
    remove,
  };
}

export default useEventListener;
