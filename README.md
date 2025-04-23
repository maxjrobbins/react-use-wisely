# Use Wisely

A collection of useful React hooks for common tasks.

## Installation

```bash
npm install use-wisely
# or
yarn add use-wisely
```

## Available Hooks

### useAsync

Hook for handling asynchronous operations with loading, error, and success states.

```jsx
import { useAsync } from 'use-wisely';

const MyComponent = () => {
  const fetchData = async () => {
    const response = await fetch('https://api.example.com/data');
    return response.json();
  };

  const { execute, status, value, error, isLoading } = useAsync(fetchData);

  return (
    <div>
      <button onClick={execute} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Fetch Data'}
      </button>
      
      {status === 'success' && <div>Data: {JSON.stringify(value)}</div>}
      {status === 'error' && <div>Error: {error.message}</div>}
    </div>
  );
};
```

### useLocalStorage

Hook for persisting state to localStorage.

```jsx
import { useLocalStorage } from 'use-wisely';

const MyComponent = () => {
  const [name, setName] = useLocalStorage('name', 'Guest');

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};
```

### useDebounce

Hook for debouncing value changes.

```jsx
import { useDebounce } from 'use-wisely';

const MyComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Effect runs when debouncedSearchTerm changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      searchApi(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

### useMedia

Hook for responsive design with media queries.

```jsx
import { useMedia } from 'use-wisely';

const MyComponent = () => {
  const isMobile = useMedia('(max-width: 768px)');

  return (
    <div>
      {isMobile ? 'Mobile View' : 'Desktop View'}
    </div>
  );
};
```

### useClickOutside

Hook for detecting clicks outside a specified element.

```jsx
import { useState } from 'react';
import { useClickOutside } from 'use-wisely';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));
  
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Menu</button>
      {isOpen && (
        <div ref={ref}>
          Click outside to close this
        </div>
      )}
    </div>
  );
};
```

### useWindowSize

Track browser window size.

```jsx
const MyComponent = () => {
  const { width, height } = useWindowSize();
  
  return (
    <div>
      <p>Window width: {width}px</p>
      <p>Window height: {height}px</p>
    </div>
  );
};
```

### useForm

Simple form handling.

```jsx
const SignupForm = () => {
  const validate = (values) => {
    const errors = {};
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    return errors;
  };
  
  const onSubmit = (values, resetForm) => {
    console.log('Form submitted with values:', values);
    // API call would go here
    resetForm();
  };
  
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(
    { email: '', password: '' },
    onSubmit,
    validate
  );
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.email && errors.email && <div>{errors.email}</div>}
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.password && errors.password && <div>{errors.password}</div>}
      </div>
      
      <button type="submit">Sign Up</button>
    </form>
  );
};
```

### usePrevious

Hook for getting the previous value of a state or prop.

```jsx
const Counter = () => {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  
  return (
    <div>
      <p>Current: {count}, Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

## License

MIT License

Copyright (c) 2025 Max Robbins

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
