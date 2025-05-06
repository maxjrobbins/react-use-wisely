import { renderHook, act } from "@testing-library/react";
import usePageVisibility from "../../hooks/usePageVisibility";
import * as browser from "../../utils/browser";

describe("usePageVisibility", () => {
  const originalVisibility = document.visibilityState;
  const originalHidden = document.hidden;

  // Create a spy on browser features
  let featuresSpy: jest.SpyInstance;

  beforeEach(() => {
    // Set default state
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      configurable: true,
    });
    Object.defineProperty(document, "hidden", {
      value: false,
      configurable: true,
    });

    // Spy on the features.pageVisibility function to control its return value
    featuresSpy = jest.spyOn(browser.features, "pageVisibility");
    featuresSpy.mockReturnValue(true);
  });

  afterEach(() => {
    // Restore document properties
    Object.defineProperty(document, "visibilityState", {
      value: originalVisibility,
      configurable: true,
    });
    Object.defineProperty(document, "hidden", {
      value: originalHidden,
      configurable: true,
    });

    // Restore the spy
    featuresSpy.mockRestore();
  });

  it("returns true when document is visible", () => {
    const { result } = renderHook(() => usePageVisibility());
    expect(result.current.isVisible).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("returns false when document is hidden", () => {
    Object.defineProperty(document, "visibilityState", {
      value: "hidden",
      configurable: true,
    });
    Object.defineProperty(document, "hidden", {
      value: true,
      configurable: true,
    });

    const { result } = renderHook(() => usePageVisibility());
    expect(result.current.isVisible).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("updates when visibility changes", () => {
    const { result } = renderHook(() => usePageVisibility());

    expect(result.current.isVisible).toBe(true);
    expect(result.current.error).toBeNull();

    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        configurable: true,
      });
      Object.defineProperty(document, "hidden", {
        value: true,
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(result.current.isVisible).toBe(false);
    expect(result.current.error).toBeNull();

    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "visible",
        configurable: true,
      });
      Object.defineProperty(document, "hidden", {
        value: false,
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(result.current.isVisible).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("returns isSupported false when document.visibilityState is undefined", () => {
    // Mock the feature detection to return false
    featuresSpy.mockReturnValue(false);

    const { result } = renderHook(() => usePageVisibility());
    expect(result.current.isSupported).toBe(false);
    expect(result.current.isVisible).toBe(true); // fallback default
    expect(result.current.error).toBeNull();
  });

  it("returns isSupported false and true visibility when document is undefined (SSR)", () => {
    // Mock the runInBrowser function to simulate SSR by always running the fallback
    const runInBrowserSpy = jest.spyOn(browser, "runInBrowser");
    runInBrowserSpy.mockImplementation((_, fallback) => {
      // Always run the fallback function
      return fallback
        ? fallback()
        : { isVisible: true, isSupported: false, error: null };
    });

    const { result } = renderHook(() => usePageVisibility());
    expect(result.current.isSupported).toBe(false);
    expect(result.current.isVisible).toBe(true);
    expect(result.current.error).toBeNull();

    runInBrowserSpy.mockRestore();
  });
});
