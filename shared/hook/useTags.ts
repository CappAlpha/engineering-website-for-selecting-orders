import { useEffect, useMemo, useState } from "react";

import { Api } from "../services/apiClient";
import { useSet } from "./useSet";

interface ReturnProps {
  items: string[];
  selected: Set<string>;
  loading: boolean;
  error: boolean;
  toggle: (id: string) => void;
  clear: () => void;
}

export const useTags = (
  setIsReset: (value: boolean) => void,
  sortedToTop?: boolean,
): ReturnProps => {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, { toggle, clear }] = useSet<string>([]);

  const fetchTags = async (signal: AbortSignal) => {
    try {
      const response = await Api.tags.getAll(signal);
      setItems(response);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error.name === "CanceledError" || error.message.includes("canceled"))
      ) {
        return;
      }
      console.error("Ошибка при запросе тегов:", error);
      setIsReset(true);
      setItems([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchTags(signal);

    return () => controller.abort();
  }, []);

  const sortedTags = useMemo(() => {
    if (!sortedToTop) return items;
    return [...items].sort((a, b) => {
      const aSelected = selected.has(a) ? -1 : 1;
      const bSelected = selected.has(b) ? -1 : 1;
      return aSelected - bSelected;
    });
  }, [items, selected, sortedToTop]);

  return { items: sortedTags, loading, error, toggle, clear, selected };
};
