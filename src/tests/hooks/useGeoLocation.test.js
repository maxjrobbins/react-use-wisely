import React from 'react';
import { render, screen, act } from '@testing-library/react';
import useGeolocation from '../../hooks/useGeolocation';

// A test component that uses the hook
function TestComponent({ options }) {
	const geoState = useGeolocation(options);

	return (
		<div>
			<div data-testid="loading">Loading: {geoState.loading.toString()}</div>
			<div data-testid="error">{geoState.error ? `Error: ${geoState.error.message}` : 'No error'}</div>
			<div data-testid="coordinates">
				{geoState.latitude && geoState.longitude
					? `Coordinates: ${geoState.latitude}, ${geoState.longitude}`
					: 'No coordinates'
				}
			</div>
			<div data-testid="accuracy">
				{geoState.accuracy ? `Accuracy: ${geoState.accuracy}` : 'No accuracy data'}
			</div>
			<div data-testid="altitude">
				{geoState.altitude !== null ? `Altitude: ${geoState.altitude}` : 'No altitude data'}
			</div>
			<div data-testid="heading">
				{geoState.heading !== null ? `Heading: ${geoState.heading}` : 'No heading data'}
			</div>
			<div data-testid="speed">
				{geoState.speed !== null ? `Speed: ${geoState.speed}` : 'No speed data'}
			</div>
			<div data-testid="timestamp">
				{geoState.timestamp ? `Timestamp: ${geoState.timestamp}` : 'No timestamp'}
			</div>
		</div>
	);
}

describe('useGeolocation', () => {
	// Mock geolocation object
	const mockGeolocation = {
		watchPosition: jest.fn((success, error, options) => {
			successCallback = success;
			errorCallback = error;
			return 123; // mock watch ID
		}),
		clearWatch: jest.fn(),
	};

	// Mock success and error callbacks
	let successCallback;
	let errorCallback;
	let originalGeolocation;

	// Set up mock before each test
	beforeEach(() => {
		successCallback = null;
		errorCallback = null;

		// Store original navigator.geolocation if it exists
		originalGeolocation = navigator.geolocation;

		// Mock navigator.geolocation
		Object.defineProperty(navigator, 'geolocation', {
			configurable: true,
			value: mockGeolocation,
		});
	});

	// Restore original after each test
	afterEach(() => {
		// Restore to original value
		if (originalGeolocation) {
			Object.defineProperty(navigator, 'geolocation', {
				configurable: true,
				value: originalGeolocation,
			});
		}
	});

	test('should initialize with loading state', () => {
		render(<TestComponent />);

		expect(screen.getByTestId('loading').textContent).toBe('Loading: true');
		expect(screen.getByTestId('coordinates').textContent).toBe('No coordinates');
		expect(screen.getByTestId('error').textContent).toBe('No error');
	});

	test('should call watchPosition with the provided options', () => {
		const options = {
			enableHighAccuracy: true,
			maximumAge: 30000,
			timeout: 27000,
		};

		render(<TestComponent options={options} />);

		expect(mockGeolocation.watchPosition).toHaveBeenCalledWith(
			expect.any(Function),
			expect.any(Function),
			options
		);
	});

	test('should update state when position is received', () => {
		render(<TestComponent />);

		// Initial state
		expect(screen.getByTestId('loading').textContent).toBe('Loading: true');

		// Simulate successful geolocation response
		const mockPosition = {
			coords: {
				latitude: 37.7749,
				longitude: -122.4194,
				accuracy: 100,
				altitude: 10,
				altitudeAccuracy: 80,
				heading: 90,
				speed: 5,
			},
			timestamp: 1627884468000,
		};

		act(() => {
			successCallback(mockPosition);
		});

		// Loading should be false
		expect(screen.getByTestId('loading').textContent).toBe('Loading: false');

		// Coordinates should be updated
		expect(screen.getByTestId('coordinates').textContent).toBe('Coordinates: 37.7749, -122.4194');

		// Other properties should be updated
		expect(screen.getByTestId('accuracy').textContent).toBe('Accuracy: 100');
		expect(screen.getByTestId('altitude').textContent).toBe('Altitude: 10');
		expect(screen.getByTestId('heading').textContent).toBe('Heading: 90');
		expect(screen.getByTestId('speed').textContent).toBe('Speed: 5');
		expect(screen.getByTestId('timestamp').textContent).toBe('Timestamp: 1627884468000');
	});

	test('should handle geolocation errors', () => {
		render(<TestComponent />);

		// Simulate geolocation error
		const mockError = new Error('Geolocation permission denied');
		mockError.code = 1; // Permission denied error code

		act(() => {
			errorCallback(mockError);
		});

		// Loading should be false
		expect(screen.getByTestId('loading').textContent).toBe('Loading: false');

		// Error should be displayed
		expect(screen.getByTestId('error').textContent).toBe('Error: Geolocation permission denied');

		// Coordinates should still be unavailable
		expect(screen.getByTestId('coordinates').textContent).toBe('No coordinates');
	});

	test('should clear watch on unmount', () => {
		const { unmount } = render(<TestComponent />);

		// watchPosition should have been called
		expect(mockGeolocation.watchPosition).toHaveBeenCalled();

		// Unmount component
		unmount();

		// clearWatch should have been called
		expect(mockGeolocation.clearWatch).toHaveBeenCalled();
	});

	test('should handle partial position data', () => {
		render(<TestComponent />);

		// Simulate geolocation response with partial data
		const mockPartialPosition = {
			coords: {
				latitude: 37.7749,
				longitude: -122.4194,
				accuracy: 100,
				// Missing altitude, heading, and speed
			},
			timestamp: 1627884468000,
		};

		act(() => {
			successCallback(mockPartialPosition);
		});

		// Coordinates should be updated
		expect(screen.getByTestId('coordinates').textContent).toBe('Coordinates: 37.7749, -122.4194');

		// Missing properties should show "No X data"
		expect(screen.getByTestId('altitude').textContent).toBe('Altitude: undefined');
		expect(screen.getByTestId('heading').textContent).toBe('Heading: undefined');
		expect(screen.getByTestId('speed').textContent).toBe('Speed: undefined');
	});
});
