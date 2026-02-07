/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useMemo } from "react";
import { debounce } from "../utils/debounce";

// ✅ FIX: Permitir qualquer função, não só unknown
type AnyFunction = (...args: any[]) => any;

interface DebounceOptions {
  leading?: boolean;
  maxWait?: number;
}

export function useDebounce<T extends AnyFunction>(
  callback: T,
  delay: number,
  options?: DebounceOptions,
) {
  // ✅ FIX: Inicializar com valor
  const callbackRef = useRef<T>(callback);
  const debouncedRef = useRef<ReturnType<typeof debounce<T>> | undefined>(
    undefined,
  );

  // ✅ FIX: Atualizar ref dentro de useEffect
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cria/atualiza debounce
  useEffect(() => {
    debouncedRef.current = debounce(
      ((...args: Parameters<T>) => callbackRef.current(...args)) as T,
      delay,
      options,
    );

    return () => debouncedRef.current?.cancel();
  }, [delay, options]);

  // Retorna objeto literal simples
  return useMemo(
    () => ({
      execute: (...args: Parameters<T>) => {
        return debouncedRef.current?.(...args);
      },
      cancel: () => {
        debouncedRef.current?.cancel();
      },
      flush: () => {
        debouncedRef.current?.flush();
      },
    }),
    [],
  );
}
