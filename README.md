```
# React Utility Hooks

A collection of useful React hooks for common tasks.

## Installation

```bash
npm install react-utility-hooks
# or
yarn add react-utility-hooks
```

## Available Hooks

### useAsync

Hook for handling asynchronous operations with loading, error, and success states.

```jsx
import { useAsync } from 'react-utility-hooks';

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
import { useLocalStorage } from 'react-utility-hooks';

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
import { useDebounce } from 'react-utility-hooks';

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
import { useMedia } from 'react-utility-hooks';

const MyComponent = () => {
  const isMobile = useMedia('(max-width: 768px)');

  return (
    <div>
      {isMobile ? 'Mobile View' : 'Desktop View'}
    </div>
  );
};
```

## License

MIT
```
