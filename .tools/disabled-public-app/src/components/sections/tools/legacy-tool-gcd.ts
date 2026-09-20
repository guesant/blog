export function gcd(a: number, b: number): number {
  let left = Math.abs(Math.trunc(a));
  let right = Math.abs(Math.trunc(b));
  while (right) [left, right] = [right, left % right];
  return left;
}
