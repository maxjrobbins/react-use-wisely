import { renderHook, act } from '@testing-library/react';
import useIdle from '../../hooks/useIdle';

describe('useIdle', () => {
	// Helper to simulate user activity
	const simulateUserActivity = (eventType = 'mousedown') => {
		const event = new Event(eventType);
		document.dispatchEvent(event);
	};

	// Control time passage in tests
	jest.useFakeTimers();

	beforeEach(() => {
		// Reset the document event listeners
		const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
		events.forEach(event => {
			document.removeEventListener(event, () => {});
		});
	});

	afterEach(() => {
		// Clean up timers and event listeners
		jest.clearAllTimers();
		jest.clearAllMocks();
	});

	it('returns false initially', () => {
		const { result } = renderHook(() => useIdle());

		expect(result.current).toBe(false);
	});

	it('resets idle state on user activity', () => {
		const { result } = renderHook(() => useIdle(1000));

		// Simulate activity before timeout
		act(() => {
			simulateUserActivity();
			jest.advanceTimersByTime(500);
			simulateUserActivity('mousemove');
			jest.advanceTimersByTime(500);
		});

		expect(result.current).toBe(false);
	});

	it('supports custom events', () => {
		const customEvents = ['click', 'keydown'];
		const { result } = renderHook(() => useIdle(1000, customEvents));

		// Simulate custom event
		act(() => {
			const clickEvent = new Event('click');
			document.dispatchEvent(clickEvent);
			jest.advanceTimersByTime(500);
		});

		expect(result.current).toBe(false);
	});

	it('cleans up event listeners on unmount', () => {
		const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
		const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

		const { unmount } = renderHook(() => useIdle());

		// Unmount the hook
		act(() => {
			unmount();
		});

		// Verify cleanup
		expect(removeEventListenerSpy).toHaveBeenCalledTimes(addEventListenerSpy.mock.calls.length);
	});

	it('does not become idle if activity occurs before timeout', () => {
		const { result } = renderHook(() => useIdle(1000));

		// Simulate activity before timeout
		act(() => {
			jest.advanceTimersByTime(500);
			simulateUserActivity();
			jest.advanceTimersByTime(500);
		});

		expect(result.current).toBe(false);
	});
});
