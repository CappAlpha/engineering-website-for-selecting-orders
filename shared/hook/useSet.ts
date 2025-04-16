import { useState, useMemo } from "react";

export function useSet<T>(initialValue?: Iterable<T>) {
  const [set, setSet] = useState<Set<T>>(new Set(initialValue));

  const actions = useMemo(
    () => ({
      add: (item: T) => {
        setSet((prevSet) => {
          if (prevSet.has(item)) return prevSet;
          return new Set([...prevSet, item]);
        });
      },

      remove: (item: T) => {
        setSet((prevSet) => {
          if (!prevSet.has(item)) return prevSet;
          const newSet = new Set(prevSet);
          newSet.delete(item);
          return newSet;
        });
      },

      toggle: (item: T) => {
        setSet((prevSet) => {
          const newSet = new Set(prevSet);
          if (newSet.has(item)) {
            newSet.delete(item);
          } else {
            newSet.add(item);
          }
          return newSet;
        });
      },

      clear: () => {
        setSet(new Set());
      },

      has: (item: T) => {
        return set.has(item);
      },
    }),
    [set]
  );

  return [set, actions] as const;
}