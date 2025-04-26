import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Api } from "@/services/apiClient";
import { selectSelectedTags } from "@/store/filters/filtersSelectors";
import { filtersActions } from "@/store/filters/filtersSlice";

interface ReturnProps {
  items: string[];
  selected: Set<string>;
  loading: boolean;
  error: boolean;
  toggle: (id: string) => void;
}

export const useTags = (sortedToTop?: boolean): ReturnProps => {
  const dispatch = useDispatch();
  const selected = useSelector(selectSelectedTags);
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTags = async (signal: AbortSignal) => {
    try {
      const cachedData = localStorage.getItem("tagsData");
      if (cachedData) {
        const { tags, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < 86400000) {
          setItems(tags);
          setLoading(false);
          return;
        }
      }

      const response = await Api.tags.getAll(signal);
      const responseToLocal = JSON.stringify({
        tags: response,
        timestamp: Date.now(),
      });

      setItems(response);
      localStorage.setItem("tagsData", responseToLocal);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error.name === "CanceledError" || error.message.includes("canceled"))
      ) {
        return;
      }
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

  const toggle = (id: string) => {
    dispatch(filtersActions.toggleTag(id));
  };

  return { items: sortedTags, selected, loading, error, toggle };
};
