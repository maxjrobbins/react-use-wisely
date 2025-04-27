import { useState, useEffect } from "react";
import { ScriptError } from "./errors";

type Status = "idle" | "loading" | "ready" | "error";

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

/**
 * Hook for dynamically loading external JavaScript
 * @param {string} src - URL of the script to load
 * @param {ScriptOptions} options - Additional script tag attributes
 * @returns {[Status, ScriptError | null]} Current status and error if any
 */
function useScript(
  src: string,
  options: ScriptOptions = {}
): [Status, ScriptError | null] {
  const [status, setStatus] = useState<Status>(src ? "loading" : "idle");
  const [error, setError] = useState<ScriptError | null>(null);

  useEffect(() => {
    // If the script is already loaded, don't need to add it again
    if (!src) {
      setStatus("idle");
      return;
    }

    // Check if script already exists
    let script = document.querySelector(
      `script[src="${src}"]`
    ) as HTMLScriptElement;

    if (script) {
      setStatus((script.getAttribute("data-status") as Status) || "ready");
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
        setStatus("ready");
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
        setError(scriptError);
        setStatus("error");
      };

      // Add to document head
      document.head.appendChild(script);
    }

    // Handle cleanup
    return () => {
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
  }, [
    src,
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

  return [status, error];
}

export default useScript;
