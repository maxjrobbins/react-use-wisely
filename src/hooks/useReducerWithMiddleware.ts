// Enhanced useReducer with middleware support
import {
  useReducer,
  useRef,
  useCallback,
  useEffect,
  Reducer,
  Dispatch,
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
 * Hook that enhances useReducer with middleware
 * @template S State type
 * @template A Action type
 * @param reducer - The reducer function
 * @param initialState - Initial state
 * @param middlewareFn - Middleware function
 * @returns [state, dispatch] - State and dispatch function
 */
const useReducerWithMiddleware = <S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  middlewareFn?: Middleware<S, A>
): [S, Dispatch<A>] => {
  // Create a memoized version of the reducer that updates our ref
  const reducerWithRef = useCallback(
    (state: S, action: A): S => {
      const newState = reducer(state, action);
      return newState;
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
      if (middlewareFn) {
        // Always use the most up-to-date state from the ref
        const next = (nextAction: A) => {
          originalDispatch(nextAction);
        };

        middlewareFn(stateRef.current, action, next);
      } else {
        originalDispatch(action);
      }
    },
    [middlewareFn, originalDispatch]
  );

  return [state, dispatch];
};

export default useReducerWithMiddleware;
