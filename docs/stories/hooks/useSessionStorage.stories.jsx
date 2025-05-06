import React, { useState, useEffect } from "react";
import useSessionStorage from "../../../src/hooks/useSessionStorage";

export default {
  title: "Hooks/useSessionStorage",
  parameters: {
    docs: {
      description: {
        component: `
\`useSessionStorage\` is a custom React hook that provides a way to persist state in browser \`sessionStorage\`.
Unlike \`localStorage\`, data stored in \`sessionStorage\` is cleared when the page session ends (when the tab is closed).

### Features

- Persists state across page refreshes within the same session
- Type-safe with full TypeScript support
- Handles serialization and deserialization of complex data types
- Functional updates similar to React's \`useState\`
- Sync state across browser tabs/windows
- Error handling and support detection for environments without \`sessionStorage\`
- SSR compatible
        `,
      },
    },
  },
};

// Basic usage example
export const BasicUsage = () => {
  const { value, setValue, isSupported, error } = useSessionStorage(
    "basic-demo",
    "Initial value"
  );

  return (
    <div className="story-container">
      <h2>Basic Usage</h2>
      <div className="mb-4">
        <p>
          Current value: <strong>{value}</strong>
        </p>
        <p>
          Storage supported: <strong>{isSupported ? "Yes" : "No"}</strong>
        </p>
        {error && (
          <div className="error">
            <p>Error: {error.message}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setValue("Updated value")}
        >
          Set New Value
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => setValue("Initial value")}
        >
          Reset Value
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p className="text-sm">
          <em>
            Note: Refresh the page to see that the value persists in
            sessionStorage
          </em>
        </p>
      </div>
    </div>
  );
};

// Counter example with numeric data
export const NumericCounter = () => {
  const { value, setValue, isSupported, error } = useSessionStorage(
    "counter-demo",
    0
  );

  return (
    <div className="story-container">
      <h2>Numeric Counter Example</h2>
      <div className="mb-4">
        <p>
          Counter value: <strong>{value}</strong>
        </p>
        <p>
          Storage supported: <strong>{isSupported ? "Yes" : "No"}</strong>
        </p>
        {error && (
          <div className="error">
            <p>Error: {error.message}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setValue((prevValue) => prevValue + 1)}
        >
          Increment
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setValue((prevValue) => prevValue - 1)}
        >
          Decrement
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => setValue(0)}
        >
          Reset
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p className="text-sm">
          <em>
            Note: This example demonstrates functional updates (similar to
            React's useState). The counter persists across page refreshes.
          </em>
        </p>
      </div>
    </div>
  );
};

// Complex object example
export const ComplexObject = () => {
  const initialTodos = [
    { id: 1, text: "Learn React", completed: true },
    { id: 2, text: "Build a project", completed: false },
  ];

  const {
    value: todos,
    setValue: setTodos,
    isSupported,
    error,
  } = useSessionStorage("todos-demo", initialTodos);

  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (!newTodo.trim()) return;

    setTodos((prevTodos) => [
      ...prevTodos,
      {
        id: Date.now(),
        text: newTodo,
        completed: false,
      },
    ]);

    setNewTodo("");
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="story-container">
      <h2>Complex Object Example (Todo List)</h2>
      <div className="mb-4">
        <p>
          Storage supported: <strong>{isSupported ? "Yes" : "No"}</strong>
        </p>
        {error && (
          <div className="error">
            <p>Error: {error.message}</p>
          </div>
        )}
      </div>

      <div className="mb-4 flex">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="px-2 py-1 border rounded mr-2 flex-grow"
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={addTodo}
        >
          Add
        </button>
      </div>

      <ul className="list-disc pl-5">
        {todos.map((todo) => (
          <li key={todo.id} className="mb-2 flex items-center justify-between">
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
              onClick={() => toggleTodo(todo.id)}
              className="cursor-pointer flex-grow"
            >
              {todo.text}
            </span>
            <button
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => setTodos(initialTodos)}
        >
          Reset Todos
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p className="text-sm">
          <em>
            Note: This example demonstrates storing and manipulating complex
            objects (arrays of objects). Changes persist across page refreshes.
          </em>
        </p>
      </div>
    </div>
  );
};

// Form state persistence example
export const FormPersistence = () => {
  const {
    value: formData,
    setValue: setFormData,
    isSupported,
    error,
  } = useSessionStorage("form-demo", {
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Form submitted with:\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`
    );
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="story-container">
      <h2>Form State Persistence</h2>
      <div className="mb-4">
        <p>
          Storage supported: <strong>{isSupported ? "Yes" : "No"}</strong>
        </p>
        {error && (
          <div className="error">
            <p>Error: {error.message}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block mb-1">
            Message:
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows="4"
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded"
            onClick={resetForm}
          >
            Reset
          </button>
        </div>
      </form>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p className="text-sm">
          <em>
            Note: Start filling out the form, then refresh the page. Your form
            inputs will be preserved across page refreshes.
          </em>
        </p>
      </div>
    </div>
  );
};

// Cross-tab synchronization example
export const CrossTabSync = () => {
  const { value, setValue, isSupported, error } = useSessionStorage(
    "sync-demo",
    "Initial value"
  );
  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString()
  );

  // Update the lastUpdated timestamp whenever the value changes
  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, [value]);

  return (
    <div className="story-container">
      <h2>Cross-Tab Synchronization</h2>
      <div className="mb-4">
        <p>
          Current value: <strong>{value}</strong>
        </p>
        <p>
          Last updated: <strong>{lastUpdated}</strong>
        </p>
        <p>
          Storage supported: <strong>{isSupported ? "Yes" : "No"}</strong>
        </p>
        {error && (
          <div className="error">
            <p>Error: {error.message}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() =>
            setValue(`Value updated at ${new Date().toLocaleTimeString()}`)
          }
        >
          Update Value
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => setValue("Initial value")}
        >
          Reset Value
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p className="text-sm">
          <em>
            Open this page in multiple tabs or windows. When you update the
            value in one tab, the changes will be synchronized to the other
            tabs.
          </em>
        </p>
      </div>
    </div>
  );
};

// Error handling example
export const ErrorHandling = () => {
  // Simulate a very large object that might exceed storage limits
  const createLargeObject = () => {
    const obj = {};
    // Create a string that's approximately 5MB (this will exceed limits on most browsers)
    const largeString = new Array(5 * 1024 * 1024).fill("a").join("");
    obj.data = largeString;
    return obj;
  };

  const { value, setValue, isSupported, error } = useSessionStorage(
    "error-demo",
    "Small value"
  );

  const triggerError = () => {
    try {
      setValue(createLargeObject());
    } catch (e) {
      console.error("Error in component:", e);
    }
  };

  return (
    <div className="story-container">
      <h2>Error Handling</h2>
      <div className="mb-4">
        <p>
          Current value: {typeof value === "string" ? value : "[Large Object]"}
        </p>
        <p>
          Storage supported: <strong>{isSupported ? "Yes" : "No"}</strong>
        </p>
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 rounded mb-4">
            <p className="text-red-700">
              <strong>Error detected:</strong> {error.message}
            </p>
            {error.cause && (
              <p className="text-red-600 text-sm mt-1">
                Cause: {error.cause.toString()}
              </p>
            )}
            {error.metadata && (
              <pre className="text-xs mt-2 overflow-auto">
                {JSON.stringify(error.metadata, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={triggerError}
        >
          Trigger Storage Error
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => setValue("Small value")}
        >
          Reset Value
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p className="text-sm">
          <em>
            This example demonstrates error handling when trying to store
            excessively large data that might exceed the browser's storage
            limits. The hook will catch the error and make it available through
            the error property.
          </em>
        </p>
      </div>
    </div>
  );
};
