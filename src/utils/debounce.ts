/* eslint-disable @typescript-eslint/no-explicit-any */
// ✅ FIX: Permitir any ao invés de unknown
type AnyFunction = (...args: any[]) => any;

type DebouncedFunction<T extends AnyFunction> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
};

interface DebounceOptions {
  leading?: boolean;
  maxWait?: number;
}

export function debounce<T extends AnyFunction>(
  fn: T,
  delay: number,
  options?: DebounceOptions,
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime: number | undefined;
  let lastArgs: Parameters<T> | undefined;

  const invokeFunction = (args: Parameters<T>) => {
    lastArgs = undefined;
    fn(...args);
  };

  const debouncedFn = (...args: Parameters<T>) => {
    const now = Date.now();
    lastArgs = args;

    // Leading edge execution
    if (options?.leading && !timeoutId) {
      invokeFunction(args);
    }

    // Max wait enforcement
    if (options?.maxWait && lastCallTime) {
      const timeSinceLastCall = now - lastCallTime;
      if (timeSinceLastCall >= options.maxWait) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = undefined;
        }
        invokeFunction(args);
        lastCallTime = now;
        return;
      }
    }

    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      if (lastArgs) {
        invokeFunction(lastArgs);
      }
      timeoutId = undefined;
      lastCallTime = undefined;
    }, delay);

    lastCallTime = now;
  };

  debouncedFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
      lastArgs = undefined;
      lastCallTime = undefined;
    }
  };

  debouncedFn.flush = () => {
    if (timeoutId && lastArgs) {
      clearTimeout(timeoutId);
      invokeFunction(lastArgs);
      timeoutId = undefined;
      lastCallTime = undefined;
    }
  };

  return debouncedFn;
}
