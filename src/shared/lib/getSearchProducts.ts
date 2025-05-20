import { Product } from "@prisma/client";

import { Api } from "../services/apiClient";

export const getSearchProducts = async (
  setLoading: (loading: boolean) => void,
  setError: (error: boolean) => void,
  setProducts: (products: Product[]) => void,
  debouncedSearchQuery: string,
) => {
  setLoading(true);
  setError(false);

  const controller = new AbortController();

  try {
    const response = await Api.products.search(
      debouncedSearchQuery,
      controller.signal,
    );
    setProducts(response);
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
