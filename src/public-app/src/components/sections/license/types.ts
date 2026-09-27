import type { ProtectedEmailChallenge } from '@portfolio/data/domain/protected-email';
import type { LicensePageCopy } from '@portfolio/data/domain/types';

export type LicenseSectionProps = { heading: string; body: string };

export type LicensePageContentProps = {
  page: LicensePageCopy;
  emailChallenge?: ProtectedEmailChallenge;
};
