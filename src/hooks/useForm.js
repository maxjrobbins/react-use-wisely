// Simple form state management
import { useState, useCallback } from 'react';

/**
 * Hook for form state management
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Form submission handler
 * @param {Function} validate - Optional validation function
 * @returns {Object} Form methods and state
 */
const useForm = (initialValues, onSubmit, validate) => {
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Reset form to initial values
	const resetForm = useCallback(() => {
		setValues(initialValues);
		setErrors({});
		setTouched({});
		setIsSubmitting(false);
	}, [initialValues]);

	// Update field value
	const handleChange = useCallback((event) => {
		const { name, value } = event.target;

		setValues(prevValues => ({
			...prevValues,
			[name]: value
		}));
	}, []);

	// Mark field as touched on blur
	const handleBlur = useCallback((event) => {
		const { name } = event.target;

		setTouched(prevTouched => ({
			...prevTouched,
			[name]: true
		}));

		// Validate on blur if validation function provided
		if (validate) {
			const validationErrors = validate(values);
			setErrors(validationErrors);
		}
	}, [values, validate]);

	// Form submission handler
	const handleSubmit = useCallback((event) => {
		if (event) event.preventDefault();

		// Validate all fields if validation function provided
		if (validate) {
			const validationErrors = validate(values);
			setErrors(validationErrors);

			// Mark all fields as touched
			const touchedFields = Object.keys(values).reduce((acc, key) => {
				acc[key] = true;
				return acc;
			}, {});

			setTouched(touchedFields);

			// Only proceed if there are no errors
			if (Object.keys(validationErrors).length === 0) {
				setIsSubmitting(true);
				onSubmit(values, resetForm);
			}
		} else {
			setIsSubmitting(true);
			onSubmit(values, resetForm);
		}
	}, [values, onSubmit, validate, resetForm]);

	return {
		values,
		errors,
		touched,
		isSubmitting,
		handleChange,
		handleBlur,
		handleSubmit,
		resetForm
	};
}

export default useForm;
