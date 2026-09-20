export function interpolate(current: number, target: number, amount: number) {
  return current + (target - current) * amount;
}
