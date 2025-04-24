# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2025-04-24

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
