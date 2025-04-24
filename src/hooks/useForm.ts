// Simple form state management
import {
  useState,
  useCallback,
  FormEvent,
  ChangeEvent,
  FocusEvent,
} from "react";

// Type definitions
export type FormErrors<T> = Partial<Record<keyof T, string>>;
export type FormTouched<T> = Partial<Record<keyof T, boolean>>;

export interface UseFormReturn<T> {
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isSubmitting: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (event?: FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
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
  onSubmit: (values: T, resetForm: () => void) => void,
  validate?: (values: T) => FormErrors<T>
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Update field value
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }, []);

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
        const validationErrors = validate(values);
        setErrors(validationErrors);
      }
    },
    [values, validate]
  );

  // Form submission handler
  const handleSubmit = useCallback(
    (event?: FormEvent<HTMLFormElement>) => {
      if (event) event.preventDefault();

      // Validate all fields if validation function provided
      if (validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);

        // Mark all fields as touched
        const touchedFields = Object.keys(values).reduce<FormTouched<T>>(
          (acc, key) => {
            acc[key as keyof T] = true;
            return acc;
          },
          {}
        );

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
    },
    [values, onSubmit, validate, resetForm]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
};

export default useForm;
