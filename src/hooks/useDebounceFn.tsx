import { useEffect, useMemo, useRef } from "react";
import { debounce } from "lodash";

/**
 * A custom hook that debounces any function.
 *
 * This hook takes a callback function and a delay time (in milliseconds) as parameters.
 * It returns a debounced version of the callback function that delays its execution until after
 * a specified delay has elapsed since the last time it was invoked.
 *
 * @template T A function type that extends a function with unknown arguments and void return type.
 * @param {T} callback The function to debounce.
 * @param {number} delay The number of milliseconds to delay the function call.
 * @returns A debounced version of the callback function.
 */
function useDebounce<T extends (...args: unknown[]) => void>(callback: T, delay: number) {
  const ref = useRef<() => void>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debounceCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, delay);
  }, [delay]);

  return debounceCallback;
}

export default useDebounce;
