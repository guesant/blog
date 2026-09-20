export function primeFactors(value: number) {
  let number = Math.abs(Math.trunc(value));

  const result: number[] = [];

  for (let divisor = 2; divisor * divisor <= number; divisor += 1) {
    while (number % divisor === 0) {
      result.push(divisor);
      number /= divisor;
    }
  }
  if (number > 1) result.push(number);
  return result.join(' × ');
}
