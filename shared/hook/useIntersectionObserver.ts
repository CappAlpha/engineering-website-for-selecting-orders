import { useEffect, useRef, useState, useCallback, useMemo } from "react";

type State = {
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

type UseIntersectionObserverOptions = {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
  initialIsIntersecting?: boolean;
};

type IntersectionReturn = [
  (node?: Element | null) => void,
  boolean,
  IntersectionObserverEntry | undefined,
] & {
  ref: (node?: Element | null) => void;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false,
  initialIsIntersecting = false,
}: UseIntersectionObserverOptions = {}): IntersectionReturn {
  const [ref, setRefState] = useState<Element | null>(null);

  const [state, setState] = useState<State>({
    isIntersecting: initialIsIntersecting,
    entry: undefined,
  });

  const frozen = state.entry?.isIntersecting && freezeOnceVisible;

  const thresholdArray = useMemo(
    () => (Array.isArray(threshold) ? threshold : [threshold]),
    [threshold],
  );

  const setRef = useCallback((node?: Element | null) => {
    setRefState(node ?? null);
  }, []);

  useEffect(() => {
    if (!ref) return;
    if (typeof window === "undefined") return; // SSR check
    if (!("IntersectionObserver" in window)) return;
    if (frozen) return;

    let unobserve = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting =
            entry.isIntersecting &&
            thresholdArray.some(
              (threshold) => entry.intersectionRatio >= threshold,
            );

          setState({ isIntersecting, entry });

          if (isIntersecting && freezeOnceVisible && !unobserve) {
            observer.unobserve(entry.target);
            unobserve = true;
          }
        });
      },
      { threshold: thresholdArray, root, rootMargin },
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, root, rootMargin, frozen, freezeOnceVisible, thresholdArray]);

  const prevRef = useRef<Element | null>(null);
  useEffect(() => {
    if (
      !ref &&
      state.entry?.target &&
      !freezeOnceVisible &&
      !frozen &&
      prevRef.current !== state.entry.target
    ) {
      prevRef.current = state.entry.target;
      setState({ isIntersecting: initialIsIntersecting, entry: undefined });
    }
  }, [ref, state.entry, freezeOnceVisible, frozen, initialIsIntersecting]);

  const result = [
    setRef,
    state.isIntersecting,
    state.entry,
  ] as IntersectionReturn;

  result.ref = setRef;
  result.isIntersecting = state.isIntersecting;
  result.entry = state.entry;

  return result;
}
