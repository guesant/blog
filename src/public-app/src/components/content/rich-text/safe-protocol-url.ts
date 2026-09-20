const safeProtocols = new Set(['http:', 'https:', 'mailto:', 'tel:']);

export function safeProtocolUrl(url: string): string | undefined {
  try {
    return safeProtocols.has(new URL(url).protocol) ? url : undefined;
  } catch {
    return undefined;
  }
}
