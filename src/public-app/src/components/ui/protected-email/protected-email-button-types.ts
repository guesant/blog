export type ProtectedEmailRevealedButtonProps = {
  email: string;
  label: string;
  showAddress: boolean;
  onReveal: () => void;
  ref?: (element: HTMLButtonElement | null) => void;
};

export type ProtectedEmailTriggerButtonProps = {
  busy: boolean;
  label: string;
  onReveal: () => void;
};
