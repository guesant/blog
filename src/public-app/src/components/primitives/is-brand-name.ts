import { brands } from './brand-icon-data';
import type { BrandName } from './brand-icon-name';

export function isBrandName(value: string | undefined): value is BrandName {
  return value !== undefined && Object.hasOwn(brands, value);
}
