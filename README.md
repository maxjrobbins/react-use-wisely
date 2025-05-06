# React-Use-Wisely

[![CI](https://github.com/maxjrobbins/react-use-wisely/actions/workflows/ci.yml/badge.svg)](https://github.com/maxjrobbins/react-use-wisely/actions/workflows/ci.yml)
[![Storybook](https://github.com/maxjrobbins/react-use-wisely/actions/workflows/storybook.yml/badge.svg)](https://github.com/maxjrobbins/react-use-wisely/actions/workflows/storybook.yml)
[![npm version](https://img.shields.io/npm/v/react-use-wisely.svg)](https://www.npmjs.com/package/react-use-wisely)
[![Test Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen.svg)](https://github.com/maxjrobbins/react-use-wisely)

A comprehensive collection of custom React hooks for common development tasks with standardized interfaces, robust error handling, and cross-browser compatibility.

## Installation

```bash
npm install react-use-wisely
# or
yarn add react-use-wisely
```

## Available Hooks

### Core Hooks

#### useAsync

Handle asynchronous operations with loading, error, and success states. Includes built-in retry functionality and full TypeScript support.

```jsx
// Basic usage
const {
  execute,
  status,
  value,
  error,
  isLoading,
  isRetrying,
  attemptCount,
  reset,
} = useAsync(fetchData);

// Later in your component
<button onClick={execute} disabled={isLoading}>
  {isLoading
    ? isRetrying
      ? `Retrying (${attemptCount})...`
      : "Loading..."
    : "Fetch Data"}
</button>;

{
  error && <div className="error">{error.message}</div>;
}
{
  value && <div className="success">{JSON.stringify(value)}</div>;
}
```

#### useFetch

A specialized hook for data fetching with automatic request cancellation and built-in caching.

```jsx
const {
  data,
  error,
  isLoading,
  isSuccess,
  isError,
  refetch,
  abort,
  isSupported,
} = useFetch("https://api.example.com/data", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
  cache: "default", // "no-cache", "force-cache", etc.
  credentials: "same-origin",
});

// In your component
if (!isSupported) {
  return <div>Fetch API not supported in this environment</div>;
}

if (isLoading) {
  return <div>Loading data...</div>;
}

if (isError) {
  return (
    <div className="error">
      <p>Error: {error.message}</p>
      <button onClick={refetch}>Try Again</button>
    </div>
  );
}

return (
  <div>
    <button onClick={abort}>Cancel Request</button>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
);
```

#### useLocalStorage

Persist state to localStorage with the same API as useState.

```jsx
// Correct object destructuring pattern for the standardized interface
const { value, setValue, error, isSupported } = useLocalStorage(
  "user-name",
  "Guest"
);

// Works like useState but persists to localStorage
setValue("New Name");

// Example component with full API usage
return (
  <>
    {!isSupported && (
      <div className="warning">
        Local storage is not supported in this environment
      </div>
    )}

    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={() => setValue("Reset Value")}>Reset</button>
    </div>

    {error && <div className="error">Storage error: {error.message}</div>}
  </>
);
```

#### useSessionStorage

Like useLocalStorage but using sessionStorage for session-based persistence.

```jsx
const {
  value: sessionData,
  setValue: setSessionData,
  error,
  isSupported,
} = useSessionStorage("session-id", "");

// Works like useState but with sessionStorage
setSessionData(generateSessionId());

// Example component with full API usage
return (
  <>
    {!isSupported && (
      <div className="warning">
        Session storage is not supported in this environment
      </div>
    )}

    <div>
      <p>Current session: {sessionData || "Not started"}</p>
      <button onClick={() => setSessionData(generateSessionId())}>
        New Session
      </button>
    </div>

    {error && (
      <div className="error">Session storage error: {error.message}</div>
    )}
  </>
);
```

#### useDebounce

Debounce rapidly changing values to reduce unnecessary renders or API calls.

```jsx
const { debouncedValue, isDebouncing } = useDebounce(searchTerm, 500);

// Only triggers API call after typing has stopped for 500ms
useEffect(() => {
  if (debouncedValue) {
    searchApi(debouncedValue);
  }
}, [debouncedValue]);

// Show typing indicator
{
  isDebouncing && <span>Typing...</span>;
}
```

#### useThrottle

Limit the rate at which a function can fire.

```jsx
const { throttledValue, isThrottling } = useThrottle(windowScroll, 200);

// Update scroll position in state
useEffect(() => {
  const handleScroll = () => setWindowScroll(window.scrollY);
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

// Show throttling status
{
  isThrottling && <div>Throttling active...</div>;
}
```

#### useMedia

React to media query changes for responsive designs with enhanced SSR support.

```jsx
const { matches, isSupported, error } = useMedia("(max-width: 768px)", false);

return (
  <>
    {!isSupported && (
      <div className="warning">
        Media queries not supported in this environment. Using fallback layout.
      </div>
    )}

    <div className={matches ? "mobile-layout" : "desktop-layout"}>
      {/* Responsive content */}
    </div>

    {error && <div className="error">Media query error: {error.message}</div>}
  </>
);
```

#### useTimeout

Set a timeout with automatic cleanup and abort control.

```jsx
const { isActive, clear, reset, error, isSupported } = useTimeout(() => {
  alert("Timeout completed!");
}, 5000);

// In your component
return (
  <>
    {!isSupported && (
      <div className="warning">
        Timeout API not supported in this environment
      </div>
    )}

    <div>Timeout status: {isActive ? "Running" : "Inactive"}</div>
    <button onClick={clear} disabled={!isActive}>
      Cancel Timeout
    </button>
    <button onClick={reset} disabled={isActive}>
      Reset Timeout
    </button>

    {error && <div className="error">Timeout error: {error.message}</div>}
  </>
);
```

#### useInterval

A safer alternative to setInterval with React lifecycle integration.

```jsx
const { isActive, start, stop, error, isSupported } = useInterval(() => {
  console.log("This runs every second");
}, 1000);

return (
  <>
    {!isSupported && (
      <div className="warning">
        Interval API not supported in this environment
      </div>
    )}

    <div>Interval is {isActive ? "running" : "stopped"}</div>
    <button onClick={start} disabled={isActive}>
      Start
    </button>
    <button onClick={stop} disabled={!isActive}>
      Stop
    </button>

    {error && <div className="error">Interval error: {error.message}</div>}
  </>
);
```

### UI Interaction Hooks

#### useClickOutside

Detect clicks outside of a component (for modals, dropdowns, etc).

```jsx
const { ref, isActive, error } = useClickOutside(() => setIsOpen(false));

return (
  <>
    <div ref={ref} className={`dropdown ${isActive ? "active" : ""}`}>
      {/* Your dropdown or modal content */}
    </div>

    {error && <div className="error">{error.message}</div>}
  </>
);
```

#### useHover

Track whether an element is being hovered.

```jsx
const [ref, isHovered, error] = useHover();

return (
  <>
    <div ref={ref} className={isHovered ? "hovered" : "not-hovered"}>
      {isHovered ? "I am being hovered!" : "Hover me!"}
    </div>

    {error && <div className="error">{error.message}</div>}
  </>
);
```

#### useKeyPress

Detect when specific keys are pressed.

```jsx
const { isPressed, isSupported, error } = useKeyPress("Enter");
const { isPressed: isEscapePressed } = useKeyPress("Escape");

return (
  <>
    {!isSupported && (
      <div className="warning">
        Keyboard events not supported in this environment
      </div>
    )}

    {isPressed && <p>Enter key is pressed</p>}
    {isEscapePressed && <p>Escape key is pressed</p>}

    {error && <div className="error">{error.message}</div>}
  </>
);
```

#### useScrollPosition

Track and control scroll position with throttling.

```jsx
const {
  position,
  scrollTo,
  scrollToTop,
  scrollToBottom,
  isScrolling,
  error,
  isSupported,
} = useScrollPosition({ throttleMs: 100 });

return (
  <>
    {!isSupported && (
      <div className="warning">
        Scroll position tracking not supported in this environment
      </div>
    )}

    <div>
      <p>
        Current position: {position.x}px, {position.y}px
      </p>
      {isScrolling && <span>Scrolling...</span>}

      <button onClick={() => scrollTo(0, 500)}>Scroll to y=500</button>
      <button onClick={scrollToTop}>Scroll to Top</button>
      <button onClick={scrollToBottom}>Scroll to Bottom</button>
    </div>

    {error && <div className="error">Scroll error: {error.message}</div>}
  </>
);
```

#### useEventListener

Easily add and remove event listeners with proper cleanup.

```jsx
const { isListening, error, isSupported, remove, add } = useEventListener(
  window,
  "resize",
  () => console.log("Window resized"),
  { passive: true }
);

return (
  <>
    {!isSupported && (
      <div className="warning">
        Event listener API not supported in this environment
      </div>
    )}

    <div>Listener status: {isListening ? "Active" : "Inactive"}</div>
    <button onClick={remove} disabled={!isListening}>
      Remove Listener
    </button>
    <button onClick={add} disabled={isListening}>
      Add Listener
    </button>

    {error && (
      <div className="error">Event listener error: {error.message}</div>
    )}
  </>
);
```

### Form Hooks

#### useForm

Complete form state management with validation.

```jsx
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
} = useForm(
  { email: "", password: "" },
  (values) => console.log("Form submitted", values),
  (values) => {
    const errors = {};
    if (!values.email) errors.email = "Required";
    return errors;
  }
);

// Form with error handling
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

    {formError && <div className="form-error">{formError}</div>}

    <button type="button" onClick={reset}>
      Reset
    </button>
  </form>
);
```

### Browser API Hooks

#### useClipboard

Copy text to clipboard with success state and enhanced cross-browser support.

```jsx
const { isCopied, copy, error, reset, isSupported } = useClipboard();

return (
  <>
    {!isSupported && (
      <div className="warning">
        Clipboard API is not supported in your browser
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
  </>
);
```

#### useGeolocation

Access and track device location with improved error states and recovery.

```jsx
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

if (!isSupported) {
  return <div>Geolocation is not supported in your browser</div>;
}

if (isLoading) {
  return <div>Loading location...</div>;
}

if (error) {
  return (
    <div className="error">
      <p>Error: {error.message}</p>
      <button onClick={retry}>Retry</button>
    </div>
  );
}

return (
  <div>
    <p>
      Your location: {latitude}, {longitude}
    </p>
    {accuracy && <span>Accuracy: {accuracy}m</span>}
    {timestamp && (
      <span>Updated: {new Date(timestamp).toLocaleTimeString()}</span>
    )}
  </div>
);
```

#### useIdle

Detect when a user is inactive.

```jsx
const { isIdle, isSupported, error, reset } = useIdle(3000); // 3 seconds

return (
  <>
    {!isSupported && (
      <div className="warning">
        Idle detection not supported in this environment
      </div>
    )}

    <div>User is {isIdle ? "idle" : "active"}</div>

    {isIdle && <button onClick={reset}>Reset idle state</button>}

    {error && <div className="error">{error.message}</div>}
  </>
);
```

#### useOnline

Track user's online/offline status.

```jsx
const { isOnline, isSupported, error } = useOnline();

return (
  <>
    {!isSupported && (
      <div className="warning">Network status detection not supported</div>
    )}

    <div className={isOnline ? "online" : "offline"}>
      {isOnline ? "You are online" : "You are offline"}
    </div>

    {error && <div className="error">{error.message}</div>}
  </>
);
```

#### usePrefersReducedMotion

Respect user's motion preferences.

```jsx
const { prefersReducedMotion, isSupported, error } = usePrefersReducedMotion();

// Use in animations or transitions
const animationStyle = prefersReducedMotion
  ? { transition: "none" }
  : { transition: "all 0.5s ease" };

return (
  <>
    {!isSupported && (
      <div className="warning">
        Reduced motion preference detection not supported
      </div>
    )}

    <div style={animationStyle}>
      Animated content respecting user preferences
    </div>

    {error && <div className="error">{error.message}</div>}
  </>
);
```

#### usePageVisibility

Detect when your page is visible or hidden to the user.

```jsx
const { isVisible, isSupported, error } = usePageVisibility();

return (
  <>
    {!isSupported && (
      <div className="warning">
        Page visibility API not supported in this browser
      </div>
    )}

    <div>
      Page is currently {isVisible ? "visible" : "hidden"}
      {!isVisible && <p>User has switched to another tab or application</p>}
    </div>

    {error && <div className="error">Visibility error: {error.message}</div>}
  </>
);
```

#### usePermission

Request and check browser permissions status.

```jsx
const { state, request, isSupported, error } = usePermission({
  name: "microphone",
});

return (
  <>
    {!isSupported && (
      <div className="warning">
        Permissions API not supported in this browser
      </div>
    )}

    <div>
      Microphone permission: {state}
      {state === "prompt" && (
        <button onClick={request}>Request Permission</button>
      )}
      {state === "denied" && (
        <p>Please enable microphone access in your browser settings</p>
      )}
    </div>

    {error && <div className="error">Permission error: {error.message}</div>}
  </>
);
```

#### useScript

Dynamically load external scripts with loading states.

```jsx
const { isLoaded, isLoading, error, isSupported } = useScript(
  "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"
);

return (
  <>
    {!isSupported && (
      <div className="warning">
        Dynamic script loading not supported in this environment
      </div>
    )}

    {isLoading && <div>Loading Google Maps...</div>}
    {error && <div className="error">Script error: {error.message}</div>}
    {isLoaded && (
      <div id="map" style={{ width: "100%", height: "400px" }}>
        {/* Google Maps will render here once loaded */}
      </div>
    )}
  </>
);
```

#### useSpeechRecognition

Access browser speech recognition capabilities.

```jsx
const {
  transcript,
  isListening,
  start,
  stop,
  resetTranscript,
  error,
  isSupported,
} = useSpeechRecognition();

return (
  <>
    {!isSupported && (
      <div className="warning">
        Speech recognition not supported in this browser
      </div>
    )}

    <div>
      <p>Microphone: {isListening ? "on" : "off"}</p>
      <button onClick={start} disabled={isListening}>
        Start
      </button>
      <button onClick={stop} disabled={!isListening}>
        Stop
      </button>
      <button onClick={resetTranscript} disabled={!transcript}>
        Reset
      </button>

      <div className="transcript">
        <h3>Transcript:</h3>
        <p>{transcript || "(say something...)"}</p>
      </div>
    </div>

    {error && <div className="error">Recognition error: {error.message}</div>}
  </>
);
```

### Element Observation Hooks

#### useIntersectionObserver

Detect when an element is visible in the viewport with improved browser compatibility.

```jsx
const [ref, isVisible, error] = useIntersectionObserver({
  threshold: 0.1,
});

return (
  <>
    <div ref={ref} className={isVisible ? "visible" : "not-visible"}>
      {isVisible ? "Element is visible" : "Element is not visible"}
    </div>

    {error && <div className="error">Observer error: {error.message}</div>}
  </>
);
```

#### useResizeObserver

Track element dimensions when they change.

```jsx
const [ref, dimensions, error] = useResizeObserver();

return (
  <>
    <div ref={ref} style={{ width: "100%", border: "1px solid black" }}>
      {dimensions && (
        <>
          Width: {dimensions.width}px, Height: {dimensions.height}px
        </>
      )}
    </div>

    {error && <div className="error">Resize error: {error.message}</div>}
  </>
);
```

#### useWindowSize

Get and track window dimensions.

```jsx
const { width, height, isSupported, error } = useWindowSize();

return (
  <>
    {!isSupported && (
      <div className="warning">
        Window size detection not supported in this environment
      </div>
    )}

    <div>
      Window size: {width}px × {height}px
    </div>

    {error && <div className="error">{error.message}</div>}
  </>
);
```

### Error Handling Hooks

#### useErrorBoundary

Create error boundaries in functional components.

```jsx
const { error, resetError, errorInfo } = useErrorBoundary();

if (error) {
  return (
    <div className="error-boundary">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      {errorInfo && (
        <details>
          <summary>Component Stack</summary>
          <pre>{errorInfo.componentStack}</pre>
        </details>
      )}
      <button onClick={resetError}>Try Again</button>
    </div>
  );
}

return <YourComponent />;
```

### Component Lifecycle Hooks

#### useMountedRef

Track whether a component is still mounted to prevent memory leaks.

```jsx
const isMountedRef = useMountedRef();

// Use in async operations
const fetchData = async () => {
  try {
    const response = await api.getData();
    // Check if component is still mounted before updating state
    if (isMountedRef.current) {
      setData(response);
    }
  } catch (error) {
    if (isMountedRef.current) {
      setError(error);
    }
  }
};

return (
  <div>
    <button onClick={fetchData}>Fetch Data</button>
    {/* Component content */}
  </div>
);
```

### Performance Hooks

#### usePrevious

Keep track of the previous value of a variable.

```jsx
const [count, setCount] = useState(0);
const { previous: prevCount, error } = usePrevious(count);

return (
  <div>
    <p>
      Current: {count}, Previous: {prevCount}
    </p>
    <button onClick={() => setCount(count + 1)}>Increment</button>

    {error && <div className="error">{error.message}</div>}
  </div>
);
```

#### useWhyDidYouUpdate

Debug component re-renders.

```jsx
function MyComponent(props) {
  const { updates, error } = useWhyDidYouUpdate("MyComponent", props);

  // Log updates if needed
  useEffect(() => {
    if (updates && Object.keys(updates).length > 0) {
      console.log("Component updated because:", updates);
    }
  }, [updates]);

  // ... rest of component

  {
    error && <div className="debug-error">{error.message}</div>;
  }
}
```

### Advanced State Management

#### useMap

Manage Map data structures with React state.

```jsx
const {
  map,
  set,
  get,
  delete: remove,
  clear,
  has,
  size,
  error,
} = useMap([
  ["key1", "value1"],
  ["key2", "value2"],
]);

return (
  <div>
    <button onClick={() => set("key3", "value3")}>Add item</button>
    <button onClick={() => remove("key1")}>Remove item</button>
    <button onClick={clear}>Clear all</button>

    <p>Value for key2: {get("key2")}</p>
    <p>Has key3: {has("key3") ? "Yes" : "No"}</p>
    <p>Size: {size}</p>

    {error && <div className="error">{error.message}</div>}
  </div>
);
```

#### useSet

Manage Set data structures with React state.

```jsx
const { set, add, remove, has, clear, size, error } = useSet([
  "item1",
  "item2",
]);

return (
  <div>
    <button onClick={() => add("item3")}>Add item</button>
    <button onClick={() => remove("item1")}>Remove item</button>
    <button onClick={clear}>Clear all</button>

    <p>Has item2: {has("item2") ? "Yes" : "No"}</p>
    <p>Set size: {size}</p>

    {error && <div className="error">{error.message}</div>}
  </div>
);
```

#### useReducerWithMiddleware

Enhanced useReducer with middleware support.

```jsx
const logger = (state, action, dispatch) => {
  console.log("Previous state:", state);
  console.log("Action:", action);
  dispatch(action);
};

const { state, dispatch, error } = useReducerWithMiddleware(
  reducer,
  initialState,
  logger
);

// Component with error handling
return (
  <div>
    <p>Count: {state.count}</p>
    <button onClick={() => dispatch({ type: "increment" })}>Increment</button>

    {error && <div className="error">{error.message}</div>}
  </div>
);
```

## Error Handling

All hooks now include standardized error handling with specific error classes for different scenarios. This gives you better control over error states and recovery mechanisms in your components.

```jsx
// Example of working with hook errors
const [value, setValue, error] = useLocalStorage("user-data", {});

// You can check the error type for specific handling
if (error?.name === "QuotaExceededError") {
  // Handle storage quota exceeded
}

// Display user-friendly error messages
{
  error && <div className="error">{error.message}</div>;
}
```

## Browser Compatibility and Feature Detection

All browser API hooks include an `isSupported` property to detect feature availability:

```jsx
const { isOnline, isSupported } = useOnline();

if (!isSupported) {
  // Provide fallback for environments without online status detection
  return <div>Network status detection not available</div>;
}

return <div>{isOnline ? "Online" : "Offline"}</div>;
```

## Optimized Bundle Size

React-Use-Wisely is fully optimized for tree-shaking, allowing you to include only the hooks you actually use in your final bundle. This means your production builds will be smaller and more efficient.

### Import Strategies

You can import hooks in several ways, depending on your needs:

#### 1. Direct hook imports (recommended for production)

Individually import only the hooks you need to ensure minimal bundle size:

```jsx
import useOnline from "react-use-wisely/hooks/useOnline";
import useLocalStorage from "react-use-wisely/hooks/useLocalStorage";

function MyComponent() {
  const { isOnline } = useOnline();
  const [user, setUser, error] = useLocalStorage("user", null);
  // ...
}
```

#### 2. Category imports

Import related hooks by category:

```jsx
import { useOnline, usePermission } from "react-use-wisely/categories/browser";
import {
  useLocalStorage,
  useDebounce,
} from "react-use-wisely/categories/utilities";
```

#### 3. All hooks (not recommended for production)

Import everything (only use this during development):

```jsx
import {
  useOnline,
  useLocalStorage,
  useDebounce /* ... */,
} from "react-use-wisely";
```

The package is configured with `"sideEffects": false` to ensure modern bundlers can tree-shake unused hooks. For the smallest possible bundle size, use approach #1 and import only what you need.

## Server-Side Rendering

All hooks are designed to work with server-side rendering. They check for browser environment before accessing browser APIs.

## TypeScript Support

Full TypeScript definitions are included. All hooks now have explicit interfaces for their return values and parameters:

```typescript
// Import hook with its type definitions
import useAsync, {
  AsyncHookResult,
  AsyncOptions,
} from "react-use-wisely/hooks/useAsync";

// Use proper typing for hook options and results
const options: AsyncOptions = {
  immediate: true,
  retryCount: 3,
  retryDelay: 1000,
};

const { execute, status, value, error }: AsyncHookResult<User, [number]> =
  useAsync<User, [number]>(fetchUser, options);
```

## Documentation

### Storybook

This project uses Storybook to showcase and document all the hooks in an interactive environment.

You can view the live Storybook documentation at: https://maxjrobbins.github.io/react-use-wisely/

To run Storybook locally:

```bash
# Navigate to the docs directory
cd docs

# Install dependencies
npm install

# Start Storybook
npm run storybook
```

To build Storybook:

```bash
cd docs
npm run build-storybook
```

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
