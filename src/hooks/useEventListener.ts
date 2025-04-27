import { useRef, useEffect, RefObject } from "react";

/**
 * Hook for adding event listeners with proper cleanup
 * @template K Type of event
 * @template T Type of element
 * @param {K} eventName - Name of the event to listen for
 * @param {(event: any) => void} handler - Event handler function
 * @param {RefObject<T> | Window | Document} element - Element to attach the event to (defaults to window)
 */
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined
): void;

function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: RefObject<T>
): void;

function useEventListener<
  K extends keyof DocumentEventMap,
  T extends Document = Document
>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: RefObject<T> | Document
): void;

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
  element?: RefObject<T> | Window | Document
) {
  // Create a ref that stores the handler
  const savedHandler = useRef(handler);

  useEffect(() => {
    // Update ref.current value if handler changes
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Define the listening target
    const targetElement: T | Window | Document =
      element instanceof Window
        ? window
        : element instanceof Document
        ? document
        : element?.current || window;

    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    // Create event listener that calls handler function stored in ref
    const eventListener: typeof handler = (event) =>
      savedHandler.current(event);

    // Add event listener
    targetElement.addEventListener(eventName, eventListener);

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}

export default useEventListener;
