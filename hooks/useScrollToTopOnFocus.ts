import { useFocusEffect } from "expo-router";
import { useCallback, type RefObject } from "react";

interface Scrollable {
  scrollTo?: (options: { y: number; animated?: boolean }) => void;
}

export const useScrollToTopOnFocus = (ref: RefObject<Scrollable | null>) => {
  useFocusEffect(
    useCallback(() => {
      const timeoutId = setTimeout(() => {
        ref.current?.scrollTo?.({ y: 0, animated: false });
      }, 0);

      return () => {
        clearTimeout(timeoutId);
      };
    }, [ref])
  );
};
