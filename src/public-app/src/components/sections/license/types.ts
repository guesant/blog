import type { ProtectedEmailChallenge } from '@portfolio/data/domain/protected-email';
import type { LicensePageCopy } from '@portfolio/data/domain/types';
import type { ReactNode } from 'react';

export type LicenseSectionProps = { heading: string; children: ReactNode };

export type LicensePageContentProps = {
  page: LicensePageCopy;
  emailChallenge?: ProtectedEmailChallenge;
};
