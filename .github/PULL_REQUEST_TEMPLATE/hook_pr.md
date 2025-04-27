## Hook PR

### Changes Overview

<!-- Briefly describe the hook(s) you're adding, modifying, or fixing -->

### Hook Standard Checklist

- [ ] The hook follows the naming convention with `use` prefix
- [ ] The hook's arguments follow the standard pattern (simple arguments or options object)
- [ ] The hook returns a standardized object with consistent property naming
- [ ] The hook includes proper feature detection (`isSupported` flag) if it uses Browser/DOM APIs
- [ ] The hook includes proper error handling with typed errors
- [ ] Boolean properties use the `is` prefix (e.g., `isActive`, `isLoading`)
- [ ] Method names use verb forms (e.g., `setValue`, `refresh`)
- [ ] The hook has proper TypeScript types and interfaces defined
- [ ] The hook properly handles SSR scenarios (if applicable)

### Category-Specific Requirements

<!-- Check the category of your hook and ensure it follows specific standards -->

#### Browser API Hooks

- [ ] Includes `isSupported` flag for feature detection
- [ ] Uses the browser utility for feature detection
- [ ] Gracefully handles unsupported browsers
- [ ] Has been tested across different browsers

#### DOM Hooks

- [ ] Includes `isSupported` flag for feature detection
- [ ] Safely handles server-side rendering
- [ ] Uses appropriate event cleanup in useEffect

#### Utility/State Hooks

- [ ] Provides appropriate memoization for performance
- [ ] Follows React's rules of hooks
- [ ] Handles edge cases for inputs

#### Async Hooks

- [ ] Properly manages loading/error states
- [ ] Includes appropriate cleanup for async operations
- [ ] Handles cancellation appropriately

### Documentation

- [ ] The hook is properly documented with JSDoc comments
- [ ] The hook has usage examples
- [ ] The return value and options are clearly documented

### Testing

- [ ] Unit tests cover the hook's functionality
- [ ] Tests cover error cases and edge cases
- [ ] Tests verify the hook works with feature detection (if applicable)

### Additional Context

<!-- Any additional information or context that would help reviewers understand your changes -->

Please refer to the [Hook Standardization Guide](../docs/HOOK_STANDARD.md) for details on our hook standards.
