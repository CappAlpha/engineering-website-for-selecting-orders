import { useDispatch } from "react-redux";

import { filtersActions } from "@/modules/Catalog/store/filtersSlice";
import { useGetProductsTagsQuery } from "@/shared/api/client/productsTagsQuery";
import { useAppSelector } from "@/shared/hooks/useAppSelector";

import { resetChanged } from "../services/resetChanged";

interface ReturnProps {
  tags: string[];
  selected: string[];
  loading: boolean;
  error: boolean;
  toggle: (id: string) => void;
}

/**
 * Custom hook to fetch and manage tags with caching and sorting.
 * @param sortedToTop - if true, selected tags are moved to the top of the list.
 * @returns tags, selected tags, loading & error states, and a toggle function.
 */
export const useTags = (sortedToTop = false): ReturnProps => {
  const dispatch = useDispatch();
  const selected = useAppSelector((state) => state.filters.selectedTags);

  const {
    data: tags = [],
    isLoading: loading,
    isError: error,
  } = useGetProductsTagsQuery();

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
    resetChanged(dispatch);
  };

  return { tags: sortedTags, selected, loading, error, toggle };
};
