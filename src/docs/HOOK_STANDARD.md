# Hook Standardization Guide

This document outlines the standardized patterns that all hooks in this library should follow to ensure consistency in API design, error handling, and return values.

## Core Principles

1. **Clarity**: Hook interfaces should be clear, predictable, and self-documenting
2. **Consistency**: Similar hooks should have similar interfaces
3. **Progressive Enhancement**: All hooks should gracefully handle unsupported features
4. **Error Handling**: Error states should be handled consistently and helpfully

## Standard Interface Pattern

### Arguments

For hooks with simple arguments:

```typescript
function useSimpleHook(mainArgument?: Type): HookResult {
  // Implementation
}
```

For hooks with multiple configuration options:

```typescript
function useComplexHook(mainArgument: Type, options?: HookOptions): HookResult {
  // Implementation with destructuring and defaults
  const { option1 = defaultValue1, option2 = defaultValue2 } = options || {};

  // Implementation
}
```

### Return Types

All hooks should return a standardized object with consistent property naming:

```typescript
interface HookResult {
  // Main state properties (camelCase, use 'is' prefix for booleans)
  value: ValueType; // For single value hooks
  items: ItemType[]; // For collection-based hooks
  isActive: boolean; // For boolean states (use 'is' prefix)

  // Support information (required for Browser/DOM API hooks)
  isSupported?: boolean; // Include feature detection results for Browser/DOM API hooks

  // Error state
  error: ErrorType | null; // Always include typed error information

  // Status indicators
  isLoading?: boolean; // For async operations
  status?: "idle" | "loading" | "success" | "error"; // For hooks with complex state

  // Actions/Methods
  setValue?: (newValue: ValueType) => void; // For state setters
  reset?: () => void; // For reset functionality
  refresh?: () => void; // For refreshing data
  execute?: (...args: any[]) => Promise<any>; // For executing operations
}
```

### Feature Detection Requirements by Category

The `isSupported` property is required for certain hook categories:

1. **Browser API Hooks**: Must include `isSupported` for browser APIs that may not be available in all environments
2. **DOM Hooks**: Must include `isSupported` for DOM features that aren't available during SSR
3. **Utility Hooks**: Generally don't require `isSupported` unless using conditional browser/DOM features
4. **Async Hooks**: Don't require `isSupported` as async operations are standard in JavaScript

### Error Handling

Each hook should have a specific error class:

```typescript
export class HookNameError extends Error {
  constructor(
    message: string,
    public originalError?: unknown,
    public metadata?: Record<string, any>
  ) {
    super(message);
    this.name = "HookNameError";
  }
}
```

## Feature Detection

Browser and DOM hooks should use feature detection from the browser utility:

```typescript
function useBrowserAPI(): HookResult {
  const isSupported = features.specificFeature();

  // Use isSupported to control behavior
}
```

## Common Patterns

### For Browser API Hooks

```typescript
function useBrowserAPI(options?: APIOptions): APIResult {
  // Feature detection
  const isSupported = features.specificAPI();

  // Initialize with safe defaults
  const [state, setState] = useState<APIState>(() =>
    runInBrowser(
      () => ({
        // Browser-specific initial state
        isSupported,
      }),
      () => ({
        // SSR-friendly default state
        isSupported: false,
      })
    )
  );

  // Side effects with isSupported check
  useEffect(() => {
    if (!isSupported) return;

    // Browser API implementation

    return () => {
      // Cleanup
    };
  }, [isSupported, ...dependencies]);

  return {
    // Standardized return structure
    isSupported,
    // ... other properties
  };
}
```

### For UI State Hooks

```typescript
function useUIState(initialValue: ValueType): UIStateResult {
  // State management
  const [value, setValue] = useState(initialValue);

  // Add any complex operations as methods
  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return {
    value,
    setValue,
    reset,
    // No need for isSupported for pure React state hooks
    error: null,
  };
}
```

## Naming Conventions

1. **Hook Names**: Always use `use` prefix (e.g., `useOnline`, `useMedia`)
2. **Boolean Properties**: Use `is` prefix (e.g., `isVisible`, `isLoading`, `isSupported`)
3. **Actions/Methods**: Use verb forms (e.g., `setValue`, `refresh`, `execute`)
4. **Error Properties**: Always use `error`
5. **Option Properties**: Use descriptive names (e.g., `timeout`, `pollingInterval`)

By following these standards, we ensure that our hooks are consistent, predictable, and easy to use.
