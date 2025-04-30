// Simple form state management
import {
  useState,
  useCallback,
  FormEvent,
  ChangeEvent,
  FocusEvent,
} from "react";
import { FormError } from "./errors";

// Type definitions
export type FormErrors<T> = Partial<Record<keyof T, string>>;
export type FormTouched<T> = Partial<Record<keyof T, boolean>>;

export interface UseFormReturn<T> {
  // Main state properties
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;

  // Status indicators
  isLoading: boolean;
  isValid: boolean;

  // Error state
  error: FormError | null;

  // Actions/Methods
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (event?: FormEvent<HTMLFormElement>) => void;
  reset: () => void;
  setFieldValue: (field: keyof T, value: any) => void;
}

/**
 * Hook for form state management
 * @param initialValues - Initial form values
 * @param onSubmit - Form submission handler
 * @param validate - Optional validation function
 * @returns Form methods and state
 */
const useForm = <T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (
    values: T,
    formActions: { reset: () => void }
  ) => void | Promise<void>,
  validate?: (values: T) => FormErrors<T>
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FormError | null>(null);

  // Reset form to initial values
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsLoading(false);
    setError(null);
  }, [initialValues]);

  // Set single field value
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  }, []);

  // Update field value
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (error) {
        setError(null);
      }
    },
    [error]
  );

  // Mark field as touched on blur
  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      const { name } = event.target;

      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));

      // Validate on blur if validation function provided
      if (validate) {
        try {
          const validationErrors = validate(values);
          setErrors(validationErrors);
        } catch (err) {
          const validationError = new FormError(
            "Validation error occurred",
            err,
            { field: name, values }
          );
          console.error(validationError);
          setError(validationError);
        }
      }
    },
    [values, validate]
  );

  // Form submission handler
  const handleSubmit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      if (event) event.preventDefault();
      setError(null);

      // Mark all fields as touched
      const touchedFields = Object.keys(values).reduce<FormTouched<T>>(
        (acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        },
        {}
      );

      setTouched(touchedFields);

      try {
        let validationErrors = {};

        // Validate all fields if validation function provided
        if (validate) {
          validationErrors = validate(values);
          setErrors(validationErrors);

          // Only proceed if there are no errors
          if (Object.keys(validationErrors).length > 0) {
            return;
          }
        }

        setIsLoading(true);

        try {
          await Promise.resolve(onSubmit(values, { reset }));
        } catch (err) {
          const submissionError = new FormError(
            err instanceof Error ? err.message : "Form submission failed",
            err,
            { values }
          );
          console.error(submissionError);
          setError(submissionError);
        } finally {
          setIsLoading(false);
        }
      } catch (err) {
        const validationError = new FormError(
          "Validation error occurred",
          err,
          { values }
        );
        console.error(validationError);
        setError(validationError);
        setIsLoading(false);
      }
    },
    [values, onSubmit, validate, reset]
  );

  // Compute if form is valid
  const isValid = Object.keys(errors).length === 0 && error === null;

  return {
    values,
    errors,
    touched,
    isLoading,
    isValid,
    error,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
  };
};

export default useForm;
