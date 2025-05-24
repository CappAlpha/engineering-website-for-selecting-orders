import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { filtersActions } from "@/modules/Catalog/store/filtersSlice";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { Api } from "@/shared/services/apiClient";
import { getCachedData } from "@/shared/utils/getCacheData";

interface ReturnProps {
  tags: string[];
  selected: string[];
  loading: boolean;
  error: boolean;
  toggle: (id: string) => void;
}

const CACHE_KEY = "tagsData";
const CACHE_DURATION = 4 * 60 * 60 * 1000;

/**
 * Custom hook to fetch and manage tags with caching and sorting.
 * @param sortedToTop - if true, selected tags are moved to the top of the list.
 * @returns tags, selected tags, loading & error states, and a toggle function.
 */
export const useTags = (sortedToTop = false): ReturnProps => {
  const dispatch = useDispatch();
  const selected = useAppSelector((state) => state.filters.selectedTags);

  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTags = async () => {
    const cachedTags = getCachedData<string>(CACHE_KEY, CACHE_DURATION);
    if (cachedTags) {
      setTags(cachedTags);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    try {
      const response = await Api.tags.getAll(controller.signal);
      setTags(response);

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ items: response, timestamp: Date.now() }),
      );
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        (err.name === "CanceledError" || err.message.includes("canceled"))
      ) {
        return;
      }
      console.error("Error fetching tags:", err);
      setTags([]);
      setError(true);
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  };

  useEffect(() => {
    fetchTags();
  }, []);

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
