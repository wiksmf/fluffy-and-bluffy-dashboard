import { useEffect, useRef, useCallback } from "react";

interface UseOutsideClickOptions {
  listenCapturing?: boolean;
  enableEscape?: boolean;
  disabled?: boolean;
}

const DEFAULT_OPTIONS: UseOutsideClickOptions = {
  listenCapturing: true,
  enableEscape: true,
  disabled: false,
};

export function useOutsideClick<T extends HTMLElement = HTMLElement>(
  handler: () => void,
  options?: UseOutsideClickOptions
) {
  const { listenCapturing, enableEscape, disabled } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };
  const ref = useRef<T | null>(null);

  const stableHandler = useCallback(() => handler(), [handler]);

  useEffect(() => {
    if (disabled) return;

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        stableHandler();
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (enableEscape && e.key === "Escape") {
        stableHandler();
      }
    };

    document.addEventListener("click", handleClick, listenCapturing);

    if (enableEscape) {
      document.addEventListener("keydown", handleKeydown);
    }

    return () => {
      document.removeEventListener("click", handleClick, listenCapturing);
      if (enableEscape) {
        document.removeEventListener("keydown", handleKeydown);
      }
    };
  }, [stableHandler, listenCapturing, enableEscape, disabled]);

  return ref;
}
