import React from "react";
import useForm from "../../../src/hooks/useForm";

export default {
  title: "Hooks/useForm",
  parameters: {
    componentSubtitle: "Hook for managing form state and validation",
    docs: {
      description: {
        component:
          "A React hook that handles form state, validation, and submission with a simple API.",
      },
    },
  },
};

export const Default = () => {
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Name is required";
    }

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is invalid";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const onSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useForm({
      initialValues,
      validate,
      onSubmit,
    });

  const getFieldStyle = (fieldName) => {
    return {
      borderColor: touched[fieldName] && errors[fieldName] ? "#ff0000" : "#ccc",
      padding: "8px",
      marginTop: "4px",
      width: "100%",
      borderRadius: "4px",
      border: "1px solid",
    };
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h3>Form Management Demo</h3>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="name" style={{ display: "block" }}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            style={getFieldStyle("name")}
          />
          {touched.name && errors.name && (
            <div
              style={{ color: "#ff0000", fontSize: "14px", marginTop: "4px" }}
            >
              {errors.name}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email" style={{ display: "block" }}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            style={getFieldStyle("email")}
          />
          {touched.email && errors.email && (
            <div
              style={{ color: "#ff0000", fontSize: "14px", marginTop: "4px" }}
            >
              {errors.email}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password" style={{ display: "block" }}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            style={getFieldStyle("password")}
          />
          {touched.password && errors.password && (
            <div
              style={{ color: "#ff0000", fontSize: "14px", marginTop: "4px" }}
            >
              {errors.password}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="confirmPassword" style={{ display: "block" }}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            style={getFieldStyle("confirmPassword")}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <div
              style={{ color: "#ff0000", fontSize: "14px", marginTop: "4px" }}
            >
              {errors.confirmPassword}
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>

      <div style={{ marginTop: "30px" }}>
        <h4>Form State:</h4>
        <pre
          style={{
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {JSON.stringify({ values, errors, touched }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

Default.storyName = "Basic Usage";
