interface CachedItems<T> {
  items: T[];
  timestamp: number;
}

export const getCachedData = <T>(
  cacheKey: string,
  cacheDuration?: number,
): T[] | null => {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const { items, timestamp }: CachedItems<T> = JSON.parse(cached);
    if (!cacheDuration) return items;
    if (Date.now() - timestamp < cacheDuration) return items;

    return null;
  } catch {
    return null;
  }
};
