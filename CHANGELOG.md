# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2024-03-21

### Fixed

- Fixed TypeScript declaration file generation issues
- Resolved CommonJS/ESM export compatibility warnings
- Updated build configuration to properly handle declarations and exports
- Improved module resolution for better compatibility with different bundlers

## [2.0.0] - 2025-05-06

## Breaking Changes

- **Removed deprecated hook**

  - Deleted `useNetworkSpeed.ts` and its associated tests/stories; any imports of that hook must be removed.

- **Hook return-type standardization**
  - Most hooks (e.g. `useScrollPosition`, `usePermission`, `usePageVisibility`, `useFetch`, etc.) now return an object conforming to a `*HookResult` interface (with properties like `value`/`isSupported`/`error`/control methods) instead of returning a bare primitive or single value.

## Features

- **New hooks added**

  - `useErrorBoundary`
  - `useEventListener`
  - `useFetch`
  - `useInterval`
  - `useMountedRef`
  - `usePermission`
  - `useScript`
  - `useScrollPosition`
  - `useSessionStorage`
  - `useSpeechRecognition`
  - `useTimeout`

- **Hook categorization & tree-shaking support**

  - Introduced `src/categories/*` files (e.g. `async.ts`, `dom.ts`) and moved out shared type definitions into dedicated `src/types/*`.
  - Reorganized exports so unused hooks can be tree-shaken.

- **Utility helpers**
  - Added `src/utils/helpers.ts` for common logic across hooks (e.g. safe JSON parsing).

## Bug Fixes

- **Test fixes**

  - Corrected mocks and expectations in `useOnline` & `useIdle` tests.
  - Fixed broken tests for `useFetch` and `useEventListener`.

- **Linting & styling**
  - Addressed lint errors across the codebase to restore a clean ESLint run.

## Improvements

- **Browser API feature detection**

  - Enhanced hooks like `useIntersectionObserver` and `useEventListener` with better `isSupported` checks (e.g. using refs to guard one-time detection).

- **Refactored JSDoc & comments**

  - Clarified inline docs, consolidated parameter descriptions, and cleaned up example code.

- **Coverage boosts**
  - Increased unit-test coverage for `useMedia` and many other hooks.

## Documentation

- **Hook Standard Guide**

  - Added a living "Hook Standard Guide" outlining naming conventions, return-type interfaces, and testing best practices.

- **Storybook updates**
  - Updated `storybook.yml` to include the new hooks.
  - Added/updated stories for every hook under `docs/stories/hooks/*.stories.(ts|tsx|jsx)`.
  - Ensured all stories render correctly with the standardized API.

## Tests & CI

- **Comprehensive test suites**

  - New tests in `src/tests/hooks/*.test.ts(x)` for every hook.
  - Unified test patterns to reflect the new `*HookResult` interfaces.  
    _(commits: add tests and stories for some new hooks; ensure all hooks follow standard)_

- **CI Pipeline**
  - Expanded coverage thresholds; Storybook build step added/verified in CI after `storybook.yml` update.

## [1.1.3] - 2025-05-15

### Changed

- Simplified package distribution to use only npm registry
- Removed GitHub Packages support to avoid confusion with package naming

## [1.1.2] - 2025-04-25

### Added

- GitHub Packages support
- Package status badges in README (npm and GitHub Packages)
- GitHub workflow for automated package publishing
- Enhanced repository metadata

### Changed

- Updated documentation with installation instructions for GitHub Packages
- Added homepage and bugs fields to package.json

## [1.1.1] - 2025-04-24

### Added

- Enhanced error handling system across all hooks
- Added centralized error classes in `src/hooks/errors/`
- Added `useResizeObserver` error handling
  - Hook now returns error state as third value
  - Created `ResizeObserverError` and `ResizeObserverNotSupportedError` classes
  - Added browser compatibility detection
  - Updated stories to demonstrate error handling
- Added error handling to `useLocalStorage` hook
- Added error handling to `useGeolocation` hook with retry functionality
- Added error handling to `useClipboard` hook
- Added error handling to `useMedia` hook
- Added error handling to `useForm` hook
- Added error handling to `useAsync` hook with retry functionality
- Added error handling to `useIntersectionObserver` hook
- Added error handling to `useOnline` hook
- Added comprehensive unit tests for error scenarios:
  - Browser compatibility detection
  - Error state tracking and clearing
  - Error recovery mechanisms
  - Error propagation

### Changed

- Refactored hook return values to include error state
- Updated documentation and stories to reflect new error handling capabilities
- Improved user experience by providing meaningful error messages
- Standardized error pattern across all hooks
