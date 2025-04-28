import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Api } from "@/services/apiClient";
import { filtersActions } from "@/store/filters/filtersSlice";
import { getCachedData } from "@/utils/getCacheData";

import { useAppSelector } from "./useAppSelector";

interface ReturnProps {
  tags: string[];
  selected: string[];
  loading: boolean;
  error: boolean;
  toggle: (id: string) => void;
}

const CACHE_KEY = "tagsData";
const CACHE_DURATION = 4 * 60 * 60 * 1000;

export const useTags = (sortedToTop = false): ReturnProps => {
  const dispatch = useDispatch();
  const selected = useAppSelector((state) => state.filters.selectedTags);

  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTags = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError(false);

    const cachedTags = getCachedData<string>(CACHE_KEY, CACHE_DURATION);
    if (cachedTags) {
      setTags(cachedTags);
      setLoading(false);
      return;
    }

    try {
      const response = await Api.tags.getAll(signal);
      setTags(response);

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ tags: response, timestamp: Date.now() }),
      );
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        (err.name === "CanceledError" || err.message.includes("canceled"))
      ) {
        return;
      }
      console.error("Ошибка при запросе тегов:", err);
      setTags([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchTags(controller.signal);

    return () => controller.abort();
  }, [fetchTags]);

  // Sort tags - selected tag move to top
  const sortedTags = sortedToTop
    ? [...tags].sort((a, b) => {
        const aSelected = selected.includes(a);
        const bSelected = selected.includes(b);

        if (aSelected === bSelected) return 0;
        return aSelected ? -1 : 1;
      })
    : tags;

  const toggle = (id: string) => {
    dispatch(filtersActions.toggleTag(id));
  };

  return { tags: sortedTags, selected, loading, error, toggle };
};
