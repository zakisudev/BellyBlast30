import { useFeedbackStore } from "@/store/feedbackStore";

export const useAppFeedback = () => {
  const show = useFeedbackStore((state) => state.show);
  const hide = useFeedbackStore((state) => state.hide);

  return {
    show,
    hide,
    showSuccess: (message: string) => show(message, "success"),
    showError: (message: string) => show(message, "error"),
    showInfo: (message: string) => show(message, "info")
  };
};
