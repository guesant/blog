import type { SettleReveal } from './types';

export function handleRevealError(settle: SettleReveal, worker: Worker) {
  settle('error', '');
  worker.terminate();
}
