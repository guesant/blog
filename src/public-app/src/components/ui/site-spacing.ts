const spacingTokens: Record<number, string> = {
  0: '0',
  0.5: 'var(--site-space-1)',
  1: 'var(--site-space-2)',
  1.5: 'var(--site-space-3)',
  2: 'var(--site-space-4)',
  2.5: 'var(--site-space-5)',
  3: 'var(--site-space-6)',
  3.5: 'var(--site-space-7)',
  4: 'var(--site-space-8)',
  5: 'var(--site-space-10)',
  6: 'var(--site-space-12)',
  8: 'var(--site-space-16)',
};

export function siteSpacing(factor: number) {
  return spacingTokens[factor] ?? `calc(var(--site-space-2) * ${factor})`;
}
