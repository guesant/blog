export const navigationProgressState: {
  fallbackTimer: ReturnType<typeof setTimeout> | undefined;
  active: boolean;
} = {
  fallbackTimer: undefined,
  active: false,
};
