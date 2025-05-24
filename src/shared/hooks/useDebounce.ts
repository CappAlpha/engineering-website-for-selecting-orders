import { useEffect, useRef, useState } from "react";

interface DebounceOptions {
  leading?: boolean; // Выполнять ли сразу при первом вызове
  trailing?: boolean; // Выполнять ли после задержки
}

export function useDebounce<T>(
  value: T,
  delay: number,
  options: DebounceOptions = {},
): T {
  const { leading = false, trailing = true } = options;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstUpdate = useRef(true);

  useEffect(() => {
    if (isFirstUpdate.current && leading) {
      isFirstUpdate.current = false;
      setDebouncedValue(value);
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (trailing) {
        setDebouncedValue(value);
      }
      timerRef.current = null;
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay, leading, trailing]);

  return debouncedValue;
}

// Хук useDebouncedCallback для функций
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: DebounceOptions = {},
): T {
  const { leading = false, trailing = true } = options;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstUpdate = useRef(true);

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const debouncedCallback = (...args: Parameters<T>) => {
    if (isFirstUpdate.current && leading) {
      isFirstUpdate.current = false;
      callbackRef.current(...args);
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (trailing) {
        callbackRef.current(...args);
      }
      timerRef.current = null;
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return debouncedCallback as T;
}
