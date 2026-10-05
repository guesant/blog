export const navigationProgressState: {
  fallbackTimer: ReturnType<typeof setTimeout> | undefined;
  active: boolean;
  bodyOverflow: string;
  documentOverflow: string;
} = {
  fallbackTimer: undefined,
  active: false,
  bodyOverflow: '',
  documentOverflow: '',
};
