import { renderHook, act } from '@testing-library/react';
import useAsync from '../../hooks/useAsync';

describe('useAsync', () => {
	// Mocked async functions for testing
	const mockSuccessFunction = jest.fn(async (value) => value);
	const mockErrorFunction = jest.fn(async () => {
		throw new Error('Test error');
	});

	beforeEach(() => {
		// Clear mock function calls before each test
		mockSuccessFunction.mockClear();
		mockErrorFunction.mockClear();
	});

	it('initializes with correct default state', () => {
		const { result } = renderHook(() => useAsync(mockSuccessFunction));

		expect(result.current.status).toBe('idle');
		expect(result.current.value).toBeNull();
		expect(result.current.error).toBeNull();
		expect(result.current.isLoading).toBe(false);
	});

	it('executes async function successfully', async () => {
		const { result } = renderHook(() => useAsync(mockSuccessFunction));

		// Execute the async function
		await act(async () => {
			const response = await result.current.execute('test value');

			expect(mockSuccessFunction).toHaveBeenCalledWith('test value');
		});

		// State checks after act
		expect(result.current.status).toBe('success');
		expect(result.current.value).toBe('test value');
		expect(result.current.error).toBeNull();
		expect(result.current.isLoading).toBe(false);
	});

	it('handles async function error', async () => {
		const { result } = renderHook(() => useAsync(mockErrorFunction));

		// Execute the async function and expect an error
		await act(async () => {
			try {
				await result.current.execute();
			} catch (error) {
				expect(mockErrorFunction).toHaveBeenCalled();
			}
		});

		// State checks after act
		expect(result.current.status).toBe('error');
		expect(result.current.value).toBeNull();
		expect(result.current.error).toEqual(expect.any(Error));
		expect(result.current.error.message).toBe('Test error');
		expect(result.current.isLoading).toBe(false);
	});

	it('sets loading state during async operation', async () => {
		const delayedFunction = jest.fn(async () => {
			await new Promise(resolve => setTimeout(resolve, 100));
			return 'delayed result';
		});

		const { result } = renderHook(() => useAsync(delayedFunction));

		// Start execution and check loading state
		let executionPromise;
		await act(async () => {
			executionPromise = result.current.execute();
		});

		// Verify loading state
		expect(result.current.status).toBe('pending');
		expect(result.current.isLoading).toBe(true);

		// Wait for execution to complete
		await act(async () => {
			await executionPromise;
		});

		// Verify final state
		expect(result.current.status).toBe('success');
		expect(result.current.isLoading).toBe(false);
		expect(result.current.value).toBe('delayed result');
	});

	it('executes immediately when immediate is true', async () => {
		await act(async () => {
			renderHook(() => useAsync(mockSuccessFunction, true));
		});

		// Verify the function was called
		expect(mockSuccessFunction).toHaveBeenCalled();
	});

	it('does not execute immediately when immediate is false', () => {
		renderHook(() => useAsync(mockSuccessFunction, false));

		// Verify the function was not called
		expect(mockSuccessFunction).not.toHaveBeenCalled();
	});

	it('resets state before each execution', async () => {
		const { result } = renderHook(() => useAsync(mockSuccessFunction));

		// First successful execution
		await act(async () => {
			await result.current.execute('first value');
		});

		// Second execution
		await act(async () => {
			await result.current.execute('second value');
		});

		// Verify state is updated with second execution
		expect(result.current.status).toBe('success');
		expect(result.current.value).toBe('second value');
		expect(result.current.error).toBeNull();
	});
});
