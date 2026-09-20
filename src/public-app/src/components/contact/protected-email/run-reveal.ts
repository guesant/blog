import type { ProtectedEmailChallenge } from '@portfolio/data/domain/protected-email';
import { handleRevealError } from './handle-reveal-error';
import { handleRevealMessage } from './handle-reveal-message';
import type { SettleReveal } from './types';

export function runReveal(challenge: ProtectedEmailChallenge, settle: SettleReveal) {
  let worker: Worker;

  try {
    worker = new Worker(new URL('../protected-email.worker.ts', import.meta.url));
  } catch {
    settle('error', '');
    return;
  }

  worker.onmessage = handleRevealMessage.bind(null, settle, worker);
  worker.onerror = handleRevealError.bind(null, settle, worker);

  worker.postMessage(challenge);
}
