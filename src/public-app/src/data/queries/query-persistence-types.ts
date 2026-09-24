import type { DehydratedState } from '@tanstack/react-query';

export type PersistedQueryClient = {
  timestamp: number;
  buster: string;
  clientState: DehydratedState;
};
