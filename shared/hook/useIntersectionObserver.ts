import { useCallback, useEffect, useRef, useState } from "react";

interface UseIntersectionObserverProps {
  threshold: number | number[];
  callback?: (isIntersecting: boolean) => void;
}

export const useIntersectionObserver = ({
  threshold,
  callback,
}: UseIntersectionObserverProps) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (node) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            const isIntersecting = entry.isIntersecting;
            setIsIntersecting((prev) => {
              if (prev !== isIntersecting) {
                return isIntersecting;
              }
              return prev;
            });
            if (callback) {
              callback(isIntersecting);
            }
          },
          { threshold },
        );

        observer.observe(node);
        observerRef.current = observer;
      }
    },
    [threshold, callback],
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  return { isIntersecting, ref: setRef };
};
