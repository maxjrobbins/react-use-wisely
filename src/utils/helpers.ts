/**
 * Safely serializes values to string, handling circular references
 * @param value - Value to serialize
 * @returns - Safe string representation or fallback
 */
export const safeStringify = (value: unknown): string => {
  try {
    // Handle primitive types directly
    if (
      value === null ||
      value === undefined ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      typeof value === "string"
    ) {
      return String(value);
    }

    // For arrays, safely stringify each item
    if (Array.isArray(value)) {
      return `[${value
        .map((item) =>
          typeof item === "object" && item !== null
            ? "{...}"
            : safeStringify(item)
        )
        .join(", ")}]`;
    }

    // For objects, create a safe representation with basic properties
    if (typeof value === "object") {
      return JSON.stringify(
        value,
        (key, val) => {
          if (typeof val === "object" && val !== null && key !== "") {
            // For nested objects, just show type
            return val.constructor ? `[${val.constructor.name}]` : "{...}";
          }
          return val;
        },
        2
      );
    }

    // Fallback
    return String(value);
  } catch (e) {
    return "[Unserialized Value]";
  }
};
