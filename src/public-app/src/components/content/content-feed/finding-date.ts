import type { Reference } from '@portfolio/data/domain/types';
import { dateValue } from './date-value';

export function findingDate(item: Reference): string {
  return dateValue(item.foundDateISO || item.publishedDateISO);
}
