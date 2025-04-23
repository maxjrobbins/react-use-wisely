import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import useClickOutside from '../../hooks/useClickOutside';

// A test component that uses the hook
function TestComponent({ callback }) {
	const ref = useClickOutside(callback);

	return (
		<div>
			<div data-testid="outside">Outside Element</div>
			<div data-testid="inside" ref={ref}>Inside Element</div>
		</div>
	);
}

describe('useClickOutside', () => {
	let mockCallback;

	beforeEach(() => {
		mockCallback = jest.fn();
	});

	test('should call callback when clicking outside', () => {
		render(<TestComponent callback={mockCallback} />);

		const outsideElement = screen.getByTestId('outside');

		// Click outside
		fireEvent.mouseDown(outsideElement);

		// Callback should be called
		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	test('should not call callback when clicking inside', () => {
		render(<TestComponent callback={mockCallback} />);

		const insideElement = screen.getByTestId('inside');

		// Click inside
		fireEvent.mouseDown(insideElement);

		// Callback should not be called
		expect(mockCallback).not.toHaveBeenCalled();
	});

	test('should call callback when clicking on document body', () => {
		render(<TestComponent callback={mockCallback} />);

		// Click on document body
		fireEvent.mouseDown(document.body);

		// Callback should be called
		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	test('should add and remove event listener correctly', () => {
		const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
		const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

		const { unmount } = render(<TestComponent callback={mockCallback} />);

		// Check that the event listener was added
		expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

		// Unmount component
		unmount();

		// Check that the event listener was removed
		expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

		// Clean up spies
		addEventListenerSpy.mockRestore();
		removeEventListenerSpy.mockRestore();
	});

	test('should not call callback when ref is null', () => {
		// This component doesn't attach the ref to any element
		function NullRefComponent({ callback }) {
			const ref = useClickOutside(callback);

			return (
				<div>
					<div data-testid="outside">Outside Element</div>
					{/* No element with ref attached */}
				</div>
			);
		}

		render(<NullRefComponent callback={mockCallback} />);

		const outsideElement = screen.getByTestId('outside');

		// Click outside
		fireEvent.mouseDown(outsideElement);

		// With a null ref, the callback should NOT be called
		expect(mockCallback).not.toHaveBeenCalled();
	});
});
