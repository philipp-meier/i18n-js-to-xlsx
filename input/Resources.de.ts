import { IResources } from "./Resources";

export const ResourcesDE: IResources = {
  Start: {
    WelcomeTitle: "Willkommen",
  },
  Navigation: {
    Previous: "Zurück",
    Next: "Weiter",
  },
  Actions: {
    Apply: "Anwenden",
    Back: "Zurück",
  },
  Questions: {
    ConfirmDeleteItem: (itemName: string): string =>
      `Sind Sie sicher, dass Sie "${itemName}" löschen möchten?`,
  },
  Loading: "Wird geladen...",
};
