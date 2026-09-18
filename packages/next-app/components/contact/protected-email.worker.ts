import type { ProtectedEmailChallenge } from '@portfolio/content/protected-email';
import { solveEmailChallenge } from '@portfolio/content/protected-email';

export type ProtectedEmailWorkerResponse = { ok: true; email: string } | { ok: false };

self.onmessage = async (event: MessageEvent<ProtectedEmailChallenge>) => {
  try {
    const email = await solveEmailChallenge(event.data);
    const response: ProtectedEmailWorkerResponse = { ok: true, email };
    self.postMessage(response);
  } catch {
    const response: ProtectedEmailWorkerResponse = { ok: false };
    self.postMessage(response);
  }
};
