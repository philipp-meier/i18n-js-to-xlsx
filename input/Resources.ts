export interface IResources {
  Start: {
    WelcomeTitle: string;
  };
  Navigation: {
    Previous: string;
    Next: string;
  };
  Actions: {
    Apply: string;
    Back: string;
  };
  Questions: {
    ConfirmDeleteItem(itemName: string): string;
  };
  Loading: string;
}
