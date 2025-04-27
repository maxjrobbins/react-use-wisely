import { useState, useEffect } from "react";
import { ScriptError } from "./errors";
import { runInBrowser } from "../utils/browser";

type Status = "idle" | "loading" | "ready" | "error" | "unsupported";

interface ScriptOptions {
  id?: string;
  async?: boolean;
  defer?: boolean;
  crossOrigin?: "anonymous" | "use-credentials";
  integrity?: string;
  noModule?: boolean;
  nonce?: string;
  type?: string;
  referrerPolicy?: string;
}

interface ScriptResult {
  status: Status;
  error: ScriptError | null;
  isSupported: boolean;
}

/**
 * Hook for dynamically loading external JavaScript
 * @param {string} src - URL of the script to load
 * @param {ScriptOptions} options - Additional script tag attributes
 * @returns {ScriptResult} Object with current status, error if any, and whether dynamic script loading is supported
 */
function useScript(src: string, options: ScriptOptions = {}): ScriptResult {
  const [state, setState] = useState<ScriptResult>(() =>
    runInBrowser<ScriptResult>(
      () => ({
        status: src ? "loading" : "idle",
        error: null,
        isSupported: true,
      }),
      () => ({
        status: "unsupported",
        error: new ScriptError(
          "Script loading is not supported in this environment",
          null
        ),
        isSupported: false,
      })
    )
  );

  useEffect(() => {
    // Skip if we're in a non-browser environment
    if (!state.isSupported) {
      return;
    }

    // If the script is already loaded, don't need to add it again
    if (!src) {
      setState((prev) => ({ ...prev, status: "idle" }));
      return;
    }

    let cleanup = () => {};

    try {
      // Check if script already exists
      let script = document.querySelector(
        `script[src="${src}"]`
      ) as HTMLScriptElement;

      if (script) {
        const scriptStatus =
          (script.getAttribute("data-status") as Status) || "ready";
        setState((prev) => ({ ...prev, status: scriptStatus }));
      } else {
        // Create script element
        script = document.createElement("script");
        script.src = src;
        script.async = options.async !== false; // true by default
        script.setAttribute("data-status", "loading");

        // Add other attributes if provided
        if (options.id) script.id = options.id;
        if (options.defer) script.defer = options.defer;
        if (options.crossOrigin) script.crossOrigin = options.crossOrigin;
        if (options.integrity) script.integrity = options.integrity;
        if (options.noModule) script.noModule = options.noModule;
        if (options.nonce) script.nonce = options.nonce;
        if (options.type) script.type = options.type;
        if (options.referrerPolicy)
          script.referrerPolicy = options.referrerPolicy;

        // Event handlers
        script.onload = () => {
          script.setAttribute("data-status", "ready");
          setState((prev) => ({ ...prev, status: "ready" }));
        };

        script.onerror = (event) => {
          // Remove the script from DOM on error
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }

          const scriptError = new ScriptError("Error loading script", event, {
            src,
          });
          script.setAttribute("data-status", "error");
          setState({
            status: "error",
            error: scriptError,
            isSupported: true,
          });
        };

        // Add to document head
        document.head.appendChild(script);

        // Setup cleanup
        cleanup = () => {
          if (script && options.id) {
            // Only remove script if it was created with a custom ID
            // Don't remove scripts that might be used elsewhere
            if (script.getAttribute("data-status") !== "ready") {
              script.setAttribute("data-status", "idle");
              if (script.parentNode) {
                script.parentNode.removeChild(script);
              }
            }
          }
        };
      }
    } catch (error) {
      // Handle unexpected errors in script loading
      const scriptError = new ScriptError(
        "Unexpected error during script initialization",
        error,
        { src }
      );
      setState({
        status: "error",
        error: scriptError,
        isSupported: true,
      });
    }

    // Handle cleanup
    return cleanup;
  }, [
    src,
    state.isSupported,
    options.id,
    options.async,
    options.defer,
    options.crossOrigin,
    options.integrity,
    options.noModule,
    options.nonce,
    options.type,
    options.referrerPolicy,
  ]);

  return state;
}

export default useScript;
