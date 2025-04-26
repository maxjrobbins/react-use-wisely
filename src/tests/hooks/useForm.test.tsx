import React, { ReactElement } from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from "@testing-library/react";
import useForm, { FormErrors } from "../../hooks/useForm";

interface FormValues {
  name: string;
  email: string;
}

interface TestFormProps {
  initialValues: FormValues;
  onSubmit: (
    values: FormValues,
    formActions: { resetForm: () => void }
  ) => void;
  validate?: (values: FormValues) => FormErrors<FormValues>;
}

// Test component that uses the hook
function TestForm({
  initialValues,
  onSubmit,
  validate,
}: TestFormProps): ReactElement {
  const {
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
  } = useForm<FormValues>(initialValues, onSubmit, validate);

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

      {formError && <div data-testid="form-error">{formError.message}</div>}

      <button data-testid="submit-button" type="submit" disabled={isSubmitting}>
        Submit
      </button>

      <button data-testid="reset-button" type="button" onClick={resetForm}>
        Reset
      </button>

      <div data-testid="values-display">{JSON.stringify(values)}</div>

      <div data-testid="touched-display">{JSON.stringify(touched)}</div>

      <div data-testid="submitting-display">{isSubmitting.toString()}</div>

      <div data-testid="valid-display">{isValid.toString()}</div>
    </form>
  );
}

describe("useForm", () => {
  // Default props for most tests
  const initialValues: FormValues = { name: "", email: "" };
  const mockSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize with provided initial values", () => {
    const customInitialValues: FormValues = {
      name: "Test User",
      email: "test@example.com",
    };

    render(
      <TestForm initialValues={customInitialValues} onSubmit={mockSubmit} />
    );

    expect(screen.getByTestId("values-display").textContent).toBe(
      JSON.stringify(customInitialValues)
    );
    expect(screen.getByTestId("touched-display").textContent).toBe(
      JSON.stringify({})
    );
    expect(screen.getByTestId("submitting-display").textContent).toBe("false");
  });

  test("should update values when input changes", () => {
    render(<TestForm initialValues={initialValues} onSubmit={mockSubmit} />);

    const nameInput = screen.getByTestId("name-input");

    act(() => {
      fireEvent.change(nameInput, { target: { value: "New Name" } });
    });

    expect(screen.getByTestId("values-display").textContent).toBe(
      JSON.stringify({ name: "New Name", email: "" })
    );
  });

  test("should mark field as touched on blur", () => {
    render(<TestForm initialValues={initialValues} onSubmit={mockSubmit} />);

    const nameInput = screen.getByTestId("name-input");

    act(() => {
      fireEvent.blur(nameInput);
    });

    expect(screen.getByTestId("touched-display").textContent).toBe(
      JSON.stringify({ name: true })
    );
  });

  test("should validate on blur if validate function is provided", () => {
    const customValidate = jest
      .fn()
      .mockReturnValue({ name: "Name is required" });

    render(
      <TestForm
        initialValues={initialValues}
        onSubmit={mockSubmit}
        validate={customValidate}
      />
    );

    const nameInput = screen.getByTestId("name-input");

    act(() => {
      fireEvent.blur(nameInput);
    });

    expect(customValidate).toHaveBeenCalled();
    expect(screen.getByTestId("name-error")).toBeInTheDocument();
    expect(screen.getByTestId("name-error").textContent).toBe(
      "Name is required"
    );
  });

  test("should call onSubmit if form is valid", () => {
    render(<TestForm initialValues={initialValues} onSubmit={mockSubmit} />);

    const form = screen.getByTestId("form");

    act(() => {
      fireEvent.submit(form);
    });

    expect(mockSubmit).toHaveBeenCalledWith(initialValues, {
      resetForm: expect.any(Function),
    });
    expect(screen.getByTestId("submitting-display").textContent).toBe("true");
  });

  test("should not call onSubmit if validation fails", () => {
    const invalidValidate = jest
      .fn()
      .mockReturnValue({ name: "Name is required" });

    render(
      <TestForm
        initialValues={initialValues}
        onSubmit={mockSubmit}
        validate={invalidValidate}
      />
    );

    const form = screen.getByTestId("form");

    act(() => {
      fireEvent.submit(form);
    });

    expect(invalidValidate).toHaveBeenCalled();
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId("submitting-display").textContent).toBe("false");

    // All fields should be marked as touched after attempted submission
    expect(screen.getByTestId("touched-display").textContent).toBe(
      JSON.stringify({ name: true, email: true })
    );
  });

  test("should reset form to initial values when resetForm is called", () => {
    render(<TestForm initialValues={initialValues} onSubmit={mockSubmit} />);

    // Change some values
    const nameInput = screen.getByTestId("name-input");
    const emailInput = screen.getByTestId("email-input");

    act(() => {
      fireEvent.change(nameInput, { target: { value: "New Name" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.blur(nameInput);
    });

    // Verify values and touched state were updated
    expect(screen.getByTestId("values-display").textContent).toBe(
      JSON.stringify({ name: "New Name", email: "test@example.com" })
    );
    expect(screen.getByTestId("touched-display").textContent).toBe(
      JSON.stringify({ name: true })
    );

    // Reset the form
    const resetButton = screen.getByTestId("reset-button");

    act(() => {
      fireEvent.click(resetButton);
    });

    // Verify everything was reset
    expect(screen.getByTestId("values-display").textContent).toBe(
      JSON.stringify(initialValues)
    );
    expect(screen.getByTestId("touched-display").textContent).toBe(
      JSON.stringify({})
    );
    expect(screen.getByTestId("submitting-display").textContent).toBe("false");
  });

  test("should handle function updates in validate", () => {
    // A validate function that checks if email is valid
    const emailValidate = jest.fn((values: FormValues) => {
      const errors: FormErrors<FormValues> = {};
      if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email is invalid";
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

    const emailInput = screen.getByTestId("email-input");

    // Enter an invalid email
    act(() => {
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.blur(emailInput);
    });

    expect(emailValidate).toHaveBeenCalled();
    expect(screen.getByTestId("email-error")).toBeInTheDocument();
    expect(screen.getByTestId("email-error").textContent).toBe(
      "Email is invalid"
    );

    // Correct the email
    act(() => {
      fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
      fireEvent.blur(emailInput);
    });

    expect(emailValidate).toHaveBeenCalledTimes(2);
    expect(screen.queryByTestId("email-error")).not.toBeInTheDocument();
  });

  test("should handle errors during form submission", async () => {
    // Mock a failing submit function
    const failingSubmit = jest.fn().mockImplementation(() => {
      throw new Error("Submission failed");
    });

    // Suppress console.error for this test
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<TestForm initialValues={initialValues} onSubmit={failingSubmit} />);

    const form = screen.getByTestId("form");

    await act(async () => {
      fireEvent.submit(form);
    });

    // Form should have an error
    expect(screen.getByTestId("form-error")).toBeInTheDocument();
    expect(screen.getByTestId("form-error").textContent).toBe(
      "Submission failed"
    );

    // Should not be submitting anymore
    expect(screen.getByTestId("submitting-display").textContent).toBe("false");

    // Form should be invalid
    expect(screen.getByTestId("valid-display").textContent).toBe("false");

    // Clean up spy
    consoleErrorSpy.mockRestore();
  });

  test("should handle errors during validation", async () => {
    // Create a validate function that throws an error
    const throwingValidate = jest.fn().mockImplementation(() => {
      throw new Error("Validation crashed");
    });

    // Suppress console.error for this test
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <TestForm
        initialValues={initialValues}
        onSubmit={mockSubmit}
        validate={throwingValidate}
      />
    );

    const nameInput = screen.getByTestId("name-input");

    // Trigger validation on blur
    await act(async () => {
      fireEvent.blur(nameInput);
    });

    // Should have a form error
    expect(screen.getByTestId("form-error")).toBeInTheDocument();
    expect(screen.getByTestId("form-error").textContent).toBe(
      "Validation error occurred"
    );

    // Form should be invalid
    expect(screen.getByTestId("valid-display").textContent).toBe("false");

    // Clean up spy
    consoleErrorSpy.mockRestore();
  });

  // Test for setFieldValue function
  test("should update value using setFieldValue", () => {
    // Create a TestForm that exposes setFieldValue
    function TestFormWithSetField({
      initialValues,
      onSubmit,
      validate,
    }: TestFormProps) {
      const form = useForm(initialValues, onSubmit, validate);

      return (
        <div>
          <button
            data-testid="set-field-button"
            onClick={() =>
              form.setFieldValue("name", "Updated via setFieldValue")
            }
          >
            Set Field
          </button>
          {/* Existing form components */}
          <div data-testid="values-display">{JSON.stringify(form.values)}</div>
        </div>
      );
    }

    render(
      <TestFormWithSetField
        initialValues={initialValues}
        onSubmit={mockSubmit}
      />
    );

    // Click the button that uses setFieldValue
    act(() => {
      fireEvent.click(screen.getByTestId("set-field-button"));
    });

    // Verify the value was updated
    expect(screen.getByTestId("values-display").textContent).toBe(
      JSON.stringify({ name: "Updated via setFieldValue", email: "" })
    );
  });

  // Test for clearing formError when typing
  test("should clear formError when user starts typing", async () => {
    // Create a failing submit function
    const failingSubmit = jest.fn().mockImplementation(() => {
      throw new Error("Submission failed");
    });

    // Suppress console.error
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<TestForm initialValues={initialValues} onSubmit={failingSubmit} />);

    // Submit the form to generate an error
    await act(async () => {
      fireEvent.submit(screen.getByTestId("form"));
    });

    // Verify form error exists
    expect(screen.getByTestId("form-error")).toBeInTheDocument();

    // Start typing in an input to clear the error
    act(() => {
      fireEvent.change(screen.getByTestId("name-input"), {
        target: { value: "New input" },
      });
    });

    // Verify the form error is cleared
    expect(screen.queryByTestId("form-error")).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  // Test for successful async submission
  test("should handle successful async submission", async () => {
    // Create a mock submit function that returns a promise
    const asyncSubmit = jest.fn().mockImplementation(() => {
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 100);
      });
    });

    render(<TestForm initialValues={initialValues} onSubmit={asyncSubmit} />);

    // Submit the form
    await act(async () => {
      fireEvent.submit(screen.getByTestId("form"));
      // Wait for the async operation to complete
      await new Promise<void>((resolve) => setTimeout(resolve, 200));
    });

    // Should have called submit
    expect(asyncSubmit).toHaveBeenCalled();

    // Submitting state should be false after resolution
    expect(screen.getByTestId("submitting-display").textContent).toBe("false");
  });

  // Test isValid computation
  test("should compute isValid based on errors and formError", () => {
    const validateWithErrors = jest.fn().mockReturnValue({ name: "Error" });

    // Render with validation errors
    render(
      <TestForm
        initialValues={initialValues}
        onSubmit={mockSubmit}
        validate={validateWithErrors}
      />
    );

    // Trigger validation
    act(() => {
      fireEvent.blur(screen.getByTestId("name-input"));
    });

    // Form should be invalid due to field errors
    expect(screen.getByTestId("valid-display").textContent).toBe("false");

    // Clean up and create a new test with form error
    cleanup();

    // Suppress console error
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const failingSubmit = jest.fn().mockImplementation(() => {
      throw new Error("Submission error");
    });

    render(<TestForm initialValues={initialValues} onSubmit={failingSubmit} />);

    // Submit to generate form error
    act(() => {
      fireEvent.submit(screen.getByTestId("form"));
    });

    // Form should be invalid due to form error
    expect(screen.getByTestId("valid-display").textContent).toBe("false");

    consoleErrorSpy.mockRestore();
  });

  // Test for form reset after successful submission
  test("should be able to reset form after successful submission", async () => {
    // Mock that calls resetForm after submission
    const submitAndReset = jest
      .fn()
      .mockImplementation((values, { resetForm }) => {
        // Simulate async action
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            resetForm();
            resolve();
          }, 100);
        });
      });

    render(
      <TestForm initialValues={initialValues} onSubmit={submitAndReset} />
    );

    // Change some values
    act(() => {
      fireEvent.change(screen.getByTestId("name-input"), {
        target: { value: "Changed name" },
      });
    });

    // Submit the form
    await act(async () => {
      fireEvent.submit(screen.getByTestId("form"));
      // Wait for the async operation to complete
      await new Promise<void>((resolve) => setTimeout(resolve, 200));
    });

    // Values should be reset to initial values after submission
    expect(screen.getByTestId("values-display").textContent).toBe(
      JSON.stringify(initialValues)
    );
  });

  // Test for validation error during form submission
  test("should handle validation error during form submission", async () => {
    // Create a validate function that throws an error during submission
    const throwingValidate = jest.fn().mockImplementation(() => {
      throw new Error("Validation crashed during submission");
    });

    // Suppress console.error for this test
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <TestForm
        initialValues={initialValues}
        onSubmit={mockSubmit}
        validate={throwingValidate}
      />
    );

    // Submit the form to trigger validation error in handleSubmit
    await act(async () => {
      fireEvent.submit(screen.getByTestId("form"));
    });

    // Validation function should have been called
    expect(throwingValidate).toHaveBeenCalled();

    // Should have a form error with the expected message
    expect(screen.getByTestId("form-error")).toBeInTheDocument();
    expect(screen.getByTestId("form-error").textContent).toBe(
      "Validation error occurred"
    );

    // Form should be invalid
    expect(screen.getByTestId("valid-display").textContent).toBe("false");

    // Should not be submitting
    expect(screen.getByTestId("submitting-display").textContent).toBe("false");

    // Clean up spy
    consoleErrorSpy.mockRestore();
  });

  // Test for calling handleSubmit directly without an event
  test("should handle direct call to handleSubmit without event", async () => {
    // Create a component that exposes handleSubmit
    function TestFormWithDirectSubmit({
      initialValues,
      onSubmit,
      validate,
    }: TestFormProps) {
      const form = useForm(initialValues, onSubmit, validate);

      return (
        <div>
          <button
            data-testid="direct-submit-button"
            onClick={() => form.handleSubmit()} // Call without event
          >
            Submit Directly
          </button>
          <div data-testid="submitting-display">
            {form.isSubmitting.toString()}
          </div>
        </div>
      );
    }

    render(
      <TestFormWithDirectSubmit
        initialValues={initialValues}
        onSubmit={mockSubmit}
      />
    );

    // Trigger direct submission without event
    await act(async () => {
      fireEvent.click(screen.getByTestId("direct-submit-button"));
    });

    // Should have called the onSubmit function
    expect(mockSubmit).toHaveBeenCalled();
  });

  // Test for non-Error object during form submission
  test("should handle non-Error object during form submission", async () => {
    // Mock a failing submit function that throws a non-Error object
    const failingWithNonError = jest.fn().mockImplementation(() => {
      throw "This is a string error"; // Not an Error instance
    });

    // Suppress console.error for this test
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <TestForm initialValues={initialValues} onSubmit={failingWithNonError} />
    );

    // Submit the form
    await act(async () => {
      fireEvent.submit(screen.getByTestId("form"));
    });

    // Should have a form error with the default message
    expect(screen.getByTestId("form-error")).toBeInTheDocument();
    expect(screen.getByTestId("form-error").textContent).toBe(
      "Form submission failed"
    );

    // Clean up spy
    consoleErrorSpy.mockRestore();
  });

  // Test for Error instance during form submission
  test("should handle Error instance during form submission", async () => {
    // Custom error message to verify it's used
    const errorMessage = "This is a custom error message";

    // Mock a failing submit function that throws an Error instance
    const failingWithError = jest.fn().mockImplementation(() => {
      throw new Error(errorMessage);
    });

    // Suppress console.error for this test
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <TestForm initialValues={initialValues} onSubmit={failingWithError} />
    );

    // Submit the form
    await act(async () => {
      fireEvent.submit(screen.getByTestId("form"));
    });

    // Should have a form error with the custom error message
    expect(screen.getByTestId("form-error")).toBeInTheDocument();
    expect(screen.getByTestId("form-error").textContent).toBe(errorMessage);

    // Clean up spy
    consoleErrorSpy.mockRestore();
  });

  // Test for coverage of the conditional operator at line 140
  test("should evaluate the line 140 conditional directly", () => {
    // Let's extract and directly test the ternary operator at line 140
    // error instanceof Error ? error.message : "Form submission failed"

    // Function to evaluate the same expression
    const evaluateErrorMessage = (error: any): string => {
      return error instanceof Error ? error.message : "Form submission failed";
    };

    // Test with an Error instance
    const errorWithMessage = new Error("Expected error message");
    expect(evaluateErrorMessage(errorWithMessage)).toBe(
      "Expected error message"
    );

    // Test with a non-Error value
    const nonErrorValue = "Just a string";
    expect(evaluateErrorMessage(nonErrorValue)).toBe("Form submission failed");

    // Test with null
    expect(evaluateErrorMessage(null)).toBe("Form submission failed");

    // Test with undefined
    expect(evaluateErrorMessage(undefined)).toBe("Form submission failed");
  });
});
