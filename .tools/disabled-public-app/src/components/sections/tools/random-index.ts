export function randomIndex(maximum: number) {
  const limit = 0x100000000 - (0x100000000 % maximum);

  const values = new Uint32Array(1);

  do {
    crypto.getRandomValues(values);
  } while (values[0] >= limit);
  return values[0] % maximum;
}
