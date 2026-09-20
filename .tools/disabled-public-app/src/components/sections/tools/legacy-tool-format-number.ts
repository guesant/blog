export function formatNumber(value: number) {
  if (!Number.isFinite(value)) return '∞';
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
}
