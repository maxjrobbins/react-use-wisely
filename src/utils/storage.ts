import { isBrowser } from "./browser";

/**
 * Type for web storage (localStorage or sessionStorage)
 */
export type WebStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/**
 * Checks if a storage object is available
 * @param storage - The storage object to check
 * @returns Whether the storage is available
 */
export const isStorageAvailable = (storage: WebStorage): boolean => {
  if (!isBrowser) return false;

  try {
    const testKey = "__storage_test__";
    storage.setItem(testKey, "true");
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Gets an item from storage and parses it as JSON
 * @param storage - The storage object to use
 * @param key - The key to get
 * @param defaultValue - The default value to return if the key doesn't exist
 * @returns The parsed value or the default value
 */
export const getStorageItem = <T>(
  storage: WebStorage,
  key: string,
  defaultValue: T
): T => {
  if (!isBrowser) return defaultValue;

  try {
    const item = storage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (e) {
    console.warn(`Error reading from storage key "${key}":`, e);
    return defaultValue;
  }
};

/**
 * Sets an item in storage after stringifying it
 * @param storage - The storage object to use
 * @param key - The key to set
 * @param value - The value to set
 * @returns Whether the operation succeeded
 */
export const setStorageItem = <T>(
  storage: WebStorage,
  key: string,
  value: T
): boolean => {
  if (!isBrowser) return false;

  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`Error writing to storage key "${key}":`, e);
    return false;
  }
};
