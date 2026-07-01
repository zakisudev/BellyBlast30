export const ONBOARDING_COMPLETED_KEY = "bellyblast30:onboarding-completed";

let completedInSession = false;

export const markOnboardingCompletedInSession = () => {
  completedInSession = true;
};

export const isOnboardingCompletedInSession = () => completedInSession;
