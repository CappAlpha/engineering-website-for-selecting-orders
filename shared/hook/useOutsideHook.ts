import { RefObject, useEffect } from "react";

import { useLatest } from "./useLatest";

interface UseOutsideClick<T extends HTMLElement = HTMLDivElement> {
  elementRef: RefObject<T | null>;
  handler: (e: MouseEvent) => void;
  attached?: boolean;
}

export const useOutsideClick = <T extends HTMLElement = HTMLDivElement>({
  elementRef,
  handler,
  attached = true,
}: UseOutsideClick<T>) => {
  const latestHandler = useLatest(handler);

  useEffect(() => {
    if (!attached) return;

    const handleClick = (e: MouseEvent) => {
      if (!elementRef.current) return;
      if (!elementRef.current.contains(e.target as Node)) {
        latestHandler.current(e);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [elementRef, latestHandler, attached]);
};
