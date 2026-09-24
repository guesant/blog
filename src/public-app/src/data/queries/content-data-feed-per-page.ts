import { positiveQueryNumber } from './positive-query-number';

const feedPageSizes = [10, 20, 50];

export function feedPerPage(value: string | null) {
  const requested = positiveQueryNumber(value);

  if (requested && feedPageSizes.includes(requested)) {
    return requested;
  }

  return 10;
}
