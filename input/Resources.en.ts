import { IResources } from "./Resources";

export const ResourcesEN: IResources = {
  Start: {
    WelcomeTitle: "Welcome",
  },
  Navigation: {
    Previous: "Previous",
    Next: "Next",
  },
  Actions: {
    Apply: "Apply",
    Back: "Back",
  },
  Questions: {
    ConfirmDeleteItem: (itemName: string): string =>
      `Do you really want to delete "${itemName}"?`,
  },
  Loading: "Loading",
};
