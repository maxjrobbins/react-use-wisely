// src/tests/hooks/useForm.test.js
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import useForm from '../../hooks/useForm';

// Test component that uses the hook
function TestForm({ initialValues, onSubmit, validate }) {
	const {
		values,
		errors,
		touched,
		isSubmitting,
		handleChange,
		handleBlur,
		handleSubmit,
		resetForm
	} = useForm(initialValues, onSubmit, validate);

	return (
		<form data-testid="form" onSubmit={handleSubmit}>
			<input
				data-testid="name-input"
				type="text"
				name="name"
				value={values.name}
				onChange={handleChange}
				onBlur={handleBlur}
			/>
			{touched.name && errors.name && (
				<div data-testid="name-error">{errors.name}</div>
			)}

			<input
				data-testid="email-input"
				type="email"
				name="email"
				value={values.email}
				onChange={handleChange}
				onBlur={handleBlur}
			/>
			{touched.email && errors.email && (
				<div data-testid="email-error">{errors.email}</div>
			)}

			<button
				data-testid="submit-button"
				type="submit"
				disabled={isSubmitting}
			>
				Submit
			</button>

			<button
				data-testid="reset-button"
				type="button"
				onClick={resetForm}
			>
				Reset
			</button>

			<div data-testid="values-display">
				{JSON.stringify(values)}
			</div>

			<div data-testid="touched-display">
				{JSON.stringify(touched)}
			</div>

			<div data-testid="submitting-display">
				{isSubmitting.toString()}
			</div>
		</form>
	);
}

describe('useForm', () => {
	// Default props for most tests
	const initialValues = { name: '', email: '' };
	const mockSubmit = jest.fn();
	const mockValidate = jest.fn().mockReturnValue({});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should initialize with provided initial values', () => {
		const customInitialValues = { name: 'Test User', email: 'test@example.com' };

		render(
			<TestForm
				initialValues={customInitialValues}
				onSubmit={mockSubmit}
			/>
		);

		expect(screen.getByTestId('values-display').textContent)
			.toBe(JSON.stringify(customInitialValues));
		expect(screen.getByTestId('touched-display').textContent)
			.toBe(JSON.stringify({}));
		expect(screen.getByTestId('submitting-display').textContent)
			.toBe('false');
	});

	test('should update values when input changes', () => {
		render(
			<TestForm
				initialValues={initialValues}
				onSubmit={mockSubmit}
			/>
		);

		const nameInput = screen.getByTestId('name-input');

		act(() => {
			fireEvent.change(nameInput, { target: { value: 'New Name' } });
		});

		expect(screen.getByTestId('values-display').textContent)
			.toBe(JSON.stringify({ name: 'New Name', email: '' }));
	});

	test('should mark field as touched on blur', () => {
		render(
			<TestForm
				initialValues={initialValues}
				onSubmit={mockSubmit}
			/>
		);

		const nameInput = screen.getByTestId('name-input');

		act(() => {
			fireEvent.blur(nameInput);
		});

		expect(screen.getByTestId('touched-display').textContent)
			.toBe(JSON.stringify({ name: true }));
	});

	test('should validate on blur if validate function is provided', () => {
		const customValidate = jest.fn().mockReturnValue({ name: 'Name is required' });

		render(
			<TestForm
				initialValues={initialValues}
				onSubmit={mockSubmit}
				validate={customValidate}
			/>
		);

		const nameInput = screen.getByTestId('name-input');

		act(() => {
			fireEvent.blur(nameInput);
		});

		expect(customValidate).toHaveBeenCalled();
		expect(screen.getByTestId('name-error')).toBeInTheDocument();
		expect(screen.getByTestId('name-error').textContent).toBe('Name is required');
	});

	test('should call onSubmit if form is valid', () => {
		render(
			<TestForm
				initialValues={initialValues}
				onSubmit={mockSubmit}
			/>
		);

		const form = screen.getByTestId('form');

		act(() => {
			fireEvent.submit(form);
		});

		expect(mockSubmit).toHaveBeenCalledWith(initialValues, expect.any(Function));
		expect(screen.getByTestId('submitting-display').textContent).toBe('true');
	});

	test('should not call onSubmit if validation fails', () => {
		const invalidValidate = jest.fn().mockReturnValue({ name: 'Name is required' });

		render(
			<TestForm
				initialValues={initialValues}
				onSubmit={mockSubmit}
				validate={invalidValidate}
			/>
		);

		const form = screen.getByTestId('form');

		act(() => {
			fireEvent.submit(form);
		});

		expect(invalidValidate).toHaveBeenCalled();
		expect(mockSubmit).not.toHaveBeenCalled();
		expect(screen.getByTestId('submitting-display').textContent).toBe('false');

		// All fields should be marked as touched after attempted submission
		expect(screen.getByTestId('touched-display').textContent)
			.toBe(JSON.stringify({ name: true, email: true }));
	});

	test('should reset form to initial values when resetForm is called', () => {
		render(
			<TestForm
				initialValues={initialValues}
				onSubmit={mockSubmit}
			/>
		);

		// Change some values
		const nameInput = screen.getByTestId('name-input');
		const emailInput = screen.getByTestId('email-input');

		act(() => {
			fireEvent.change(nameInput, { target: { value: 'New Name' } });
			fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
			fireEvent.blur(nameInput);
		});

		// Verify values and touched state were updated
		expect(screen.getByTestId('values-display').textContent)
			.toBe(JSON.stringify({ name: 'New Name', email: 'test@example.com' }));
		expect(screen.getByTestId('touched-display').textContent)
			.toBe(JSON.stringify({ name: true }));

		// Reset the form
		const resetButton = screen.getByTestId('reset-button');

		act(() => {
			fireEvent.click(resetButton);
		});

		// Verify everything was reset
		expect(screen.getByTestId('values-display').textContent)
			.toBe(JSON.stringify(initialValues));
		expect(screen.getByTestId('touched-display').textContent)
			.toBe(JSON.stringify({}));
		expect(screen.getByTestId('submitting-display').textContent)
			.toBe('false');
	});

	test('should handle function updates in validate', () => {
		// A validate function that checks if email is valid
		const emailValidate = jest.fn(values => {
			const errors = {};
			if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
				errors.email = 'Email is invalid';
			}
			return errors;
		});

		render(
			<TestForm
				initialValues={initialValues}
				onSubmit={mockSubmit}
				validate={emailValidate}
			/>
		);

		const emailInput = screen.getByTestId('email-input');

		// Enter an invalid email
		act(() => {
			fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
			fireEvent.blur(emailInput);
		});

		expect(emailValidate).toHaveBeenCalled();
		expect(screen.getByTestId('email-error')).toBeInTheDocument();
		expect(screen.getByTestId('email-error').textContent).toBe('Email is invalid');

		// Correct the email
		act(() => {
			fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
			fireEvent.blur(emailInput);
		});

		expect(emailValidate).toHaveBeenCalledTimes(2);
		expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
	});
});
