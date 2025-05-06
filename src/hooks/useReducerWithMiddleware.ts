// Enhanced useReducer with middleware support
import {
  useReducer,
  useRef,
  useCallback,
  useEffect,
  Reducer,
  Dispatch,
  useState,
} from "react";

/**
 * Middleware function type
 * @template S State type
 * @template A Action type
 */
export type Middleware<S, A> = (
  state: S,
  action: A,
  next: (action: A) => void
) => void;

/**
 * Return type for useReducerWithMiddleware
 * @template S State type
 * @template A Action type
 */
export interface ReducerWithMiddlewareResult<S, A> {
  state: S;
  dispatch: Dispatch<A>;
  error: Error | null;
}

/**
 * Hook that enhances useReducer with middleware
 * @template S State type
 * @template A Action type
 * @param reducer - The reducer function
 * @param initialState - Initial state
 * @param middlewareFn - Middleware function
 * @returns Object containing state, dispatch function, and error
 */
const useReducerWithMiddleware = <S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  middlewareFn?: Middleware<S, A>
): ReducerWithMiddlewareResult<S, A> => {
  // Error state
  const [error, setError] = useState<Error | null>(null);

  // Create a memoized version of the reducer that updates our ref
  const reducerWithRef = useCallback(
    (state: S, action: A): S => {
      try {
        const newState = reducer(state, action);
        return newState;
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("An error occurred in the reducer")
        );
        return state;
      }
    },
    [reducer]
  );

  const [state, originalDispatch] = useReducer(reducerWithRef, initialState);

  // Store the latest state in a ref
  const stateRef = useRef<S>(state);

  // Update stateRef when state changes
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Create a stable dispatch function that doesn't change on rerenders
  const dispatch = useCallback(
    (action: A) => {
      try {
        if (middlewareFn) {
          // Always use the most up-to-date state from the ref
          const next = (nextAction: A) => {
            originalDispatch(nextAction);
          };

          middlewareFn(stateRef.current, action, next);
        } else {
          originalDispatch(action);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("An error occurred in the middleware")
        );
      }
    },
    [middlewareFn, originalDispatch]
  );

  return {
    state,
    dispatch,
    error,
  };
};

export default useReducerWithMiddleware;
