import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import useMap from '../../hooks/useMap';

// A test component that uses the hook
function TestComponent({ initialEntries = [] }) {
	const [map, { set, delete: remove, clear, get, has }] = useMap(initialEntries);

	// Convert Map to array of key-value pairs for display
	const entries = Array.from(map.entries()).map(([key, value]) => `${key}:${value}`).sort();

	return (
		<div>
			<div data-testid="entries">
				{entries.length > 0 ? entries.join(', ') : 'Empty map'}
			</div>
			<div>
				<input data-testid="key-input" type="text" id="key" placeholder="Key" />
				<input data-testid="value-input" type="text" id="value" placeholder="Value" />
				<button
					data-testid="set-button"
					onClick={() => {
						const key = document.getElementById('key').value;
						const value = document.getElementById('value').value;
						set(key, value);
						document.getElementById('key').value = '';
						document.getElementById('value').value = '';
					}}
				>
					Set Entry
				</button>
				<button
					data-testid="remove-button"
					onClick={() => {
						const key = document.getElementById('key').value;
						remove(key);
						document.getElementById('key').value = '';
					}}
				>
					Remove Entry
				</button>
				<button data-testid="clear-button" onClick={clear}>
					Clear Map
				</button>
			</div>
			<div>
				<input data-testid="get-key-input" type="text" id="getKey" placeholder="Key to get" />
				<button
					data-testid="get-button"
					onClick={() => {
						const key = document.getElementById('getKey').value;
						const value = get(key);
						document.getElementById('get-result').textContent =
							value !== undefined ? `Value: ${value}` : 'Key not found';
					}}
				>
					Get Value
				</button>
				<div data-testid="get-result" id="get-result"></div>
			</div>
			<div>
				<input data-testid="has-key-input" type="text" id="hasKey" placeholder="Key to check" />
				<button
					data-testid="has-button"
					onClick={() => {
						const key = document.getElementById('hasKey').value;
						const result = has(key);
						document.getElementById('has-result').textContent =
							result ? 'Key exists' : 'Key does not exist';
					}}
				>
					Check Key
				</button>
				<div data-testid="has-result" id="has-result"></div>
			</div>
		</div>
	);
}

describe('useMap', () => {
	test('should initialize with empty map by default', () => {
		render(<TestComponent />);

		expect(screen.getByTestId('entries').textContent).toBe('Empty map');
	});

	test('should initialize with provided initial entries', () => {
		render(<TestComponent initialEntries={[['key1', 'value1'], ['key2', 'value2']]} />);

		expect(screen.getByTestId('entries').textContent).toBe('key1:value1, key2:value2');
	});

	test('should set entries in the map', () => {
		render(<TestComponent />);

		const keyInput = screen.getByTestId('key-input');
		const valueInput = screen.getByTestId('value-input');
		const setButton = screen.getByTestId('set-button');

		// Add first entry
		act(() => {
			fireEvent.change(keyInput, { target: { value: 'key1' } });
			fireEvent.change(valueInput, { target: { value: 'value1' } });
			fireEvent.click(setButton);
		});

		expect(screen.getByTestId('entries').textContent).toBe('key1:value1');

		// Add second entry
		act(() => {
			fireEvent.change(keyInput, { target: { value: 'key2' } });
			fireEvent.change(valueInput, { target: { value: 'value2' } });
			fireEvent.click(setButton);
		});

		expect(screen.getByTestId('entries').textContent).toBe('key1:value1, key2:value2');
	});

	test('should update existing entries in the map', () => {
		render(<TestComponent initialEntries={[['key1', 'value1'], ['key2', 'value2']]} />);

		const keyInput = screen.getByTestId('key-input');
		const valueInput = screen.getByTestId('value-input');
		const setButton = screen.getByTestId('set-button');

		// Update an existing entry
		act(() => {
			fireEvent.change(keyInput, { target: { value: 'key1' } });
			fireEvent.change(valueInput, { target: { value: 'updated-value1' } });
			fireEvent.click(setButton);
		});

		expect(screen.getByTestId('entries').textContent).toBe('key1:updated-value1, key2:value2');
	});

	test('should remove entries from the map', () => {
		render(<TestComponent initialEntries={[['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3']]} />);

		const keyInput = screen.getByTestId('key-input');
		const removeButton = screen.getByTestId('remove-button');

		// Remove an entry
		act(() => {
			fireEvent.change(keyInput, { target: { value: 'key2' } });
			fireEvent.click(removeButton);
		});

		expect(screen.getByTestId('entries').textContent).toBe('key1:value1, key3:value3');

		// Try to remove a non-existent entry
		act(() => {
			fireEvent.change(keyInput, { target: { value: 'key4' } });
			fireEvent.click(removeButton);
		});

		// Map should remain unchanged
		expect(screen.getByTestId('entries').textContent).toBe('key1:value1, key3:value3');
	});

	test('should clear all entries from the map', () => {
		render(<TestComponent initialEntries={[['key1', 'value1'], ['key2', 'value2']]} />);

		const clearButton = screen.getByTestId('clear-button');

		// Clear all entries
		act(() => {
			fireEvent.click(clearButton);
		});

		expect(screen.getByTestId('entries').textContent).toBe('Empty map');
	});

	test('should get values by key', () => {
		render(<TestComponent initialEntries={[['key1', 'value1'], ['key2', 'value2']]} />);

		const getKeyInput = screen.getByTestId('get-key-input');
		const getButton = screen.getByTestId('get-button');
		const getResult = screen.getByTestId('get-result');

		// Get existing entry
		act(() => {
			fireEvent.change(getKeyInput, { target: { value: 'key1' } });
			fireEvent.click(getButton);
		});

		expect(getResult.textContent).toBe('Value: value1');

		// Get non-existent entry
		act(() => {
			fireEvent.change(getKeyInput, { target: { value: 'key3' } });
			fireEvent.click(getButton);
		});

		expect(getResult.textContent).toBe('Key not found');
	});

	test('should check if keys exist', () => {
		render(<TestComponent initialEntries={[['key1', 'value1'], ['key2', 'value2']]} />);

		const hasKeyInput = screen.getByTestId('has-key-input');
		const hasButton = screen.getByTestId('has-button');
		const hasResult = screen.getByTestId('has-result');

		// Check existing key
		act(() => {
			fireEvent.change(hasKeyInput, { target: { value: 'key2' } });
			fireEvent.click(hasButton);
		});

		expect(hasResult.textContent).toBe('Key exists');

		// Check non-existent key
		act(() => {
			fireEvent.change(hasKeyInput, { target: { value: 'key3' } });
			fireEvent.click(hasButton);
		});

		expect(hasResult.textContent).toBe('Key does not exist');
	});

	test('should handle object keys', () => {
		// This component uses objects as keys
		function ObjectKeysComponent() {
			const [map, { set, get, has }] = useMap();
			const obj1 = { id: 1 };
			const obj2 = { id: 2 };

			const [key1Ref, setKey1Ref] = React.useState(null);
			const [key2Ref, setKey2Ref] = React.useState(null);

			return (
				<div>
					<button
						data-testid="set-obj1"
						onClick={() => {
							const newKey = { id: 1 };
							set(newKey, 'object-value-1');
							setKey1Ref(newKey);
						}}
					>
						Set Object 1
					</button>
					<button
						data-testid="set-obj2"
						onClick={() => {
							const newKey = { id: 2 };
							set(newKey, 'object-value-2');
							setKey2Ref(newKey);
						}}
					>
						Set Object 2
					</button>
					<button
						data-testid="check-ref-obj1"
						onClick={() => {
							document.getElementById('has-obj1-result').textContent =
								has(key1Ref) ? 'Has reference object 1' : 'Does not have reference object 1';
						}}
					>
						Check Reference Object 1
					</button>
					<button
						data-testid="check-similar-obj1"
						onClick={() => {
							document.getElementById('has-obj1-result').textContent =
								has({ id: 1 }) ? 'Has similar object 1' : 'Does not have similar object 1';
						}}
					>
						Check Similar Object 1
					</button>
					<div data-testid="has-obj1-result" id="has-obj1-result"></div>
					<div data-testid="map-size">Size: {map.size}</div>
				</div>
			);
		}

		render(<ObjectKeysComponent />);

		// Initial state
		expect(screen.getByTestId('map-size').textContent).toBe('Size: 0');

		// Add first object
		act(() => {
			fireEvent.click(screen.getByTestId('set-obj1'));
		});

		// Map should contain the entry
		expect(screen.getByTestId('map-size').textContent).toBe('Size: 1');

		// Should be able to find the object by reference
		act(() => {
			fireEvent.click(screen.getByTestId('check-ref-obj1'));
		});
		expect(screen.getByTestId('has-obj1-result').textContent).toBe('Has reference object 1');

		// But not by a similar object with different reference
		act(() => {
			fireEvent.click(screen.getByTestId('check-similar-obj1'));
		});
		expect(screen.getByTestId('has-obj1-result').textContent).toBe('Does not have similar object 1');
	});
});
