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
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isSubmitting: boolean;
  isValid: boolean;
  formError: FormError | null;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (event?: FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
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
    formActions: { resetForm: () => void }
  ) => void | Promise<void>,
  validate?: (values: T) => FormErrors<T>
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<FormError | null>(null);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setFormError(null);
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

      // Clear form error when user starts typing
      if (formError) {
        setFormError(null);
      }
    },
    [formError]
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
        } catch (error) {
          const validationError = new FormError(
            "Validation error occurred",
            error,
            { field: name, values }
          );
          console.error(validationError);
          setFormError(validationError);
        }
      }
    },
    [values, validate]
  );

  // Form submission handler
  const handleSubmit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      if (event) event.preventDefault();
      setFormError(null);

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

        setIsSubmitting(true);

        try {
          await Promise.resolve(onSubmit(values, { resetForm }));
        } catch (error) {
          const submissionError = new FormError(
            error instanceof Error ? error.message : "Form submission failed",
            error,
            { values }
          );
          console.error(submissionError);
          setFormError(submissionError);
        } finally {
          setIsSubmitting(false);
        }
      } catch (error) {
        const validationError = new FormError(
          "Validation error occurred",
          error,
          { values }
        );
        console.error(validationError);
        setFormError(validationError);
        setIsSubmitting(false);
      }
    },
    [values, onSubmit, validate, resetForm]
  );

  // Compute if form is valid
  const isValid = Object.keys(errors).length === 0 && formError === null;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    formError,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
  };
};

export default useForm;
