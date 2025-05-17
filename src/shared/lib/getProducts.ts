import { Product } from "@prisma/client";

import { Api } from "../services/apiClient";
import { getCachedData } from "./getCacheData";

const CACHE_KEY = "searchHeaderData";
const CACHE_DURATION = 4 * 60 * 60 * 1000;

export const getProducts = async (
  setLoading: (loading: boolean) => void,
  setError: (error: boolean) => void,
  setProducts: (products: Product[]) => void,
  debouncedSearchQuery: string,
) => {
  setLoading(true);
  setError(false);

  const cached = getCachedData<Product>(CACHE_KEY, CACHE_DURATION);
  if (cached) {
    setProducts(cached);
    setLoading(false);
    return;
  }

  const controller = new AbortController();

  try {
    const response = await Api.products.search(
      debouncedSearchQuery,
      controller.signal,
    );
    setProducts(response);

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
    console.error("Error searching products:", err);
    setProducts([]);
    setError(true);
  } finally {
    setLoading(false);
  }

  return () => controller.abort();
};
