import { useEffect, useMemo, useState } from "react";

import { Api } from "../services/api-client";
import { useSet } from "./useSet";

interface ReturnProps {
  items: string[];
  loading: boolean;
  error: boolean;
  selected: Set<string>;
  toggle: (id: string) => void;
}

export const useTags = (sortedToTop?: boolean): ReturnProps => {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, { toggle }] = useSet<string>([]);

  const fetchTags = async (signal: AbortSignal) => {
    try {
      const response = await Api.tags.getAll(signal);
      setItems(response);
    } catch (error) {
      console.error("Ошибка при запросе тегов:", error);
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
  }, []);

  const sortedTags = useMemo(() => {
    if (!sortedToTop) return items;
    return [...items].sort((a, b) => {
      const aSelected = selected.has(a) ? -1 : 1;
      const bSelected = selected.has(b) ? -1 : 1;
      return aSelected - bSelected;
    });
  }, [items, selected, sortedToTop]);

  return { items: sortedTags, loading, error, toggle, selected };
};
