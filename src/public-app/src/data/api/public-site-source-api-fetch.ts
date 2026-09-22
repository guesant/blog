const publicApiRequestTimeoutMs = 1500;

export async function fetchPublicApiWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const timeoutController = new AbortController();

  const timeout = setTimeout(() => timeoutController.abort(), publicApiRequestTimeoutMs);

  const requestSignal = init?.signal ?? (input instanceof Request ? input.signal : undefined);

  const signal = requestSignal
    ? AbortSignal.any([requestSignal, timeoutController.signal])
    : timeoutController.signal;

  try {
    return await fetch(input, { ...init, signal });
  } finally {
    clearTimeout(timeout);
  }
}
