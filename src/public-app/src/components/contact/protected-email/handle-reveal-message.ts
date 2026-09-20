import type { ProtectedEmailWorkerResponse } from '../protected-email.worker';
import type { SettleReveal } from './types';

export function handleRevealMessage(
  settle: SettleReveal,
  worker: Worker,
  event: MessageEvent<ProtectedEmailWorkerResponse>,
) {
  const response = event.data;

  settle(response.ok ? 'revealed' : 'error', response.ok ? response.email : '');
  worker.terminate();
}
