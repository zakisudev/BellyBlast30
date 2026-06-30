import { create } from "zustand";

type FeedbackTone = "success" | "error" | "info";

interface FeedbackState {
  message: string;
  tone: FeedbackTone;
  visible: boolean;
  show: (message: string, tone?: FeedbackTone) => void;
  hide: () => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  message: "",
  tone: "info",
  visible: false,
  show: (message, tone = "info") => {
    set({ message, tone, visible: true });
  },
  hide: () => {
    set({ visible: false });
  }
}));
