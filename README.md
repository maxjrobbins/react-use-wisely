# React-Use-Wisely

A comprehensive collection of custom React hooks for common development tasks.

## Installation

```bash
npm install react-use-wisely
# or
yarn add react-use-wisely
```

## Available Hooks

### Core Hooks

#### useAsync

Handle asynchronous operations with loading, error, and success states.

```jsx
const { execute, status, value, error, isLoading } = useAsync(fetchData);

// Later in your component
<button onClick={execute} disabled={isLoading}>
  {isLoading ? "Loading..." : "Fetch Data"}
</button>;
```

#### useLocalStorage

Persist state to localStorage with the same API as useState.

```jsx
const [name, setName] = useLocalStorage("user-name", "Guest");

// Works like useState but persists to localStorage
setName("New Name");
```

#### useDebounce

Debounce rapidly changing values to reduce unnecessary renders or API calls.

```jsx
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearchTerm = useDebounce(searchTerm, 500);

// Only triggers API call after typing has stopped for 500ms
useEffect(() => {
  if (debouncedSearchTerm) {
    searchApi(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);
```

#### useThrottle

Limit the rate at which a function can fire.

```jsx
const [windowScroll, setWindowScroll] = useState(0);
const throttledScrollPosition = useThrottle(windowScroll, 200);

// Update scroll position in state
useEffect(() => {
  const handleScroll = () => setWindowScroll(window.scrollY);
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

#### useMedia

React to media query changes for responsive designs.

```jsx
const isMobile = useMedia("(max-width: 768px)");

return (
  <div className={isMobile ? "mobile-layout" : "desktop-layout"}>
    {/* Responsive content */}
  </div>
);
```

### UI Interaction Hooks

#### useClickOutside

Detect clicks outside of a component (for modals, dropdowns, etc).

```jsx
const [isOpen, setIsOpen] = useState(false);
const ref = useClickOutside(() => setIsOpen(false));

return <div ref={ref}>{/* Your dropdown or modal content */}</div>;
```

#### useHover

Track whether an element is being hovered.

```jsx
const [hoverRef, isHovered] = useHover();

return (
  <div ref={hoverRef}>{isHovered ? "I am being hovered!" : "Hover me!"}</div>
);
```

#### useKeyPress

Detect when specific keys are pressed.

```jsx
const isEnterPressed = useKeyPress("Enter");
const isEscapePressed = useKeyPress("Escape");

return (
  <div>
    {isEnterPressed && <p>Enter key is pressed</p>}
    {isEscapePressed && <p>Escape key is pressed</p>}
  </div>
);
```

### Form Hooks

#### useForm

Complete form state management with validation.

```jsx
const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
  useForm(
    { email: "", password: "" },
    (values) => console.log("Form submitted", values),
    (values) => {
      const errors = {};
      if (!values.email) errors.email = "Required";
      return errors;
    }
  );
```

### Browser API Hooks

#### useClipboard

Copy text to clipboard with success state.

```jsx
const [isCopied, copyToClipboard] = useClipboard();

return (
  <button onClick={() => copyToClipboard("Text to copy")}>
    {isCopied ? "Copied!" : "Copy to clipboard"}
  </button>
);
```

#### useGeolocation

Access and track device location.

```jsx
const { latitude, longitude, error, loading } = useGeolocation();

if (loading) return <p>Loading location...</p>;
if (error) return <p>Error: {error.message}</p>;

return (
  <p>
    Your location: {latitude}, {longitude}
  </p>
);
```

#### useIdle

Detect when a user is inactive.

```jsx
const isIdle = useIdle(3000); // 3 seconds

return <div>{isIdle ? "User is idle" : "User is active"}</div>;
```

#### useOnline

Track user's online/offline status.

```jsx
const isOnline = useOnline();

return <div>{isOnline ? "You are online" : "You are offline"}</div>;
```

#### usePrefersReducedMotion

Respect user's motion preferences.

```jsx
const prefersReducedMotion = usePrefersReducedMotion();

// Use in animations or transitions
const animationStyle = prefersReducedMotion
  ? { transition: "none" }
  : { transition: "all 0.5s ease" };
```

### Element Observation Hooks

#### useIntersectionObserver

Detect when an element is visible in the viewport.

```jsx
const [ref, isVisible] = useIntersectionObserver({
  threshold: 0.1,
});

return (
  <div ref={ref}>
    {isVisible ? "Element is visible" : "Element is not visible"}
  </div>
);
```

#### useResizeObserver

Track element dimensions when they change.

```jsx
const [ref, dimensions] = useResizeObserver();

return (
  <div ref={ref}>
    Width: {dimensions.width}px, Height: {dimensions.height}px
  </div>
);
```

#### useWindowSize

Get and track window dimensions.

```jsx
const { width, height } = useWindowSize();

return (
  <div>
    Window size: {width}px × {height}px
  </div>
);
```

### Performance Hooks

#### usePrevious

Keep track of the previous value of a variable.

```jsx
const [count, setCount] = useState(0);
const prevCount = usePrevious(count);

return (
  <div>
    <p>
      Current: {count}, Previous: {prevCount}
    </p>
    <button onClick={() => setCount(count + 1)}>Increment</button>
  </div>
);
```

#### useWhyDidYouUpdate

Debug component re-renders.

```jsx
function MyComponent(props) {
  useWhyDidYouUpdate("MyComponent", props);
  // ... rest of component
}
```

### Advanced State Management

#### useMap

Manage Map data structures with React state.

```jsx
const [map, { set, get, delete: remove }] = useMap([
  ["key1", "value1"],
  ["key2", "value2"],
]);

return (
  <div>
    <button onClick={() => set("key3", "value3")}>Add item</button>
    <button onClick={() => remove("key1")}>Remove item</button>
    <p>Value for key2: {get("key2")}</p>
  </div>
);
```

#### useSet

Manage Set data structures with React state.

```jsx
const [set, { add, remove, has }] = useSet(["item1", "item2"]);

return (
  <div>
    <button onClick={() => add("item3")}>Add item</button>
    <button onClick={() => remove("item1")}>Remove item</button>
    <p>Has item2: {has("item2") ? "Yes" : "No"}</p>
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

const [state, dispatch] = useReducerWithMiddleware(
  reducer,
  initialState,
  logger
);
```

## Server-Side Rendering

All hooks are designed to work with server-side rendering. They check for browser environment before accessing browser APIs.

## TypeScript Support

Full TypeScript definitions are included.

## License

MIT
