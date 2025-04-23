import React from 'react';
import { render, screen, act } from '@testing-library/react';
import useLocalStorage from '../../hooks/useLocalStorage';

// A simple test component that uses the hook
function TestComponent({ initialValue }) {
	const [value, setValue] = useLocalStorage('test-key', initialValue);

	return (
		<div>
			<div data-testid="value">{value}</div>
			<button
				data-testid="button"
				onClick={() => setValue('new value')}
			>
				Update Value
			</button>
		</div>
	);
}

describe('useLocalStorage', () => {
	beforeEach(() => {
		window.localStorage.clear();
		jest.clearAllMocks();
	});

	test('should use initial value when localStorage is empty', () => {
		render(<TestComponent initialValue="initial value" />);
		expect(screen.getByTestId('value').textContent).toBe('initial value');
	});

	test('should update localStorage when value changes', () => {
		render(<TestComponent initialValue="initial value" />);

		act(() => {
			screen.getByTestId('button').click();
		});

		expect(screen.getByTestId('value').textContent).toBe('new value');
		expect(window.localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new value'));
	});
});
