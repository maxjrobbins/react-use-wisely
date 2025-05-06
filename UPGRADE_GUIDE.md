# Upgrade Guide to Version 2.0.0

This guide helps you upgrade from react-use-wisely version 1.x to 2.0.0, explaining all breaking changes, improvements, and providing a comprehensive migration path.

## Major Change Overview

Version 2.0.0 introduces a standardized interface pattern across all hooks in accordance with our [Hook Standardization Guide](src/docs/HOOK_STANDARD.md). This represents a significant change to the API surface and requires careful migration of existing code.

## Key Improvements

Version 2.0.0 focuses on four key areas:

1. **Standardized Hook Interfaces**: Consistent return types and naming conventions across all hooks
2. **Enhanced TypeScript Support**: Explicit interfaces for all hook parameters and return values
3. **Comprehensive Error Handling**: Standardized error objects and recovery mechanisms
4. **Browser Compatibility**: Improved feature detection and graceful degradation

## Breaking Changes

### 1. Standardized Return Values

Most hooks now return structured objects instead of arrays or primitive values:

| Hook Type     | Previous Return     | New Return                                       |
| ------------- | ------------------- | ------------------------------------------------ |
| State hooks   | `[value, setValue]` | `{ value, setValue, error, reset }`              |
| Boolean hooks | `boolean`           | `{ isActive, error, isSupported }`               |
| Ref hooks     | `[ref, value]`      | `[ref, value, error]` or `{ ref, value, error }` |

### 2. Naming Conventions

- Boolean state properties now use the `is` prefix (e.g., `isLoading` instead of `loading`)
- All hooks that deal with browser APIs now include an `isSupported` property
- Error objects are now consistently named `error`

### 3. Error Handling

All hooks now include standardized error handling:

- Error objects have consistent structure
- Browser API hooks include feature detection
- Recovery mechanisms (retry, reset) where applicable

## Migration Guide

### Step 1: Update Your Package

```bash
npm install react-use-wisely@2.0.0
# or
yarn add react-use-wisely@2.0.0
```

### Step 2: Migrate Each Hook

Below is a comprehensive guide for migrating each hook to the new standardized interface:

### Core Hooks

#### useAsync

```jsx
// Before
const { execute, status, value, error } = useAsync(fetchData);

// After
const {
  execute, // Function to execute the async operation
  status, // "idle" | "pending" | "success" | "error" | "retrying"
  value, // The result value (or null)
  error, // Error object (or null)
  isLoading, // Boolean for loading state
  isRetrying, // Boolean for retry state
  attemptCount, // Number of retry attempts
  reset, // Function to reset state
} = useAsync(fetchData, false, 3, 1000);

// Example showing retry status
return (
  <div>
    <button onClick={execute} disabled={isLoading}>
      {isLoading
        ? isRetrying
          ? `Retrying (${attemptCount})...`
          : "Loading..."
        : "Fetch Data"}
    </button>

    {status === "error" && (
      <>
        <div className="error">{error.message}</div>
        <button onClick={reset}>Reset</button>
      </>
    )}

    {status === "success" && (
      <div className="data">{JSON.stringify(value)}</div>
    )}
  </div>
);
```

#### useLocalStorage

```jsx
// Before
const [value, setValue] = useLocalStorage("key", defaultValue);

// After
const [value, setValue, error] = useLocalStorage("key", defaultValue);

// Example with error handling
return (
  <div>
    <input value={value} onChange={(e) => setValue(e.target.value)} />

    {error && (
      <div className="storage-error">
        <p>Storage error: {error.message}</p>
        <p>Your changes might not be saved.</p>
      </div>
    )}
  </div>
);
```

#### useDebounce

```jsx
// Before
const debouncedValue = useDebounce(value, delay);

// After - No breaking changes but added isDebouncing property
const { debouncedValue, isDebouncing } = useDebounce(value, delay);

// Example showing debounce state
return (
  <div>
    <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />

    {isDebouncing && <span>Typing...</span>}

    <p>Debounced value: {debouncedValue}</p>
  </div>
);
```

#### useThrottle

```jsx
// Before
const throttledValue = useThrottle(value, limit);

// After - No breaking changes but added isThrottling property
const { throttledValue, isThrottling } = useThrottle(value, limit);

// Example
return (
  <div>
    <p>Current: {value}</p>
    <p>Throttled: {throttledValue}</p>
    {isThrottling && <span>Throttling active...</span>}
  </div>
);
```

#### useMedia

```jsx
// Before
const isMobile = useMedia("(max-width: 768px)");

// After
const { matches, error, isSupported } = useMedia("(max-width: 768px)", false);

// Example
return (
  <div>
    {!isSupported && (
      <div className="warning">
        Media queries are not supported in this environment. Using fallback
        layout.
      </div>
    )}

    <div className={matches ? "mobile-layout" : "desktop-layout"}>
      {/* Content */}
    </div>

    {error && <div className="error">Media query error: {error.message}</div>}
  </div>
);
```

### UI Interaction Hooks

#### useClickOutside

```jsx
// Before
const ref = useClickOutside(callback);

// After
const { ref, isActive, error } = useClickOutside(callback);

// Example
return (
  <div>
    <div ref={ref} className={`dropdown ${isActive ? "active" : ""}`}>
      Dropdown content here
    </div>

    {error && <div className="error">Click handler error: {error.message}</div>}
  </div>
);
```

#### useHover

```jsx
// Before
const [ref, isHovered] = useHover();

// After
const [ref, isHovered, error] = useHover();

// Example
return (
  <div>
    <div ref={ref} className={isHovered ? "hovered" : ""}>
      Hover over me
    </div>

    {error && (
      <div className="error">Hover detection error: {error.message}</div>
    )}
  </div>
);
```

#### useKeyPress

```jsx
// Before
const isPressed = useKeyPress("Enter");

// After
const { isPressed, isSupported, error } = useKeyPress("Enter");

// Example
return (
  <div>
    <div>Press Enter key</div>

    {isPressed && <div>Enter key is pressed!</div>}

    {!isSupported && (
      <div className="warning">
        Keyboard events not supported in this environment
      </div>
    )}

    {error && (
      <div className="error">Keyboard event error: {error.message}</div>
    )}
  </div>
);
```

### Form Hooks

#### useForm

```jsx
// Before
const { values, errors, handleChange, handleSubmit } = useForm(
  initialValues,
  onSubmit,
  validate
);

// After
const {
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  isValid,
  formError,
  setFieldValue,
  reset,
} = useForm(initialValues, onSubmit, validate);

// Example
return (
  <form onSubmit={handleSubmit}>
    <div>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.email && errors.email && (
        <div className="field-error">{errors.email}</div>
      )}
    </div>

    <button type="submit" disabled={!isValid || isSubmitting}>
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>

    {formError && (
      <div className="form-error">Form submission failed: {formError}</div>
    )}

    <button type="button" onClick={reset}>
      Reset Form
    </button>
  </form>
);
```

### Browser API Hooks

#### useClipboard

```jsx
// Before
const [isCopied, copyToClipboard] = useClipboard(timeout);

// After
const { isCopied, copy, error, reset, isSupported } = useClipboard(timeout);

// Example
return (
  <div>
    {!isSupported && (
      <div className="warning">
        Clipboard functionality is not supported in this environment
      </div>
    )}

    <button
      onClick={() => copy("Text to copy")}
      disabled={!isSupported || isCopied}
    >
      {isCopied ? "Copied!" : "Copy to clipboard"}
    </button>

    {isCopied && <button onClick={reset}>Reset</button>}

    {error && <div className="error">Clipboard error: {error.message}</div>}
  </div>
);
```

#### useGeolocation

```jsx
// Before
const { latitude, longitude, error, loading } = useGeolocation();

// After
const {
  latitude,
  longitude,
  error,
  isLoading,
  isSupported,
  accuracy,
  altitude,
  altitudeAccuracy,
  heading,
  speed,
  timestamp,
  retry,
} = useGeolocation();

// Example
if (!isSupported) {
  return <div>Geolocation is not supported in this browser</div>;
}

if (isLoading) {
  return <div>Loading location data...</div>;
}

if (error) {
  return (
    <div className="error">
      <p>Error getting location: {error.message}</p>
      <button onClick={retry}>Try again</button>
    </div>
  );
}

return (
  <div>
    <p>Latitude: {latitude}</p>
    <p>Longitude: {longitude}</p>
    {accuracy && <p>Accuracy: {accuracy}m</p>}
    {timestamp && <p>Timestamp: {new Date(timestamp).toLocaleTimeString()}</p>}
  </div>
);
```

#### useIdle

```jsx
// Before
const isIdle = useIdle(timeout);

// After
const { isIdle, isSupported, error, reset } = useIdle(timeout);

// Example
return (
  <div>
    {!isSupported && (
      <div className="warning">
        Idle detection is not supported in this environment
      </div>
    )}

    <div>User is currently {isIdle ? "idle" : "active"}</div>

    {isIdle && <button onClick={reset}>Reset idle state</button>}

    {error && (
      <div className="error">Idle detection error: {error.message}</div>
    )}
  </div>
);
```

#### useOnline

```jsx
// Before
const isOnline = useOnline();

// After
const { isOnline, isSupported, error } = useOnline();

// Example
return (
  <div>
    {!isSupported && (
      <div className="warning">Online status detection not supported</div>
    )}

    <div className={isOnline ? "online" : "offline"}>
      {isOnline ? "Online" : "Offline"}
    </div>

    {error && (
      <div className="error">Network status error: {error.message}</div>
    )}
  </div>
);
```

### Element Observation Hooks

#### useIntersectionObserver

```jsx
// Before
const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

// After
const [ref, isVisible, error] = useIntersectionObserver({ threshold: 0.1 });

// Example
return (
  <div>
    <div ref={ref} className={isVisible ? "visible" : "not-visible"}>
      {isVisible
        ? "I'm visible in the viewport"
        : "I'm not visible in the viewport"}
    </div>

    {error && (
      <div className="error">Intersection observer error: {error.message}</div>
    )}
  </div>
);
```

#### useResizeObserver

```jsx
// Before
const [ref, dimensions] = useResizeObserver();

// After
const [ref, dimensions, error] = useResizeObserver();

// Example
return (
  <div>
    <div
      ref={ref}
      style={{ width: "100%", height: "200px", border: "1px solid black" }}
    >
      {dimensions && (
        <p>
          Width: {dimensions.width}px, Height: {dimensions.height}px
        </p>
      )}
    </div>

    {error && (
      <div className="error">Resize observer error: {error.message}</div>
    )}
  </div>
);
```

#### useWindowSize

```jsx
// Before
const { width, height } = useWindowSize();

// After
const { width, height, isSupported, error } = useWindowSize();

// Example
return (
  <div>
    {!isSupported && (
      <div className="warning">
        Window size detection not supported in this environment
      </div>
    )}

    <div>
      Window size: {width} x {height}
    </div>

    {error && <div className="error">Window size error: {error.message}</div>}
  </div>
);
```

### Advanced State Management

#### useMap

```jsx
// Before
const [map, { set, get, delete: remove }] = useMap(initialEntries);

// After
const {
  map,
  set,
  get,
  delete: remove,
  clear,
  has,
  size,
  error,
} = useMap(initialEntries);

// Example
return (
  <div>
    <button onClick={() => set("key1", "value1")}>Add key1</button>
    <button onClick={() => remove("key1")}>Remove key1</button>
    <button onClick={clear}>Clear map</button>

    <p>Has 'key1': {has("key1") ? "Yes" : "No"}</p>
    <p>Map size: {size}</p>

    <div>Current map: {JSON.stringify(Array.from(map.entries()))}</div>

    {error && <div className="error">Map operation error: {error.message}</div>}
  </div>
);
```

#### useSet

```jsx
// Before
const [set, { add, remove, has }] = useSet(initialValues);

// After
const { set, add, remove, has, clear, size, error } = useSet(initialValues);

// Example
return (
  <div>
    <button onClick={() => add("item1")}>Add item1</button>
    <button onClick={() => remove("item1")}>Remove item1</button>
    <button onClick={clear}>Clear set</button>

    <p>Has 'item1': {has("item1") ? "Yes" : "No"}</p>
    <p>Set size: {size}</p>

    <div>Current set: {JSON.stringify(Array.from(set))}</div>

    {error && <div className="error">Set operation error: {error.message}</div>}
  </div>
);
```

## Error Handling Best Practices

Version 2.0.0 introduces a standardized error handling system:

### 1. Using Error Objects

```jsx
// Check error type for specific handling
if (error?.name === "StorageQuotaExceededError") {
  // Handle storage quota exceeded
}

// Display user-friendly messages
if (error) {
  return <div className="error">{error.message}</div>;
}
```

### 2. Feature Detection

```jsx
// Check if a feature is supported before using it
if (!isSupported) {
  return <div>This feature is not supported in your browser</div>;
}
```

### 3. Recovery Mechanisms

```jsx
// Provide retry or reset options when available
if (error) {
  return (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={retry}>Retry</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

## TypeScript Improvements

Version 2.0.0 offers improved TypeScript definitions for all hooks:

```typescript
// Import specific hook types
import useAsync, {
  AsyncHookResult,
  AsyncOptions,
} from "react-use-wisely/hooks/useAsync";

// Define generic types for hook return values
const { execute, status }: AsyncHookResult<User, [number]> = useAsync<
  User,
  [number]
>(fetchUser, { immediate: false, retryCount: 3 });

// All hook options have proper interfaces
const options: AsyncOptions = {
  immediate: true,
  retryCount: 3,
  retryDelay: 1000,
};
```

## Testing With The Library

If you're writing tests for components using these hooks, update your mocks to match the new interfaces:

```jsx
// Before
jest.mock("react-use-wisely/hooks/useMedia", () => {
  return jest.fn().mockReturnValue(true);
});

// After
jest.mock("react-use-wisely/hooks/useMedia", () => {
  return jest.fn().mockReturnValue({
    matches: true,
    isSupported: true,
    error: null,
  });
});
```

## Conclusion

Version 2.0.0 represents a significant step forward in API consistency, error handling, and TypeScript support. While the migration requires some effort, it provides a more robust foundation for your React applications.

For any issues or questions, please [file an issue on GitHub](https://github.com/maxjrobbins/react-use-wisely/issues).
