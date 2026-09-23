import type { CreditEntry, PackageCredit } from '../domain/types.ts';

export function creditToPackage(entry: CreditEntry): PackageCredit {
  return {
    name: entry.name,
    description: entry.description,
  };
}
